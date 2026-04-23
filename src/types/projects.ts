export type ProjectType = 'apartment' | 'villa' | 'plotted' | 'commercial_complex' | 'mixed'
export type ProjectStatus = 'upcoming' | 'under_construction' | 'ready_to_move' | 'completed'

export interface Block {
  name: string
  floors: number
  units_per_floor: number
  unit_label_pattern: string
  unit_types: string[]
}

export interface FloorPlan {
  blocks: Block[]
}

export interface Project {
  id: string
  owner_id: string
  project_type: ProjectType
  name: string
  slug: string
  description: string
  developer_name: string
  rera_number: string | null
  address_line: string
  locality: string
  city: string
  pincode: string
  latitude: number | null
  longitude: number | null
  total_units: number
  total_floors: number
  units_per_floor: number
  floor_plan: FloorPlan | null
  amenities: string[]
  specifications: Record<string, string>
  status: ProjectStatus
  possession_date: string | null
  price_range_min: number | null
  price_range_max: number | null
  is_featured: boolean
  created_at: string
  updated_at: string
  // Joined
  owner?: {
    full_name: string
    phone: string
    email: string
  }
  media?: import('./listings').MediaItem[]
  units?: import('./units').Unit[]
}
