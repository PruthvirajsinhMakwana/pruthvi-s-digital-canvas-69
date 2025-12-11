import { useState } from 'react';
import { useLinktree, LinktreeLink, LinktreeSettings } from '@/hooks/useLinktree';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { 
  Plus, Trash2, Edit, GripVertical, Eye, EyeOff, 
  ExternalLink, Settings, Link as LinkIcon, Palette
} from 'lucide-react';

const iconOptions = [
  { value: 'globe', label: 'Globe' },
  { value: 'linkedin', label: 'LinkedIn' },
  { value: 'github', label: 'GitHub' },
  { value: 'instagram', label: 'Instagram' },
  { value: 'message-circle', label: 'Message' },
  { value: 'mail', label: 'Email' },
  { value: 'phone', label: 'Phone' },
  { value: 'youtube', label: 'YouTube' },
  { value: 'twitter', label: 'Twitter' },
  { value: 'facebook', label: 'Facebook' },
  { value: 'external', label: 'External Link' },
  { value: 'link', label: 'Link' },
];

const colorPresets = [
  { value: '#873CFF', label: 'Purple' },
  { value: '#4A80FF', label: 'Blue' },
  { value: '#25D366', label: 'Green' },
  { value: '#E4405F', label: 'Pink' },
  { value: '#0A66C2', label: 'LinkedIn Blue' },
  { value: '#FF0000', label: 'Red' },
  { value: '#333333', label: 'Dark' },
  { value: '#FFFFFF', label: 'White' },
];

type ButtonShape = LinktreeLink['button_shape'];
type ButtonStyle = LinktreeLink['button_style'];

interface FormData {
  title: string;
  subtitle: string;
  url: string;
  icon: string;
  button_color: string;
  button_shape: ButtonShape;
  button_style: ButtonStyle;
  icon_color: string;
  animation_enabled: boolean;
  is_visible: boolean;
  sort_order: number;
}

