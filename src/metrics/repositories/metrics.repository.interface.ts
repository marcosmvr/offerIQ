import { Offer, OfferMetrics, Prisma } from '@prisma/client'

export type CalculatedMetricsData = {
  impressions: number
  clicks: number
  leads: number
  sales: number
  revenue: Prisma.Decimal
  cost: Prisma.Decimal
  ctr: Prisma.Decimal
  cpc: Prisma.Decimal
  cpm: Prisma.Decimal
  conversionRate: Prisma.Decimal
  roas: Prisma.Decimal
  aov: Prisma.Decimal
}

export interface IMetricsRepository {
  offerExists(id: string, userId: string): Promise<Offer | null>
  upsert(offerId: string, data: CalculatedMetricsData): Promise<OfferMetrics>
  findByOfferId(offerId: string): Promise<OfferMetrics | null>
}

export const METRICS_REPOSITORY = Symbol('METRICS_REPOSITORY')
