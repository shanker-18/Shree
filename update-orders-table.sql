-- =========================================
-- Add Missing Columns to Orders Table
-- Run this in Supabase SQL Editor
-- =========================================

-- Add guest_email column
ALTER TABLE public.orders 
ADD COLUMN IF NOT EXISTS guest_email TEXT DEFAULT '';

-- Add isFirstTimeOrder column  
ALTER TABLE public.orders 
ADD COLUMN IF NOT EXISTS isFirstTimeOrder BOOLEAN DEFAULT false;

-- Add state column if missing
ALTER TABLE public.orders 
ADD COLUMN IF NOT EXISTS state TEXT DEFAULT '';

-- Add freeSampleIncluded column if missing
ALTER TABLE public.orders 
ADD COLUMN IF NOT EXISTS freeSampleIncluded BOOLEAN DEFAULT false;

-- Update any existing records to have default values
UPDATE public.orders 
SET 
    guest_email = COALESCE(guest_email, ''),
    isFirstTimeOrder = COALESCE(isFirstTimeOrder, false),
    state = COALESCE(state, ''),
    freeSampleIncluded = COALESCE(freeSampleIncluded, false)
WHERE guest_email IS NULL 
   OR isFirstTimeOrder IS NULL 
   OR state IS NULL 
   OR freeSampleIncluded IS NULL;

-- Verify the table structure
SELECT column_name, data_type, is_nullable, column_default 
FROM information_schema.columns 
WHERE table_name = 'orders' 
AND table_schema = 'public'
ORDER BY ordinal_position;
