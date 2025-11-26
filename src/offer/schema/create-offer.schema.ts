import { z } from 'zod'

export const CreateOfferSchema = z.object({
  name: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres.'),

  niche: z.string().min(1, 'O nicho não pode ser vazio.'),
  country: z
    .string()
    .length(2, 'Código do país inválido (use 2 letras, ex: BR).'),
  trafficSource: z.string().min(1, 'Fonte de tráfego é obrigatória.'),
  funnelType: z.string().min(1, 'Tipo de funil é obrigatório.'),

  startDate: z.iso.datetime(
    'Formato de data de início inválido (espera-se ISO 8601).',
  ),
  endDate: z.iso
    .datetime('Formato de data de fim inválido (espera-se ISO 8601).')
    .optional(),

  budget: z
    .number()
    .positive('O orçamento deve ser um valor positivo.')
    .optional(),

  description: z.string().optional(),
})

export type CreateOfferSchema = z.infer<typeof CreateOfferSchema>
