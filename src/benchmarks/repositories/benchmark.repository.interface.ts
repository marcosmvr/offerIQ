import { Benchmark, Prisma } from '@prisma/client'
import { BenchmarkFiltersSchema } from '../schemas/benchmarks-filter.schema'
import { UpdateBenchmarkSchema } from '../schemas/update-benchmarks.schemas'

export interface IBenchmarkRepository {
  create(data: Prisma.BenchmarkCreateInput): Promise<Benchmark>
  findAll(filters: BenchmarkFiltersSchema): Promise<Benchmark[]>
  findById(id: string): Promise<Benchmark | null>
  updateById(id: string, data: UpdateBenchmarkSchema): Promise<Benchmark>
  deleteById(id: string): Promise<void>
}
