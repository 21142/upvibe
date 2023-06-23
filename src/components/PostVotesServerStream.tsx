import { getAuthSession } from '@/lib/auth'
import { Post, Vote, VoteType } from '@prisma/client'
import { notFound } from 'next/navigation'
import PostVotesClient from './PostVotesClient'

interface PostVotesServerStreamProps {
   postId: string
   initialVotesAmount?: number
   initialVote?: VoteType | null
   getData?: () => Promise<Post & { votes: Vote[] | null }>
}

const PostVotesServerStream = async ({ postId, initialVotesAmount, initialVote, getData }: PostVotesServerStreamProps) => {
   const session = await getAuthSession()

   let votesAmount: number = 0
   let currentVote: VoteType | null | undefined = undefined

   if (getData) {
      const post = await getData()

      if (!post) return notFound()

      votesAmount = post.votes?.reduce((previousVotesAmount, vote) => {
         if (vote.type === "UP") return previousVotesAmount + 1
         if (vote.type === "DOWN") return previousVotesAmount - 1
         return previousVotesAmount
      }, 0) as number
      currentVote = post.votes?.find((vote) => vote.userId === session?.user.id)?.type
   } else {
      votesAmount = initialVotesAmount as number
      currentVote = initialVote
   }


   return <PostVotesClient postId={postId} initialVotesAmount={votesAmount} initialVote={currentVote} />
}

export default PostVotesServerStream