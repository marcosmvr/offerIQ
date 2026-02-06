import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
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
import { OfferService } from './offer.service'
import { CreateOfferSchema } from './schema/create-offer.schema'
import { UpdateOfferSchema } from './schema/update-offer.schema'
import {
  CREATE_OFFER_BODY_EXAMPLE,
  FULL_OFFER_EXAMPLE,
  LIST_OFFER_EXAMPLE,
  UPDATE_OFFER_BODY_EXAMPLE,
} from './offer.swagger'

@ApiTags('Offers')
@ApiBearerAuth()
@Controller('offers')
@UseGuards(JwtAuthGuard)
export class OfferController {
  constructor(private readonly offerService: OfferService) {}

  @Post()
  @ApiOperation({ summary: 'Criar uma nova oferta' })
  @ApiBody({ schema: { example: CREATE_OFFER_BODY_EXAMPLE } })
  @ApiResponse({
    status: 201,
    description: 'Oferta criada com sucesso',
    schema: { example: FULL_OFFER_EXAMPLE },
  })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body(new ZodValidationPipe(CreateOfferSchema)) data: CreateOfferSchema,
    @CurrentUser('id') userId: string,
  ) {
    return await this.offerService.create(data, userId)
  }

  @Get()
  @ApiOperation({ summary: 'Listar todas as ofertas do usuário' })
  @ApiResponse({
    status: 200,
    description: 'Lista de ofertas retornada',
    schema: { example: [LIST_OFFER_EXAMPLE] },
  })
  @HttpCode(HttpStatus.OK)
  async findOffersByUser(@CurrentUser('id') userId: string) {
    return await this.offerService.findByUserId(userId)
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar oferta por ID' })
  @ApiParam({
    name: 'id',
    description: 'ID da oferta (UUID)',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({
    status: 200,
    description: 'Oferta encontrada',
    schema: { example: FULL_OFFER_EXAMPLE },
  })
  @ApiResponse({ status: 404, description: 'Oferta não encontrada' })
  @HttpCode(HttpStatus.OK)
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser('id') userId: string,
  ) {
    return this.offerService.findById(id, userId)
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar dados de uma oferta' })
  @ApiBody({ schema: { example: UPDATE_OFFER_BODY_EXAMPLE } })
  @ApiResponse({
    status: 200,
    description: 'Oferta atualizada com sucesso',
    schema: { example: FULL_OFFER_EXAMPLE },
  })
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body(new ZodValidationPipe(UpdateOfferSchema)) data: UpdateOfferSchema,
    @CurrentUser('id') userId: string,
  ) {
    return this.offerService.updateById(id, userId, data)
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Excluir uma oferta permanentemente' })
  @ApiResponse({ status: 204, description: 'Oferta excluída com sucesso' })
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser('id') userId: string,
  ) {
    await this.offerService.deleteById(id, userId)
  }
}
