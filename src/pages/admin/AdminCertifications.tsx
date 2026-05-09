import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Trash2, Eye, EyeOff, Award, Loader2, ArrowUp, ArrowDown } from 'lucide-react';
import { ImageUploader } from '@/components/admin/ImageUploader';
import { toast } from 'sonner';

interface Certification {
  id: string;
  title: string;
  issuer: string | null;
  description: string | null;
  image_url: string | null;
  certificate_url: string | null;
  gradient: string | null;
  is_visible: boolean;
  sort_order: number;
}

const gradientOptions = [
  'from-blue-500 to-cyan-500',
  'from-green-500 to-emerald-500',
  'from-pink-500 to-rose-500',
  'from-red-500 to-orange-500',
  'from-purple-500 to-violet-500',
  'from-amber-500 to-yellow-500',
  'from-indigo-500 to-blue-500',
  'from-rose-500 to-pink-500',
];

const AdminCertifications = () => {
  const [items, setItems] = useState<Certification[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('certifications')
      .select('*')
      .order('sort_order', { ascending: true });
    if (error) toast.error(error.message);
    setItems(data || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const addNew = async () => {
    const { data, error } = await supabase
      .from('certifications')
      .insert({
        title: 'New Certification',
        issuer: '',
        description: '',
        gradient: 'from-blue-500 to-cyan-500',
        sort_order: items.length,
      })
      .select()
      .single();
    if (error) return toast.error(error.message);
    setItems([...items, data as Certification]);
    toast.success('Added');
  };

  const update = (id: string, patch: Partial<Certification>) => {
    setItems(items.map(i => i.id === id ? { ...i, ...patch } : i));
  };

  const save = async (cert: Certification) => {
    setSavingId(cert.id);
    const { error } = await supabase
      .from('certifications')
      .update({
        title: cert.title,
        issuer: cert.issuer,
        description: cert.description,
        image_url: cert.image_url,
        certificate_url: cert.certificate_url,
        gradient: cert.gradient,
        is_visible: cert.is_visible,
        sort_order: cert.sort_order,
      })
      .eq('id', cert.id);
    setSavingId(null);
    if (error) return toast.error(error.message);
    toast.success('Saved');
  };

  const remove = async (id: string) => {
    if (!confirm('Delete this certification?')) return;
    const { error } = await supabase.from('certifications').delete().eq('id', id);
    if (error) return toast.error(error.message);
    setItems(items.filter(i => i.id !== id));
    toast.success('Deleted');
  };

  const move = async (index: number, dir: -1 | 1) => {
    const j = index + dir;
    if (j < 0 || j >= items.length) return;
    const a = { ...items[index], sort_order: j };
    const b = { ...items[j], sort_order: index };
    const next = [...items];
    next[index] = b; next[j] = a;
    setItems(next);
    await Promise.all([
      supabase.from('certifications').update({ sort_order: a.sort_order }).eq('id', a.id),
      supabase.from('certifications').update({ sort_order: b.sort_order }).eq('id', b.id),
    ]);
  };

  if (loading) {
    return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-heading text-2xl font-bold flex items-center gap-2">
            <Award className="w-6 h-6 text-primary" /> Certifications
          </h2>
          <p className="text-sm text-muted-foreground">Manage the certification cards shown on the Services page.</p>
        </div>
        <Button onClick={addNew} className="gap-2"><Plus className="w-4 h-4" /> Add</Button>
      </div>

      {items.length === 0 && (
        <div className="text-center py-16 border border-dashed border-border rounded-2xl">
          <Award className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground">No certifications yet. Click "Add" to create one.</p>
        </div>
      )}

      <div className="space-y-5">
        {items.map((cert, idx) => (
          <div key={cert.id} className="glass-card rounded-2xl p-5 sm:p-6 space-y-4">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => move(idx, -1)} disabled={idx === 0}>
                  <ArrowUp className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => move(idx, 1)} disabled={idx === items.length - 1}>
                  <ArrowDown className="w-4 h-4" />
                </Button>
                <span className="text-xs text-muted-foreground">#{idx + 1}</span>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => update(cert.id, { is_visible: !cert.is_visible })}>
                  {cert.is_visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4 text-muted-foreground" />}
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => remove(cert.id)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-5">
              <div>
                <Label className="text-xs">Certificate Image</Label>
                <div className="mt-1.5">
                  <ImageUploader
                    bucket="certifications"
                    value={cert.image_url || ''}
                    onChange={(url) => update(cert.id, { image_url: url })}
                  />
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <Label className="text-xs">Title</Label>
                  <Input className="mt-1" value={cert.title} onChange={(e) => update(cert.id, { title: e.target.value })} />
                </div>
                <div>
                  <Label className="text-xs">Issuer</Label>
                  <Input className="mt-1" value={cert.issuer || ''} onChange={(e) => update(cert.id, { issuer: e.target.value })} placeholder="e.g. Google, Adobe" />
                </div>
                <div>
                  <Label className="text-xs">Description (2-3 lines)</Label>
                  <Textarea className="mt-1 resize-none" rows={3} maxLength={300}
                    value={cert.description || ''}
                    onChange={(e) => update(cert.id, { description: e.target.value })} />
                </div>
                <div>
                  <Label className="text-xs">Certificate URL (optional)</Label>
                  <Input className="mt-1" value={cert.certificate_url || ''} onChange={(e) => update(cert.id, { certificate_url: e.target.value })} placeholder="https://..." />
                </div>
                <div>
                  <Label className="text-xs">Accent Gradient</Label>
                  <Select value={cert.gradient || gradientOptions[0]} onValueChange={(v) => update(cert.id, { gradient: v })}>
                    <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {gradientOptions.map(g => (
                        <SelectItem key={g} value={g}>
                          <div className="flex items-center gap-2">
                            <div className={`w-5 h-5 rounded bg-gradient-to-r ${g}`} />
                            <span className="text-xs">{g.replace(/from-|to-|-500/g, '').trim()}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t border-border/50">
              <Button onClick={() => save(cert)} disabled={savingId === cert.id} className="gap-2">
                {savingId === cert.id && <Loader2 className="w-4 h-4 animate-spin" />}
                Save Changes
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminCertifications;
