import CreatePost from '@/components/CreatePost';
import PostFeed from '@/components/PostFeed';
import { INFINITE_SCROLLING } from '@/config';
import { getAuthSession } from '@/lib/auth';
import { db } from '@/lib/db';
import { notFound } from 'next/navigation';

interface ZenZonePageProps {
  params: {
    slug: string;
  };
}

const ZenZonePage = async ({ params }: ZenZonePageProps) => {
  const { slug } = params;

  const session = await getAuthSession();
  const zenZone = await db.zenZone.findFirst({
    where: {
      name: slug,
    },
    include: {
      posts: {
        include: {
          author: true,
          zenZone: true,
          comments: true,
          votes: true,
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
      },
    },
  });

  if (!zenZone) return notFound();

  return (
    <>
      <h1 className="h-14 text-3xl font-bold md:text-4xl">
        {`zenzone / ${zenZone.name}`}
      </h1>
      <CreatePost session={session} />
      <PostFeed
        initialPosts={zenZone.posts}
        zenZoneName={zenZone.name}
      />
    </>
  );
};

export default ZenZonePage;
