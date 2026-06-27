
-- 1) Revoke EXECUTE from PUBLIC/anon on SECURITY DEFINER functions; grant only where needed.
REVOKE EXECUTE ON FUNCTION public.is_admin_user() FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.aggregate_daily_visitor_stats(date) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.check_page_view_rate_limit() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.check_contact_rate_limit() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.update_updated_at_column() FROM PUBLIC, anon, authenticated;

-- Keep RLS helpers callable by authenticated only (used inside policies; service_role bypasses)
GRANT EXECUTE ON FUNCTION public.is_admin_user() TO authenticated;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated;

-- 2) Drop broad SELECT policies that allow listing public buckets.
--    Files remain accessible via their direct public URL because the buckets are public.
DROP POLICY IF EXISTS "Blog images are publicly accessible" ON storage.objects;
DROP POLICY IF EXISTS "Public can view certification images" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can view logos" ON storage.objects;

-- Allow only admins to list/enumerate objects in these buckets (for admin UI management).
CREATE POLICY "Admins can list blog images"
ON storage.objects FOR SELECT
USING (bucket_id = 'blog-images' AND public.is_admin_user());

CREATE POLICY "Admins can list certification images"
ON storage.objects FOR SELECT
USING (bucket_id = 'certifications' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can list logos"
ON storage.objects FOR SELECT
USING (bucket_id = 'logos' AND public.is_admin_user());
