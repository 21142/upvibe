import { INFINITE_SCROLLING } from '@/config';
import { db } from '@/lib/db';
import PostFeed from './PostFeed';

const MainFeed = async () => {
  const postsToDisplay = await db.post.findMany({
    include: {
      author: true,
      votes: true,
      zenZone: true,
      comments: true,
    },
    orderBy: [
      {
        votes: {
          _count: 'desc',
        },
      },
      {
        createdAt: 'desc',
      },
    ],
    take: INFINITE_SCROLLING,
  });
  return <PostFeed initialPosts={postsToDisplay} />;
};

export default MainFeed;
