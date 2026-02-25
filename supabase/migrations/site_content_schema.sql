-- Create Site Content Table for Dynamic Page Content
CREATE TABLE IF NOT EXISTS public.site_content (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  section_key TEXT NOT NULL UNIQUE,
  content JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Site content is viewable by everyone" ON public.site_content
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage site content" ON public.site_content
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Function to handle timestamp updates
CREATE OR REPLACE FUNCTION handle_site_content_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for timestamp updates
CREATE TRIGGER set_site_content_updated_at
  BEFORE UPDATE ON public.site_content
  FOR EACH ROW EXECUTE PROCEDURE handle_site_content_updated_at();

-- Initial content seeds (Optional, but good for reference)
-- INSERT INTO public.site_content (section_key, content) VALUES ('hero_slides', '[...]') ON CONFLICT DO NOTHING;
