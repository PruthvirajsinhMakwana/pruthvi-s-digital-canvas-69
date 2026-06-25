import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Send, Sparkles, Briefcase, DollarSign, Calendar, Building2, User, Mail, Phone, Globe } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useSiteSettings } from '@/hooks/useSiteSettings';

interface ProjectInquiryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultPackage?: string;
  defaultServices?: string[];
}

const SERVICES = [
  'Web Development',
  'Digital Marketing',
  'Graphic Design',
  'Video Editing',
  'UI/UX Design',
  'Video Shooting',
  'Esports Commentary',
  'Event Hosting',
  'Tournament Organization',
  'Branding & Identity',
];

const BUDGETS = [
  'Under ₹10,000',
  '₹10,000 – ₹25,000',
  '₹25,000 – ₹50,000',
  '₹50,000 – ₹1,00,000',
  '₹1,00,000 – ₹3,00,000',
  '₹3,00,000+',
];

const TIMELINES = ['ASAP (Rush)', '1–2 weeks', '2–4 weeks', '1–2 months', '3+ months', 'Flexible'];

export const ProjectInquiryDialog = ({ open, onOpenChange, defaultPackage, defaultServices = [] }: ProjectInquiryDialogProps) => {
  const { settings } = useSiteSettings();
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    website: '',
    services: [] as string[],
    pkg: defaultPackage || '',
    budget: '',
    timeline: '',
    details: '',
  });

  useEffect(() => {
    if (open) {
      setForm((f) => ({
        ...f,
        pkg: defaultPackage || f.pkg,
        services: defaultServices.length ? defaultServices : f.services,
      }));
    }
  }, [open, defaultPackage]);

  const toggleService = (s: string) => {
    setForm((f) => ({
      ...f,
      services: f.services.includes(s) ? f.services.filter((x) => x !== s) : [...f.services, s],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const name = form.name.trim();
    const email = form.email.trim();
    const phone = form.phone.trim();
    const details = form.details.trim();

    if (name.length < 2 || name.length > 100) return toast.error('Please enter a valid name');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return toast.error('Please enter a valid email');
    if (phone && phone.length > 20) return toast.error('Phone too long');
    if (form.services.length === 0) return toast.error('Select at least one service');
    if (!form.budget) return toast.error('Please pick a budget range');
    if (details.length < 10) return toast.error('Please describe your project (min 10 chars)');
    if (details.length > 2000) return toast.error('Project details too long (max 2000)');

    setSubmitting(true);
    try {
      const message = [
        `🎯 PROJECT INQUIRY`,
        form.pkg ? `📦 Package: ${form.pkg}` : null,
        `🛠️ Services: ${form.services.join(', ')}`,
        `💰 Budget: ${form.budget}`,
        form.timeline ? `⏱️ Timeline: ${form.timeline}` : null,
        form.company ? `🏢 Company: ${form.company}` : null,
        form.website ? `🌐 Website: ${form.website}` : null,
        ``,
        `📝 Project Details:`,
        details,
      ].filter(Boolean).join('\n');

      const { error } = await supabase.from('contact_messages').insert({
        name,
        email,
        phone: phone || null,
        message,
      });
      if (error) throw error;

      supabase.functions.invoke('send-telegram-notification', {
        body: { name, email, phone: phone || null, message },
      }).catch(() => {});

      supabase.functions.invoke('send-brevo-emails', {
        body: { name, email, phone: phone || null, message, adminEmail: settings.email },
      }).catch(() => {});

      toast.success('Inquiry sent!', { description: "I'll get back to you within 24 hours." });
      onOpenChange(false);
      setForm({ name: '', email: '', phone: '', company: '', website: '', services: [], pkg: '', budget: '', timeline: '', details: '' });
    } catch (err: any) {
      console.error(err);
      toast.error(err?.message || 'Failed to send inquiry');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[92vh] overflow-y-auto p-0 gap-0">
        {/* Header */}
        <div className="relative overflow-hidden rounded-t-lg">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-accent/10 to-secondary/20" />
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/30 rounded-full blur-3xl animate-pulse" />
          <div className="relative p-6 sm:p-8">
            <DialogHeader>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary/10 border border-primary/20 rounded-full text-xs font-medium text-primary w-fit mb-3">
                <Sparkles className="w-3.5 h-3.5" />
                Start Your Project
              </div>
              <DialogTitle className="text-2xl sm:text-3xl font-bold font-heading">
                Let's Build Something <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Great</span>
              </DialogTitle>
              <DialogDescription className="text-sm sm:text-base">
                Fill in the details below — I'll personally review and respond within 24 hours.
              </DialogDescription>
            </DialogHeader>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-5">
          {/* Contact */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="flex items-center gap-1.5 text-xs"><User className="w-3.5 h-3.5" /> Full Name *</Label>
              <Input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="John Doe" />
            </div>
            <div className="space-y-2">
              <Label className="flex items-center gap-1.5 text-xs"><Mail className="w-3.5 h-3.5" /> Email *</Label>
              <Input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@company.com" />
            </div>
            <div className="space-y-2">
              <Label className="flex items-center gap-1.5 text-xs"><Phone className="w-3.5 h-3.5" /> Phone</Label>
              <Input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+91 98765 43210" />
            </div>
            <div className="space-y-2">
              <Label className="flex items-center gap-1.5 text-xs"><Building2 className="w-3.5 h-3.5" /> Company</Label>
              <Input value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} placeholder="Acme Inc." />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-1.5 text-xs"><Globe className="w-3.5 h-3.5" /> Website / Social</Label>
            <Input value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })} placeholder="https://yourbrand.com or @handle" />
          </div>

          {/* Services */}
          <div className="space-y-2">
            <Label className="flex items-center gap-1.5 text-xs"><Briefcase className="w-3.5 h-3.5" /> Services Needed *</Label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {SERVICES.map((s) => {
                const active = form.services.includes(s);
                return (
                  <button
                    type="button"
                    key={s}
                    onClick={() => toggleService(s)}
                    className={`flex items-center gap-2 p-2.5 rounded-lg border text-xs text-left transition-all ${
                      active
                        ? 'border-primary bg-primary/10 text-foreground shadow-sm'
                        : 'border-border bg-muted/20 hover:border-primary/50 hover:bg-muted/40 text-muted-foreground'
                    }`}
                  >
                    <Checkbox checked={active} className="pointer-events-none" />
                    <span className="flex-1">{s}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Package + Budget + Timeline */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label className="flex items-center gap-1.5 text-xs"><Sparkles className="w-3.5 h-3.5" /> Package</Label>
              <Select value={form.pkg} onValueChange={(v) => setForm({ ...form, pkg: v })}>
                <SelectTrigger><SelectValue placeholder="Optional" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Starter">Starter</SelectItem>
                  <SelectItem value="Growth">Growth</SelectItem>
                  <SelectItem value="Pro">Pro</SelectItem>
                  <SelectItem value="Custom">Custom</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="flex items-center gap-1.5 text-xs"><DollarSign className="w-3.5 h-3.5" /> Budget *</Label>
              <Select value={form.budget} onValueChange={(v) => setForm({ ...form, budget: v })}>
                <SelectTrigger><SelectValue placeholder="Pick budget" /></SelectTrigger>
                <SelectContent>{BUDGETS.map((b) => <SelectItem key={b} value={b}>{b}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="flex items-center gap-1.5 text-xs"><Calendar className="w-3.5 h-3.5" /> Timeline</Label>
              <Select value={form.timeline} onValueChange={(v) => setForm({ ...form, timeline: v })}>
                <SelectTrigger><SelectValue placeholder="When?" /></SelectTrigger>
                <SelectContent>{TIMELINES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
              </Select>
            </div>
          </div>

          {/* Details */}
          <div className="space-y-2">
            <Label className="text-xs">Project Details *</Label>
            <Textarea
              required
              rows={5}
              value={form.details}
              onChange={(e) => setForm({ ...form, details: e.target.value })}
              placeholder="Tell me about your goals, scope, references, deadlines..."
              className="resize-none"
            />
          </div>

          <Button type="submit" size="lg" disabled={submitting} className="w-full group">
            {submitting ? (
              <><span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin mr-2" /> Sending...</>
            ) : (
              <>Send Inquiry <Send className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" /></>
            )}
          </Button>
          <p className="text-xs text-muted-foreground text-center">Your details are private — used only to respond to your inquiry.</p>
        </form>
      </DialogContent>
    </Dialog>
  );
};
