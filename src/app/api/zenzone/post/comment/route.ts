import { getAuthSession } from '@/lib/auth';
import { db } from '@/lib/db';
import { CommentValidator } from '@/lib/validation/comment';
import { z } from 'zod';

export async function PATCH(req: Request) {

   try {

      const session = await getAuthSession();

      if (!session?.user) {
         return new Response("Unauthorized", { status: 401 });
      }

      const body = await req.json()

      const { postId, text, replyToId } = CommentValidator.parse(body);

      await db.comment.create({
         data: {
            text,
            postId,
            authorId: session.user.id,
            replyToId,
         }
      })

      return new Response("Comment has been created", { status: 200 })

   } catch (error) {
      if (error instanceof z.ZodError) {
         return new Response('Invalid request body', { status: 422 });
      }

      return new Response('Could not create the comment', { status: 500 });
   }
}