import Comments from '@/components/Comments';
import DisplayEditorOutput from '@/components/DisplayEditorOutput';
import { Icons } from '@/components/Icons';
import PostVotesServerStream from '@/components/PostVotesServerStream';
import { buttonVariants } from '@/components/ui/Button';
import { db } from '@/lib/db';
import { redis } from '@/lib/upstash-redis';
import { formatTimeToNow } from '@/lib/utils';
import { CachedPost } from '@/lib/validation/cache';
import { Post, User, Vote } from '@prisma/client';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';

interface PageProps {
  params: {
    postId: string;
  };
}

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

const Page = async ({ params }: PageProps) => {
  const cachedPost = (await redis.hgetall(
    `post:${params.postId}`
  )) as CachedPost;

  let post: (Post & { votes: Vote[]; author: User }) | null = null;

  if (!cachedPost) {
    post = await db.post.findUnique({
      where: {
        id: params.postId,
      },
      include: {
        votes: true,
        author: true,
      },
    });
  }

  if (!post && !cachedPost) return notFound();

  return (
    <div>
      <div className="item-center flex h-full flex-col justify-between sm:flex-row sm:items-start">
        <Suspense
          fallback={
            <div className="flex w-20 flex-col items-center pr-6">
              <div className={buttonVariants({ variant: 'ghost' })}>
                <Icons.up className="h-5 w-5 text-zinc-700" />
              </div>

              <div className="py-2 text-center text-sm font-medium text-zinc-900">
                <Icons.loading className="h-3 w-3 animate-spin" />
              </div>

              <div className={buttonVariants({ variant: 'ghost' })}>
                <Icons.down className="h-5 w-5 text-zinc-700" />
              </div>
            </div>
          }
        >
          {/* @ts-expect-error PostVotesServerStream is a server component */}
          <PostVotesServerStream
            postId={post.id ?? cachedPost.id}
            getData={async () => {
              return await db.post.findUnique({
                where: {
                  id: params.postId,
                },
                include: {
                  votes: true,
                },
              });
            }}
          />
        </Suspense>

        <div className="w-full flex-1 rounded-sm bg-white p-4 sm:w-0">
          <p className="mt-1 max-h-40 truncate text-xs text-gray-500">
            <span>
              Posted by {post?.author.name ?? cachedPost.authorUsername} •{' '}
            </span>
            {formatTimeToNow(new Date(post?.createdAt ?? cachedPost.createdAt))}
          </p>
          <h1 className="py-2 text-xl font-semibold leading-6 text-gray-900">
            {post?.title ?? cachedPost.title}
          </h1>

          <DisplayEditorOutput content={post?.content ?? cachedPost.content} />

          <Suspense
            fallback={
              <Icons.loading className="h-5 w-5 animate-spin text-zinc-500" />
            }
          >
            {/* @ts-expect-error Comments is a server component */}
            <Comments postId={post?.id ?? cachedPost.id} />
          </Suspense>
        </div>
      </div>
    </div>
  );
};

export default Page;
