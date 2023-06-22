import LeaveZenZoneButton from "@/components/LeaveZenZoneButton"
import { buttonVariants } from "@/components/ui/Button"
import { getAuthSession } from "@/lib/auth"
import { db } from "@/lib/db"
import { format } from "date-fns"
import Link from "next/link"
import { notFound } from "next/navigation"

const Layout = async ({ children, params: { slug } }: { children: React.ReactNode, params: { slug: string } }) => {
   const session = await getAuthSession()

   const zenZone = await db.zenZone.findFirst({
      where: {
         name: slug
      },
      include: {
         posts: {
            include: {
               author: true,
               votes: true,
            }
         }
      }
   })

   const subscription = !session?.user ? undefined : await db.subscription.findFirst({
      where: {
         zenZone: {
            name: slug
         },
         user: {
            id: session.user.id
         }
      }
   })

   const isSubscriptionPresent = !!subscription

   if (!zenZone) return notFound()

   const zenZoneUsersCount = await db.subscription.count({
      where: {
         zenZone: {
            name: slug
         }
      }
   })

   return (
      <div className="sm:container mx-w-7xl mx-auto h-full pt-12">
         <div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-y-4 md:gap-x-4 py-6">
               <ul className="flex flex-col col-span-2 space-y-6">
                  {children}
               </ul>

               <div className="overflow-hidden h-fit rounded-lg border border-gray-200 order-first md:order-last">
                  <div className="px-6 py-4">
                     <p className="font-semibold py-3">{`About zenzone / ${slug}`}</p>
                  </div>

                  <dl className='divide-y divide-gray-100 px-6 py-4 text-sm leading-6 bg-white'>
                     <div className='flex justify-between gap-x-4 py-3'>
                        <dt className="text-gray-500">Created</dt>
                        <dd className="text-gray-700">
                           <time dateTime={zenZone.createdAt.toDateString()}>
                              {format(zenZone.createdAt, "MMMM dd, yyyy")}
                           </time>
                        </dd>
                     </div>

                     <div className='flex justify-between gap-x-4 py-3'>
                        <dt className='text-gray-500'>Members</dt>
                        <dd className='flex items-start gap-x-2'>
                           <div className='text-gray-900'>{zenZoneUsersCount}</div>
                        </dd>
                     </div>
                     {zenZone.creatorId === session?.user?.id ? (
                        <div className='flex justify-between gap-x-4 py-3'>
                           <dt className='text-gray-500'>You are the creator of this zenzone</dt>
                        </div>
                     ) : null}

                     {zenZone.creatorId !== session?.user?.id ? (
                        <LeaveZenZoneButton
                           isSubscribed={isSubscriptionPresent}
                           zenZoneId={zenZone.id}
                           zenZoneName={zenZone.name}
                        />
                     ) : null}
                     <Link
                        className={buttonVariants({
                           variant: 'outline',
                           className: 'w-full mb-6',
                        })}
                        href={`zenzone/${slug}/submit`}>
                        Create Post
                     </Link>
                  </dl>
               </div>
            </div>
         </div>
      </div>
   )
}

export default Layout