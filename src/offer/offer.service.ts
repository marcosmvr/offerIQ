import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { CreateOfferSchema } from './schema/create-offer.schema'
import { UpdateOfferSchema } from './schema/update-offer.schema'

@Injectable()
export class OfferService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateOfferSchema & { userId: string }) {
    return await this.prisma.offer.create({
      data,
      include: { metrics: true },
    })
  }

  async findByUserId(userId: string) {
    return await this.prisma.offer.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    })
  }

  async findById(id: string, userId: string) {
    const offer = await this.prisma.offer.findFirst({
      where: { id, userId },
      include: { metrics: true, reports: true },
    })

    if (!offer) {
      throw new NotFoundException('Oferta não encontrada ou acesso negado.')
    }

    return offer
  }

  async updateById( id: string, userId: string, data: UpdateOfferSchema) {
    const offerCheck = await this.prisma.offer.findFirst({
      where: { id, userId },
    })

    if (!offerCheck) {
      throw new NotFoundException('Oferta não encontrada ou acesso negado.')
    }

    return await this.prisma.offer.update({
      where: { id },
      data,
    })
  }

  async deleteById(id: string, userId: string) {
    const offerCheck = await this.prisma.offer.findFirst({
      where: { id, userId },
    })

    if (!offerCheck) {
      throw new NotFoundException('Oferta não encontrada ou acesso negado.')
    }

    return this.prisma.offer.delete({
      where: { id },
    })
  }
}
