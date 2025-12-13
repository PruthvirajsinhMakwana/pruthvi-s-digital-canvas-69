-- Create a table for tracking page views
CREATE TABLE public.page_views (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  page_path TEXT NOT NULL,
  visitor_ip TEXT,
  user_agent TEXT,
  referrer TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.page_views ENABLE ROW LEVEL SECURITY;

-- Policy to allow anyone to insert page views (for tracking)
CREATE POLICY "Anyone can insert page views" 
ON public.page_views 
FOR INSERT 
WITH CHECK (true);

-- Policy to allow admins to view page views
CREATE POLICY "Admins can view page views" 
ON public.page_views 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create an index for faster queries on created_at
CREATE INDEX idx_page_views_created_at ON public.page_views(created_at DESC);

-- Create an index for page_path queries
CREATE INDEX idx_page_views_page_path ON public.page_views(page_path);

-- Create a table for daily aggregated stats (for performance)
CREATE TABLE public.visitor_stats (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  date DATE NOT NULL UNIQUE,
  total_views INTEGER NOT NULL DEFAULT 0,
  unique_visitors INTEGER NOT NULL DEFAULT 0,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.visitor_stats ENABLE ROW LEVEL SECURITY;

-- Admins can view stats
CREATE POLICY "Admins can view visitor stats" 
ON public.visitor_stats 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Anyone can update stats (for the tracking function)
CREATE POLICY "Anyone can insert visitor stats" 
ON public.visitor_stats 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Anyone can update visitor stats" 
ON public.visitor_stats 
FOR UPDATE 
USING (true);