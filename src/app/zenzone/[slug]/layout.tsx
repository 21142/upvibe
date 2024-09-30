import LeaveZenZoneButton from '@/components/LeaveZenZoneButton';
import { buttonVariants } from '@/components/ui/Button';
import { getAuthSession } from '@/lib/auth';
import { db } from '@/lib/db';
import { format } from 'date-fns';
import Link from 'next/link';
import { notFound } from 'next/navigation';

const Layout = async ({
  children,
  params: { slug },
}: {
  children: React.ReactNode;
  params: { slug: string };
}) => {
  const session = await getAuthSession();

  const zenZone = await db.zenZone.findFirst({
    where: {
      name: slug,
    },
    include: {
      posts: {
        include: {
          author: true,
          votes: true,
        },
      },
    },
  });

  const subscription = !session?.user
    ? undefined
    : await db.subscription.findFirst({
        where: {
          zenZone: {
            name: slug,
          },
          user: {
            id: session.user.id,
          },
        },
      });

  const isSubscriptionPresent = !!subscription;

  if (!zenZone) return notFound();

  const zenZoneUsersCount = await db.subscription.count({
    where: {
      zenZone: {
        name: slug,
      },
    },
  });

  return (
    <div className="mx-w-7xl mx-auto h-full pt-12 sm:container">
      <div>
        <div className="grid grid-cols-1 gap-y-4 py-6 md:grid-cols-3 md:gap-x-4">
          <ul className="col-span-2 flex flex-col space-y-6">{children}</ul>

          <div className="order-first h-fit overflow-hidden rounded-lg border border-gray-200 md:order-last">
            <div className="px-6 py-4">
              <p className="py-3 font-semibold">{`About zenzone / ${slug}`}</p>
            </div>

            <dl className="divide-y divide-gray-100 bg-white px-6 py-4 text-sm leading-6">
              <div className="flex justify-between gap-x-4 py-3">
                <dt className="text-gray-500">Created</dt>
                <dd className="text-gray-700">
                  <time dateTime={zenZone.createdAt.toDateString()}>
                    {format(zenZone.createdAt, 'MMMM dd, yyyy')}
                  </time>
                </dd>
              </div>

              <div className="flex justify-between gap-x-4 py-3">
                <dt className="text-gray-500">Members</dt>
                <dd className="flex items-start gap-x-2">
                  <div className="text-gray-900">{zenZoneUsersCount}</div>
                </dd>
              </div>
              {zenZone.creatorId === session?.user?.id ? (
                <div className="flex justify-between gap-x-4 py-3">
                  <dt className="text-gray-500">
                    You are the creator of this zenzone
                  </dt>
                </div>
              ) : null}

              {zenZone.creatorId !== session?.user?.id ? (
                <LeaveZenZoneButton
                  isSubscribed={isSubscriptionPresent}
                  zenZoneId={zenZone.id}
                  zenZoneName={zenZone.name}
                />
              ) : null}
              <Link
                className={buttonVariants({
                  variant: 'outline',
                  className: 'mb-6 w-full',
                })}
                href={`${slug}/submit`}
              >
                Create Post
              </Link>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Layout;
