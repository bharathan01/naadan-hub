-- MASTER SETUP SQL FOR NAADAN HUB
-- This file contains the complete database structure, policies, and storage setup.
-- Run this in your Supabase SQL Editor to set up everything at once.

-- ==========================================
-- 1. EXTENSIONS
-- ==========================================
-- Ensure necessary extensions are enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==========================================
-- 2. TABLES & ENUMS
-- ==========================================

-- Profiles Table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  email TEXT UNIQUE,
  phone TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'seller', 'admin')),
  store_name TEXT,
  is_verified_seller BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  location TEXT,
  district TEXT,
  farm_size TEXT,
  farm_type TEXT,
  registration_products TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Categories Table
CREATE TABLE IF NOT EXISTS public.categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Products Table
CREATE TABLE IF NOT EXISTS public.products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
  category TEXT REFERENCES public.categories(name) ON UPDATE CASCADE,
  images TEXT[] NOT NULL DEFAULT '{}',
  seller_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  stock_quantity INTEGER NOT NULL DEFAULT 0 CHECK (stock_quantity >= 0),
  is_verified BOOLEAN NOT NULL DEFAULT false,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'inactive', 'out_of_stock', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT TIMEZONE('utc'::text, NOW()),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT TIMEZONE('utc'::text, NOW())
);

-- Orders Table
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  address_line1 TEXT NOT NULL,
  address_line2 TEXT,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  postal_code TEXT NOT NULL,
  country TEXT NOT NULL DEFAULT 'India',
  landmark TEXT,
  total_amount DECIMAL(10, 2) NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'shipped', 'delivered', 'cancelled')),
  order_type TEXT DEFAULT 'whatsapp' CHECK (order_type IN ('whatsapp', 'website')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Order Items Table
CREATE TABLE IF NOT EXISTS public.order_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE NOT NULL,
  product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
  product_name TEXT NOT NULL, 
  quantity INTEGER NOT NULL,
  unit_price DECIMAL(10, 2) NOT NULL
);

-- Blogs Table
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

