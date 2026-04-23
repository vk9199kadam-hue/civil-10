import { z } from 'zod'

export const unitUpdateSchema = z.object({
  status: z.enum(['available', 'booked', 'sold', 'blocked']),
  price: z.number().positive().optional().nullable(),
  buyer_name: z.string().optional().nullable(),
  buyer_phone: z.string().optional().nullable(),
  remarks: z.string().optional().nullable(),
})

export type UnitUpdateFormData = z.infer<typeof unitUpdateSchema>
