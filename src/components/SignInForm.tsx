'use client';

import { FC } from 'react';
import { Button } from './ui/Button';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { Icons } from './Icons';
import { useToast } from '@/hooks/use-toast';

interface SignInFormProps extends React.HTMLAttributes<HTMLDivElement> {}

const SignInForm: FC<SignInFormProps> = ({ className, ...props }) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const loginWithGoogle = async () => {
    setIsLoading(true);

    try {
      await signIn('google');
    } catch (e) {
      toast({
        title: 'An error occurred.',
        description:
          'There was an error while signing in with Google. Please try again later.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className={cn('flex justify-center', className)}
      {...props}
    >
      <Button
        onClick={loginWithGoogle}
        isLoading={isLoading}
        className="w-full"
        size="sm"
      >
        {isLoading ? null : <Icons.google className="h-4 w-4 pr-2" />}
        Google
      </Button>
    </div>
  );
};

export default SignInForm;
