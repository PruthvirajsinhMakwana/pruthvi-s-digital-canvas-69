import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Save, Plus, Trash2, GripVertical, Eye, EyeOff, ExternalLink, FolderOpen,
  Globe, Palette, Video, Megaphone, Layers, PenTool, 
  Mic, Trophy, Gamepad2, Radio, Users, Calendar,
  Code, Smartphone, Database, Cloud, Shield, Zap,
  Image, Film, Sparkles, PlayCircle, FileVideo, Clapperboard,
  MonitorPlay, Camera, Brush, Type, Layout, Building2, Upload, X
} from 'lucide-react';
import { useSiteSettings, CustomService, PortfolioCategory, CompanyLogo } from '@/hooks/useSiteSettings';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';

const iconOptions = [
  { value: 'globe', label: 'Globe', icon: Globe },
  { value: 'palette', label: 'Palette', icon: Palette },
  { value: 'video', label: 'Video', icon: Video },
  { value: 'megaphone', label: 'Marketing', icon: Megaphone },
  { value: 'layers', label: 'Layers', icon: Layers },
  { value: 'pen-tool', label: 'Design', icon: PenTool },
  { value: 'mic', label: 'Mic', icon: Mic },
  { value: 'trophy', label: 'Trophy', icon: Trophy },
  { value: 'gamepad', label: 'Gaming', icon: Gamepad2 },
  { value: 'radio', label: 'Broadcast', icon: Radio },
  { value: 'users', label: 'Users', icon: Users },
  { value: 'calendar', label: 'Calendar', icon: Calendar },
  { value: 'code', label: 'Code', icon: Code },
  { value: 'smartphone', label: 'Mobile', icon: Smartphone },
  { value: 'database', label: 'Database', icon: Database },
  { value: 'cloud', label: 'Cloud', icon: Cloud },
  { value: 'shield', label: 'Security', icon: Shield },
  { value: 'zap', label: 'Fast', icon: Zap },
];

const portfolioIconOptions = [
  { value: 'image', label: 'Poster/Image', icon: Image },
  { value: 'palette', label: 'Design', icon: Palette },
  { value: 'video', label: 'Video', icon: Video },
  { value: 'film', label: 'Film', icon: Film },
  { value: 'sparkles', label: 'Animated', icon: Sparkles },
  { value: 'play-circle', label: 'Play', icon: PlayCircle },
  { value: 'file-video', label: 'File Video', icon: FileVideo },
  { value: 'clapperboard', label: 'Editing', icon: Clapperboard },
  { value: 'monitor-play', label: 'Ads', icon: MonitorPlay },
  { value: 'camera', label: 'Photography', icon: Camera },
  { value: 'brush', label: 'Art', icon: Brush },
  { value: 'type', label: 'Typography', icon: Type },
  { value: 'layout', label: 'Layout', icon: Layout },
  { value: 'megaphone', label: 'Marketing', icon: Megaphone },
  { value: 'globe', label: 'Website', icon: Globe },
  { value: 'code', label: 'Code', icon: Code },
];

const gradientOptions = [
  { value: 'from-blue-500 to-cyan-500', label: 'Blue Cyan' },
  { value: 'from-green-500 to-emerald-500', label: 'Green Emerald' },
  { value: 'from-pink-500 to-rose-500', label: 'Pink Rose' },
  { value: 'from-red-500 to-orange-500', label: 'Red Orange' },
  { value: 'from-purple-500 to-violet-500', label: 'Purple Violet' },
  { value: 'from-orange-500 to-amber-500', label: 'Orange Amber' },
  { value: 'from-violet-500 to-purple-500', label: 'Violet Purple' },
  { value: 'from-cyan-500 to-blue-500', label: 'Cyan Blue' },
  { value: 'from-amber-500 to-yellow-500', label: 'Amber Yellow' },
  { value: 'from-emerald-500 to-green-500', label: 'Emerald Green' },
  { value: 'from-rose-500 to-pink-500', label: 'Rose Pink' },
  { value: 'from-indigo-500 to-blue-500', label: 'Indigo Blue' },
];

