import { z } from 'zod'

export const inquirySchema = z.object({
  name: z.string().min(2, 'Name is required'),
  phone: z.string().min(10, 'Valid phone number is required'),
  email: z.string().email().optional().or(z.literal('')),
  message: z.string().max(1000).optional(),
})

export type InquiryFormData = z.infer<typeof inquirySchema>
