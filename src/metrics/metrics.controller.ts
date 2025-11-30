import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common'
import { JwtAuthGuard } from 'src/auth/auth.guard'
import { MetricsService } from './metrics.service'
import { CurrentUser } from 'src/auth/current-user.decorator'
import { ZodValidationPipe } from 'src/utils/ZodValidationPipe'
import { CreateMetricsSchema } from './schemas/create-metric.schema'
import { validate as isUUID } from 'uuid'

@Controller('offers/:offerId/metrics')
@UseGuards(JwtAuthGuard)
export class MetricsController {
  constructor(private metricsService: MetricsService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async findMetricsByOffer(
    @Param('offerId') offerId: string,
    @CurrentUser('id') userId: string,
  ) {
    if (!isUUID(offerId)) {
      throw new BadRequestException('ID da oferta inválido.')
    }

    return await this.metricsService.findByOfferId(offerId, userId)
  }

  @Post()
  @HttpCode(HttpStatus.OK)
  async upsert(
    @Param('offerId') offerId: string,
    @CurrentUser('id') userId: string,
    @Body(new ZodValidationPipe(CreateMetricsSchema)) data: CreateMetricsSchema,
  ) {
    if (!isUUID(offerId)) {
      throw new BadRequestException('ID da oferta inválido.')
    }

    return await this.metricsService.upsert(offerId, userId, data)
  }
}
