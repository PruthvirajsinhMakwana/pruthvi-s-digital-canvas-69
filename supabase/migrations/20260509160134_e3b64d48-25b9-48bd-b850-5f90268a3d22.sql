
CREATE TABLE public.certifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  issuer text,
  description text,
  image_url text,
  certificate_url text,
  gradient text DEFAULT 'from-blue-500 to-cyan-500',
  is_visible boolean DEFAULT true,
  sort_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE public.certifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view visible certifications"
  ON public.certifications FOR SELECT
  USING (is_visible = true OR has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can manage certifications"
  ON public.certifications FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER set_certifications_updated_at
  BEFORE UPDATE ON public.certifications
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

INSERT INTO storage.buckets (id, name, public) VALUES ('certifications', 'certifications', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public can view certification images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'certifications');

CREATE POLICY "Admins can upload certification images"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'certifications' AND has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update certification images"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'certifications' AND has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete certification images"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'certifications' AND has_role(auth.uid(), 'admin'::app_role));
