import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface LinktreeLink {
  id: string;
  title: string;
  subtitle: string | null;
  url: string;
  icon: string;
  button_color: string;
  button_shape: 'pill' | 'rounded' | 'square';
  button_style: 'solid' | 'outline' | 'neon' | 'minimal';
  icon_color: string;
  animation_enabled: boolean;
  is_visible: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface LinktreeSettings {
  page_title: string;
  page_subtitle: string;
  profile_image: string;
  background_theme: 'purple-neon' | 'dark' | 'light' | 'custom';
  glow_intensity: 'low' | 'medium' | 'high';
  font_family: 'poppins' | 'montserrat' | 'inter';
  enable_3d_elements: boolean;
  enable_glassmorphism: boolean;
  footer_link_visible: boolean;
}

const defaultSettings: LinktreeSettings = {
  page_title: 'Pruthvirajsinh Makwana',
  page_subtitle: 'IT Professional • Digital Creator • Esports Host',
  profile_image: '/placeholder.svg',
  background_theme: 'purple-neon',
  glow_intensity: 'medium',
  font_family: 'poppins',
  enable_3d_elements: true,
  enable_glassmorphism: true,
  footer_link_visible: true,
};

export const useLinktree = () => {
  const [links, setLinks] = useState<LinktreeLink[]>([]);
  const [settings, setSettings] = useState<LinktreeSettings>(defaultSettings);
  const [isLoading, setIsLoading] = useState(true);

  const fetchLinks = async () => {
    const { data, error } = await supabase
      .from('linktree_links')
      .select('*')
      .order('sort_order', { ascending: true });

    if (!error && data) {
      setLinks(data as unknown as LinktreeLink[]);
    }
  };

  const fetchSettings = async () => {
    const { data, error } = await supabase
      .from('linktree_settings')
      .select('*');

    if (!error && data) {
      const settingsObj = { ...defaultSettings };
      data.forEach((item) => {
        const key = item.key as keyof LinktreeSettings;
        if (key in settingsObj) {
          (settingsObj as Record<string, unknown>)[key] = item.value;
        }
      });
      setSettings(settingsObj);
    }
  };

  const fetchAll = async () => {
    setIsLoading(true);
    await Promise.all([fetchLinks(), fetchSettings()]);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const addLink = async (link: Omit<LinktreeLink, 'id' | 'created_at' | 'updated_at'>) => {
    const { data, error } = await supabase
      .from('linktree_links')
      .insert([{
        title: link.title,
        subtitle: link.subtitle,
        url: link.url,
        icon: link.icon,
        button_color: link.button_color,
        button_shape: link.button_shape,
        button_style: link.button_style,
        icon_color: link.icon_color,
        animation_enabled: link.animation_enabled,
        is_visible: link.is_visible,
        sort_order: link.sort_order,
      }])
      .select()
      .single();

    if (!error && data) {
      await fetchLinks();
      return data;
    }
    return null;
  };

  const updateLink = async (id: string, updates: Partial<LinktreeLink>) => {
    const { error } = await supabase
      .from('linktree_links')
      .update(updates as any)
      .eq('id', id);

    if (!error) {
      await fetchLinks();
      return true;
    }
    return false;
  };

  const deleteLink = async (id: string) => {
    const { error } = await supabase
      .from('linktree_links')
      .delete()
      .eq('id', id);

    if (!error) {
      await fetchLinks();
      return true;
    }
    return false;
  };

  const reorderLinks = async (reorderedLinks: LinktreeLink[]) => {
    const updates = reorderedLinks.map((link, index) => ({
      id: link.id,
      sort_order: index,
    }));

    for (const update of updates) {
      await supabase
        .from('linktree_links')
        .update({ sort_order: update.sort_order })
        .eq('id', update.id);
    }

    await fetchLinks();
  };

  const updateSetting = async (key: keyof LinktreeSettings, value: unknown) => {
    const { data: existing } = await supabase
      .from('linktree_settings')
      .select('id')
      .eq('key', key)
      .single();

    if (existing) {
      await supabase
        .from('linktree_settings')
        .update({ value: value as string })
        .eq('key', key);
    } else {
      await supabase
        .from('linktree_settings')
        .insert({ key, value: value as string });
    }

    setSettings(prev => ({ ...prev, [key]: value }));
    return true;
  };

  const updateSettings = async (newSettings: Partial<LinktreeSettings>) => {
    for (const [key, value] of Object.entries(newSettings)) {
      await updateSetting(key as keyof LinktreeSettings, value);
    }
  };

  return {
    links,
    settings,
    isLoading,
    addLink,
    updateLink,
    deleteLink,
    reorderLinks,
    updateSettings,
    refetch: fetchAll,
  };
};
