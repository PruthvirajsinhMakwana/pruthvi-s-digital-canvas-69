import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Save, BarChart3, User, Link2, MousePointer, Tags, Plus, X, Briefcase, Trash2, Palette, Github, Dribbble, Globe, FileImage, Code, Youtube, Instagram, Linkedin, Twitter, ExternalLink, ArrowRight } from 'lucide-react';
import { useSiteSettings, PortfolioLink, ServiceLink } from '@/hooks/useSiteSettings';

// Service names for arrow button links
const serviceNames = [
  'Web Development',
  'Digital Marketing', 
  'Graphic Design',
  'Video Editing',
  'UI/UX Design',
  'IT Support',
  'Esports Commentary',
  'Event Hosting',
  'Tournament Organization',
  'Gaming Content',
  'Team Management',
  'Community Events',
];

// Icon options for portfolio links
const portfolioIconOptions = [
  { value: 'briefcase', label: 'Briefcase', icon: Briefcase },
  { value: 'palette', label: 'Behance/Design', icon: Palette },
  { value: 'dribbble', label: 'Dribbble', icon: Dribbble },
  { value: 'github', label: 'GitHub', icon: Github },
  { value: 'globe', label: 'Website', icon: Globe },
  { value: 'file-image', label: 'Portfolio', icon: FileImage },
  { value: 'code', label: 'Code', icon: Code },
  { value: 'youtube', label: 'YouTube', icon: Youtube },
  { value: 'instagram', label: 'Instagram', icon: Instagram },
  { value: 'linkedin', label: 'LinkedIn', icon: Linkedin },
  { value: 'twitter', label: 'Twitter', icon: Twitter },
  { value: 'external-link', label: 'External Link', icon: ExternalLink },
];

