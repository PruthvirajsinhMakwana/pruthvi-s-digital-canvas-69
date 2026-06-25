DROP POLICY IF EXISTS "Anyone can insert page views" ON public.page_views;
REVOKE INSERT ON public.page_views FROM anon, authenticated;

DROP POLICY IF EXISTS "Authenticated users can upload logos" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update logos" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete logos" ON storage.objects;

CREATE POLICY "Admins can upload logos"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'logos' AND public.is_admin_user());

CREATE POLICY "Admins can update logos"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'logos' AND public.is_admin_user())
WITH CHECK (bucket_id = 'logos' AND public.is_admin_user());

CREATE POLICY "Admins can delete logos"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'logos' AND public.is_admin_user());