-- STORAGE BUCKETS SETUP
-- Run this in your Supabase SQL Editor to create the necessary storage buckets

-- 1. Create 'products' bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('products', 'products', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Create 'categories' bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('categories', 'categories', true)
ON CONFLICT (id) DO NOTHING;

-- 3. Storage Policies for 'products'
-- Allow public access to view images
CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'products');

-- Allow authenticated users to upload images
CREATE POLICY "Authenticated users can upload" ON storage.objects FOR INSERT 
WITH CHECK (
  bucket_id = 'products' AND 
  auth.role() = 'authenticated'
);

-- Allow owners and admins to delete images
CREATE POLICY "Owners can delete" ON storage.objects FOR DELETE 
USING (
  bucket_id = 'products' AND 
  (auth.uid()::text = (storage.foldername(name))[1] OR 
   EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'))
);

-- 4. Storage Policies for 'categories'
CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'categories');
CREATE POLICY "Admins can manage categories storage" ON storage.objects FOR ALL
USING (
  bucket_id = 'categories' AND 
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);
