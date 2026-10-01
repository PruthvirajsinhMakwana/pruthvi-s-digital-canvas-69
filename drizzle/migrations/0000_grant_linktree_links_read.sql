GRANT SELECT ON public.linktree_links TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.linktree_links TO authenticated;
GRANT ALL ON public.linktree_links TO service_role;
GRANT SELECT ON public.page_views TO authenticated;
GRANT ALL ON public.page_views TO service_role;