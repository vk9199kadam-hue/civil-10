import { z } from 'zod'

export const projectSchema = z.object({
  project_type: z.enum(['apartment', 'villa', 'plotted', 'commercial_complex', 'mixed']),
  name: z.string().min(3, 'Project name must be at least 3 characters').max(200),
  description: z.string().min(20, 'Description must be at least 20 characters').max(5000),
  developer_name: z.string().min(2, 'Developer name is required'),
  rera_number: z.string().optional().nullable(),
  address_line: z.string().min(5, 'Address is required'),
  locality: z.string().min(2, 'Locality is required'),
  city: z.string().min(2),
  pincode: z.string().regex(/^\d{6}$/, 'Pincode must be 6 digits'),
  total_floors: z.number().int().min(0).default(0),
  units_per_floor: z.number().int().min(0).default(0),
  status: z.enum(['upcoming', 'under_construction', 'ready_to_move', 'completed']).default('upcoming'),
  possession_date: z.string().optional().nullable(),
  price_range_min: z.number().positive().optional().nullable(),
  price_range_max: z.number().positive().optional().nullable(),
  amenities: z.array(z.string()).default([]),
})

export const blockSchema = z.object({
  name: z.string().min(1, 'Block name is required'),
  floors: z.number().int().min(1, 'At least 1 floor'),
  units_per_floor: z.number().int().min(1, 'At least 1 unit per floor'),
  unit_label_pattern: z.string().default('{block}-{floor}{unit}'),
  unit_types: z.array(z.string()).min(1),
})

export const floorPlanSchema = z.object({
  blocks: z.array(blockSchema).min(1, 'At least one block is required'),
})

export type ProjectFormData = z.infer<typeof projectSchema>
export type BlockFormData = z.infer<typeof blockSchema>
export type FloorPlanFormData = z.infer<typeof floorPlanSchema>
