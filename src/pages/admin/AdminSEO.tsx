import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Save, Search, Globe, Share2, FileText, CheckCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { SEODashboardWidget } from '@/components/admin/SEODashboardWidget';

interface SEOSettings {
  siteTitle: string;
  siteDescription: string;
  siteKeywords: string;
  canonicalUrl: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  twitterHandle: string;
  googleVerification: string;
  bingVerification: string;
  robotsDirective: string;
  additionalKeywords: string;
}

const defaultSEOSettings: SEOSettings = {
  siteTitle: 'Pruthvirajsinh Makwana | IT Professional',
  siteDescription: 'Pruthvirajsinh Makwana - Leading IT Professional, Web Developer, Digital Marketing Expert from Gujarat, India.',
  siteKeywords: 'Pruthvirajsinh Makwana, Pruthvirajsinh, Web Developer, Digital Marketing',
  canonicalUrl: 'https://pruthvirajsinh.com',
  ogTitle: 'Pruthvirajsinh Makwana | IT Professional',
  ogDescription: 'Helping Brands Grow With Creativity, Technology & Digital Innovation.',
  ogImage: '',
  twitterHandle: '@pruthvirajsinh',
  googleVerification: 'Cpu019A0S-BESNShDe1GO8_GiVnmfN_pTS-nLVQO73E',
  bingVerification: '',
  robotsDirective: 'index, follow',
  additionalKeywords: 'pruthvi makwana, pruthviraj, makwana pruthvirajsinh, web developer gujarat, freelance developer india',
};

