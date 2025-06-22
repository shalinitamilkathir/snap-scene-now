
-- Create enum for user roles
CREATE TYPE public.user_role AS ENUM ('customer', 'florist', 'admin');

-- Create enum for order status
CREATE TYPE public.order_status AS ENUM ('pending', 'confirmed', 'preparing', 'ready', 'delivered', 'cancelled');

-- Create enum for product categories
CREATE TYPE public.product_category AS ENUM ('bouquets', 'plants', 'occasions');

-- Update profiles table to include role and additional fields
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS role public.user_role DEFAULT 'customer';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS address TEXT;

-- Create products table
CREATE TABLE public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  image_url TEXT,
  category public.product_category NOT NULL,
  tags TEXT[] DEFAULT '{}',
  in_stock BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create carts table
CREATE TABLE public.carts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, product_id)
);

-- Create orders table
CREATE TABLE public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  total_amount DECIMAL(10,2) NOT NULL,
  status public.order_status DEFAULT 'pending',
  delivery_address TEXT,
  delivery_date DATE,
  special_instructions TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create order_items table
CREATE TABLE public.order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE NOT NULL,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
  quantity INTEGER NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create chat_threads table
CREATE TABLE public.chat_threads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  florist_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  subject TEXT,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create messages table
CREATE TABLE public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  thread_id UUID REFERENCES public.chat_threads(id) ON DELETE CASCADE NOT NULL,
  sender_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.carts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_threads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- RLS Policies for products (public read, admin write)
CREATE POLICY "Anyone can view products" ON public.products FOR SELECT USING (true);
CREATE POLICY "Only admins can manage products" ON public.products FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role IN ('admin', 'florist')
  )
);

-- RLS Policies for carts
CREATE POLICY "Users can manage their own cart" ON public.carts FOR ALL USING (auth.uid() = user_id);

-- RLS Policies for orders
CREATE POLICY "Users can view their own orders" ON public.orders FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own orders" ON public.orders FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Florists can view all orders" ON public.orders FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role IN ('admin', 'florist')
  )
);
CREATE POLICY "Florists can update orders" ON public.orders FOR UPDATE USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role IN ('admin', 'florist')
  )
);

-- RLS Policies for order_items
CREATE POLICY "Users can view their own order items" ON public.order_items FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.orders 
    WHERE id = order_id AND user_id = auth.uid()
  )
);
CREATE POLICY "Users can create their own order items" ON public.order_items FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.orders 
    WHERE id = order_id AND user_id = auth.uid()
  )
);
CREATE POLICY "Florists can view all order items" ON public.order_items FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role IN ('admin', 'florist')
  )
);

-- RLS Policies for chat_threads
CREATE POLICY "Users can view threads they're part of" ON public.chat_threads FOR SELECT USING (
  auth.uid() = customer_id OR auth.uid() = florist_id OR
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role IN ('admin', 'florist')
  )
);
CREATE POLICY "Customers can create threads" ON public.chat_threads FOR INSERT WITH CHECK (auth.uid() = customer_id);
CREATE POLICY "Florists can update threads" ON public.chat_threads FOR UPDATE USING (
  auth.uid() = florist_id OR
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role IN ('admin', 'florist')
  )
);

-- RLS Policies for messages
CREATE POLICY "Users can view messages in their threads" ON public.messages FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.chat_threads 
    WHERE id = thread_id AND (customer_id = auth.uid() OR florist_id = auth.uid())
  ) OR
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role IN ('admin', 'florist')
  )
);
CREATE POLICY "Users can send messages in their threads" ON public.messages FOR INSERT WITH CHECK (
  auth.uid() = sender_id AND
  EXISTS (
    SELECT 1 FROM public.chat_threads 
    WHERE id = thread_id AND (customer_id = auth.uid() OR florist_id = auth.uid())
  )
);
CREATE POLICY "Users can update their own messages" ON public.messages FOR UPDATE USING (auth.uid() = sender_id);

-- Insert sample products
INSERT INTO public.products (name, description, price, category, tags, image_url) VALUES
('Red Rose Bouquet', 'Beautiful bouquet of 12 fresh red roses perfect for romantic occasions', 45.99, 'bouquets', '{"roses", "romantic", "anniversary"}', 'https://images.unsplash.com/photo-1563241527-3004b7be0ffd'),
('Spring Tulip Arrangement', 'Colorful tulip arrangement with mixed spring flowers', 32.50, 'bouquets', '{"tulips", "spring", "colorful"}', 'https://images.unsplash.com/photo-1490750967868-88aa4486c946'),
('Succulent Garden', 'Low-maintenance succulent arrangement in decorative pot', 28.00, 'plants', '{"succulent", "low-maintenance", "indoor"}', 'https://images.unsplash.com/photo-1459411552884-841db9b3cc2a'),
('Wedding Centerpiece', 'Elegant white and pink arrangement perfect for weddings', 75.00, 'occasions', '{"wedding", "white", "pink", "elegant"}', 'https://images.unsplash.com/photo-1519475889208-e8db29369265'),
('Birthday Sunflower Bouquet', 'Bright and cheerful sunflower bouquet for celebrations', 38.99, 'bouquets', '{"sunflowers", "birthday", "cheerful"}', 'https://images.unsplash.com/photo-1597848212624-e6ec3f543876'),
('Peace Lily Plant', 'Beautiful indoor peace lily plant in ceramic pot', 42.00, 'plants', '{"peace lily", "indoor", "air-purifying"}', 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b');

-- Enable realtime for messages and chat_threads
ALTER TABLE public.messages REPLICA IDENTITY FULL;
ALTER TABLE public.chat_threads REPLICA IDENTITY FULL;
ALTER TABLE public.orders REPLICA IDENTITY FULL;

-- Add tables to realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.chat_threads;
ALTER PUBLICATION supabase_realtime ADD TABLE public.orders;
