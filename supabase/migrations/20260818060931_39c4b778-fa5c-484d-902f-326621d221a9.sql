DROP POLICY IF EXISTS "Public can view active packages" ON public.packages;
DROP POLICY IF EXISTS "Admins can manage packages" ON public.packages;

CREATE POLICY "Public can view active packages"
ON public.packages FOR SELECT TO anon
USING (is_active = true);

CREATE POLICY "Authenticated can view packages"
ON public.packages FOR SELECT TO authenticated
USING (is_active = true OR public.is_admin_user());

CREATE POLICY "Admins can manage packages"
ON public.packages FOR ALL TO authenticated
USING (public.is_admin_user())
WITH CHECK (public.is_admin_user());

GRANT SELECT ON public.packages TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.packages TO authenticated;
GRANT ALL ON public.packages TO service_role;
GRANT EXECUTE ON FUNCTION public.is_admin_user() TO authenticated;