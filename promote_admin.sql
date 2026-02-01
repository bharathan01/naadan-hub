-- PROMOTE A USER TO ADMIN
-- 1. Get the user's ID from Supabase Authentication or the profiles table
-- 2. Run this query in the SQL Editor, replacing 'USER_ID_HERE' with the actual UUID

UPDATE public.profiles
SET role = 'admin'
WHERE id = 'USER_ID_HERE';

-- To check if it worked:
-- SELECT * FROM public.profiles WHERE role = 'admin';
