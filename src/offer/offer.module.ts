import { Module } from '@nestjs/common'
import { OfferController } from './offer.controller'
import { OfferService } from './offer.service'
import { PrismaModule } from 'src/prisma/prisma.module'
import { OFFERS_REPOSITORY } from './repositories/offer.repository.interface'
import { OffersRepository } from './repositories/offer.repository'

@Module({
  imports: [PrismaModule],
  controllers: [OfferController],
  providers: [
    OfferService,
    {
      provide: OFFERS_REPOSITORY,
      useClass: OffersRepository,
    },
  ],
  exports: [OfferService],
})
export class OfferModule {}
