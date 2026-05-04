import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { z } from 'zod';
import { X, Sparkles, Users, Award, Rocket, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useSiteSettings } from '@/hooks/useSiteSettings';

const STORAGE_KEY = 'lead_popup_last_shown';
const DELAY_MS = 20_000; // 20 seconds
const COOLDOWN_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

const PROJECT_TYPES = [
  'Web Development',
  'Social Media Marketing',
  'Video Editing & Shooting',
  'Graphic Design',
  'Esports Hosting',
  'Other',
];

const schema = z.object({
  name: z.string().trim().min(2, 'Name is too short').max(100),
  email: z.string().trim().email('Invalid email').max(255),
  projectType: z.string().min(1, 'Select a project type').max(100),
  message: z.string().trim().min(10, 'Tell me a bit more (min 10 chars)').max(2000),
});

export const LeadCapturePopup = () => {
  const { settings } = useSiteSettings();
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', projectType: '', message: '' });

  useEffect(() => {
    const t = setTimeout(() => setOpen(true), DELAY_MS);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open]);

  const close = () => setOpen(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      toast.error(parsed.error.errors[0]?.message || 'Please fix the form');
      return;
    }
    const { name, email, projectType, message } = parsed.data;
    setSubmitting(true);
    try {
      const fullMessage = `[Project Type: ${projectType}]\n\n${message}`;
      const { error } = await supabase.from('contact_messages').insert({
        name, email, phone: null, message: fullMessage,
      });
      if (error) throw error;

      supabase.functions.invoke('send-telegram-notification', {
        body: { name, email, phone: null, message: fullMessage },
      }).catch((err) => console.error('Telegram failed:', err));

      supabase.functions.invoke('send-brevo-emails', {
        body: { name, email, phone: null, message: fullMessage, adminEmail: settings.email },
      }).catch((err) => console.error('Brevo failed:', err));

      toast.success("Thanks! I'll get back to you shortly.");
      setForm({ name: '', email: '', projectType: '', message: '' });
      close();
    } catch (err) {
      console.error('Lead popup submit error:', err);
      toast.error('Failed to send. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center p-0 sm:p-6 animate-in fade-in duration-200">
      <div
        className="absolute inset-0 bg-background/70 backdrop-blur-xl"
        onClick={close}
        aria-hidden
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="lead-popup-title"
        className="relative w-full sm:max-w-3xl h-[100dvh] sm:h-auto sm:max-h-[92vh] flex flex-col rounded-t-2xl sm:rounded-2xl border-t sm:border border-border/50 bg-card/95 shadow-2xl glass-card animate-in slide-in-from-bottom-4 sm:zoom-in-95 sm:slide-in-from-bottom-0 duration-300 overflow-hidden"
      >
        <button
          onClick={close}
          aria-label="Close"
          className="absolute top-2 right-2 sm:top-3 sm:right-3 z-30 p-2 rounded-full bg-background/80 backdrop-blur border border-border/50 hover:bg-muted text-foreground transition shadow-md"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Scrollable body */}
        <div
          className="flex-1 min-h-0 overflow-y-auto overscroll-contain"
          style={{ WebkitOverflowScrolling: 'touch' }}
        >
          <div className="grid md:grid-cols-2 gap-0">
            {/* Left: pitch */}
            <div className="relative p-4 sm:p-7 md:p-8 pr-12 sm:pr-7 bg-gradient-to-br from-primary/15 via-accent/10 to-secondary/15 md:rounded-l-2xl">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-primary/15 text-primary rounded-full text-[11px] sm:text-xs font-medium mb-2 sm:mb-4">
                <Sparkles className="w-3.5 h-3.5" /> Let's build something
              </span>
              <h2 id="lead-popup-title" className="font-heading text-lg sm:text-2xl md:text-3xl font-bold leading-tight mb-1.5 sm:mb-3">
                Got an idea? <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Let's make it real.</span>
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-6 line-clamp-3 sm:line-clamp-none">
                From web development and graphic design to video production, social media marketing, and live esports hosting — I help brands grow with end‑to‑end creative & tech services.
              </p>
              <ul className="hidden sm:block space-y-2 sm:space-y-3 text-xs sm:text-sm">
                <li className="flex items-start gap-2.5 sm:gap-3">
                  <Award className="w-4 h-4 sm:w-5 sm:h-5 text-primary shrink-0 mt-0.5" />
                  <span><strong>5+ years</strong> of hands‑on experience across creative & tech.</span>
                </li>
                <li className="flex items-start gap-2.5 sm:gap-3">
                  <Users className="w-4 h-4 sm:w-5 sm:h-5 text-primary shrink-0 mt-0.5" />
                  <span><strong>Trusted team</strong> of designers, editors & developers.</span>
                </li>
                <li className="flex items-start gap-2.5 sm:gap-3">
                  <Rocket className="w-4 h-4 sm:w-5 sm:h-5 text-primary shrink-0 mt-0.5" />
                  <span><strong>Fast turnaround</strong> with quality you can show off.</span>
                </li>
              </ul>
            </div>

            {/* Right: form */}
            <form id="lead-popup-form" onSubmit={handleSubmit} className="p-4 sm:p-7 md:p-8 space-y-3">
              <div>
                <Label htmlFor="lp-name" className="text-xs sm:text-sm">Name</Label>
                <Input
                  id="lp-name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Your name"
                  maxLength={100}
                  required
                  className="mt-1 text-base sm:text-sm"
                />
              </div>
              <div>
                <Label htmlFor="lp-email" className="text-xs sm:text-sm">Email</Label>
                <Input
                  id="lp-email"
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="you@example.com"
                  maxLength={255}
                  required
                  className="mt-1 text-base sm:text-sm"
                />
              </div>
              <div>
                <Label htmlFor="lp-type" className="text-xs sm:text-sm">Project type</Label>
                <select
                  id="lp-type"
                  value={form.projectType}
                  onChange={(e) => setForm({ ...form, projectType: e.target.value })}
                  required
                  className="mt-1 w-full bg-background border border-input rounded-md p-2.5 sm:p-2 text-base sm:text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="">Select a service</option>
                  {PROJECT_TYPES.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
              <div>
                <Label htmlFor="lp-message" className="text-xs sm:text-sm">Message</Label>
                <Textarea
                  id="lp-message"
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  placeholder="Briefly describe your project, timeline, and budget."
                  rows={3}
                  maxLength={2000}
                  required
                  className="mt-1 text-base sm:text-sm resize-none"
                />
              </div>
            </form>
          </div>
        </div>

        {/* Sticky footer (always visible, safe-area aware) */}
        <div
          className="shrink-0 flex items-center justify-between gap-3 px-4 sm:px-7 md:px-8 py-3 border-t border-border/50 bg-card/95 backdrop-blur"
          style={{ paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom))' }}
        >
          <button
            type="button"
            onClick={close}
            className="text-xs sm:text-sm text-muted-foreground hover:text-foreground transition"
          >
            Maybe later
          </button>
          <Button form="lead-popup-form" type="submit" variant="hero" disabled={submitting} className="gap-2">
            <Send className="w-4 h-4" />
            {submitting ? 'Sending...' : 'Send Inquiry'}
          </Button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default LeadCapturePopup;
