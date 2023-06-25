import { getAuthSession } from '@/lib/auth';
import { db } from '@/lib/db';
import { PostValidator } from '@/lib/validation/post';
import { z } from 'zod';

export async function POST(req: Request) {
  try {
    const session = await getAuthSession();

    if (!session?.user) {
      return new Response('Unauthorized', { status: 401 });
    }

    const body = await req.json();

    const { zenZoneId, title, content } = PostValidator.parse(body);

    const subscriptionExists = await db.subscription.findFirst({
      where: {
        userId: session.user.id,
        zenZoneId,
      },
    });

    if (!subscriptionExists) {
      return new Response('You need to subscribe to be able to post', {
        status: 403,
      });
    }

    await db.post.create({
      data: {
        title,
        content,
        authorId: session.user.id,
        zenZoneId,
      },
    });

    return new Response('OK');
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(error.message, { status: 422 });
    }

    return new Response('Error while creating a post', { status: 500 });
  }
}
