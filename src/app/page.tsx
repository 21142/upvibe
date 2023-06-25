import { Icons } from '@/components/Icons';
import MainFeed from '@/components/MainFeed';
import YourFeed from '@/components/YourFeed';
import { buttonVariants } from '@/components/ui/Button';
import { getAuthSession } from '@/lib/auth';
import Link from 'next/link';

export default async function Home() {
  const session = await getAuthSession();

  return (
    <>
      <h1 className="text-3xl font-bold md:text-4xl">Your feed</h1>
      <div className="grid grid-cols-1 gap-y-4 py-6 md:grid-cols-3 md:gap-x-4">
        {/* @ts-expect-error MainFeed is a server component */}
        {session ? <YourFeed /> : <MainFeed />}

        <div className="order-first h-fit overflow-hidden rounded-lg border-gray-200 md:order-last">
          <div className="bg-sky-100 px-6 py-4">
            <p className="flex items-center gap-1.5 py-3 font-semibold">
              <Icons.home className="h-4 w-4" />
              Home
            </p>
          </div>

          <div className="-my-3 divide-y divide-gray-100 px-6 py-4 text-sm leading-6">
            <div className="flex justify-between gap-x-4 py-3">
              <p className="text-zinc-500">
                Your personal upvibe timeline. Come here to check in with your
                favourite Zen Zones.
              </p>
            </div>

            <Link
              className={buttonVariants({
                className: 'mb-6 mt-4 w-full',
              })}
              href="/zenzone/create"
            >
              Create your Zen Zone
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