-- Site Content Table (Dynamic UI)
CREATE TABLE IF NOT EXISTS public.site_content (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  section_key TEXT NOT NULL UNIQUE,
  content JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Contact Enquiries Table
CREATE TABLE IF NOT EXISTS public.contact_enquiries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    subject TEXT NOT NULL,
    message TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'open',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================
-- 3. ENABLE RLS
-- ==========================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blogs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_enquiries ENABLE ROW LEVEL SECURITY;

-- ==========================================
-- 4. FUNCTIONS & TRIGGERS
-- ==========================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply update_updated_at to relevant tables
CREATE TRIGGER set_products_updated_at BEFORE UPDATE ON public.products FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER set_blogs_updated_at BEFORE UPDATE ON public.blogs FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER set_site_content_updated_at BEFORE UPDATE ON public.site_content FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER set_contact_enquiries_updated_at BEFORE UPDATE ON public.contact_enquiries FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- Function to handle auto-profile creation on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (
    id, 
    email, 
    full_name, 
    role, 
    phone, 
    store_name, 
    location, 
    district, 
    farm_size, 
    farm_type, 
    registration_products,
    is_verified_seller
  )
  VALUES (
    new.id, 
    new.email, 
    new.raw_user_meta_data->>'full_name', 
    COALESCE(new.raw_user_meta_data->>'role', 'user'),
    new.raw_user_meta_data->>'phone',
    new.raw_user_meta_data->>'store_name',
    new.raw_user_meta_data->>'location',
    new.raw_user_meta_data->>'district',
    new.raw_user_meta_data->>'farm_size',
    new.raw_user_meta_data->>'farm_type',
    ARRAY(SELECT jsonb_array_elements_text(COALESCE(new.raw_user_meta_data->'registration_products', '[]'::jsonb))),
    COALESCE((new.raw_user_meta_data->>'is_verified_seller')::boolean, false)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- ==========================================
-- 5. RLS POLICIES
-- ==========================================

-- Profiles Policies
CREATE POLICY "Profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admins have full access to profiles" ON public.profiles FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Categories Policies
CREATE POLICY "Categories are viewable by everyone" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Admins can manage categories" ON public.categories FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Products Policies
CREATE POLICY "Products are viewable by everyone" ON public.products FOR SELECT USING (true);
CREATE POLICY "Verified sellers can manage own products" ON public.products FOR ALL USING (
  auth.uid() = seller_id AND 
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_verified_seller = true)
);
CREATE POLICY "Admins have full access to products" ON public.products FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Orders Policies
CREATE POLICY "Users can view own orders" ON public.orders FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own orders" ON public.orders FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Sellers can view/update orders for their products" ON public.orders FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.order_items 
    JOIN public.products ON order_items.product_id = products.id 
    WHERE order_items.order_id = orders.id AND products.seller_id = auth.uid()
  )
);
CREATE POLICY "Admins have full access to orders" ON public.orders FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Order Items Policies
CREATE POLICY "Order items are viewable by owner" ON public.order_items FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.orders WHERE id = order_items.order_id AND user_id = auth.uid())
);
CREATE POLICY "Sellers can view their product items" ON public.order_items FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.products 
    WHERE products.id = order_items.product_id AND products.seller_id = auth.uid()
  )
);
CREATE POLICY "Admins have full access to order items" ON public.order_items FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Blog Policies
CREATE POLICY "Anyone can view published blogs" ON public.blogs FOR SELECT USING (status = 'published');
CREATE POLICY "Admins have full access to blogs" ON public.blogs FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Site Content Policies
CREATE POLICY "Site content is public" ON public.site_content FOR SELECT USING (true);
CREATE POLICY "Admins can manage site content" ON public.site_content FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Contact Enquiry Policies
CREATE POLICY "Anyone can submit enquiries" ON public.contact_enquiries FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "Admins can manage enquiries" ON public.contact_enquiries FOR ALL TO authenticated USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- ==========================================
-- 6. STORAGE BUCKETS & POLICIES
-- ==========================================

-- Create Buckets
INSERT INTO storage.buckets (id, name, public)
VALUES ('products', 'products', true), ('categories', 'categories', true), ('blogs', 'blogs', true)
ON CONFLICT (id) DO NOTHING;

-- Products Storage Policies
CREATE POLICY "Public Products View" ON storage.objects FOR SELECT USING (bucket_id = 'products');
CREATE POLICY "Seller/Admin Product Upload" ON storage.objects FOR INSERT WITH CHECK (
  bucket_id = 'products' AND auth.role() = 'authenticated'
);
CREATE POLICY "Seller/Admin Product Delete" ON storage.objects FOR DELETE USING (
  bucket_id = 'products' AND (auth.uid()::text = (storage.foldername(name))[1] OR 
   EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'))
);

-- Categories Storage Policies
CREATE POLICY "Public Categories View" ON storage.objects FOR SELECT USING (bucket_id = 'categories');
CREATE POLICY "Admin Category Management" ON storage.objects FOR ALL USING (
  bucket_id = 'categories' AND EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Blogs Storage Policies
CREATE POLICY "Public Blogs View" ON storage.objects FOR SELECT USING (bucket_id = 'blogs');
CREATE POLICY "Admin Blog Storage Management" ON storage.objects FOR ALL USING (
  bucket_id = 'blogs' AND EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- ==========================================
-- 7. UTILITY: PROMOTE FIRST ADMIN
-- ==========================================
-- Uncomment and replace YOUR_USER_ID if you need to manually promote yourself
-- UPDATE public.profiles SET role = 'admin' WHERE id = 'YOUR_USER_ID';
-- UPDATE public.profiles SET role = 'admin' WHERE email = 'admin@naadanhub.com';
