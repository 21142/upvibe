import { formatTimeToNow } from '@/lib/utils';
import { Post, User, Vote } from '@prisma/client';
import Link from 'next/link';
import { FC, useRef } from 'react';
import DisplayEditorOutput from './DisplayEditorOutput';
import { Icons } from './Icons';
import PostVotesClient from './PostVotesClient';

type PartialVote = Pick<Vote, 'type'>;

interface PostProps {
  post: Post & {
    author: User;
    votes: Vote[];
  };
  votesAmount: number;
  zenZoneName: string;
  currentVote?: PartialVote;
  commentsAmount: number;
}

const Post: FC<PostProps> = ({
  zenZoneName,
  post,
  commentsAmount,
  votesAmount,
  currentVote,
}) => {
  const postRef = useRef<HTMLParagraphElement>(null);

  return (
    <div className="rounded-md bg-white shadow">
      <div className="flex justify-between px-6 py-4">
        <PostVotesClient
          postId={post.id}
          initialVotesAmount={votesAmount}
          initialVote={currentVote?.type}
        />
        <div className="w-0 flex-1">
          <div className="mt-1 max-h-40 text-xs text-gray-500">
            {zenZoneName ? (
              <>
                <a
                  className="text-sm text-zinc-900 underline underline-offset-2"
                  href={`/zenzone/${zenZoneName}`}
                >
                  {`zenzone / ${zenZoneName}`}
                </a>

                <span className="px-1">•</span>
              </>
            ) : null}
            <span>Posted by {post.author.name} • </span>
            {formatTimeToNow(new Date(post.createdAt))}
          </div>

          <a href={`/zenzone/${zenZoneName}/post/${post.id}`}>
            <h1 className="py-2 text-lg font-semibold leading-6 text-gray-900">
              {post.title}
            </h1>
          </a>

          <div
            className="relative max-h-40 w-full overflow-clip text-sm"
            ref={postRef}
          >
            <DisplayEditorOutput content={post.content} />
            {postRef.current?.clientHeight === 160 ? (
              // blur bottom if content is too long
              <div className="absolute bottom-0 left-0 h-24 w-full bg-gradient-to-t from-white to-transparent" />
            ) : null}
          </div>
        </div>
      </div>

      <div className="z-20 bg-gray-50 px-4 py-4 text-sm sm:px-6">
        <Link
          href={`/zenzone/${zenZoneName}/post/${post.id}`}
          className="flex w-fit items-center gap-2"
        >
          <Icons.message className="h-4 w-4 hover:fill-current" />{' '}
          {commentsAmount} comments
        </Link>
      </div>
    </div>
  );
};

export default Post;
