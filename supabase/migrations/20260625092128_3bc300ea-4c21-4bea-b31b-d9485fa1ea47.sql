
CREATE TABLE public.packages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  tagline TEXT NOT NULL DEFAULT '',
  price TEXT NOT NULL,
  price_note TEXT NOT NULL DEFAULT 'starting',
  icon TEXT NOT NULL DEFAULT 'Sparkles',
  gradient TEXT NOT NULL DEFAULT 'from-primary to-secondary',
  features JSONB NOT NULL DEFAULT '[]'::jsonb,
  services JSONB NOT NULL DEFAULT '[]'::jsonb,
  popular BOOLEAN NOT NULL DEFAULT false,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT ON public.packages TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.packages TO authenticated;
GRANT ALL ON public.packages TO service_role;

ALTER TABLE public.packages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view active packages"
ON public.packages FOR SELECT
USING (is_active = true OR public.is_admin_user());

CREATE POLICY "Admins can manage packages"
ON public.packages FOR ALL
USING (public.is_admin_user())
WITH CHECK (public.is_admin_user());

CREATE TRIGGER update_packages_updated_at
BEFORE UPDATE ON public.packages
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

INSERT INTO public.packages (name, tagline, price, icon, gradient, features, services, popular, sort_order) VALUES
('Starter', 'Perfect to launch your idea', '₹9,999', 'Zap', 'from-blue-500 to-cyan-500',
 '["1 Landing Page (up to 5 sections)","Mobile responsive design","Basic SEO setup","3 social media creatives","1 round of revisions","Delivery in 5–7 days"]'::jsonb,
 '["Web Development","Graphic Design"]'::jsonb, false, 1),
('Growth', 'For brands ready to scale', '₹29,999', 'Sparkles', 'from-primary to-secondary',
 '["Up to 5-page custom website","Premium UI/UX design","Advanced SEO + Analytics","10 social media creatives","2 short reels / promo video","Logo & brand kit","3 rounds of revisions","Delivery in 2–3 weeks"]'::jsonb,
 '["Web Development","Graphic Design","Video Editing","Digital Marketing"]'::jsonb, true, 2),
('Pro', 'Full-stack growth partner', '₹79,999', 'Crown', 'from-amber-500 to-orange-500',
 '["Custom web app / multi-page site","Full branding + identity system","1 month digital marketing","30+ social creatives","4 reels + 1 promo video","Video shoot (1 day)","Dedicated project manager","Unlimited revisions","Priority support"]'::jsonb,
 '["Web Development","Branding & Identity","Digital Marketing","Video Editing","Video Shooting","Graphic Design"]'::jsonb, false, 3);