const AdminSiteContent = () => {
  const { settings, isLoading, updateSettings } = useSiteSettings();
  const [formData, setFormData] = useState(settings);
  const [isSaving, setIsSaving] = useState(false);
  const [newTag, setNewTag] = useState('');

  useEffect(() => {
    setFormData(settings);
  }, [settings]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    await updateSettings(formData);
    setIsSaving(false);
  };

  const handleChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const addTag = () => {
    if (newTag.trim() && !formData.skillTags.includes(newTag.trim())) {
      setFormData({ ...formData, skillTags: [...formData.skillTags, newTag.trim()] });
      setNewTag('');
    }
  };

  const removeTag = (tag: string) => {
    setFormData({ ...formData, skillTags: formData.skillTags.filter(t => t !== tag) });
  };

  const addPortfolioLink = () => {
    const newLink: PortfolioLink = {
      id: Date.now().toString(),
      title: '',
      url: '',
      icon: 'link',
    };
    setFormData({ 
      ...formData, 
      portfolioLinks: [...(formData.portfolioLinks || []), newLink] 
    });
  };

  const updatePortfolioLink = (id: string, field: keyof PortfolioLink, value: string) => {
    setFormData({
      ...formData,
      portfolioLinks: (formData.portfolioLinks || []).map(link =>
        link.id === id ? { ...link, [field]: value } : link
      ),
    });
  };

  const removePortfolioLink = (id: string) => {
    setFormData({
      ...formData,
      portfolioLinks: (formData.portfolioLinks || []).filter(link => link.id !== id),
    });
  };

  const updateServiceLink = (serviceName: string, url: string) => {
    const currentLinks = formData.serviceLinks || [];
    const existingIndex = currentLinks.findIndex(l => l.serviceName === serviceName);
    
    if (existingIndex >= 0) {
      const updatedLinks = [...currentLinks];
      updatedLinks[existingIndex] = { serviceName, url };
      setFormData({ ...formData, serviceLinks: updatedLinks });
    } else {
      setFormData({ 
        ...formData, 
        serviceLinks: [...currentLinks, { serviceName, url }] 
      });
    }
  };

  const getServiceLinkUrl = (serviceName: string): string => {
    const link = (formData.serviceLinks || []).find(l => l.serviceName === serviceName);
    return link?.url || '/links';
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
        <h2 className="font-heading text-2xl font-bold">Site Content</h2>
        <p className="text-muted-foreground">Manage your website content, links, and statistics</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Statistics Section */}
        <div className="glass-card rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-heading font-bold">Statistics</h3>
              <p className="text-sm text-muted-foreground">Numbers displayed on your homepage</p>
            </div>
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="projectsDone">Projects Done</Label>
              <Input
                id="projectsDone"
                value={formData.projectsDone}
                onChange={(e) => handleChange('projectsDone', e.target.value)}
                placeholder="50+"
                className="mt-2 bg-muted/50 border-border/50"
              />
            </div>
            <div>
              <Label htmlFor="toolsMastered">Tools Mastered</Label>
              <Input
                id="toolsMastered"
                value={formData.toolsMastered}
                onChange={(e) => handleChange('toolsMastered', e.target.value)}
                placeholder="15+"
                className="mt-2 bg-muted/50 border-border/50"
              />
            </div>
            <div>
              <Label htmlFor="yearsLearning">Years Learning</Label>
              <Input
                id="yearsLearning"
                value={formData.yearsLearning}
                onChange={(e) => handleChange('yearsLearning', e.target.value)}
                placeholder="3+"
                className="mt-2 bg-muted/50 border-border/50"
              />
            </div>
          </div>
        </div>

        {/* Personal Info Section */}
        <div className="glass-card rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-heading font-bold">Personal Info</h3>
              <p className="text-sm text-muted-foreground">Your name, title, and bio</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  className="mt-2 bg-muted/50 border-border/50"
                />
              </div>
              <div>
                <Label htmlFor="availabilityStatus">Availability Status</Label>
                <Input
                  id="availabilityStatus"
                  value={formData.availabilityStatus}
                  onChange={(e) => handleChange('availabilityStatus', e.target.value)}
                  placeholder="Available for freelance work"
                  className="mt-2 bg-muted/50 border-border/50"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="title">Title/Tagline</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleChange('title', e.target.value)}
                placeholder="IT Professional | Web Developer | Creative Designer"
                className="mt-2 bg-muted/50 border-border/50"
              />
            </div>
            <div>
              <Label htmlFor="description">Bio/Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                rows={3}
                className="mt-2 bg-muted/50 border-border/50"
              />
            </div>
          </div>
        </div>

        {/* Social Links Section */}
        <div className="glass-card rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
              <Link2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-heading font-bold">Social Links</h3>
              <p className="text-sm text-muted-foreground">Your contact and social media links</p>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                placeholder="contact@example.com"
                className="mt-2 bg-muted/50 border-border/50"
              />
            </div>
            <div>
              <Label htmlFor="whatsappNumber">WhatsApp Number</Label>
              <Input
                id="whatsappNumber"
                value={formData.whatsappNumber}
                onChange={(e) => handleChange('whatsappNumber', e.target.value)}
                placeholder="+919876543210"
                className="mt-2 bg-muted/50 border-border/50"
              />
            </div>
            <div>
              <Label htmlFor="linkedinUrl">LinkedIn URL</Label>
              <Input
                id="linkedinUrl"
                value={formData.linkedinUrl}
                onChange={(e) => handleChange('linkedinUrl', e.target.value)}
                placeholder="https://linkedin.com/in/username"
                className="mt-2 bg-muted/50 border-border/50"
              />
            </div>
            <div>
              <Label htmlFor="githubUrl">GitHub URL</Label>
              <Input
                id="githubUrl"
                value={formData.githubUrl}
                onChange={(e) => handleChange('githubUrl', e.target.value)}
                placeholder="https://github.com/username"
                className="mt-2 bg-muted/50 border-border/50"
              />
            </div>
            <div>
              <Label htmlFor="twitterUrl">Twitter URL</Label>
              <Input
                id="twitterUrl"
                value={formData.twitterUrl}
                onChange={(e) => handleChange('twitterUrl', e.target.value)}
                placeholder="https://twitter.com/username"
                className="mt-2 bg-muted/50 border-border/50"
              />
            </div>
            <div>
              <Label htmlFor="instagramUrl">Instagram URL</Label>
              <Input
                id="instagramUrl"
                value={formData.instagramUrl}
                onChange={(e) => handleChange('instagramUrl', e.target.value)}
                placeholder="https://instagram.com/username"
                className="mt-2 bg-muted/50 border-border/50"
              />
            </div>
          </div>
        </div>

        {/* CTA Buttons Section */}
        <div className="glass-card rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
              <MousePointer className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-heading font-bold">CTA Buttons</h3>
              <p className="text-sm text-muted-foreground">Call-to-action button text and links</p>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="hireMeText">Primary Button Text</Label>
              <Input
                id="hireMeText"
                value={formData.hireMeText}
                onChange={(e) => handleChange('hireMeText', e.target.value)}
                placeholder="Hire Me"
                className="mt-2 bg-muted/50 border-border/50"
              />
            </div>
            <div>
              <Label htmlFor="hireMeLink">Primary Button Link</Label>
              <Input
                id="hireMeLink"
                value={formData.hireMeLink}
                onChange={(e) => handleChange('hireMeLink', e.target.value)}
                placeholder="/contact"
                className="mt-2 bg-muted/50 border-border/50"
              />
            </div>
            <div>
              <Label htmlFor="servicesText">Secondary Button Text</Label>
              <Input
                id="servicesText"
                value={formData.servicesText}
                onChange={(e) => handleChange('servicesText', e.target.value)}
                placeholder="View Services"
                className="mt-2 bg-muted/50 border-border/50"
              />
            </div>
            <div>
              <Label htmlFor="servicesLink">Secondary Button Link</Label>
              <Input
                id="servicesLink"
                value={formData.servicesLink}
                onChange={(e) => handleChange('servicesLink', e.target.value)}
                placeholder="/services"
                className="mt-2 bg-muted/50 border-border/50"
              />
            </div>
            <div className="sm:col-span-2">
              <Label htmlFor="resumeLink">Resume/CV Download Link</Label>
              <Input
                id="resumeLink"
                value={formData.resumeLink}
                onChange={(e) => handleChange('resumeLink', e.target.value)}
                placeholder="https://drive.google.com/file/d/..."
                className="mt-2 bg-muted/50 border-border/50"
              />
              <p className="text-xs text-muted-foreground mt-1">Google Drive or any direct link to your resume</p>
            </div>
          </div>
        </div>

        {/* Portfolio Links Section */}
        <div className="glass-card rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
                <Briefcase className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-heading font-bold">Portfolio Links</h3>
                <p className="text-sm text-muted-foreground">Links to showcase your work (Behance, Dribbble, GitHub, etc.)</p>
              </div>
            </div>
            <Button type="button" variant="outline" size="sm" onClick={addPortfolioLink}>
              <Plus className="w-4 h-4 mr-1" />
              Add Link
            </Button>
          </div>

          <div className="space-y-4">
            {(formData.portfolioLinks || []).length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                No portfolio links added yet. Click "Add Link" to add one.
              </p>
            ) : (
              (formData.portfolioLinks || []).map((link) => {
                const IconComponent = portfolioIconOptions.find(opt => opt.value === link.icon)?.icon || Briefcase;
                return (
                  <div key={link.id} className="flex items-start gap-3 p-4 bg-muted/30 rounded-xl">
                    <div className="flex-1 grid sm:grid-cols-3 gap-3">
                      <div>
                        <Label className="text-xs">Icon</Label>
                        <Select
                          value={link.icon || 'briefcase'}
                          onValueChange={(value) => updatePortfolioLink(link.id, 'icon', value)}
                        >
                          <SelectTrigger className="mt-1 bg-background border-border/50 h-9">
                            <SelectValue>
                              <div className="flex items-center gap-2">
                                <IconComponent className="w-4 h-4" />
                                <span className="text-xs">{portfolioIconOptions.find(opt => opt.value === link.icon)?.label || 'Briefcase'}</span>
                              </div>
                            </SelectValue>
                          </SelectTrigger>
                          <SelectContent>
                            {portfolioIconOptions.map((option) => (
                              <SelectItem key={option.value} value={option.value}>
                                <div className="flex items-center gap-2">
                                  <option.icon className="w-4 h-4" />
                                  <span>{option.label}</span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label className="text-xs">Button Text</Label>
                        <Input
                          value={link.title}
                          onChange={(e) => updatePortfolioLink(link.id, 'title', e.target.value)}
                          placeholder="e.g., Behance, Dribbble"
                          className="mt-1 bg-background border-border/50 h-9"
                        />
                      </div>
                      <div>
                        <Label className="text-xs">URL</Label>
                        <Input
                          value={link.url}
                          onChange={(e) => updatePortfolioLink(link.id, 'url', e.target.value)}
                          placeholder="https://behance.net/username"
                          className="mt-1 bg-background border-border/50 h-9"
                        />
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="text-muted-foreground hover:text-destructive mt-5"
                      onClick={() => removePortfolioLink(link.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Service Arrow Links Section */}
        <div className="glass-card rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center">
              <ArrowRight className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-heading font-bold">Service Arrow Links</h3>
              <p className="text-sm text-muted-foreground">Where the arrow button on each service card redirects to</p>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            {serviceNames.map((serviceName) => (
              <div key={serviceName} className="flex items-center gap-3 p-3 bg-muted/30 rounded-xl">
                <div className="flex-1">
                  <Label className="text-xs text-muted-foreground">{serviceName}</Label>
                  <Input
                    value={getServiceLinkUrl(serviceName)}
                    onChange={(e) => updateServiceLink(serviceName, e.target.value)}
                    placeholder="/links or https://..."
                    className="mt-1 bg-background border-border/50 h-9 text-sm"
                  />
                </div>
              </div>
            ))}
          </div>
          
          <p className="text-xs text-muted-foreground mt-4">
            💡 Tip: Use "/links" for your linktree page, or add external URLs like "https://behance.net/yourname"
          </p>
        </div>

        {/* Skill Tags Section */}
        <div className="glass-card rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center">
              <Tags className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-heading font-bold">Skill Tags</h3>
              <p className="text-sm text-muted-foreground">Tags displayed on your homepage</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mb-4">
            {formData.skillTags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  className="ml-1 hover:text-destructive"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>

          <div className="flex gap-2">
            <Input
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              placeholder="Add a new tag"
              className="bg-muted/50 border-border/50"
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
            />
            <Button type="button" variant="outline" onClick={addTag}>
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button type="submit" variant="hero" size="lg" disabled={isSaving}>
            <Save className="w-4 h-4 mr-2" />
            {isSaving ? 'Saving...' : 'Save All Changes'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AdminSiteContent;
