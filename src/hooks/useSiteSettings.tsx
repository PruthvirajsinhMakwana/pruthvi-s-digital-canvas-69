import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import type { Json } from '@/integrations/supabase/types';

export interface SiteSettings {
  // Stats
  projectsDone: string;
  toolsMastered: string;
  yearsLearning: string;
  // Personal Info
  name: string;
  title: string;
  subtitle: string;
  description: string;
  availabilityStatus: string;
  // Social Links
  whatsappNumber: string;
  email: string;
  linkedinUrl: string;
  githubUrl: string;
  twitterUrl: string;
  instagramUrl: string;
  // CTA Links
  hireMeLink: string;
  hireMeText: string;
  servicesLink: string;
  servicesText: string;
  // Skills Tags
  skillTags: string[];
}

const defaultSettings: SiteSettings = {
  projectsDone: '50+',
  toolsMastered: '15+',
  yearsLearning: '3+',
  name: 'Pruthvirajsinh Makwana',
  title: 'IT Professional | Web Developer | Creative Designer',
  subtitle: 'IT Professional',
  description: 'I build responsive websites, engaging digital content, and modern brand experiences using technology, creativity, and innovation.',
  availabilityStatus: 'Available for freelance work',
  whatsappNumber: 'https://wa.link/ldny59',
  email: 'pruthvirajsinhpvt@gmail.com',
  linkedinUrl: 'https://www.linkedin.com/in/pruthvirajsinh-makwana-635974393/',
  githubUrl: 'https://github.com/PruthvirajsinhMakwana',
  twitterUrl: 'https://twitter.com',
  instagramUrl: 'https://www.instagram.com/pruthvirajsinh__makwana/',
  hireMeLink: '/contact',
  hireMeText: 'Hire Me',
  servicesLink: '/services',
  servicesText: 'View Services',
  skillTags: ['Web Development', 'Digital Marketing', 'Graphic Design', 'Video Editing'],
};

// Cache settings in memory to avoid repeated API calls
let cachedSettings: SiteSettings | null = null;
let cacheTimestamp: number = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export const useSiteSettings = () => {
  const [settings, setSettings] = useState<SiteSettings>(cachedSettings || defaultSettings);
  const [isLoading, setIsLoading] = useState(!cachedSettings);

  useEffect(() => {
    // Use cached settings if available and fresh
    if (cachedSettings && Date.now() - cacheTimestamp < CACHE_DURATION) {
      setSettings(cachedSettings);
      setIsLoading(false);
      return;
    }
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      // Use maybeSingle() to avoid 406 errors when no rows exist
      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .eq('key', 'general_settings')
        .maybeSingle();

      if (error) {
        console.error('Error fetching settings:', error);
      }

      if (data?.value) {
        const newSettings = { ...defaultSettings, ...(data.value as unknown as SiteSettings) };
        cachedSettings = newSettings;
        cacheTimestamp = Date.now();
        setSettings(newSettings);
      } else {
        // No settings in DB, use defaults
        cachedSettings = defaultSettings;
        cacheTimestamp = Date.now();
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateSettings = async (newSettings: Partial<SiteSettings>) => {
    try {
      const updatedSettings = { ...settings, ...newSettings };
      
      const { error } = await supabase
        .from('site_settings')
        .upsert([{
          key: 'general_settings',
          value: JSON.parse(JSON.stringify(updatedSettings)) as Json,
          updated_at: new Date().toISOString(),
        }], { onConflict: 'key' });

      if (error) throw error;

      // Update cache
      cachedSettings = updatedSettings;
      cacheTimestamp = Date.now();
      setSettings(updatedSettings);
      toast.success('Settings saved successfully');
      return true;
    } catch (error: any) {
      console.error('Error updating settings:', error);
      toast.error('Failed to save settings');
      return false;
    }
  };

  const clearCache = () => {
    cachedSettings = null;
    cacheTimestamp = 0;
  };

  return { settings, isLoading, updateSettings, refetch: fetchSettings, clearCache };
};
