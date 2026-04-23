export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          full_name: string
          phone: string | null
          email: string
          role: 'user' | 'owner' | 'agent' | 'admin'
          avatar_url: string | null
          agency_name: string | null
          rera_number: string | null
          preferences: Json | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          full_name: string
          phone?: string | null
          email: string
          role?: 'user' | 'owner' | 'agent' | 'admin'
          avatar_url?: string | null
          agency_name?: string | null
          rera_number?: string | null
          preferences?: Json | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          full_name?: string
          phone?: string | null
          email?: string
          role?: 'user' | 'owner' | 'agent' | 'admin'
          avatar_url?: string | null
          agency_name?: string | null
          rera_number?: string | null
          preferences?: Json | null
          updated_at?: string
        }
      }
      property_listings: {
        Row: {
          id: string
          owner_id: string
          category: 'residential' | 'commercial' | 'land' | 'industrial' | 'hospitality'
          title: string
          slug: string
          description: string
          listing_type: 'sale' | 'rent' | 'lease'
          price: number
          price_unit: 'total' | 'per_sqft' | 'per_month'
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
          area_unit: 'sqft' | 'sqm' | 'acre' | 'hectare' | 'guntha'
          category_specs: Json
          rera_number: string | null
          status: 'draft' | 'active' | 'sold' | 'rented' | 'expired' | 'archived'
          is_featured: boolean
          is_verified: boolean
          view_count: number
          published_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          owner_id: string
          category: 'residential' | 'commercial' | 'land' | 'industrial' | 'hospitality'
          title: string
          slug: string
          description: string
          listing_type: 'sale' | 'rent' | 'lease'
          price: number
          price_unit?: 'total' | 'per_sqft' | 'per_month'
          is_negotiable?: boolean
          address_line: string
          locality: string
          city: string
          district?: string
          state?: string
          pincode: string
          latitude?: number | null
          longitude?: number | null
          carpet_area?: number | null
          built_up_area?: number | null
          area_unit?: 'sqft' | 'sqm' | 'acre' | 'hectare' | 'guntha'
          category_specs?: Json
          rera_number?: string | null
          status?: 'draft' | 'active' | 'sold' | 'rented' | 'expired' | 'archived'
          is_featured?: boolean
          is_verified?: boolean
          view_count?: number
          published_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          owner_id?: string
          category?: 'residential' | 'commercial' | 'land' | 'industrial' | 'hospitality'
          title?: string
          slug?: string
          description?: string
          listing_type?: 'sale' | 'rent' | 'lease'
          price?: number
          price_unit?: 'total' | 'per_sqft' | 'per_month'
          is_negotiable?: boolean
          address_line?: string
          locality?: string
          city?: string
          district?: string
          state?: string
          pincode?: string
          latitude?: number | null
          longitude?: number | null
          carpet_area?: number | null
          built_up_area?: number | null
          area_unit?: 'sqft' | 'sqm' | 'acre' | 'hectare' | 'guntha'
          category_specs?: Json
          rera_number?: string | null
          status?: 'draft' | 'active' | 'sold' | 'rented' | 'expired' | 'archived'
          is_featured?: boolean
          is_verified?: boolean
          view_count?: number
          published_at?: string | null
          updated_at?: string
        }
      }
      projects: {
        Row: {
          id: string
          owner_id: string
          project_type: 'apartment' | 'villa' | 'plotted' | 'commercial_complex' | 'mixed'
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
          floor_plan: Json | null
          amenities: Json
          specifications: Json
          status: 'upcoming' | 'under_construction' | 'ready_to_move' | 'completed'
          possession_date: string | null
          price_range_min: number | null
          price_range_max: number | null
          is_featured: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          owner_id: string
          project_type: 'apartment' | 'villa' | 'plotted' | 'commercial_complex' | 'mixed'
          name: string
          slug: string
          description: string
          developer_name: string
          rera_number?: string | null
          address_line: string
          locality: string
          city: string
          pincode: string
          latitude?: number | null
          longitude?: number | null
          total_units?: number
          total_floors?: number
          units_per_floor?: number
          floor_plan?: Json | null
          amenities?: Json
          specifications?: Json
          status?: 'upcoming' | 'under_construction' | 'ready_to_move' | 'completed'
          possession_date?: string | null
          price_range_min?: number | null
          price_range_max?: number | null
          is_featured?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          owner_id?: string
          project_type?: 'apartment' | 'villa' | 'plotted' | 'commercial_complex' | 'mixed'
          name?: string
          slug?: string
          description?: string
          developer_name?: string
          rera_number?: string | null
          address_line?: string
          locality?: string
          city?: string
          pincode?: string
          latitude?: number | null
          longitude?: number | null
          total_units?: number
          total_floors?: number
          units_per_floor?: number
          floor_plan?: Json | null
          amenities?: Json
          specifications?: Json
          status?: 'upcoming' | 'under_construction' | 'ready_to_move' | 'completed'
          possession_date?: string | null
          price_range_min?: number | null
          price_range_max?: number | null
          is_featured?: boolean
          updated_at?: string
        }
      }
      units: {
        Row: {
          id: string
          project_id: string
          unit_number: string
          floor_number: number
          block_or_wing: string
          unit_type: string
          carpet_area: number | null
          price: number | null
          status: 'available' | 'booked' | 'sold' | 'blocked'
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
        Insert: {
          id?: string
          project_id: string
          unit_number: string
          floor_number?: number
          block_or_wing?: string
          unit_type: string
          carpet_area?: number | null
          price?: number | null
          status?: 'available' | 'booked' | 'sold' | 'blocked'
          booked_by?: string | null
          buyer_name?: string | null
          buyer_phone?: string | null
          remarks?: string | null
          grid_row?: number
          grid_col?: number
          status_changed_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          project_id?: string
          unit_number?: string
          floor_number?: number
          block_or_wing?: string
          unit_type?: string
          carpet_area?: number | null
          price?: number | null
          status?: 'available' | 'booked' | 'sold' | 'blocked'
          booked_by?: string | null
          buyer_name?: string | null
          buyer_phone?: string | null
          remarks?: string | null
          grid_row?: number
          grid_col?: number
          status_changed_at?: string | null
          updated_at?: string
        }
      }
      inquiries: {
        Row: {
          id: string
          user_id: string | null
          listing_id: string | null
          project_id: string | null
          unit_id: string | null
          name: string
          phone: string
          email: string | null
          message: string | null
          source: 'website' | 'whatsapp' | 'call' | 'walkin'
          status: 'new' | 'contacted' | 'interested' | 'converted' | 'closed'
          metadata: Json | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          listing_id?: string | null
          project_id?: string | null
          unit_id?: string | null
          name: string
          phone: string
          email?: string | null
          message?: string | null
          source?: 'website' | 'whatsapp' | 'call' | 'walkin'
          status?: 'new' | 'contacted' | 'interested' | 'converted' | 'closed'
          metadata?: Json | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          user_id?: string | null
          listing_id?: string | null
          project_id?: string | null
          unit_id?: string | null
          name?: string
          phone?: string
          email?: string | null
          message?: string | null
          source?: 'website' | 'whatsapp' | 'call' | 'walkin'
          status?: 'new' | 'contacted' | 'interested' | 'converted' | 'closed'
          metadata?: Json | null
          updated_at?: string
        }
      }
      inventory_logs: {
        Row: {
          id: string
          unit_id: string
          changed_by: string
          old_status: 'available' | 'booked' | 'sold' | 'blocked'
          new_status: 'available' | 'booked' | 'sold' | 'blocked'
          reason: string | null
          metadata: Json | null
          created_at: string
        }
        Insert: {
          id?: string
          unit_id: string
          changed_by: string
          old_status: 'available' | 'booked' | 'sold' | 'blocked'
          new_status: 'available' | 'booked' | 'sold' | 'blocked'
          reason?: string | null
          metadata?: Json | null
          created_at?: string
        }
        Update: never
      }
      media: {
        Row: {
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
        Insert: {
          id?: string
          listing_id?: string | null
          project_id?: string | null
          storage_path: string
          public_url: string
          alt_text?: string | null
          media_type?: 'image' | 'video' | 'document' | 'floor_plan'
          mime_type: string
          file_size: number
          sort_order?: number
          is_cover?: boolean
          created_at?: string
        }
        Update: {
          listing_id?: string | null
          project_id?: string | null
          storage_path?: string
          public_url?: string
          alt_text?: string | null
          media_type?: 'image' | 'video' | 'document' | 'floor_plan'
          mime_type?: string
          file_size?: number
          sort_order?: number
          is_cover?: boolean
        }
      }
    }
    Functions: {
      increment_view_count: {
        Args: { listing_id: string }
        Returns: void
      }
    }
    Enums: {
      property_category: 'residential' | 'commercial' | 'land' | 'industrial' | 'hospitality'
      listing_type: 'sale' | 'rent' | 'lease'
      listing_status: 'draft' | 'active' | 'sold' | 'rented' | 'expired' | 'archived'
      unit_status: 'available' | 'booked' | 'sold' | 'blocked'
      project_type: 'apartment' | 'villa' | 'plotted' | 'commercial_complex' | 'mixed'
      project_status: 'upcoming' | 'under_construction' | 'ready_to_move' | 'completed'
      user_role: 'user' | 'owner' | 'agent' | 'admin'
      inquiry_source: 'website' | 'whatsapp' | 'call' | 'walkin'
      inquiry_status: 'new' | 'contacted' | 'interested' | 'converted' | 'closed'
    }
  }
}
