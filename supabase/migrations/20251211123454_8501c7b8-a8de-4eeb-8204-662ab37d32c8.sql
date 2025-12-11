-- Create enum for link button styles
CREATE TYPE public.link_button_style AS ENUM ('solid', 'outline', 'neon', 'minimal');

-- Create enum for link button shapes
CREATE TYPE public.link_button_shape AS ENUM ('pill', 'rounded', 'square');

-- Create linktree_links table
CREATE TABLE public.linktree_links (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  subtitle TEXT,
  url TEXT NOT NULL,
  icon TEXT DEFAULT 'link',
  button_color TEXT DEFAULT '#873CFF',
  button_shape link_button_shape DEFAULT 'pill',
  button_style link_button_style DEFAULT 'solid',
  icon_color TEXT DEFAULT '#FFFFFF',
  animation_enabled BOOLEAN DEFAULT true,
  is_visible BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create linktree_settings table
CREATE TABLE public.linktree_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  key TEXT NOT NULL UNIQUE,
  value JSONB,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.linktree_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.linktree_settings ENABLE ROW LEVEL SECURITY;

-- RLS policies for linktree_links
CREATE POLICY "Anyone can view visible links" ON public.linktree_links
  FOR SELECT USING (is_visible = true);

CREATE POLICY "Admins can manage all links" ON public.linktree_links
  FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- RLS policies for linktree_settings
CREATE POLICY "Anyone can view linktree settings" ON public.linktree_settings
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage linktree settings" ON public.linktree_settings
  FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- Insert default settings
INSERT INTO public.linktree_settings (key, value) VALUES
  ('page_title', '"Pruthvirajsinh Makwana"'),
  ('page_subtitle', '"IT Professional • Digital Creator • Esports Host"'),
  ('profile_image', '"/placeholder.svg"'),
  ('background_theme', '"purple-neon"'),
  ('glow_intensity', '"medium"'),
  ('font_family', '"poppins"'),
  ('enable_3d_elements', 'true'),
  ('enable_glassmorphism', 'true'),
  ('footer_link_visible', 'true');

-- Insert sample links
INSERT INTO public.linktree_links (title, subtitle, url, icon, button_color, button_style, sort_order) VALUES
  ('Portfolio Website', 'View my work', 'https://pruthvirajsinh.dev', 'globe', '#873CFF', 'neon', 1),
  ('LinkedIn', 'Connect with me', 'https://linkedin.com/in/pruthvirajsinh-makwana-635974393', 'linkedin', '#0A66C2', 'solid', 2),
  ('GitHub', 'Check my code', 'https://github.com/PruthvirajsinhMakwana', 'github', '#333333', 'solid', 3),
  ('Instagram', 'Follow my journey', 'https://instagram.com/pruthvirajsinh__makwana', 'instagram', '#E4405F', 'solid', 4),
  ('WhatsApp', 'Message me directly', 'https://wa.link/ldny59', 'message-circle', '#25D366', 'solid', 5);

-- Create updated_at trigger
CREATE TRIGGER update_linktree_links_updated_at
  BEFORE UPDATE ON public.linktree_links
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_linktree_settings_updated_at
  BEFORE UPDATE ON public.linktree_settings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();