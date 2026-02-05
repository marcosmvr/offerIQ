import { Module } from '@nestjs/common'
import { PrismaModule } from 'src/prisma/prisma.module'
import { MetricsController } from './metrics.controller'
import { MetricsService } from './metrics.service'
import { METRICS_REPOSITORY } from './repositories/metrics.repository.interface'
import { MetricsRepository } from './repositories/metrics.repository'

@Module({
  imports: [PrismaModule],
  controllers: [MetricsController],
  providers: [
    MetricsService,
    {
      provide: METRICS_REPOSITORY,
      useClass: MetricsRepository,
    },
  ],
  exports: [MetricsService],
})
export class MetricsModule {}