const AdminLinks = () => {
  const { links, settings, addLink, updateLink, deleteLink, reorderLinks, updateSettings, isLoading } = useLinktree();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingLink, setEditingLink] = useState<LinktreeLink | null>(null);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const [formData, setFormData] = useState<FormData>({
    title: '',
    subtitle: '',
    url: '',
    icon: 'link',
    button_color: '#873CFF',
    button_shape: 'pill',
    button_style: 'solid',
    icon_color: '#FFFFFF',
    animation_enabled: true,
    is_visible: true,
    sort_order: 0,
  });

  const resetForm = () => {
    setFormData({
      title: '',
      subtitle: '',
      url: '',
      icon: 'link',
      button_color: '#873CFF',
      button_shape: 'pill',
      button_style: 'solid',
      icon_color: '#FFFFFF',
      animation_enabled: true,
      is_visible: true,
      sort_order: links.length,
    });
  };

  const handleAddLink = async () => {
    if (!formData.title || !formData.url) {
      toast.error('Title and URL are required');
      return;
    }

    const result = await addLink({
      ...formData,
      sort_order: links.length,
    });

    if (result) {
      toast.success('Link added successfully');
      setIsAddDialogOpen(false);
      resetForm();
    } else {
      toast.error('Failed to add link');
    }
  };

  const handleUpdateLink = async () => {
    if (!editingLink) return;

    const success = await updateLink(editingLink.id, formData);
    if (success) {
      toast.success('Link updated successfully');
      setEditingLink(null);
      resetForm();
    } else {
      toast.error('Failed to update link');
    }
  };

  const handleDeleteLink = async (id: string) => {
    if (!confirm('Are you sure you want to delete this link?')) return;

    const success = await deleteLink(id);
    if (success) {
      toast.success('Link deleted successfully');
    } else {
      toast.error('Failed to delete link');
    }
  };

  const handleToggleVisibility = async (link: LinktreeLink) => {
    await updateLink(link.id, { is_visible: !link.is_visible });
  };

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    const newLinks = [...links];
    const draggedLink = newLinks[draggedIndex];
    newLinks.splice(draggedIndex, 1);
    newLinks.splice(index, 0, draggedLink);

    setDraggedIndex(index);
  };

  const handleDragEnd = async () => {
    if (draggedIndex !== null) {
      await reorderLinks(links);
    }
    setDraggedIndex(null);
  };

  const openEditDialog = (link: LinktreeLink) => {
    setEditingLink(link);
    setFormData({
      title: link.title,
      subtitle: link.subtitle || '',
      url: link.url,
      icon: link.icon,
      button_color: link.button_color,
      button_shape: link.button_shape,
      button_style: link.button_style,
      icon_color: link.icon_color,
      animation_enabled: link.animation_enabled,
      is_visible: link.is_visible,
      sort_order: link.sort_order,
    });
  };

  const LinkForm = ({ isEdit = false }: { isEdit?: boolean }) => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Title *</Label>
          <Input
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="My Website"
          />
        </div>
        <div className="space-y-2">
          <Label>Subtitle</Label>
          <Input
            value={formData.subtitle}
            onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
            placeholder="Visit my portfolio"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>URL *</Label>
        <Input
          value={formData.url}
          onChange={(e) => setFormData({ ...formData, url: e.target.value })}
          placeholder="https://example.com"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Icon</Label>
          <Select value={formData.icon} onValueChange={(v) => setFormData({ ...formData, icon: v })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {iconOptions.map((icon) => (
                <SelectItem key={icon.value} value={icon.value}>
                  {icon.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Button Shape</Label>
          <Select 
            value={formData.button_shape} 
            onValueChange={(v) => setFormData({ ...formData, button_shape: v as ButtonShape })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pill">Pill</SelectItem>
              <SelectItem value="rounded">Rounded</SelectItem>
              <SelectItem value="square">Square</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Button Style</Label>
          <Select 
            value={formData.button_style} 
            onValueChange={(v) => setFormData({ ...formData, button_style: v as ButtonStyle })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="solid">Solid</SelectItem>
              <SelectItem value="outline">Outline</SelectItem>
              <SelectItem value="neon">Neon Glow</SelectItem>
              <SelectItem value="minimal">Minimal</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Button Color</Label>
          <div className="flex gap-2">
            <Input
              type="color"
              value={formData.button_color}
              onChange={(e) => setFormData({ ...formData, button_color: e.target.value })}
              className="w-12 h-10 p-1 cursor-pointer"
            />
            <Select value={formData.button_color} onValueChange={(v) => setFormData({ ...formData, button_color: v })}>
              <SelectTrigger className="flex-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {colorPresets.map((color) => (
                  <SelectItem key={color.value} value={color.value}>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded" style={{ backgroundColor: color.value }} />
                      {color.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label>Icon Color</Label>
        <Input
          type="color"
          value={formData.icon_color}
          onChange={(e) => setFormData({ ...formData, icon_color: e.target.value })}
          className="w-full h-10 p-1 cursor-pointer"
        />
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Switch
            checked={formData.animation_enabled}
            onCheckedChange={(v) => setFormData({ ...formData, animation_enabled: v })}
          />
          <Label>Enable Animation</Label>
        </div>
        <div className="flex items-center gap-2">
          <Switch
            checked={formData.is_visible}
            onCheckedChange={(v) => setFormData({ ...formData, is_visible: v })}
          />
          <Label>Visible</Label>
        </div>
      </div>

      <Button onClick={isEdit ? handleUpdateLink : handleAddLink} className="w-full">
        {isEdit ? 'Update Link' : 'Add Link'}
      </Button>
    </div>
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Links Manager</h1>
          <p className="text-muted-foreground">Manage your Linktree page links and settings</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <a href="/links" target="_blank" rel="noopener noreferrer">
              <ExternalLink className="w-4 h-4 mr-2" />
              Preview
            </a>
          </Button>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetForm}>
                <Plus className="w-4 h-4 mr-2" />
                Add Link
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Add New Link</DialogTitle>
              </DialogHeader>
              <LinkForm />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Tabs defaultValue="links" className="space-y-4">
        <TabsList>
          <TabsTrigger value="links" className="flex items-center gap-2">
            <LinkIcon className="w-4 h-4" />
            Links
          </TabsTrigger>
          <TabsTrigger value="design" className="flex items-center gap-2">
            <Palette className="w-4 h-4" />
            Design
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="w-4 h-4" />
            Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="links" className="space-y-4">
          {links.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <LinkIcon className="w-12 h-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No links yet. Add your first link!</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-2">
              {links.map((link, index) => (
                <Card
                  key={link.id}
                  draggable
                  onDragStart={() => handleDragStart(index)}
                  onDragOver={(e) => handleDragOver(e, index)}
                  onDragEnd={handleDragEnd}
                  className={`cursor-move transition-all ${draggedIndex === index ? 'opacity-50 scale-95' : ''}`}
                >
                  <CardContent className="flex items-center gap-4 py-4">
                    <GripVertical className="w-5 h-5 text-muted-foreground shrink-0" />
                    
                    <div 
                      className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                      style={{ backgroundColor: link.button_color }}
                    >
                      <LinkIcon className="w-5 h-5" style={{ color: link.icon_color }} />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="font-medium truncate">{link.title}</div>
                      <div className="text-sm text-muted-foreground truncate">{link.url}</div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleToggleVisibility(link)}
                      >
                        {link.is_visible ? (
                          <Eye className="w-4 h-4 text-green-500" />
                        ) : (
                          <EyeOff className="w-4 h-4 text-muted-foreground" />
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openEditDialog(link)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteLink(link.id)}
                      >
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="design" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Page Design</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Background Theme</Label>
                  <Select 
                    value={settings.background_theme} 
                    onValueChange={(v) => updateSettings({ background_theme: v as LinktreeSettings['background_theme'] })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="purple-neon">Purple Neon</SelectItem>
                      <SelectItem value="dark">Dark</SelectItem>
                      <SelectItem value="light">Light</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Glow Intensity</Label>
                  <Select 
                    value={settings.glow_intensity} 
                    onValueChange={(v) => updateSettings({ glow_intensity: v as LinktreeSettings['glow_intensity'] })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Font Family</Label>
                <Select 
                  value={settings.font_family} 
                  onValueChange={(v) => updateSettings({ font_family: v as LinktreeSettings['font_family'] })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="poppins">Poppins</SelectItem>
                    <SelectItem value="montserrat">Montserrat</SelectItem>
                    <SelectItem value="inter">Inter</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <Label>Enable 3D Elements</Label>
                <Switch
                  checked={settings.enable_3d_elements}
                  onCheckedChange={(v) => updateSettings({ enable_3d_elements: v })}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label>Enable Glassmorphism</Label>
                <Switch
                  checked={settings.enable_glassmorphism}
                  onCheckedChange={(v) => updateSettings({ enable_glassmorphism: v })}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Page Content</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Page Title</Label>
                <Input
                  value={settings.page_title}
                  onChange={(e) => updateSettings({ page_title: e.target.value })}
                  placeholder="Your Name"
                />
              </div>

              <div className="space-y-2">
                <Label>Page Subtitle</Label>
                <Input
                  value={settings.page_subtitle}
                  onChange={(e) => updateSettings({ page_subtitle: e.target.value })}
                  placeholder="Your titles or description"
                />
              </div>

              <div className="space-y-2">
                <Label>Profile Image URL</Label>
                <Input
                  value={settings.profile_image}
                  onChange={(e) => updateSettings({ profile_image: e.target.value })}
                  placeholder="/path/to/image.jpg"
                />
              </div>

              <div className="flex items-center justify-between">
                <Label>Show "Pruthvi Links" in Footer</Label>
                <Switch
                  checked={settings.footer_link_visible}
                  onCheckedChange={(v) => updateSettings({ footer_link_visible: v })}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Edit Dialog */}
      <Dialog open={!!editingLink} onOpenChange={(open) => !open && setEditingLink(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Link</DialogTitle>
          </DialogHeader>
          <LinkForm isEdit />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminLinks;
