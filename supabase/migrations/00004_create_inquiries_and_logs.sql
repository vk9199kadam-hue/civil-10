-- Create inquiries table for lead capture
CREATE TABLE IF NOT EXISTS public.inquiries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.users(id) ON DELETE SET NULL, -- Logged in user
    listing_id UUID REFERENCES public.property_listings(id) ON DELETE SET NULL,
    project_id UUID REFERENCES public.projects(id) ON DELETE SET NULL,
    unit_id UUID REFERENCES public.units(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT,
    message TEXT,
    source TEXT DEFAULT 'website' CHECK (source IN ('website', 'whatsapp', 'call', 'walkin')),
    status TEXT DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'interested', 'converted', 'closed')),
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create inventory_logs for change tracking
CREATE TABLE IF NOT EXISTS public.inventory_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    unit_id UUID REFERENCES public.units(id) ON DELETE CASCADE NOT NULL,
    changed_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
    old_status TEXT,
    new_status TEXT,
    reason TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory_logs ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Anyone can submit inquiry." ON public.inquiries
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Owners can see inquiries for their properties." ON public.inquiries
    FOR SELECT USING (
        auth.uid() = user_id OR -- Inquiry submitted by user
        EXISTS ( -- Property is owned by the user
            SELECT 1 FROM public.property_listings WHERE property_listings.id = inquiries.listing_id AND property_listings.owner_id = auth.uid()
        ) OR
        EXISTS ( -- Project is owned by the user
            SELECT 1 FROM public.projects WHERE projects.id = inquiries.project_id AND projects.owner_id = auth.uid()
        )
    );

CREATE POLICY "Only admins/owners view logs." ON public.inventory_logs
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE users.id = auth.uid() AND (users.role = 'admin' OR users.role = 'agent' OR users.role = 'owner')
        )
    );

-- Trigger for inventory audit trail
CREATE OR REPLACE FUNCTION public.log_unit_status_change()
RETURNS trigger AS $$
BEGIN
  IF (OLD.status IS DISTINCT FROM NEW.status) THEN
    INSERT INTO public.inventory_logs (unit_id, changed_by, old_status, new_status)
    VALUES (NEW.id, auth.uid(), OLD.status, NEW.status);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_unit_status_update
  AFTER UPDATE OF status ON public.units
  FOR EACH ROW EXECUTE FUNCTION public.log_unit_status_change();
