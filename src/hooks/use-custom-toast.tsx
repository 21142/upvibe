import { buttonVariants } from "@/components/ui/Button"
import Link from "next/link"
import { toast } from "./use-toast"

export const useCustomToast = () => {
   const loginToast = () => {
      const { dismiss } = toast({
         title: "You are not authenticated",
         description: "Please login to create a Zen Zone.",
         variant: "destructive",
         action: (
            <Link href="/sign-in" onClick={() => dismiss()} className={buttonVariants({ variant: 'outline' })}>Login</Link>
         )
      })
   }

   return { loginToast }
}