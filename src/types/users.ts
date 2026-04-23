export type UserRole = 'user' | 'owner' | 'agent' | 'admin'

export interface UserProfile {
  id: string
  full_name: string
  phone: string | null
  email: string
  role: UserRole
  avatar_url: string | null
  agency_name: string | null
  rera_number: string | null
  preferences: Record<string, unknown> | null
  created_at: string
  updated_at: string
}
