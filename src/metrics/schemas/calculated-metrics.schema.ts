import { z } from 'zod'

export const CalculatedMetricsSchema = z.object({
  impressions: z.number().nonnegative(),
  clicks: z.number().nonnegative(),
  leads: z.number().nonnegative(),
  sales: z.number().nonnegative(),

  revenue: z.number(),
  cost: z.number(),

  ctr: z.number(),
  cpc: z.number(),
  cpm: z.number(),
  conversionRate: z.number(),
  roas: z.number(),
  aov: z.number(),
})

export type CalculatedMetrics = z.infer<typeof CalculatedMetricsSchema>
