-- SUPABASE UPDATES FOR SELLER ROLE WORKFLOW

-- 1. Add missing columns to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS location TEXT,
ADD COLUMN IF NOT EXISTS district TEXT,
ADD COLUMN IF NOT EXISTS farm_size TEXT,
ADD COLUMN IF NOT EXISTS farm_type TEXT,
ADD COLUMN IF NOT EXISTS registration_products TEXT[];

-- Add missing columns if they don't exist (using a safe block)
DO $$ 
BEGIN 
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='profiles' AND column_name='phone') THEN
    ALTER TABLE public.profiles ADD COLUMN phone TEXT;
  END IF;
END $$;

-- 2. Update the handle_new_user function to capture all seller metadata
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

-- 3. Enhance RLS Policies for Sellers

-- Orders: Sellers can view orders containing their products
DROP POLICY IF EXISTS "Sellers can view orders containing their products" ON public.orders;
CREATE POLICY "Sellers can view orders containing their products" ON public.orders 
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.order_items 
    JOIN public.products ON order_items.product_id = products.id 
    WHERE order_items.order_id = orders.id AND products.seller_id = auth.uid()
  )
);

-- Order Items: Sellers can view their own order items
DROP POLICY IF EXISTS "Sellers can view their own order items" ON public.order_items;
CREATE POLICY "Sellers can view their own order items" ON public.order_items 
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.products 
    WHERE products.id = order_items.product_id AND products.seller_id = auth.uid()
  )
);

-- Products: Ensure sellers can create products
-- (Existing policy "Sellers can manage own products" might need to check if they are verified)
DROP POLICY IF EXISTS "Verified sellers can manage products" ON public.products;
CREATE POLICY "Verified sellers can manage products" ON public.products 
FOR ALL USING (
  auth.uid() = seller_id AND 
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_verified_seller = true)
);

-- Note: Admins already have full access via existing policies.

-- Profiles: Allow admins to update status
DROP POLICY IF EXISTS "Admins can update any profile" ON public.profiles;
CREATE POLICY "Admins can update any profile" ON public.profiles 
FOR UPDATE USING (
  (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'
);
