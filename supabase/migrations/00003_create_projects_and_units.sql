-- Create projects table for multi-unit developments
CREATE TABLE IF NOT EXISTS public.projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    project_type TEXT NOT NULL CHECK (project_type IN ('apartment', 'villa', 'plotted', 'commercial_complex', 'mixed')),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    developer_name TEXT,
    rera_number TEXT,
    address_line TEXT,
    locality TEXT,
    city TEXT DEFAULT 'Islampur',
    district TEXT DEFAULT 'Sangli',
    state TEXT DEFAULT 'Maharashtra',
    pincode TEXT,
    location GEOGRAPHY(POINT, 4326),
    total_units INTEGER,
    total_floors INTEGER,
    units_per_floor INTEGER,
    floor_plan JSONB DEFAULT '{}'::jsonb, -- Configuration for generating units
    amenities JSONB DEFAULT '[]'::jsonb,
    specifications JSONB DEFAULT '{}'::jsonb,
    status TEXT DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'under_construction', 'ready_to_move', 'completed')),
    possession_date DATE,
    price_range_min NUMERIC,
    price_range_max NUMERIC,
    is_featured BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create units table for individual units within a project
CREATE TABLE IF NOT EXISTS public.units (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL,
    unit_number TEXT NOT NULL,
    floor_number TEXT,
    block_or_wing TEXT,
    unit_type TEXT,
    carpet_area NUMERIC,
    price NUMERIC,
    status TEXT DEFAULT 'available' CHECK (status IN ('available', 'booked', 'sold', 'blocked')),
    booked_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
    buyer_name TEXT,
    buyer_phone TEXT,
    remarks TEXT,
    grid_row INTEGER,
    grid_col INTEGER,
    status_changed_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(project_id, floor_number, unit_number) -- Ensure no duplicate unit mapping
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_projects_owner ON public.projects(owner_id);
CREATE INDEX IF NOT EXISTS idx_units_project_status ON public.units(project_id, status);

-- Enable RLS
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.units ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Anyone can view projects." ON public.projects FOR SELECT USING (true);
CREATE POLICY "Anyone can view units." ON public.units FOR SELECT USING (true);

CREATE POLICY "Owners can manage projects." ON public.projects FOR ALL USING (auth.uid() = owner_id);
CREATE POLICY "Owners can manage units of their projects." ON public.units FOR ALL 
    USING (EXISTS (SELECT 1 FROM public.projects WHERE projects.id = units.project_id AND projects.owner_id = auth.uid()));
