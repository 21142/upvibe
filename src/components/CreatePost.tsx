'use client';

import { Session } from 'next-auth';
import { usePathname, useRouter } from 'next/navigation';
import { FC } from 'react';
import { Icons } from './Icons';
import UserAvatar from './UserAvatar';
import { Button } from './ui/Button';
import { Input } from './ui/Input';

interface CreatePostProps {
  session: Session | null;
}

const CreatePost: FC<CreatePostProps> = ({ session }) => {
  const router = useRouter();
  const pathname = usePathname();
  return (
    <li className="list-none overflow-hidden rounded-md bg-white shadow">
      <div className="flex h-full justify-between gap-6 px-6 py-4">
        <div className="relative">
          <UserAvatar
            user={{
              name: session?.user.name || null,
              image: session?.user.image || null,
            }}
          />
          <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 outline outline-2 outline-white"></span>
        </div>

        <Input
          readOnly
          onClick={() => router.push(pathname + '/submit')}
          placeholder="What do you want to share?"
        />
        <Button
          onClick={() => router.push(pathname + '/submit')}
          variant="ghost"
        >
          <Icons.image className="text-zinc-600" />
        </Button>
        <Button
          onClick={() => router.push(pathname + '/submit')}
          variant="ghost"
        >
          <Icons.link className="text-zinc-600" />
        </Button>
      </div>
    </li>
  );
};

export default CreatePost;
