import {
  ConflictException,
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common'
import { CreateBenchmarkSchema } from './schemas/create-benchmarks.schema'
import { BenchmarkFiltersSchema } from './schemas/benchmarks-filter.schema'
import { UpdateBenchmarkSchema } from './schemas/update-benchmarks.schemas'
import {
  BENCHMARK_REPOSITORY,
  type IBenchmarkRepository,
} from './repositories/benchmark.repository.interface'

@Injectable()
export class BenchmarkService {
  private readonly logger = new Logger(BenchmarkService.name)

  constructor(
    @Inject(BENCHMARK_REPOSITORY)
    private readonly benchmarkRepository: IBenchmarkRepository,
  ) {}

  async create(data: unknown) {
    try {
      const validatedData = CreateBenchmarkSchema.parse(data)
      const benchmark = await this.benchmarkRepository.create(validatedData)

      this.logger.log(`Benchmark criado: ${benchmark.id}`)
      return benchmark
    } catch (error) {
      return this.handleDatabaseError(error, 'criar benchmark')
    }
  }

  async findAll(filters: unknown) {
    try {
      const validatedFilters = BenchmarkFiltersSchema.parse(filters)
      const benchmarks =
        await this.benchmarkRepository.findAll(validatedFilters)

      return { benchmarks }
    } catch (error) {
      this.logger.error(`Erro ao listar benchmarks: ${error.message}`)
      throw new InternalServerErrorException('Falha ao listar benchmarks.')
    }
  }

  async findById(id: string) {
    try {
      const benchmark = await this.benchmarkRepository.findById(id)

      if (!benchmark) {
        throw new NotFoundException('Benchmark não encontrado.')
      }

      return benchmark
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error
      }
      return this.handleDatabaseError(error, 'buscar benchmark')
    }
  }

  async updateById(id: string, data: unknown) {
    try {
      const validatedData = UpdateBenchmarkSchema.parse(data)
      const benchmark = await this.benchmarkRepository.updateById(
        id,
        validatedData,
      )

      this.logger.log(`Benchmark ${id} atualizado`)
      return benchmark
    } catch (error) {
      if (error?.['code'] === 'P2025') {
        throw new NotFoundException('Benchmark não encontrado.')
      }
      return this.handleDatabaseError(error, 'atualizar benchmark')
    }
  }

  async deleteById(id: string) {
    try {
      await this.benchmarkRepository.deleteById(id)

      this.logger.log(`Benchmark ${id} deletado`)
      return { message: 'Benchmark deletado com sucesso' }
    } catch (error) {
      if (error?.['code'] === 'P2025') {
        throw new NotFoundException('Benchmark não encontrado.')
      }
      return this.handleDatabaseError(error, 'deletar benchmark')
    }
  }

  private handleDatabaseError(error: unknown, operation: string): never {
    const errorCode = error?.['code']

    if (errorCode === 'P2002') {
      throw new ConflictException(
        'Já existe um benchmark com esta combinação de parâmetros.',
      )
    }

    if (errorCode === 'P2025') {
      throw new NotFoundException('Registro não encontrado.')
    }

    this.logger.error(
      `Erro ao ${operation}: ${error instanceof Error ? error.message : 'Unknown'}`,
    )
    throw new InternalServerErrorException(`Falha ao ${operation}.`)
  }
}
