"use client"

import { INIFNITE_SCROLLING } from '@/config'
import { ExtendedPost } from '@/types/db'
import { useIntersection } from '@mantine/hooks'
import { useInfiniteQuery } from '@tanstack/react-query'
import axios from 'axios'
import { useSession } from 'next-auth/react'
import { FC, useRef } from 'react'
import Post from './Post'

interface PostFeedProps {
   initialPosts: ExtendedPost[]
   zenZoneName?: string
}

const PostFeed: FC<PostFeedProps> = ({ initialPosts, zenZoneName }) => {

   const lastVisiblePost = useRef<HTMLElement>(null)
   const { ref, entry } = useIntersection({
      root: lastVisiblePost.current,
      threshold: 1
   })

   const { data: session } = useSession()

   const { data, fetchNextPage, isFetchingNextPage } = useInfiniteQuery(
      ['infinite-query'],
      async ({ pageParam = 1 }) => {
         const query =
            `/api/posts?limit=${INIFNITE_SCROLLING}&page=${pageParam}` +
            (!!zenZoneName ? `&subredditName=${zenZoneName}` : '')

         const { data } = await axios.get(query)
         return data as ExtendedPost[]
      },
      {
         getNextPageParam: (_, pages) => {
            return pages.length + 1
         },
         initialData: { pages: [initialPosts], pageParams: [1] },
      }
   )

   const postsToShow = data?.pages.flatMap((page) => page) ?? initialPosts

   return <ul className='flex flex-col col-span-2 space-y-6'>
      {postsToShow.map((post, index) => {
         const votesAmount = post.votes.reduce((acc, vote) => {
            if (vote.type === 'UP') return acc + 1
            if (vote.type === 'DOWN') return acc - 1
            return acc
         }, 0)

         const currentVote = post.votes.find(
            (vote) => vote.userId === session?.user.id
         )

         if (index === postsToShow.length - 1) {
            // Add a ref to the last post in the list
            return (
               <li key={post.id} ref={ref}>
                  <Post
                     post={post}
                     commentsAmount={post.comments.length}
                     zenZoneName={post.zenZone.name}
                     votesAmount={votesAmount}
                     currentVote={currentVote}
                  />
               </li>
            )
         } else {
            return (
               <Post
                  key={post.id}
                  post={post}
                  commentsAmount={post.comments.length}
                  zenZoneName={post.zenZone.name}
                  votesAmount={votesAmount}
                  currentVote={currentVote}
               />
            )
         }
      })}
   </ul>
}

export default PostFeed