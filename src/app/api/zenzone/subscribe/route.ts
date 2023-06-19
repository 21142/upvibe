import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { zenZoneSubscriptionValidator } from "@/lib/validation/zenzone";
import { z } from "zod";

export async function POST(req: Request) {
   try {
      const session = await getAuthSession();

      if (!session?.user) {
         return new Response("Unauthorized", { status: 401 });
      }

      const body = await req.json();

      const { zenZoneId } = zenZoneSubscriptionValidator.parse(body);

      const subscriptionExists = await db.subscription.findFirst({
         where: {
            userId: session.user.id,
            zenZoneId,
         }
      })

      if (subscriptionExists) {
         return new Response("Subscription already exists", { status: 400 });
      }

      await db.subscription.create({
         data: {
            userId: session.user.id,
            zenZoneId,
         }
      })

      return new Response(zenZoneId)
   } catch (error) {
      if (error instanceof z.ZodError) {
         return new Response(error.message, { status: 422 });
      }

      return new Response("Error while subscribing to Zen Zone", { status: 500 });
   }
}