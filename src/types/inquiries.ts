export type InquirySource = 'website' | 'whatsapp' | 'call' | 'walkin'
export type InquiryStatus = 'new' | 'contacted' | 'interested' | 'converted' | 'closed'

export interface Inquiry {
  id: string
  user_id: string | null
  listing_id: string | null
  project_id: string | null
  unit_id: string | null
  name: string
  phone: string
  email: string | null
  message: string | null
  source: InquirySource
  status: InquiryStatus
  metadata: Record<string, unknown> | null
  created_at: string
  updated_at: string
  // Joined
  listing?: { title: string; slug: string }
  project?: { name: string; slug: string }
}
