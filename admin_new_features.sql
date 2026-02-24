-- Add is_active to profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;

-- Create blogs table
CREATE TABLE IF NOT EXISTS public.blogs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  content TEXT NOT NULL,
  excerpt TEXT,
  category TEXT,
  featured_image TEXT,
  author_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- RLS for blogs
ALTER TABLE public.blogs ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any to avoid errors on re-run
DROP POLICY IF EXISTS "Anyone can view published blogs" ON public.blogs;
DROP POLICY IF EXISTS "Admins can do anything with blogs" ON public.blogs;

CREATE POLICY "Anyone can view published blogs" ON public.blogs
  FOR SELECT USING (status = 'published');

CREATE POLICY "Admins can do anything with blogs" ON public.blogs
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );
