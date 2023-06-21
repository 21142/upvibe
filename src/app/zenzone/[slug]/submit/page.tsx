import Editor from "@/components/Editor"
import { Button } from "@/components/ui/Button"
import { db } from "@/lib/db"
import { notFound } from "next/navigation"

interface PageProps {
   params: {
      slug: string
   }
}

const page = async ({ params }: PageProps) => {
   const zenzone = await db.zenZone.findFirst({
      where: {
         name: params.slug
      }
   })

   if (!zenzone) return notFound()

   return <div className="flex flex-col items-start gap-6">
      <div className="border-b border-gray-200 pb-5">
         <div className="-ml-2 -mt-2 flex flex-wrap items-baseline">
            <h3 className="ml-2 mt-2 text-base font-semibold text-gray-900 leading-6">
               Create a new post
            </h3>
            <p className="ml-2 mt-1 truncate text-sm text-gray-500">
               in zenzone / {zenzone.name}
            </p>
         </div>
      </div>

      <Editor zenZoneId={zenzone.id} />

      <div className="flex w-full justify-end">
         <Button type="submit" className="w-full" form="zenzone-post-form">
            Post
         </Button>
      </div>
   </div>
}

export default page