const AdminServices = () => {
  const { settings, isLoading, updateSettings } = useSiteSettings();
  const [services, setServices] = useState<CustomService[]>([]);
  const [portfolioCategories, setPortfolioCategories] = useState<PortfolioCategory[]>([]);
  const [companyLogos, setCompanyLogos] = useState<CompanyLogo[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingPortfolioId, setEditingPortfolioId] = useState<string | null>(null);
  const [uploadingLogoId, setUploadingLogoId] = useState<string | null>(null);

  useEffect(() => {
    if (settings.customServices) {
      setServices(settings.customServices);
    }
    if (settings.portfolioCategories) {
      setPortfolioCategories(settings.portfolioCategories);
    }
    if (settings.companyLogos) {
      setCompanyLogos(settings.companyLogos);
    }
  }, [settings.customServices, settings.portfolioCategories, settings.companyLogos]);

  const handleSave = async () => {
    setIsSaving(true);
    const success = await updateSettings({ 
      customServices: services,
      portfolioCategories: portfolioCategories,
      companyLogos: companyLogos
    });
    if (success) {
      toast.success('All changes saved successfully!');
    }
    setIsSaving(false);
  };

  // Service functions
  const addService = (category: 'it' | 'esports') => {
    const newService: CustomService = {
      id: Date.now().toString(),
      title: '',
      description: '',
      deliverables: ['', '', '', ''],
      linkUrl: '/links',
      category,
      icon: category === 'it' ? 'globe' : 'gamepad',
      gradient: category === 'it' ? 'from-blue-500 to-cyan-500' : 'from-violet-500 to-purple-500',
      isVisible: true,
      order: services.filter(s => s.category === category).length,
    };
    setServices([...services, newService]);
    setEditingId(newService.id);
  };

  const updateService = (id: string, field: keyof CustomService, value: any) => {
    setServices(services.map(s => 
      s.id === id ? { ...s, [field]: value } : s
    ));
  };

  const updateDeliverable = (id: string, index: number, value: string) => {
    setServices(services.map(s => {
      if (s.id === id) {
        const newDeliverables = [...s.deliverables];
        newDeliverables[index] = value;
        return { ...s, deliverables: newDeliverables };
      }
      return s;
    }));
  };

  const deleteService = (id: string) => {
    setServices(services.filter(s => s.id !== id));
  };

  const toggleServiceVisibility = (id: string) => {
    setServices(services.map(s => 
      s.id === id ? { ...s, isVisible: !s.isVisible } : s
    ));
  };

  // Portfolio Category functions
  const addPortfolioCategory = () => {
    const newCategory: PortfolioCategory = {
      id: Date.now().toString(),
      title: '',
      description: '',
      driveLink: '',
      icon: 'image',
      gradient: 'from-pink-500 to-rose-500',
      isVisible: true,
      order: portfolioCategories.length,
    };
    setPortfolioCategories([...portfolioCategories, newCategory]);
    setEditingPortfolioId(newCategory.id);
  };

  const updatePortfolioCategory = (id: string, field: keyof PortfolioCategory, value: any) => {
    setPortfolioCategories(portfolioCategories.map(p => 
      p.id === id ? { ...p, [field]: value } : p
    ));
  };

  const deletePortfolioCategory = (id: string) => {
    setPortfolioCategories(portfolioCategories.filter(p => p.id !== id));
  };

  const togglePortfolioVisibility = (id: string) => {
    setPortfolioCategories(portfolioCategories.map(p => 
      p.id === id ? { ...p, isVisible: !p.isVisible } : p
    ));
  };

  // Company Logo functions
  const addCompanyLogo = () => {
    const newLogo: CompanyLogo = {
      id: Date.now().toString(),
      name: '',
      imageUrl: '',
      websiteUrl: '',
      isVisible: true,
      order: companyLogos.length,
    };
    setCompanyLogos([...companyLogos, newLogo]);
  };

  const updateCompanyLogo = (id: string, field: keyof CompanyLogo, value: any) => {
    setCompanyLogos(companyLogos.map(l => 
      l.id === id ? { ...l, [field]: value } : l
    ));
  };

  const deleteCompanyLogo = async (id: string) => {
    const logo = companyLogos.find(l => l.id === id);
    // Try to delete from storage if it's a supabase URL
    if (logo?.imageUrl?.includes('supabase')) {
      try {
        const urlParts = logo.imageUrl.split('/');
        const fileName = urlParts[urlParts.length - 1];
        await supabase.storage.from('logos').remove([fileName]);
      } catch (error) {
        console.error('Error deleting image:', error);
      }
    }
    setCompanyLogos(companyLogos.filter(l => l.id !== id));
  };

  const toggleLogoVisibility = (id: string) => {
    setCompanyLogos(companyLogos.map(l => 
      l.id === id ? { ...l, isVisible: !l.isVisible } : l
    ));
  };

  const handleLogoUpload = async (id: string, file: File) => {
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      toast.error('Image must be less than 2MB');
      return;
    }

    setUploadingLogoId(id);
    try {
      const fileName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '')}`;
      const { data, error } = await supabase.storage
        .from('logos')
        .upload(fileName, file, { upsert: true });

      if (error) throw error;

      const { data: urlData } = supabase.storage.from('logos').getPublicUrl(data.path);
      updateCompanyLogo(id, 'imageUrl', urlData.publicUrl);
      toast.success('Logo uploaded!');
    } catch (error: any) {
      console.error('Upload error:', error);
      toast.error(error.message || 'Failed to upload logo');
    } finally {
      setUploadingLogoId(null);
    }
  };

  const itServices = services.filter(s => s.category === 'it');
  const esportsServices = services.filter(s => s.category === 'esports');

  const getPortfolioIcon = (iconName: string) => {
    return portfolioIconOptions.find(i => i.value === iconName)?.icon || Image;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  const renderServiceCard = (service: CustomService) => {
    const isEditing = editingId === service.id;
    const IconComponent = iconOptions.find(i => i.value === service.icon)?.icon || Globe;

    return (
      <div 
        key={service.id} 
        className={`glass-card rounded-xl p-4 transition-all ${!service.isVisible ? 'opacity-50' : ''}`}
      >
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${service.gradient} flex items-center justify-center`}>
              <IconComponent className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              {isEditing ? (
                <Input
                  value={service.title}
                  onChange={(e) => updateService(service.id, 'title', e.target.value)}
                  placeholder="Service Title"
                  className="h-8 text-sm font-semibold"
                />
              ) : (
                <h4 className="font-semibold text-sm truncate">{service.title || 'Untitled Service'}</h4>
              )}
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => toggleServiceVisibility(service.id)}
            >
              {service.isVisible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => setEditingId(isEditing ? null : service.id)}
            >
              <GripVertical className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-destructive"
              onClick={() => deleteService(service.id)}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {isEditing && (
          <div className="space-y-4 pt-2 border-t border-border/50">
            <div>
              <Label className="text-xs">Description</Label>
              <Textarea
                value={service.description}
                onChange={(e) => updateService(service.id, 'description', e.target.value)}
                placeholder="Brief description of the service"
                rows={2}
                className="mt-1 text-sm"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs">Icon</Label>
                <Select
                  value={service.icon}
                  onValueChange={(v) => updateService(service.id, 'icon', v)}
                >
                  <SelectTrigger className="mt-1 h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {iconOptions.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        <div className="flex items-center gap-2">
                          <opt.icon className="w-4 h-4" />
                          <span>{opt.label}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs">Color Gradient</Label>
                <Select
                  value={service.gradient}
                  onValueChange={(v) => updateService(service.id, 'gradient', v)}
                >
                  <SelectTrigger className="mt-1 h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {gradientOptions.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        <div className="flex items-center gap-2">
                          <div className={`w-4 h-4 rounded bg-gradient-to-r ${opt.value}`} />
                          <span>{opt.label}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label className="text-xs">Arrow Link URL</Label>
              <Input
                value={service.linkUrl}
                onChange={(e) => updateService(service.id, 'linkUrl', e.target.value)}
                placeholder="/links or https://..."
                className="mt-1 h-9 text-sm"
              />
            </div>

            <div>
              <Label className="text-xs">Deliverables (4 items)</Label>
              <div className="grid grid-cols-2 gap-2 mt-1">
                {service.deliverables.map((d, i) => (
                  <Input
                    key={i}
                    value={d}
                    onChange={(e) => updateDeliverable(service.id, i, e.target.value)}
                    placeholder={`Deliverable ${i + 1}`}
                    className="h-8 text-xs"
                  />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderPortfolioCard = (category: PortfolioCategory) => {
    const isEditing = editingPortfolioId === category.id;
    const IconComponent = getPortfolioIcon(category.icon);

    return (
      <div 
        key={category.id} 
        className={`glass-card rounded-xl p-4 transition-all ${!category.isVisible ? 'opacity-50' : ''}`}
      >
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${category.gradient} flex items-center justify-center`}>
              <IconComponent className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              {isEditing ? (
                <Input
                  value={category.title}
                  onChange={(e) => updatePortfolioCategory(category.id, 'title', e.target.value)}
                  placeholder="Category Title (e.g., Posters)"
                  className="h-8 text-sm font-semibold"
                />
              ) : (
                <h4 className="font-semibold text-sm truncate">{category.title || 'Untitled Category'}</h4>
              )}
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => togglePortfolioVisibility(category.id)}
            >
              {category.isVisible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => setEditingPortfolioId(isEditing ? null : category.id)}
            >
              <GripVertical className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-destructive"
              onClick={() => deletePortfolioCategory(category.id)}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {isEditing && (
          <div className="space-y-4 pt-2 border-t border-border/50">
            <div>
              <Label className="text-xs">Description</Label>
              <Textarea
                value={category.description}
                onChange={(e) => updatePortfolioCategory(category.id, 'description', e.target.value)}
                placeholder="Brief description (e.g., Social media posters and banners)"
                rows={2}
                className="mt-1 text-sm"
              />
            </div>

            <div>
              <Label className="text-xs flex items-center gap-2">
                <FolderOpen className="w-3.5 h-3.5" />
                Google Drive / Folder Link
              </Label>
              <Input
                value={category.driveLink}
                onChange={(e) => updatePortfolioCategory(category.id, 'driveLink', e.target.value)}
                placeholder="https://drive.google.com/drive/folders/..."
                className="mt-1 h-9 text-sm"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Paste your Google Drive folder link or any portfolio URL
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs">Icon</Label>
                <Select
                  value={category.icon}
                  onValueChange={(v) => updatePortfolioCategory(category.id, 'icon', v)}
                >
                  <SelectTrigger className="mt-1 h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {portfolioIconOptions.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        <div className="flex items-center gap-2">
                          <opt.icon className="w-4 h-4" />
                          <span>{opt.label}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs">Color</Label>
                <Select
                  value={category.gradient}
                  onValueChange={(v) => updatePortfolioCategory(category.id, 'gradient', v)}
                >
                  <SelectTrigger className="mt-1 h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {gradientOptions.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        <div className="flex items-center gap-2">
                          <div className={`w-4 h-4 rounded bg-gradient-to-r ${opt.value}`} />
                          <span>{opt.label}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderLogoCard = (logo: CompanyLogo) => {
    const isUploading = uploadingLogoId === logo.id;

    return (
      <div 
        key={logo.id} 
        className={`glass-card rounded-xl p-4 transition-all ${!logo.isVisible ? 'opacity-50' : ''}`}
      >
        <div className="flex items-center gap-4">
          {/* Logo Image */}
          <div className="relative w-20 h-14 bg-muted rounded-lg overflow-hidden flex items-center justify-center flex-shrink-0">
            {logo.imageUrl ? (
              <img 
                src={logo.imageUrl} 
                alt={logo.name} 
                className="w-full h-full object-contain p-1"
              />
            ) : (
              <Building2 className="w-8 h-8 text-muted-foreground/40" />
            )}
            {isUploading && (
              <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
              </div>
            )}
          </div>

          {/* Logo Details */}
          <div className="flex-1 min-w-0 space-y-2">
            <Input
              value={logo.name}
              onChange={(e) => updateCompanyLogo(logo.id, 'name', e.target.value)}
              placeholder="Company Name"
              className="h-8 text-sm font-medium"
            />
            <div className="flex gap-2">
              <Input
                value={logo.websiteUrl || ''}
                onChange={(e) => updateCompanyLogo(logo.id, 'websiteUrl', e.target.value)}
                placeholder="Website URL (optional)"
                className="h-7 text-xs flex-1"
              />
              <label className="cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleLogoUpload(logo.id, file);
                  }}
                />
                <Button variant="outline" size="sm" className="h-7 text-xs" asChild>
                  <span>
                    <Upload className="w-3 h-3 mr-1" />
                    Upload
                  </span>
                </Button>
              </label>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1 flex-shrink-0">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => toggleLogoVisibility(logo.id)}
            >
              {logo.isVisible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-destructive"
              onClick={() => deleteCompanyLogo(logo.id)}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-heading text-2xl font-bold">Services & Portfolio</h2>
          <p className="text-muted-foreground">Manage your services, portfolio, and company logos</p>
        </div>
        <Button onClick={handleSave} variant="hero" disabled={isSaving}>
          <Save className="w-4 h-4 mr-2" />
          {isSaving ? 'Saving...' : 'Save All'}
        </Button>
      </div>

      <Tabs defaultValue="portfolio" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="portfolio" className="flex items-center gap-2">
            <FolderOpen className="w-4 h-4" />
            My Work
          </TabsTrigger>
          <TabsTrigger value="logos" className="flex items-center gap-2">
            <Building2 className="w-4 h-4" />
            Company Logos
          </TabsTrigger>
          <TabsTrigger value="services" className="flex items-center gap-2">
            <Layers className="w-4 h-4" />
            Services
          </TabsTrigger>
        </TabsList>

        {/* Portfolio Categories Tab */}
        <TabsContent value="portfolio" className="space-y-6">
          <div className="glass-card rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center">
                  <FolderOpen className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-heading font-bold">Work Categories</h3>
                  <p className="text-sm text-muted-foreground">
                    Add categories like Posters, Ads, Videos with Drive links
                  </p>
                </div>
              </div>
              <Button variant="outline" size="sm" onClick={addPortfolioCategory}>
                <Plus className="w-4 h-4 mr-1" />
                Add Category
              </Button>
            </div>

            <div className="grid gap-4">
              {portfolioCategories.length === 0 ? (
                <div className="text-center py-12 border border-dashed border-border/50 rounded-xl">
                  <FolderOpen className="w-12 h-12 mx-auto mb-4 text-muted-foreground/50" />
                  <h4 className="font-medium mb-2">No work categories added yet</h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    Add categories to showcase your work (Posters, Ads, Videos, etc.)
                  </p>
                  <Button variant="outline" size="sm" onClick={addPortfolioCategory}>
                    <Plus className="w-4 h-4 mr-1" />
                    Add Your First Category
                  </Button>
                </div>
              ) : (
                portfolioCategories.map(renderPortfolioCard)
              )}
            </div>
          </div>

          <div className="glass-card rounded-xl p-4 bg-primary/5 border-primary/20">
            <div className="flex items-start gap-3">
              <ExternalLink className="w-5 h-5 text-primary mt-0.5" />
              <div>
                <h4 className="font-medium text-sm mb-1">How it works</h4>
                <p className="text-xs text-muted-foreground">
                  Add work categories with Google Drive folder links or any portfolio URL. 
                  Visitors can click on each category to view your work samples directly.
                </p>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Company Logos Tab */}
        <TabsContent value="logos" className="space-y-6">
          <div className="glass-card rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-heading font-bold">Companies & Clients</h3>
                  <p className="text-sm text-muted-foreground">
                    Show logos of companies you've worked with
                  </p>
                </div>
              </div>
              <Button variant="outline" size="sm" onClick={addCompanyLogo}>
                <Plus className="w-4 h-4 mr-1" />
                Add Logo
              </Button>
            </div>

            <div className="grid gap-4">
              {companyLogos.length === 0 ? (
                <div className="text-center py-12 border border-dashed border-border/50 rounded-xl">
                  <Building2 className="w-12 h-12 mx-auto mb-4 text-muted-foreground/50" />
                  <h4 className="font-medium mb-2">No company logos added yet</h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    Add logos of companies and clients you've worked with
                  </p>
                  <Button variant="outline" size="sm" onClick={addCompanyLogo}>
                    <Plus className="w-4 h-4 mr-1" />
                    Add Your First Logo
                  </Button>
                </div>
              ) : (
                companyLogos.map(renderLogoCard)
              )}
            </div>
          </div>

          <div className="glass-card rounded-xl p-4 bg-secondary/5 border-secondary/20">
            <div className="flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-secondary mt-0.5" />
              <div>
                <h4 className="font-medium text-sm mb-1">Scrolling Logo Bar</h4>
                <p className="text-xs text-muted-foreground">
                  Logos will appear in a smooth scrolling marquee on the Services page, 
                  showing "Trusted by Companies & Creators". Transparent PNG logos work best!
                </p>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Custom Services Tab */}
        <TabsContent value="services" className="space-y-6">
          {/* IT Services */}
          <div className="glass-card rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                  <Globe className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-heading font-bold">IT & Digital Services</h3>
                  <p className="text-sm text-muted-foreground">{itServices.length} custom services</p>
                </div>
              </div>
              <Button variant="outline" size="sm" onClick={() => addService('it')}>
                <Plus className="w-4 h-4 mr-1" />
                Add Service
              </Button>
            </div>

            <div className="grid gap-4">
              {itServices.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">
                  No custom IT services added yet. Click "Add Service" to create one.
                </p>
              ) : (
                itServices.map(renderServiceCard)
              )}
            </div>
          </div>

          {/* Esports Services */}
          <div className="glass-card rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center">
                  <Gamepad2 className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-heading font-bold">Esports & Gaming Services</h3>
                  <p className="text-sm text-muted-foreground">{esportsServices.length} custom services</p>
                </div>
              </div>
              <Button variant="outline" size="sm" onClick={() => addService('esports')}>
                <Plus className="w-4 h-4 mr-1" />
                Add Service
              </Button>
            </div>

            <div className="grid gap-4">
              {esportsServices.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">
                  No custom esports services added yet. Click "Add Service" to create one.
                </p>
              ) : (
                esportsServices.map(renderServiceCard)
              )}
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <p className="text-xs text-muted-foreground text-center">
        💡 Tip: Upload transparent PNG logos for best results. Changes are saved when you click "Save All".
      </p>
    </div>
  );
};

export default AdminServices;