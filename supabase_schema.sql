-- MASTER SCHEMA FOR NAADAN HUB
-- This file contains the complete database structure, including Seller role features.

-- 1. Create Profiles Table (Extensions for auth.users)
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  email TEXT UNIQUE,
  phone TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'seller', 'admin')),
  store_name TEXT,
  is_verified_seller BOOLEAN DEFAULT false,
  -- Detailed Seller Metadata
  location TEXT,
  district TEXT,
  farm_size TEXT,
  farm_type TEXT,
  registration_products TEXT[],
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 2. Create Categories Table
CREATE TABLE public.categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 3. Create Products Table
CREATE TABLE public.products (
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

-- 4. Create Orders Table
CREATE TABLE public.orders (
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

-- 5. Create Order Items Table
CREATE TABLE public.order_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE NOT NULL,
  product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
  product_name TEXT NOT NULL, 
  quantity INTEGER NOT NULL,
  unit_price DECIMAL(10, 2) NOT NULL
);

-- ENABLE ROW LEVEL SECURITY
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- 6. RLS POLICIES

-- Profiles
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admins can update any profile" ON public.profiles FOR UPDATE USING (
  (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'
);

-- Categories
CREATE POLICY "Categories are viewable by everyone" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Admins can manage categories" ON public.categories FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Products
CREATE POLICY "Products are viewable by everyone" ON public.products FOR SELECT USING (true);
CREATE POLICY "Verified sellers can manage products" ON public.products FOR ALL USING (
  auth.uid() = seller_id AND 
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_verified_seller = true)
);
CREATE POLICY "Admins have full access to products" ON public.products FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Orders
CREATE POLICY "Users can view own orders" ON public.orders FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own orders" ON public.orders FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins can view all orders" ON public.orders FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admins can update orders" ON public.orders FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Sellers can update orders containing their products" ON public.orders FOR UPDATE USING (
  EXISTS (
    SELECT 1 FROM public.order_items 
    JOIN public.products ON order_items.product_id = products.id 
    WHERE order_items.order_id = orders.id AND products.seller_id = auth.uid()
  )
);
CREATE POLICY "Sellers can view orders containing their products" ON public.orders FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.order_items 
    JOIN public.products ON order_items.product_id = products.id 
    WHERE order_items.order_id = orders.id AND products.seller_id = auth.uid()
  )
);

-- Order Items
CREATE POLICY "Order items are viewable by owner" ON public.order_items FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.orders WHERE id = order_items.order_id AND user_id = auth.uid())
);
CREATE POLICY "Admins can manage order items" ON public.order_items FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Sellers can view their own order items" ON public.order_items FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.products 
    WHERE products.id = order_items.product_id AND products.seller_id = auth.uid()
  )
);

-- 7. AUTOMATIC PROFILE CREATION ON SIGNUP
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

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 8. STORAGE BUCKETS SETUP
INSERT INTO storage.buckets (id, name, public)
VALUES ('products', 'products', true), ('categories', 'categories', true)
ON CONFLICT (id) DO NOTHING;

-- Storage Policies for 'products'
CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'products');
CREATE POLICY "Authenticated users can upload" ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'products' AND auth.role() = 'authenticated');
CREATE POLICY "Owners can delete" ON storage.objects FOR DELETE 
USING (bucket_id = 'products' AND (auth.uid()::text = (storage.foldername(name))[1] OR 
   EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')));

-- Storage Policies for 'categories'
CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'categories');
CREATE POLICY "Admins can manage categories storage" ON storage.objects FOR ALL
USING (bucket_id = 'categories' AND EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

-- 7. Create Blogs Table
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

-- Blog Policies
ALTER TABLE public.blogs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view published blogs" ON public.blogs
  FOR SELECT USING (status = 'published');

CREATE POLICY "Admins can do anything with blogs" ON public.blogs
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );
