import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import type { Json } from '@/integrations/supabase/types';

export interface PortfolioLink {
  id: string;
  title: string;
  url: string;
  icon?: string;
}

export interface ServiceLink {
  serviceName: string;
  url: string;
}

export interface CustomService {
  id: string;
  title: string;
  description: string;
  deliverables: string[];
  linkUrl: string;
  category: 'it' | 'esports';
  icon: string;
  gradient: string;
  isVisible: boolean;
  order: number;
}

export interface PortfolioCategory {
  id: string;
  title: string;
  description: string;
  driveLink: string;
  icon: string;
  gradient: string;
  isVisible: boolean;
  order: number;
}

export interface CompanyLogo {
  id: string;
  name: string;
  imageUrl: string;
  websiteUrl?: string;
  isVisible: boolean;
  order: number;
}

export interface SiteSettings {
  // Stats
  projectsDone: string;
  toolsMastered: string;
  yearsLearning: string;
  
  // Personal
  name: string;
  title: string;
  description: string;
  availabilityStatus: string;
  
  // Social Links
  email: string;
  whatsappNumber: string;
  linkedinUrl: string;
  githubUrl: string;
  twitterUrl: string;
  instagramUrl: string;
  
  // CTA
  hireMeText: string;
  hireMeLink: string;
  servicesText: string;
  servicesLink: string;
  
  // Resume
  resumeLink: string;
  
  // Skills
  skillTags: string[];
  
  // Portfolio Links
  portfolioLinks: PortfolioLink[];
  
  // Service Links (for default services)
  serviceLinks: ServiceLink[];
  
  // Custom Services
  customServices: CustomService[];
  
  // Portfolio Categories (Work Showcase)
  portfolioCategories: PortfolioCategory[];
  
  // Company Logos (Clients/Partners)
  companyLogos: CompanyLogo[];
}

const defaultSettings: SiteSettings = {
  projectsDone: '50+',
  toolsMastered: '15+',
  yearsLearning: '3+',
  name: 'Pruthvirajsinh Makwana',
  title: 'IT Professional | Web Developer | Creative Designer',
  description: 'Passionate about creating digital experiences that make a difference.',
  availabilityStatus: 'Available for freelance work',
  email: 'contact@example.com',
  whatsappNumber: '+919876543210',
  linkedinUrl: 'https://linkedin.com/in/username',
  githubUrl: 'https://github.com/username',
  twitterUrl: 'https://twitter.com/username',
  instagramUrl: 'https://instagram.com/username',
  hireMeText: 'Hire Me',
  hireMeLink: '/contact',
  servicesText: 'View Services',
  servicesLink: '/services',
  resumeLink: 'https://drive.google.com/file/d/1G7plYbEEkstJyR24LzOvGsANdz7_FeJw/view?usp=sharing',
  skillTags: ['Web Development', 'UI/UX Design', 'Digital Marketing', 'Video Editing'],
  portfolioLinks: [],
  serviceLinks: [],
  customServices: [],
  portfolioCategories: [],
  companyLogos: [],
};

// Simple in-memory cache
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
