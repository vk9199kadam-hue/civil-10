-- Enable PostGIS for location features
CREATE EXTENSION IF NOT EXISTS postgis;

-- Create property_listings table
CREATE TABLE IF NOT EXISTS public.property_listings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('residential', 'commercial', 'land', 'industrial', 'hospitality')),
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    listing_type TEXT NOT NULL CHECK (listing_type IN ('sale', 'rent', 'lease')),
    price NUMERIC NOT NULL,
    price_unit TEXT DEFAULT '₹',
    is_negotiable BOOLEAN DEFAULT false,
    address_line TEXT,
    locality TEXT,
    city TEXT DEFAULT 'Islampur',
    district TEXT DEFAULT 'Sangli',
    state TEXT DEFAULT 'Maharashtra',
    pincode TEXT,
    location GEOGRAPHY(POINT, 4326),
    carpet_area NUMERIC,
    built_up_area NUMERIC,
    area_unit TEXT DEFAULT 'sqft',
    category_specs JSONB DEFAULT '{}'::jsonb, -- Store category-specific details
    rera_number TEXT,
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'sold', 'rented', 'expired', 'archived')),
    is_featured BOOLEAN DEFAULT false,
    is_verified BOOLEAN DEFAULT false,
    view_count INTEGER DEFAULT 0,
    published_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_listings_category_status ON public.property_listings(category, status);
CREATE INDEX IF NOT EXISTS idx_listings_city_status ON public.property_listings(city, status);
CREATE INDEX IF NOT EXISTS idx_listings_owner ON public.property_listings(owner_id);
CREATE INDEX IF NOT EXISTS idx_listings_specs ON public.property_listings USING GIN (category_specs);

-- Enable RLS
ALTER TABLE public.property_listings ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Anyone can view active listings." ON public.property_listings
    FOR SELECT USING (status = 'active');

CREATE POLICY "Owners can manage their own listings." ON public.property_listings
    FOR ALL USING (auth.uid() = owner_id);

CREATE POLICY "Admins have full access." ON public.property_listings
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE users.id = auth.uid() AND users.role = 'admin'
        )
    );
