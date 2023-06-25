import { getAuthSession } from '@/lib/auth';
import { db } from '@/lib/db';
import { ZenZoneValidator } from '@/lib/validation/zenzone';
import { z } from 'zod';

export async function POST(req: Request) {
  try {
    const session = await getAuthSession();

    if (!session?.user) {
      return new Response('Unauthorized', { status: 401 });
    }
    const body = await req.json();
    const { name } = ZenZoneValidator.parse(body);

    const zenZoneAlreadyExists = await db.zenZone.findFirst({
      where: {
        name,
      },
    });

    if (zenZoneAlreadyExists) {
      return new Response('Zen Zone with that name already exists', {
        status: 409,
      });
    }

    const zenZone = await db.zenZone.create({
      data: {
        name,
        creatorId: session.user.id,
      },
    });

    await db.subscription.create({
      data: {
        userId: session.user.id,
        zenZoneId: zenZone.id,
      },
    });

    return new Response(zenZone.name);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(error.message, { status: 422 });
    }
    return new Response('Error while creating a Zen Zone', { status: 500 });
  }
}
