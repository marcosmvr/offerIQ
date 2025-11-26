import { z } from 'zod'
import { CreateOfferSchema } from './create-offer.schema'

export const UpdateOfferSchema = CreateOfferSchema.partial()

export type UpdateOfferSchema = z.infer<typeof UpdateOfferSchema>
