"use client"

import { User } from "next-auth";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { FC } from "react";
import UserAvatar from "./UserAvatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/DropdownMenu";

interface AuthDropdownMenuProps {
  user: Pick<User, "image" | "name" | "email">;
}

const AuthDropdownMenu: FC<AuthDropdownMenuProps> = ({ user }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <UserAvatar
          className="h-8 w-8"
          user={{
            name: user.name || null,
            image: user.image || null,
          }}
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-white" align="end">
        <div className="flex items-center justify-start gap-2 p-2">
          <div className="flex flex-col space-y-1 leading-none">
            {user.name && <p className="font-medium">{user.name}</p>}
            {user.email && <p className="truncate w-[200px] text-zinc-700 text-sm">{user.email}</p>}
          </div>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/">Timeline</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/zenzone/create">Create a community</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/settings">Settings</Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={(event) => {
          event.preventDefault();
          signOut({
            callbackUrl: `${window.location.origin}/sign-in`,
          });
        }} className="cursor-pointer">
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default AuthDropdownMenu;
