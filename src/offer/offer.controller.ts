import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Req,
  UsePipes,
} from '@nestjs/common'
import { ZodValidationPipe } from 'src/utils/ZodValidationPipe'
import { CreateOfferSchema } from './schema/create-offer.schema'
import { OfferService } from './offer.service'
import { UpdateOfferSchema } from './schema/update-offer.schema'

@Controller('offers')
export class OfferController {
  constructor(private readonly offerService: OfferService) {}

  @Post()
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(CreateOfferSchema))
  async create(@Body() createOfferSchema: CreateOfferSchema) {
    const tempUserId = 'temp-uuid'

    const createdOffer = await this.offerService.create({
      ...createOfferSchema,
      userId: tempUserId,
    })

    return createdOffer
  }

  @Get('/user/:userId')
  @HttpCode(200)
  async findOffersByUser(@Param('userId') userId: string) {
    return this.offerService.findByUserId(userId)
  }

  @Get('/:id')
  @HttpCode(200)
  async findOffersById(@Param('id') id: string, @Req() req: any) {
    const userId = 'temp-uuid'
    return this.offerService.findById(id, userId)
  }

  @Patch('/:id')
  @HttpCode(200)
  async update(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(UpdateOfferSchema))
    updateOfferSchema: UpdateOfferSchema,
    @Req() req: any,
  ) {
    const userId = 'temp-uuid'

    return this.offerService.updateById(id, userId, updateOfferSchema)
  }
}
