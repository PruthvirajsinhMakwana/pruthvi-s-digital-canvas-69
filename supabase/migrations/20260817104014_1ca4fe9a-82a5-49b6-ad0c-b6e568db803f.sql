ALTER TABLE public.blog_posts
  ADD COLUMN IF NOT EXISTS scheduled_at timestamptz,
  ADD COLUMN IF NOT EXISTS archived_at timestamptz,
  ADD COLUMN IF NOT EXISTS raw_imported_content text,
  ADD COLUMN IF NOT EXISTS featured_image_alt text,
  ADD COLUMN IF NOT EXISTS focus_keyword text,
  ADD COLUMN IF NOT EXISTS secondary_keywords text[] DEFAULT '{}'::text[],
  ADD COLUMN IF NOT EXISTS canonical_url text,
  ADD COLUMN IF NOT EXISTS robots_index boolean NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS robots_follow boolean NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS og_title text,
  ADD COLUMN IF NOT EXISTS og_description text,
  ADD COLUMN IF NOT EXISTS twitter_title text,
  ADD COLUMN IF NOT EXISTS twitter_description text,
  ADD COLUMN IF NOT EXISTS twitter_image text,
  ADD COLUMN IF NOT EXISTS reading_time integer,
  ADD COLUMN IF NOT EXISTS old_slugs text[] DEFAULT '{}'::text[],
  ADD COLUMN IF NOT EXISTS updated_by uuid;

CREATE UNIQUE INDEX IF NOT EXISTS blog_posts_slug_unique ON public.blog_posts (slug);
CREATE INDEX IF NOT EXISTS blog_posts_status_published_idx ON public.blog_posts (status, published_at DESC);

-- Redirects
CREATE TABLE IF NOT EXISTS public.blog_redirects (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  old_slug text NOT NULL UNIQUE,
  new_slug text NOT NULL,
  post_id uuid REFERENCES public.blog_posts(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.blog_redirects TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.blog_redirects TO authenticated;
GRANT ALL ON public.blog_redirects TO service_role;
ALTER TABLE public.blog_redirects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read redirects" ON public.blog_redirects FOR SELECT USING (true);
CREATE POLICY "Admins manage redirects" ON public.blog_redirects FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

-- Media library
CREATE TABLE IF NOT EXISTS public.media_library (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  bucket text NOT NULL DEFAULT 'blog-images',
  path text NOT NULL,
  url text NOT NULL,
  alt text,
  caption text,
  width integer,
  height integer,
  size_bytes integer,
  mime_type text,
  created_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX IF NOT EXISTS media_library_path_unique ON public.media_library (bucket, path);
GRANT SELECT ON public.media_library TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.media_library TO authenticated;
GRANT ALL ON public.media_library TO service_role;
ALTER TABLE public.media_library ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view media" ON public.media_library FOR SELECT USING (true);
CREATE POLICY "Admins manage media" ON public.media_library FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));
CREATE TRIGGER update_media_library_updated_at BEFORE UPDATE ON public.media_library
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Blog engagement events
CREATE TABLE IF NOT EXISTS public.blog_events (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id uuid REFERENCES public.blog_posts(id) ON DELETE CASCADE,
  slug text,
  event_type text NOT NULL,
  label text,
  value numeric,
  visitor_id text,
  referrer text,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS blog_events_post_idx ON public.blog_events (post_id, event_type);
GRANT INSERT ON public.blog_events TO anon;
GRANT SELECT, INSERT ON public.blog_events TO authenticated;
GRANT ALL ON public.blog_events TO service_role;
ALTER TABLE public.blog_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can record blog events" ON public.blog_events FOR INSERT WITH CHECK (
  event_type IN ('view','cta_click','share','read_progress','copy_link')
);
CREATE POLICY "Admins can read blog events" ON public.blog_events FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role));

-- Publish due scheduled posts
CREATE OR REPLACE FUNCTION public.publish_due_scheduled_posts()
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE affected integer;
BEGIN
  UPDATE public.blog_posts
     SET status = 'published',
         published_at = COALESCE(published_at, scheduled_at, now())
   WHERE status = 'scheduled'
     AND scheduled_at IS NOT NULL
     AND scheduled_at <= now();
  GET DIAGNOSTICS affected = ROW_COUNT;
  RETURN affected;
END;
$$;
REVOKE EXECUTE ON FUNCTION public.publish_due_scheduled_posts() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.publish_due_scheduled_posts() TO service_role;