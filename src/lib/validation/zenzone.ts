import { z } from "zod";

export const zenZoneValidator = z.object({
   name: z.string().min(3).max(21),
})

export const zenZoneSubscriptionValidator = z.object({
   zenZoneId: z.string(),
})

export type CreateZenZone = z.infer<typeof zenZoneValidator>;
export type SubscribeToZenZone = z.infer<typeof zenZoneSubscriptionValidator>;