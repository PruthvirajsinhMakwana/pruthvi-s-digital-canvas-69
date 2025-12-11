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
  whatsappNumber: '+919876543210',
  email: 'contact@example.com',
  linkedinUrl: 'https://linkedin.com',
  githubUrl: 'https://github.com',
  twitterUrl: 'https://twitter.com',
  instagramUrl: 'https://instagram.com',
  hireMeLink: '/contact',
  hireMeText: 'Hire Me',
  servicesLink: '/services',
  servicesText: 'View Services',
  skillTags: ['Web Development', 'Digital Marketing', 'Graphic Design', 'Video Editing'],
};

export const useSiteSettings = () => {
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .eq('key', 'general_settings')
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching settings:', error);
      }

      if (data?.value) {
        setSettings({ ...defaultSettings, ...(data.value as unknown as SiteSettings) });
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

      setSettings(updatedSettings);
      toast.success('Settings saved successfully');
      return true;
    } catch (error: any) {
      console.error('Error updating settings:', error);
      toast.error('Failed to save settings');
      return false;
    }
  };

  return { settings, isLoading, updateSettings, refetch: fetchSettings };
};
