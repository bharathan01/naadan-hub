-- Create contact_enquiries table
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

-- Enable RLS
ALTER TABLE public.contact_enquiries ENABLE ROW LEVEL SECURITY;

-- Policies
-- 1. Allow anyone to insert enquiries (Public submission)
CREATE POLICY "Enable insert for all users" 
ON public.contact_enquiries 
FOR INSERT 
TO public
WITH CHECK (true);

-- 2. Allow admins to manage enquiries
CREATE POLICY "Enable all access for admins" 
ON public.contact_enquiries 
FOR ALL 
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.profiles
        WHERE profiles.id = auth.uid()
        AND profiles.role = 'admin'
    )
);

-- Create a trigger to update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_contact_enquiries_updated_at
    BEFORE UPDATE ON public.contact_enquiries
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
