import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  UseGuards,
} from '@nestjs/common'
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger'
import { JwtAuthGuard } from 'src/auth/guards/auth.guard'
import { CurrentUser } from 'src/auth/decorators/current-user.decorator'
import { ZodValidationPipe } from 'src/utils/ZodValidationPipe'
import { MetricsService } from './metrics.service'
import { CreateMetricsSchema } from './schemas/create-metric.schema'
import {
  METRICS_INPUT_EXAMPLE,
  METRICS_RESPONSE_EXAMPLE,
} from './metrics.swagger'

@ApiTags('Metrics')
@ApiBearerAuth()
@Controller('offers/:offerId/metrics')
@UseGuards(JwtAuthGuard)
export class MetricsController {
  constructor(private metricsService: MetricsService) {}

  @Get()
  @ApiOperation({ summary: 'Obter métricas de uma oferta específica' })
  @ApiParam({
    name: 'offerId',
    description: 'ID da oferta vinculada',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({
    status: 200,
    description: 'Métricas encontradas',
    schema: { example: METRICS_RESPONSE_EXAMPLE },
  })
  @ApiResponse({ status: 400, description: 'ID da oferta inválido' })
  @HttpCode(HttpStatus.OK)
  async findMetricsByOffer(
    @Param('offerId', ParseUUIDPipe) offerId: string,
    @CurrentUser('id') userId: string,
  ) {
    return await this.metricsService.findByOfferId(offerId, userId)
  }

  @Post()
  @ApiOperation({ summary: 'Atualizar ou criar métricas (Upsert)' })
  @ApiParam({
    name: 'offerId',
    description: 'ID da oferta vinculada',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiBody({ schema: { example: METRICS_INPUT_EXAMPLE } })
  @ApiResponse({
    status: 200,
    description: 'Métricas processadas com sucesso',
    schema: { example: METRICS_RESPONSE_EXAMPLE },
  })
  @HttpCode(HttpStatus.OK)
  async upsert(
    @Param('offerId', ParseUUIDPipe) offerId: string,
    @CurrentUser('id') userId: string,
    @Body(new ZodValidationPipe(CreateMetricsSchema)) data: CreateMetricsSchema,
  ) {
    return await this.metricsService.upsert(offerId, data)
  }
}
