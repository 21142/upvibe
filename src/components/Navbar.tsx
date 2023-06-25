import { Icons } from '@/components/Icons';
import { getAuthSession } from '@/lib/auth';
import Link from 'next/link';
import AuthDropdownMenu from './AuthDropdownMenu';
import Search from './Search';
import { buttonVariants } from './ui/Button';

const Navbar = async () => {
  const session = await getAuthSession();

  return (
    <div className="fixed inset-x-0 top-0 z-[10] h-fit border-b border-zinc-300 bg-zinc-100 py-2">
      <div className="container mx-auto flex h-full max-w-7xl items-center justify-between gap-2">
        <Link
          href="/"
          className="flex items-center gap-2"
        >
          <Icons.logo className="h-8 w-8" />
          <p className="hidden text-sm font-medium text-zinc-700 md:block">
            upvibe
          </p>
        </Link>
        <Search />
        {session?.user ? (
          <AuthDropdownMenu user={session.user} />
        ) : (
          <Link
            href="/sign-in"
            className={buttonVariants()}
          >
            Sign in
          </Link>
        )}
      </div>
    </div>
  );
};

export default Navbar;
