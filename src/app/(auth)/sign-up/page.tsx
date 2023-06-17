import Link from "next/link";
import { buttonVariants } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { Icons } from "@/components/Icons";

const page = () => {
  return (
    <div className="absolute inset-0">
      <div className="h-full max-w-2xl mx-auto flex flex-col items-center justify-center gap-20">
        <Link
          href="/"
          className={cn(
            buttonVariants({ variant: "ghost" }),
            "self-start -mt-20"
          )}
        >
          <Icons.chevronLeft className="mr-2 h-4 w-4" />
          Home
        </Link>
        Sign up
      </div>
    </div>
  );
};

export default page;
