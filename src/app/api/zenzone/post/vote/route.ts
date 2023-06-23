import { VOTES_THRESHOLD } from "@/config";
import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { redis } from "@/lib/upstash-redis";
import { CachedPost } from "@/lib/validation/cache";
import { PostVoteValidator } from "@/lib/validation/vote";
import { VoteType, type Post, type User, type Vote } from "@prisma/client";
import { z } from "zod";

type PostWithVotesAndAuthor = Post & {
   votes: Vote[];
   author: User;
}

export async function PATCH(req: Request) {
   try {
      const body = await req.json()

      const { voteType, postId } = PostVoteValidator.parse(body);

      const session = await getAuthSession();

      if (!session?.user) {
         return new Response("Unauthorized", { status: 401 });
      }

      const voteExists = await db.vote.findFirst({
         where: {
            postId,
            userId: session.user.id,
         }
      })

      const associatedPost = await db.post.findUnique({
         where: {
            id: postId,
         },
         include: {
            votes: true,
            author: true,
         }
      })

      if (!associatedPost) {
         return new Response("Post not found", { status: 404 });
      }

      if (voteExists) {
         if (voteExists.type === voteType) {
            await db.vote.delete({
               where: {
                  userId_postId: {
                     postId,
                     userId: session.user.id,
                  }
               }
            })

            recountVotesThenCacheIfQualifies(associatedPost, voteType, postId)

            return new Response("OK");
         }

         await db.vote.update({
            where: {
               userId_postId: {
                  postId,
                  userId: session.user.id,
               },
            },
            data: {
               type: voteType,
            }
         })

         recountVotesThenCacheIfQualifies(associatedPost, voteType, postId)

         return new Response("OK");
      }

      await db.vote.create({
         data: {
            type: voteType,
            userId: session.user.id,
            postId,
         }
      })

      recountVotesThenCacheIfQualifies(associatedPost, voteType, postId)

      return new Response("OK");
   } catch (error) {
      if (error instanceof z.ZodError) {
         return new Response('Invalid request body', { status: 422 });
      }

      return new Response('Could not register your vote', { status: 500 });
   }
}

async function recountVotesThenCacheIfQualifies(associatedPost: PostWithVotesAndAuthor, voteType: VoteType, postId: string) {
   const votesAmount = associatedPost.votes.reduce((acc, vote) => {
      if (vote.type === "UP") {
         return acc + 1;
      }

      if (vote.type === "DOWN") {
         return acc - 1;
      }
      return acc;
   }, 0)

   if (votesAmount >= VOTES_THRESHOLD) {
      const payloadToCache: CachedPost = {
         authorUsername: associatedPost.author.username ?? "",
         title: associatedPost.title,
         content: JSON.stringify(associatedPost.content),
         id: associatedPost.id,
         currentVote: voteType,
         createdAt: associatedPost.createdAt,
      }

      await redis.hset(`post:${postId}`, payloadToCache)
   }
}