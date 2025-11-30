import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { CreateMetricsSchema } from './schemas/create-metric.schema'
import { Decimal } from '@prisma/client/runtime/client'

@Injectable()
export class MetricsService {
  private readonly logger = new Logger(MetricsService.name)
  constructor(private prisma: PrismaService) {}

  async upsert(offerId: string, userId: string, data: CreateMetricsSchema) {
    try {
      await this.verifyOfferOwnership(offerId, userId)

      const calculatedData = this.calculateMetrics(data)

      const metrics = await this.prisma.offerMetrics.upsert({
        where: { offerId },
        create: {
          offerId,
          ...calculatedData,
        },
        update: calculatedData,
      })

      this.logger.log(`Métricas atualizadas para oferta ${offerId}`)
      return metrics
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error
      }
      return this.handleDatabaseError(error, 'atualizar métricas')
    }
  }

  async findByOfferId(offerId: string, userId: string) {
    try {
      await this.verifyOfferOwnership(offerId, userId)

      const metrics = await this.prisma.offerMetrics.findUnique({
        where: { offerId },
      })

      if (!metrics) {
        throw new NotFoundException(
          'Métricas não encontradas para esta oferta.',
        )
      }

      return metrics
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error
      }
      return this.handleDatabaseError(error, 'buscar métricas')
    }
  }

  private calculateMetrics(data: CreateMetricsSchema) {
    const {
      impressions = 0,
      clicks = 0,
      leads = 0,
      sales = 0,
      revenue = 0,
      cost = 0,
    } = data

    return {
      impressions,
      clicks,
      leads,
      sales,
      revenue: new Decimal(revenue),
      cost: new Decimal(cost),

      ctr:
        impressions > 0
          ? new Decimal((clicks / impressions) * 100)
          : new Decimal(0),
      cpc: clicks > 0 ? new Decimal(cost / clicks) : new Decimal(0),
      cpm:
        impressions > 0
          ? new Decimal((cost / impressions) * 1000)
          : new Decimal(0),
      conversionRate:
        leads > 0 ? new Decimal((sales / leads) * 100) : new Decimal(0),
      roas: cost > 0 ? new Decimal(revenue / cost) : new Decimal(0),
      aov: sales > 0 ? new Decimal(revenue / sales) : new Decimal(0),
    }
  }

  private async verifyOfferOwnership(offerId: string, userId: string) {
    const offer = await this.prisma.offer.findFirst({
      where: { id: offerId, userId },
      select: { id: true },
    })

    if (!offer) {
      throw new NotFoundException('Oferta não encontrada ou acesso negado.')
    }

    return offer
  }

  private handleDatabaseError(error: unknown, operation: string): never {
    const errorCode = error?.['code']

    if (errorCode === 'P2003') {
      throw new BadRequestException('Oferta inválida.')
    }

    this.logger.error(
      `Erro ao ${operation}: ${error instanceof Error ? error.message : 'Unknown'}`,
    )
    throw new InternalServerErrorException(`Falha ao ${operation}.`)
  }
}
