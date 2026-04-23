import { z } from 'zod'

export const listingBaseSchema = z.object({
  category: z.enum(['residential', 'commercial', 'land', 'industrial', 'hospitality']),
  title: z.string().min(5, 'Title must be at least 5 characters').max(200),
  description: z.string().min(20, 'Description must be at least 20 characters').max(5000),
  listing_type: z.enum(['sale', 'rent', 'lease']),
  price: z.number().positive('Price must be positive'),
  price_unit: z.enum(['total', 'per_sqft', 'per_month']).default('total'),
  is_negotiable: z.boolean().default(false),
  address_line: z.string().min(5, 'Address is required'),
  locality: z.string().min(2, 'Locality is required'),
  city: z.string().min(2, 'City is required'),
  district: z.string().default('Sangli'),
  state: z.string().default('Maharashtra'),
  pincode: z.string().regex(/^\d{6}$/, 'Pincode must be 6 digits'),
  carpet_area: z.number().positive().optional().nullable(),
  built_up_area: z.number().positive().optional().nullable(),
  area_unit: z.enum(['sqft', 'sqm', 'acre', 'hectare', 'guntha']).default('sqft'),
  rera_number: z.string().optional().nullable(),
  category_specs: z.record(z.unknown()).default({}),
  status: z.enum(['draft', 'active', 'sold', 'rented', 'expired', 'archived']).default('draft'),
})

export const residentialSpecsSchema = z.object({
  bedrooms: z.string().optional(),
  bathrooms: z.string().optional(),
  balconies: z.string().optional(),
  furnishing: z.string().optional(),
  facing: z.string().optional(),
  floor_number: z.number().optional(),
  total_floors: z.number().optional(),
  parking: z.string().optional(),
  age_of_property: z.string().optional(),
  possession_date: z.string().optional(),
  amenities: z.array(z.string()).optional(),
})

export const commercialSpecsSchema = z.object({
  shop_type: z.string().optional(),
  frontage_ft: z.number().optional(),
  ceiling_height_ft: z.number().optional(),
  power_load_kw: z.number().optional(),
  washroom: z.boolean().optional(),
  parking: z.boolean().optional(),
  is_corner: z.boolean().optional(),
  floor_number: z.number().optional(),
  internet_ready: z.boolean().optional(),
  fire_noc: z.boolean().optional(),
  lock_in_period: z.number().optional(),
})

export const landSpecsSchema = z.object({
  plot_type: z.string().optional(),
  plot_length: z.number().optional(),
  plot_width: z.number().optional(),
  zone: z.string().optional(),
  road_width_ft: z.number().optional(),
  is_corner: z.boolean().optional(),
  boundary_wall: z.boolean().optional(),
  water: z.boolean().optional(),
  electricity: z.boolean().optional(),
  drainage: z.boolean().optional(),
  na_order: z.boolean().optional(),
  seven_twelve_clear: z.boolean().optional(),
  flood_risk: z.string().optional(),
  soil_type: z.string().optional(),
})

export const industrialSpecsSchema = z.object({
  shed_type: z.string().optional(),
  power_load_kw: z.number().optional(),
  ceiling_height_ft: z.number().optional(),
  loading_dock: z.boolean().optional(),
  crane: z.boolean().optional(),
  water_supply: z.boolean().optional(),
  fire_safety: z.boolean().optional(),
  pollution_clearance: z.boolean().optional(),
  factory_license: z.boolean().optional(),
  labor_shed: z.boolean().optional(),
  transport_connectivity: z.string().optional(),
})

export const hospitalitySpecsSchema = z.object({
  property_subtype: z.string().optional(),
  rooms: z.number().optional(),
  star_rating: z.string().optional(),
  restaurant_capacity: z.number().optional(),
  banquet_hall: z.boolean().optional(),
  banquet_capacity: z.number().optional(),
  pool: z.boolean().optional(),
  conference_rooms: z.number().optional(),
  tourism_license: z.boolean().optional(),
  fire_safety_cert: z.boolean().optional(),
  occupancy_rate: z.number().optional(),
})

export type ListingFormData = z.infer<typeof listingBaseSchema>