const AdminSEO = () => {
  const [settings, setSettings] = useState<SEOSettings>(defaultSEOSettings);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .eq('key', 'seo_settings')
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching SEO settings:', error);
      }

      if (data?.value) {
        setSettings({ ...defaultSEOSettings, ...(data.value as unknown as SEOSettings) });
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      // First check if the setting exists
      const { data: existing } = await supabase
        .from('site_settings')
        .select('id')
        .eq('key', 'seo_settings')
        .single();

      const settingsValue = JSON.parse(JSON.stringify(settings));

      if (existing) {
        const { error } = await supabase
          .from('site_settings')
          .update({
            value: settingsValue,
            updated_at: new Date().toISOString(),
          })
          .eq('key', 'seo_settings');
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('site_settings')
          .insert([{
            key: 'seo_settings',
            value: settingsValue,
            updated_at: new Date().toISOString(),
          }]);
        if (error) throw error;
      }
      toast.success('SEO settings saved successfully!');
    } catch (error) {
      console.error('Error saving SEO settings:', error);
      toast.error('Failed to save SEO settings');
    } finally {
      setIsSaving(false);
    }
  };

  const handleChange = (field: keyof SEOSettings, value: string) => {
    setSettings({ ...settings, [field]: value });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="font-heading text-2xl font-bold">SEO Settings</h2>
        <p className="text-muted-foreground">Optimize your website for search engines</p>
      </div>

      <SEODashboardWidget />



      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic SEO Section */}
        <div className="glass-card rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
              <Search className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-heading font-bold">Basic SEO</h3>
              <p className="text-sm text-muted-foreground">Core SEO settings for your website</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="siteTitle">Site Title</Label>
              <Input
                id="siteTitle"
                value={settings.siteTitle}
                onChange={(e) => handleChange('siteTitle', e.target.value)}
                placeholder="Your Site Title"
                className="mt-2 bg-muted/50 border-border/50"
              />
              <p className="text-xs text-muted-foreground mt-1">Recommended: Under 60 characters</p>
            </div>
            <div>
              <Label htmlFor="siteDescription">Meta Description</Label>
              <Textarea
                id="siteDescription"
                value={settings.siteDescription}
                onChange={(e) => handleChange('siteDescription', e.target.value)}
                placeholder="Describe your website"
                rows={3}
                className="mt-2 bg-muted/50 border-border/50"
              />
              <p className="text-xs text-muted-foreground mt-1">Recommended: 150-160 characters</p>
            </div>
            <div>
              <Label htmlFor="siteKeywords">Primary Keywords</Label>
              <Textarea
                id="siteKeywords"
                value={settings.siteKeywords}
                onChange={(e) => handleChange('siteKeywords', e.target.value)}
                placeholder="keyword1, keyword2, keyword3"
                rows={2}
                className="mt-2 bg-muted/50 border-border/50"
              />
            </div>
            <div>
              <Label htmlFor="additionalKeywords">Additional Keywords (Hidden)</Label>
              <Textarea
                id="additionalKeywords"
                value={settings.additionalKeywords}
                onChange={(e) => handleChange('additionalKeywords', e.target.value)}
                placeholder="Additional keywords for better ranking"
                rows={3}
                className="mt-2 bg-muted/50 border-border/50"
              />
              <p className="text-xs text-muted-foreground mt-1">These will be added for SEO purposes</p>
            </div>
            <div>
              <Label htmlFor="canonicalUrl">Canonical URL</Label>
              <Input
                id="canonicalUrl"
                value={settings.canonicalUrl}
                onChange={(e) => handleChange('canonicalUrl', e.target.value)}
                placeholder="https://yourwebsite.com"
                className="mt-2 bg-muted/50 border-border/50"
              />
            </div>
          </div>
        </div>

        {/* Social Media SEO Section */}
        <div className="glass-card rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
              <Share2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-heading font-bold">Social Media SEO</h3>
              <p className="text-sm text-muted-foreground">Open Graph and Twitter Card settings</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="ogTitle">OG Title</Label>
              <Input
                id="ogTitle"
                value={settings.ogTitle}
                onChange={(e) => handleChange('ogTitle', e.target.value)}
                placeholder="Title for social sharing"
                className="mt-2 bg-muted/50 border-border/50"
              />
            </div>
            <div>
              <Label htmlFor="ogDescription">OG Description</Label>
              <Textarea
                id="ogDescription"
                value={settings.ogDescription}
                onChange={(e) => handleChange('ogDescription', e.target.value)}
                placeholder="Description for social sharing"
                rows={2}
                className="mt-2 bg-muted/50 border-border/50"
              />
            </div>
            <div>
              <Label htmlFor="ogImage">OG Image URL</Label>
              <Input
                id="ogImage"
                value={settings.ogImage}
                onChange={(e) => handleChange('ogImage', e.target.value)}
                placeholder="https://yourwebsite.com/og-image.jpg"
                className="mt-2 bg-muted/50 border-border/50"
              />
              <p className="text-xs text-muted-foreground mt-1">Recommended: 1200x630 pixels</p>
            </div>
            <div>
              <Label htmlFor="twitterHandle">Twitter Handle</Label>
              <Input
                id="twitterHandle"
                value={settings.twitterHandle}
                onChange={(e) => handleChange('twitterHandle', e.target.value)}
                placeholder="@yourusername"
                className="mt-2 bg-muted/50 border-border/50"
              />
            </div>
          </div>
        </div>

        {/* Verification & Indexing Section */}
        <div className="glass-card rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-heading font-bold">Verification & Indexing</h3>
              <p className="text-sm text-muted-foreground">Search engine verification codes</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="googleVerification">Google Site Verification</Label>
              <Input
                id="googleVerification"
                value={settings.googleVerification}
                onChange={(e) => handleChange('googleVerification', e.target.value)}
                placeholder="Google verification code"
                className="mt-2 bg-muted/50 border-border/50"
              />
            </div>
            <div>
              <Label htmlFor="bingVerification">Bing Site Verification</Label>
              <Input
                id="bingVerification"
                value={settings.bingVerification}
                onChange={(e) => handleChange('bingVerification', e.target.value)}
                placeholder="Bing verification code"
                className="mt-2 bg-muted/50 border-border/50"
              />
            </div>
            <div>
              <Label htmlFor="robotsDirective">Robots Directive</Label>
              <Input
                id="robotsDirective"
                value={settings.robotsDirective}
                onChange={(e) => handleChange('robotsDirective', e.target.value)}
                placeholder="index, follow"
                className="mt-2 bg-muted/50 border-border/50"
              />
              <p className="text-xs text-muted-foreground mt-1">Controls how search engines crawl your site</p>
            </div>
          </div>
        </div>

        {/* SEO Tips Section */}
        <div className="glass-card rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-heading font-bold">SEO Tips</h3>
              <p className="text-sm text-muted-foreground">Best practices for better ranking</p>
            </div>
          </div>

          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
              <span>Use your name variations in keywords (Pruthvirajsinh, Pruthviraj, Pruthvi)</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
              <span>Include location-based keywords (Gujarat, India)</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
              <span>Keep meta description between 150-160 characters</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
              <span>Submit sitemap to Google Search Console</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
              <span>Create quality backlinks from social media profiles</span>
            </li>
          </ul>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button type="submit" variant="hero" size="lg" disabled={isSaving}>
            <Save className="w-4 h-4 mr-2" />
            {isSaving ? 'Saving...' : 'Save SEO Settings'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AdminSEO;
