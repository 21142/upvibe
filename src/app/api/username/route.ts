import { getAuthSession } from '@/lib/auth';
import { db } from '@/lib/db';
import { UsernameValidator } from '@/lib/validation/username';
import { z } from 'zod';

export async function PATCH(req: Request) {
  try {
    const session = await getAuthSession();

    if (!session?.user) {
      return new Response('Unauthorized', { status: 401 });
    }

    const body = await req.json();

    const { name } = UsernameValidator.parse(body);

    const username = await db.user.findFirst({
      where: {
        name,
      },
    });

    if (username) {
      return new Response('Username already exists', { status: 409 });
    }

    await db.user.update({
      where: {
        id: session.user.id,
      },
      data: {
        name,
      },
    });

    return new Response('Username has been updated');
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response('Invalid request data passed', { status: 422 });
    }

    return new Response('Could not update username, please try again later.', {
      status: 500,
    });
  }
}
