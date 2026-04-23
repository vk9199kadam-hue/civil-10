-- Create media table for images and documents
CREATE TABLE IF NOT EXISTS public.media (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    listing_id UUID REFERENCES public.property_listings(id) ON DELETE CASCADE,
    project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
    storage_path TEXT NOT NULL,
    public_url TEXT NOT NULL,
    alt_text TEXT,
    media_type TEXT DEFAULT 'image' CHECK (media_type IN ('image', 'video', 'document', 'floor_plan')),
    mime_type TEXT,
    file_size INTEGER,
    sort_order INTEGER DEFAULT 0,
    is_cover BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Indexing for fast media retrieval
CREATE INDEX IF NOT EXISTS idx_media_listing ON public.media(listing_id);
CREATE INDEX IF NOT EXISTS idx_media_project ON public.media(project_id);

-- Enable RLS
ALTER TABLE public.media ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Public read for all media." ON public.media FOR SELECT USING (true);
CREATE POLICY "Owners can manage media." ON public.media FOR ALL USING (
    EXISTS (SELECT 1 FROM public.property_listings WHERE property_listings.id = media.listing_id AND property_listings.owner_id = auth.uid()) OR
    EXISTS (SELECT 1 FROM public.projects WHERE projects.id = media.project_id AND projects.owner_id = auth.uid())
);
