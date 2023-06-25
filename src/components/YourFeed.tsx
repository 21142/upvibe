import { INFINITE_SCROLLING } from '@/config';
import { getAuthSession } from '@/lib/auth';
import { db } from '@/lib/db';
import PostFeed from './PostFeed';

const YourFeed = async () => {
  const session = await getAuthSession();

  const followedZenZones = await db.subscription.findMany({
    where: {
      userId: session?.user.id,
    },
    include: {
      zenZone: true,
    },
  });

  const postsToDisplay = await db.post.findMany({
    where: {
      zenZone: {
        name: {
          in: followedZenZones.map(({ zenZone }) => zenZone.id),
        },
      },
    },
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

export default YourFeed;
