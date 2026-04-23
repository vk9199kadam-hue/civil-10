export type PropertyCategory = 'residential' | 'commercial' | 'land' | 'industrial' | 'hospitality'
export type ListingType = 'sale' | 'rent' | 'lease'
export type ListingStatus = 'draft' | 'active' | 'sold' | 'rented' | 'expired' | 'archived'
export type AreaUnit = 'sqft' | 'sqm' | 'acre' | 'hectare' | 'guntha'
export type PriceUnit = 'total' | 'per_sqft' | 'per_month'

export interface ResidentialSpecs {
  bedrooms?: string
  bathrooms?: string
  balconies?: string
  furnishing?: string
  facing?: string
  floor_number?: number
  total_floors?: number
  parking?: string
  age_of_property?: string
  possession_date?: string
  amenities?: string[]
}

export interface CommercialSpecs {
  shop_type?: string
  frontage_ft?: number
  ceiling_height_ft?: number
  power_load_kw?: number
  washroom?: boolean
  parking?: boolean
  is_corner?: boolean
  floor_number?: number
  internet_ready?: boolean
  fire_noc?: boolean
  lock_in_period?: number
}

export interface LandSpecs {
  plot_type?: string
  plot_length?: number
  plot_width?: number
  zone?: string
  road_width_ft?: number
  is_corner?: boolean
  boundary_wall?: boolean
  water?: boolean
  electricity?: boolean
  drainage?: boolean
  na_order?: boolean
  seven_twelve_clear?: boolean
  flood_risk?: string
  soil_type?: string
}

export interface IndustrialSpecs {
  shed_type?: string
  power_load_kw?: number
  ceiling_height_ft?: number
  loading_dock?: boolean
  crane?: boolean
  water_supply?: boolean
  fire_safety?: boolean
  pollution_clearance?: boolean
  factory_license?: boolean
  labor_shed?: boolean
  transport_connectivity?: string
}

export interface HospitalitySpecs {
  property_subtype?: string
  rooms?: number
  star_rating?: string
  restaurant_capacity?: number
  banquet_hall?: boolean
  banquet_capacity?: number
  pool?: boolean
  conference_rooms?: number
  tourism_license?: boolean
  fire_safety_cert?: boolean
  occupancy_rate?: number
}

export type CategorySpecs =
  | ResidentialSpecs
  | CommercialSpecs
  | LandSpecs
  | IndustrialSpecs
  | HospitalitySpecs

export interface PropertyListing {
  id: string
  owner_id: string
  category: PropertyCategory
  title: string
  slug: string
  description: string
  listing_type: ListingType
  price: number
  price_unit: PriceUnit
  is_negotiable: boolean
  address_line: string
  locality: string
  city: string
  district: string
  state: string
  pincode: string
  latitude: number | null
  longitude: number | null
  carpet_area: number | null
  built_up_area: number | null
  area_unit: AreaUnit
  category_specs: CategorySpecs
  rera_number: string | null
  status: ListingStatus
  is_featured: boolean
  is_verified: boolean
  view_count: number
  published_at: string | null
  created_at: string
  updated_at: string
  // Joined fields
  owner?: {
    full_name: string
    phone: string
    email: string
    role: string
    avatar_url: string | null
  }
  media?: MediaItem[]
}

export interface MediaItem {
  id: string
  listing_id: string | null
  project_id: string | null
  storage_path: string
  public_url: string
  alt_text: string | null
  media_type: 'image' | 'video' | 'document' | 'floor_plan'
  mime_type: string
  file_size: number
  sort_order: number
  is_cover: boolean
  created_at: string
}

export interface ListingFilters {
  category?: PropertyCategory
  listing_type?: ListingType
  city?: string
  locality?: string
  price_min?: number
  price_max?: number
  area_min?: number
  area_max?: number
  bedrooms?: string
  search?: string
  sort_by?: 'price_asc' | 'price_desc' | 'newest' | 'most_viewed'
  page?: number
  per_page?: number
}
