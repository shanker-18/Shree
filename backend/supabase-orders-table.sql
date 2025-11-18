-- =========================================
-- ShreeRaga Orders Table Creation Script
-- Run this in Supabase SQL Editor
-- =========================================

-- Create orders table
CREATE TABLE public.orders (
    -- Primary key with auto-increment
    id BIGSERIAL PRIMARY KEY,
    
    -- Order identification
    order_id TEXT UNIQUE NOT NULL,
    
    -- Customer information
    user_id TEXT NULL,
    guest_name TEXT NOT NULL,
    guest_phone TEXT NOT NULL,
    guest_address TEXT NOT NULL,
    
    -- Order details
    items JSONB NOT NULL DEFAULT '[]'::jsonb,
    total_price NUMERIC(10,2) NOT NULL DEFAULT 0,
    
    -- Status fields
    payment_status TEXT NOT NULL DEFAULT 'pending',
    delivery_date TEXT NOT NULL DEFAULT '3-5 business days',
    status TEXT NOT NULL DEFAULT 'pending',
    
    -- Timestamps
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Add constraints for status fields
ALTER TABLE public.orders 
ADD CONSTRAINT orders_payment_status_check 
CHECK (payment_status IN ('pending', 'confirmed', 'failed'));

ALTER TABLE public.orders 
ADD CONSTRAINT orders_status_check 
CHECK (status IN ('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'));

-- Create indexes for better performance
CREATE INDEX idx_orders_order_id ON public.orders(order_id);
CREATE INDEX idx_orders_created_at ON public.orders(created_at);
CREATE INDEX idx_orders_status ON public.orders(status);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
CREATE TRIGGER trigger_orders_updated_at
    BEFORE UPDATE ON public.orders
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- Enable Row Level Security (RLS) - but with permissive policies for now
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Create permissive policies (allows all operations for now)
CREATE POLICY "Allow all operations on orders" ON public.orders
    FOR ALL USING (true)
    WITH CHECK (true);

-- Grant permissions to authenticated and anonymous users
GRANT ALL ON public.orders TO authenticated;
GRANT ALL ON public.orders TO anon;
GRANT USAGE ON SEQUENCE public.orders_id_seq TO authenticated;
GRANT USAGE ON SEQUENCE public.orders_id_seq TO anon;
