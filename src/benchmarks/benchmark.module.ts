import { Module } from '@nestjs/common'
import { BenchmarksController } from './benchmark.controller'
import { BenchmarkService } from './benchmark.service'
import { PrismaModule } from '../prisma/prisma.module'
import { BENCHMARK_REPOSITORY } from './repositories/benchmark.repository.interface'
import { BenchmarkRepository } from './repositories/benchmark.repository'

@Module({
  imports: [PrismaModule],
  controllers: [BenchmarksController],
  providers: [
    BenchmarkService,
    {
      provide: BENCHMARK_REPOSITORY,
      useClass: BenchmarkRepository,
    },
  ],
  exports: [BenchmarkService],
})
export class BenchmarksModule {}
