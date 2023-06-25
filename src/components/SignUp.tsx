import { Icons } from '@/components/Icons';
import SignInForm from '@/components/SignInForm';
import Link from 'next/link';

const SignUp = () => {
  return (
    <div className="container mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[400px]">
      <div className="flex flex-col space-y-2 text-center">
        <Icons.logo className="mx-auto h-6 w-6" />
        <h1 className="text-2xl font-semibold tracking-tight">
          Welcome to upvibe
        </h1>
        <p className="mx-auto max-w-xs text-sm">
          By continuing, you are setting up an upvibe account.
        </p>
        <SignInForm className="" />

        <p className="px-8 text-center text-sm text-zinc-700">
          Already have an upvibe account?{' '}
          <Link
            href="/sign-in"
            className="text-sm underline underline-offset-4 hover:text-zinc-800"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
