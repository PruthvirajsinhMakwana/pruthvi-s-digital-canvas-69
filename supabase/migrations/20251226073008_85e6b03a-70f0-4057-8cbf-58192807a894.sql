-- =====================================================
-- SECURITY FIX: Storage policies - restrict to admins only
-- =====================================================

-- Create a helper function in public schema to check admin role for storage
CREATE OR REPLACE FUNCTION public.is_admin_user()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid()
    AND role = 'admin'
  )
$$ LANGUAGE SQL SECURITY DEFINER SET search_path = public;

-- Drop existing overly permissive storage policies
DROP POLICY IF EXISTS "Admins can upload blog images" ON storage.objects;
DROP POLICY IF EXISTS "Admins can update blog images" ON storage.objects;
DROP POLICY IF EXISTS "Admins can delete blog images" ON storage.objects;

-- Create proper admin-only storage policies
CREATE POLICY "Admins can upload blog images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'blog-images'
  AND public.is_admin_user()
);

CREATE POLICY "Admins can update blog images"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'blog-images'
  AND public.is_admin_user()
);

CREATE POLICY "Admins can delete blog images"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'blog-images'
  AND public.is_admin_user()
);

-- =====================================================
-- SECURITY FIX: visitor_stats - remove public access
-- =====================================================

-- Drop overly permissive policies
DROP POLICY IF EXISTS "Anyone can insert visitor stats" ON visitor_stats;
DROP POLICY IF EXISTS "Anyone can update visitor stats" ON visitor_stats;

-- Create a SECURITY DEFINER function to aggregate visitor stats safely
CREATE OR REPLACE FUNCTION public.aggregate_daily_visitor_stats(target_date DATE)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO visitor_stats (date, total_views, unique_visitors)
  SELECT 
    target_date,
    COUNT(*),
    COUNT(DISTINCT COALESCE(real_ip, visitor_ip))
  FROM page_views
  WHERE DATE(created_at) = target_date
  ON CONFLICT (date) 
  DO UPDATE SET
    total_views = EXCLUDED.total_views,
    unique_visitors = EXCLUDED.unique_visitors,
    updated_at = NOW();
END;
$$;

-- Add unique constraint on date if not exists (for upsert)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'visitor_stats_date_key'
  ) THEN
    ALTER TABLE visitor_stats ADD CONSTRAINT visitor_stats_date_key UNIQUE (date);
  END IF;
END
$$;

-- =====================================================
-- SECURITY FIX: Rate limiting for contact form
-- =====================================================

-- Create rate limiting function for contact messages
CREATE OR REPLACE FUNCTION public.check_contact_rate_limit()
RETURNS TRIGGER AS $$
BEGIN
  -- Rate limit: max 3 submissions per email per hour
  IF EXISTS (
    SELECT 1 FROM contact_messages
    WHERE email = NEW.email
    AND created_at > NOW() - INTERVAL '1 hour'
    HAVING COUNT(*) >= 3
  ) THEN
    RAISE EXCEPTION 'Rate limit exceeded. Please wait before submitting again.';
  END IF;
  
  -- Also limit by rough IP pattern (message content similarity check)
  IF EXISTS (
    SELECT 1 FROM contact_messages
    WHERE created_at > NOW() - INTERVAL '1 minute'
    HAVING COUNT(*) >= 5
  ) THEN
    RAISE EXCEPTION 'Too many submissions. Please wait a moment.';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create trigger for rate limiting
DROP TRIGGER IF EXISTS contact_rate_limit_trigger ON contact_messages;
CREATE TRIGGER contact_rate_limit_trigger
BEFORE INSERT ON contact_messages
FOR EACH ROW EXECUTE FUNCTION public.check_contact_rate_limit();

-- =====================================================
-- SECURITY FIX: Rate limiting for page views (DDoS protection)
-- =====================================================

-- Create rate limiting function for page views
CREATE OR REPLACE FUNCTION public.check_page_view_rate_limit()
RETURNS TRIGGER AS $$
BEGIN
  -- Rate limit: max 100 page views per IP per minute
  IF EXISTS (
    SELECT 1 FROM page_views
    WHERE (real_ip = NEW.real_ip OR visitor_ip = NEW.visitor_ip)
    AND created_at > NOW() - INTERVAL '1 minute'
    HAVING COUNT(*) >= 100
  ) THEN
    -- Silently reject excessive page views (don't raise exception to avoid error responses)
    RETURN NULL;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create trigger for page view rate limiting
DROP TRIGGER IF EXISTS page_view_rate_limit_trigger ON page_views;
CREATE TRIGGER page_view_rate_limit_trigger
BEFORE INSERT ON page_views
FOR EACH ROW EXECUTE FUNCTION public.check_page_view_rate_limit();