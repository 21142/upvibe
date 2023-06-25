import { z } from 'zod';

export const ZenZoneValidator = z.object({
  name: z.string().min(3).max(21),
});

export const ZenZoneSubscriptionValidator = z.object({
  zenZoneId: z.string(),
});

export type CreateZenZone = z.infer<typeof ZenZoneValidator>;
export type SubscribeToZenZone = z.infer<typeof ZenZoneSubscriptionValidator>;
