export type UnitStatus = 'available' | 'booked' | 'sold' | 'blocked'
export type UnitType = '1BHK' | '2BHK' | '3BHK' | '4BHK' | 'shop' | 'office' | 'plot' | 'penthouse' | 'studio'

export interface Unit {
  id: string
  project_id: string
  unit_number: string
  floor_number: number
  block_or_wing: string
  unit_type: string
  carpet_area: number | null
  price: number | null
  status: UnitStatus
  booked_by: string | null
  buyer_name: string | null
  buyer_phone: string | null
  remarks: string | null
  grid_row: number
  grid_col: number
  status_changed_at: string | null
  created_at: string
  updated_at: string
}

export interface InventoryLog {
  id: string
  unit_id: string
  changed_by: string
  old_status: UnitStatus
  new_status: UnitStatus
  reason: string | null
  metadata: Record<string, unknown> | null
  created_at: string
  // Joined
  unit?: Unit
  changed_by_user?: {
    full_name: string
    email: string
  }
}

export interface InventorySummary {
  available: number
  booked: number
  sold: number
  blocked: number
  total: number
}
