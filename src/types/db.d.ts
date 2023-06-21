import type { Comment, Post, User, Vote, ZenZone } from '@prisma/client'

export type ExtendedPost = Post & {
   zenZone: ZenZone,
   author: User
   votes: Vote[]
   comments: Comment[]
}