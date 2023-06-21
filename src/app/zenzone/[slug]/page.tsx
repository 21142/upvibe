import CreatePost from "@/components/CreatePost"
import { INIFNITE_SCROLLING } from "@/config"
import { getAuthSession } from "@/lib/auth"
import { db } from "@/lib/db"
import { notFound } from "next/navigation"

interface ZenZonePageProps {
   params: {
      slug: string
   }
}

const ZenZonePage = async ({ params }: ZenZonePageProps) => {
   const { slug } = params

   const session = await getAuthSession()
   const zenZone = await db.zenZone.findFirst({
      where: {
         name: slug
      },
      include: {
         posts: {
            include: {
               author: true,
               zenZone: true,
               comments: true,
               votes: true
            },
            take: INIFNITE_SCROLLING,
         }
      }
   })

   if (!zenZone) return notFound()

   return <>
      <h1 className="font-bold text-3xl md:text-4xl h-14">
         {`zenzone / ${zenZone.name}`}
      </h1>
      <CreatePost session={session} />
   </>
}

export default ZenZonePage