import Comments from "@/components/Comments"
import DisplayEditorOutput from "@/components/DisplayEditorOutput"
import { Icons } from "@/components/Icons"
import PostVotesServerStream from "@/components/PostVotesServerStream"
import { buttonVariants } from "@/components/ui/Button"
import { db } from "@/lib/db"
import { redis } from "@/lib/upstash-redis"
import { formatTimeToNow } from "@/lib/utils"
import { CachedPost } from "@/lib/validation/cache"
import { Post, User, Vote } from "@prisma/client"
import { notFound } from "next/navigation"
import { Suspense } from "react"

interface PageProps {
   params: {
      postId: string
   }
}

export const dynamic = 'force-dynamic'
export const fetchCache = 'force-no-store'

const Page = async ({ params }: PageProps) => {
   const cachedPost = (await redis.hgetall(`post:${params.postId}`)) as CachedPost

   let post: (Post & { votes: Vote[]; author: User; }) | null = null

   if (!cachedPost) {
      post = await db.post.findUnique({
         where: {
            id: params.postId
         },
         include: {
            votes: true,
            author: true,
         }
      })
   }

   if (!post && !cachedPost) return notFound()

   return <div>
      <div className="h-full flex flex-col sm:flex-row item-center sm:items-start justify-between">
         <Suspense fallback={<div className="flex flex-col items-center pr-6 w-20">
            <div className={buttonVariants({ variant: 'ghost' })}>
               <Icons.up className='h-5 w-5 text-zinc-700' />
            </div>

            <div className='text-center py-2 font-medium text-sm text-zinc-900'>
               <Icons.loading className='h-3 w-3 animate-spin' />
            </div>

            <div className={buttonVariants({ variant: 'ghost' })}>
               <Icons.down className='h-5 w-5 text-zinc-700' />
            </div>
         </div>}>
            {/* @ts-expect-error PostVotesServerStream is a server component */}
            <PostVotesServerStream postId={post.id ?? cachedPost.id} getData={async () => {
               return await db.post.findUnique({
                  where: {
                     id: params.postId
                  },
                  include: {
                     votes: true,
                  }
               })
            }} />
         </Suspense>

         <div className="sm:w-0 w-full flex-1 bg-white p-4 rounded-sm">
            <p className="max-h-40 mt-1 truncate text-xs text-gray-500">
               <span>Posted by {post?.author.name ?? cachedPost.authorUsername} • </span>
               {formatTimeToNow(new Date(post?.createdAt ?? cachedPost.createdAt))}
            </p>
            <h1 className="text-xl font-semibold py-2 leading-6 text-gray-900">
               {post?.title ?? cachedPost.title}
            </h1>

            <DisplayEditorOutput content={post?.content ?? cachedPost.content} />

            <Suspense fallback={<Icons.loading className='h-5 w-5 animate-spin text-zinc-500' />}>
               {/* @ts-expect-error Comments is a server component */}
               <Comments postId={post?.id ?? cachedPost.id} />
            </Suspense>
         </div>
      </div>
   </div>
}

export default Page