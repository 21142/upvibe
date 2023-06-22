import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { z } from "zod";

export async function GET(req: Request) {
   const url = new URL(req.url);

   const session = await getAuthSession();

   let followedZenZonesIds: string[] = [];

   if (session) {
      const followedZenZones = await db.subscription.findMany({
         where: {
            userId: session.user.id,
         },
         include: {
            zenZone: true,
         }
      })

      followedZenZonesIds = followedZenZones.map(({ zenZone }) => zenZone.id);
   }

   try {
      const { zenZoneName, limit, page } = z.object({
         limit: z.string(),
         page: z.string(),
         zenZoneName: z.string().nullish().optional(),
      }).parse({
         zenZoneName: url.searchParams.get('zenZoneName'),
         limit: url.searchParams.get('limit'),
         page: url.searchParams.get('page'),
      })

      let where = {}

      if (zenZoneName) {
         where = {
            zenZone: {
               name: zenZoneName,
            }
         }
      } else if (session) {
         where = {
            zenZone: {
               id: {
                  in: followedZenZonesIds,
               }
            }
         }
      }

      const posts = await db.post.findMany({
         where,
         take: parseInt(limit),
         skip: (parseInt(page) - 1) * parseInt(limit),
         orderBy: [
            {
               votes: {
                  _count: 'desc',
               }
            },
            {
               createdAt: 'desc'
            }
         ],
         include: {
            zenZone: true,
            votes: true,
            author: true,
            comments: true
         }
      })

      return new Response(JSON.stringify(posts));
   } catch (error) {
      if (error instanceof z.ZodError) {
         return new Response(error.message, { status: 422 });
      }

      return new Response("Error while fetching more posts", { status: 500 });
   }
}