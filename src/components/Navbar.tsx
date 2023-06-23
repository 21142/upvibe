import { Icons } from "@/components/Icons";
import { getAuthSession } from "@/lib/auth";
import Link from "next/link";
import AuthDropdownMenu from "./AuthDropdownMenu";
import Search from "./Search";
import { buttonVariants } from "./ui/Button";

const Navbar = async () => {
  const session = await getAuthSession();

  return (
    <div className="fixed top-0 inset-x-0 h-fit bg-zinc-100 border-b border-zinc-300 z-[10] py-2">
      <div className="container max-w-7xl h-full mx-auto flex items-center justify-between gap-2">
        <Link href="/" className="flex items-center gap-2">
          <Icons.logo className="h-8 w-8" />
          <p className="hidden text-zinc-700 text-sm font-medium md:block">
            upvibe
          </p>
        </Link>
        <Search />
        {session?.user ? (
          <AuthDropdownMenu user={session.user} />
        ) : (
          <Link href="/sign-in" className={buttonVariants()}>
            Sign in
          </Link>
        )}
      </div>
    </div>
  );
};

export default Navbar;
