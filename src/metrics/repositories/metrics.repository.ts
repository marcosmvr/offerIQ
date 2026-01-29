import { Injectable } from '@nestjs/common'
import {
  CalculatedMetricsData,
  IMetricsRepository,
} from './metrics.repository.interface'
import { Offer, OfferMetrics } from '@prisma/client'
import { PrismaService } from 'src/prisma/prisma.service'

@Injectable()
export class MetricsRepository implements IMetricsRepository {
  constructor(private readonly prisma: PrismaService) {}
  async offerExists(id: string, userId: string): Promise<Offer | null> {
    return this.prisma.offer.findFirst({
      where: { id, userId },
      include: { metrics: true, reports: true },
    })
  }

  async upsert(
    offerId: string,
    data: CalculatedMetricsData,
  ): Promise<OfferMetrics> {
    return await this.prisma.offerMetrics.upsert({
      where: { offerId },
      create: {
        offerId,
        ...data,
      },
      update: data,
    })
  }
  async findByOfferId(offerId: string): Promise<OfferMetrics | null> {
    return await this.prisma.offerMetrics.findUnique({
      where: { offerId },
    })
  }
}
