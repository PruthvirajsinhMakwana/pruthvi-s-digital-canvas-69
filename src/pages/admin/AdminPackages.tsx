import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Plus, Pencil, Trash2, Package as PackageIcon, Star } from 'lucide-react';
import { toast } from 'sonner';

interface Pkg {
  id: string;
  name: string;
  tagline: string;
  price: string;
  price_note: string;
  icon: string;
  gradient: string;
  features: string[];
  services: string[];
  popular: boolean;
  sort_order: number;
  is_active: boolean;
}

const empty: Omit<Pkg, 'id'> = {
  name: '',
  tagline: '',
  price: '',
  price_note: 'starting',
  icon: 'Sparkles',
  gradient: 'from-primary to-secondary',
  features: [],
  services: [],
  popular: false,
  sort_order: 0,
  is_active: true,
};

const ICONS = ['Zap', 'Sparkles', 'Crown', 'Star', 'Rocket', 'Award', 'Gem', 'Trophy'];
const GRADIENTS = [
  'from-blue-500 to-cyan-500',
  'from-primary to-secondary',
  'from-amber-500 to-orange-500',
  'from-purple-500 to-pink-500',
  'from-emerald-500 to-teal-500',
  'from-rose-500 to-red-500',
];

const AdminPackages = () => {
  const [items, setItems] = useState<Pkg[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Pkg | null>(null);
  const [form, setForm] = useState<Omit<Pkg, 'id'>>(empty);
  const [featuresText, setFeaturesText] = useState('');
  const [servicesText, setServicesText] = useState('');

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('packages' as any)
      .select('*')
      .order('sort_order', { ascending: true });
    if (error) toast.error(error.message);
    else setItems((data || []) as any);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const openNew = () => {
    setEditing(null);
    setForm({ ...empty, sort_order: items.length + 1 });
    setFeaturesText('');
    setServicesText('');
    setOpen(true);
  };

  const openEdit = (p: Pkg) => {
    setEditing(p);
    setForm({ ...p });
    setFeaturesText(p.features.join('\n'));
    setServicesText(p.services.join(', '));
    setOpen(true);
  };

  const save = async () => {
    if (!form.name.trim() || !form.price.trim()) {
      toast.error('Name and price are required');
      return;
    }
    const payload = {
      ...form,
      features: featuresText.split('\n').map((s) => s.trim()).filter(Boolean),
      services: servicesText.split(',').map((s) => s.trim()).filter(Boolean),
    };

    const { error } = editing
      ? await supabase.from('packages' as any).update(payload).eq('id', editing.id)
      : await supabase.from('packages' as any).insert(payload);

    if (error) toast.error(error.message);
    else {
      toast.success(editing ? 'Package updated' : 'Package created');
      setOpen(false);
      load();
    }
  };

  const remove = async (id: string) => {
    if (!confirm('Delete this package?')) return;
    const { error } = await supabase.from('packages' as any).delete().eq('id', id);
    if (error) toast.error(error.message);
    else { toast.success('Deleted'); load(); }
  };

  const toggleActive = async (p: Pkg) => {
    const { error } = await supabase
      .from('packages' as any)
      .update({ is_active: !p.is_active })
      .eq('id', p.id);
    if (error) toast.error(error.message);
    else load();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h2 className="font-heading text-2xl font-bold">Packages / Plans</h2>
          <p className="text-muted-foreground text-sm">Manage pricing plans shown on the Services page.</p>
        </div>
        <Button onClick={openNew}><Plus className="w-4 h-4 mr-2" />New Package</Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
        </div>
      ) : items.length === 0 ? (
        <div className="glass-card rounded-2xl p-12 text-center">
          <PackageIcon className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">No packages yet. Create your first one.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
          {items.map((p) => (
            <div key={p.id} className="glass-card rounded-2xl p-5 space-y-3 relative">
              {p.popular && (
                <div className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full flex items-center gap-1">
                  <Star className="w-3 h-3" /> Popular
                </div>
              )}
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-heading font-bold text-lg">{p.name}</h3>
                  <p className="text-xs text-muted-foreground">{p.tagline}</p>
                </div>
                <span className="text-xl font-bold text-primary">{p.price}</span>
              </div>
              <div className="text-xs text-muted-foreground">
                {p.features.length} features · {p.services.length} services · order #{p.sort_order}
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-border">
                <div className="flex items-center gap-2">
                  <Switch checked={p.is_active} onCheckedChange={() => toggleActive(p)} />
                  <span className="text-xs">{p.is_active ? 'Active' : 'Hidden'}</span>
                </div>
                <div className="flex gap-1">
                  <Button size="icon" variant="ghost" onClick={() => openEdit(p)}><Pencil className="w-4 h-4" /></Button>
                  <Button size="icon" variant="ghost" onClick={() => remove(p.id)} className="text-destructive"><Trash2 className="w-4 h-4" /></Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing ? 'Edit Package' : 'New Package'}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Name *</Label>
                <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Starter" />
              </div>
              <div className="space-y-1.5">
                <Label>Price *</Label>
                <Input value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} placeholder="₹9,999" />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label>Tagline</Label>
              <Input value={form.tagline} onChange={(e) => setForm({ ...form, tagline: e.target.value })} placeholder="Perfect to launch your idea" />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Price note</Label>
                <Input value={form.price_note} onChange={(e) => setForm({ ...form, price_note: e.target.value })} placeholder="starting" />
              </div>
              <div className="space-y-1.5">
                <Label>Sort order</Label>
                <Input type="number" value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: parseInt(e.target.value) || 0 })} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Icon</Label>
                <select className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm" value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })}>
                  {ICONS.map((i) => <option key={i} value={i}>{i}</option>)}
                </select>
              </div>
              <div className="space-y-1.5">
                <Label>Gradient</Label>
                <select className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm" value={form.gradient} onChange={(e) => setForm({ ...form, gradient: e.target.value })}>
                  {GRADIENTS.map((g) => <option key={g} value={g}>{g}</option>)}
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label>Features (one per line)</Label>
              <Textarea rows={6} value={featuresText} onChange={(e) => setFeaturesText(e.target.value)} placeholder="Mobile responsive design&#10;Basic SEO setup" />
            </div>

            <div className="space-y-1.5">
              <Label>Services (comma separated, pre-selects in inquiry form)</Label>
              <Input value={servicesText} onChange={(e) => setServicesText(e.target.value)} placeholder="Web Development, Graphic Design" />
            </div>

            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2 text-sm">
                <Switch checked={form.popular} onCheckedChange={(v) => setForm({ ...form, popular: v })} />
                Mark as Most Popular
              </label>
              <label className="flex items-center gap-2 text-sm">
                <Switch checked={form.is_active} onCheckedChange={(v) => setForm({ ...form, is_active: v })} />
                Active (visible on site)
              </label>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={save}>{editing ? 'Save changes' : 'Create package'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminPackages;
