import { useEffect, useRef, useState, MouseEvent } from 'react';
import { Award, ExternalLink, Eye, Loader2, AlertCircle, BadgeCheck, Sparkles, Trophy, GraduationCap, Calendar, Star } from 'lucide-react';
import { ScrollReveal } from '@/hooks/useScrollReveal';
import { supabase } from '@/integrations/supabase/client';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

interface Certification {
  id: string;
  title: string;
  issuer: string | null;
  description: string | null;
  image_url: string | null;
  certificate_url: string | null;
  gradient: string | null;
  is_visible: boolean;
}

const isImageUrl = (url: string) => /\.(png|jpe?g|gif|webp|svg|avif)(\?|$)/i.test(url);
const isPdfUrl = (url: string) => /\.pdf(\?|$)/i.test(url);

export const CertificationsSection = () => {
  const [items, setItems] = useState<Certification[]>([]);
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState<Certification | null>(null);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [previewError, setPreviewError] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const { data } = await supabase
        .from('certifications')
        .select('*')
        .eq('is_visible', true)
        .order('sort_order', { ascending: true });
      if (mounted) {
        setItems((data as Certification[]) || []);
        setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  const openPreview = (cert: Certification) => {
    setActive(cert);
    setPreviewError(false);
    setPreviewLoading(true);
  };

  if (!loading && items.length === 0) return null;

  const previewUrl = active?.certificate_url || active?.image_url || '';
  const isPdf = previewUrl && isPdfUrl(previewUrl);
  const isImg = previewUrl && (isImageUrl(previewUrl) || previewUrl === active?.image_url);

  const uniqueIssuers = new Set(items.map(i => i.issuer).filter(Boolean)).size;

  return (
    <section id="certifications" className="py-24 lg:py-32 relative overflow-hidden">
      {/* Background layers */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/10 to-background" />
      <div className="absolute inset-0 opacity-[0.04] [background-image:linear-gradient(hsl(var(--foreground))_1px,transparent_1px),linear-gradient(90deg,hsl(var(--foreground))_1px,transparent_1px)] [background-size:40px_40px]" />
      <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[140px] animate-float-slow" />
      <div className="absolute bottom-1/4 left-0 w-[400px] h-[400px] bg-secondary/10 rounded-full blur-[120px] animate-float-slow" style={{ animationDelay: '1.5s' }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-accent/10 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '2s' }} />

      {/* Floating sparkles */}
      <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 18 }).map((_, i) => (
          <span
            key={i}
            className="absolute block w-1 h-1 rounded-full bg-primary/60 animate-sparkle"
            style={{
              top: `${(i * 53) % 100}%`,
              left: `${(i * 37) % 100}%`,
              animationDelay: `${(i % 6) * 0.4}s`,
              animationDuration: `${2 + (i % 4) * 0.6}s`,
            }}
          />
        ))}
      </div>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <ScrollReveal animation="fade-up">
          <div className="text-center mb-14 lg:mb-20">
            <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-primary/15 to-primary/5 border border-primary/20 rounded-full text-sm font-medium text-primary mb-6 backdrop-blur-sm shadow-lg shadow-primary/5">
              <Sparkles className="w-4 h-4 animate-pulse" />
              Achievements & Credentials
              <BadgeCheck className="w-4 h-4" />
            </div>
            <h2 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 tracking-tight">
              Certified{' '}
              <span className="relative inline-block">
                <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent bg-[length:200%_auto] animate-[shimmer_4s_linear_infinite]">
                  Excellence
                </span>
                <svg className="absolute -bottom-2 left-0 w-full" height="8" viewBox="0 0 200 8" preserveAspectRatio="none">
                  <path d="M0 4 Q 50 0, 100 4 T 200 4" stroke="hsl(var(--primary))" strokeWidth="2" fill="none" opacity="0.5" />
                </svg>
              </span>
            </h2>
            <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
              A growing collection of verified certifications that back every project I deliver — proof of continuous learning and craft.
            </p>

            {/* Stats strip */}
            {!loading && items.length > 0 && (
              <div className="mt-10 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-card/60 backdrop-blur-sm border border-border/50">
                  <Trophy className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium">{items.length}+ Certifications</span>
                </div>
                {uniqueIssuers > 0 && (
                  <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-card/60 backdrop-blur-sm border border-border/50">
                    <GraduationCap className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium">{uniqueIssuers} Issuers</span>
                  </div>
                )}
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-card/60 backdrop-blur-sm border border-border/50">
                  <BadgeCheck className="w-4 h-4 text-green-500" />
                  <span className="text-sm font-medium">Verified</span>
                </div>
              </div>
            )}
          </div>
        </ScrollReveal>

        {/* Loading skeletons */}
        {loading && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {[0, 1, 2].map(i => (
              <div key={i} className="rounded-2xl border border-border/50 overflow-hidden">
                <Skeleton className="aspect-[16/10] w-full" />
                <div className="p-6 space-y-3">
                  <Skeleton className="h-3 w-20" />
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-3 w-5/6" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 [perspective:1500px]">
          {items.map((cert, index) => (
            <ScrollReveal key={cert.id} animation="fade-up" delay={index * 100}>
              <CertificationCard cert={cert} index={index} onPreview={openPreview} />
            </ScrollReveal>
          ))}
        </div>
      </div>

      {/* Preview Dialog */}
      <Dialog open={!!active} onOpenChange={(o) => !o && setActive(null)}>
        <DialogContent className="max-w-4xl w-[95vw] p-0 overflow-hidden bg-card border-border/60">
          <div className="relative">
            <div className={`h-1.5 w-full bg-gradient-to-r ${active?.gradient || 'from-primary to-primary/60'}`} />
            <div className="p-5 sm:p-6 border-b border-border/50">
              {active?.issuer && (
                <p className="text-xs uppercase tracking-wider text-primary font-semibold mb-1">{active.issuer}</p>
              )}
              <DialogTitle className="font-heading text-xl sm:text-2xl font-bold pr-10">
                {active?.title}
              </DialogTitle>
              {active?.description && (
                <DialogDescription className="text-sm text-muted-foreground mt-2">
                  {active.description}
                </DialogDescription>
              )}
            </div>

            <div className="relative bg-muted/30 min-h-[50vh] max-h-[70vh] overflow-auto flex items-center justify-center">
              {previewLoading && !previewError && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-card/60 backdrop-blur-sm z-10">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                  <p className="text-sm text-muted-foreground">Loading certificate…</p>
                </div>
              )}

              {previewError && (
                <div className="flex flex-col items-center justify-center gap-3 p-10 text-center">
                  <div className="w-14 h-14 rounded-full bg-destructive/10 flex items-center justify-center">
                    <AlertCircle className="w-7 h-7 text-destructive" />
                  </div>
                  <div>
                    <p className="font-medium">Couldn't load preview</p>
                    <p className="text-sm text-muted-foreground mt-1">The certificate may be private or blocked from embedding.</p>
                  </div>
                  {previewUrl && (
                    <Button asChild variant="outline" className="mt-2">
                      <a href={previewUrl} target="_blank" rel="noopener noreferrer">
                        Open in new tab <ExternalLink className="w-3.5 h-3.5 ml-1.5" />
                      </a>
                    </Button>
                  )}
                </div>
              )}

              {!previewError && previewUrl && (
                isPdf ? (
                  <iframe
                    key={previewUrl}
                    src={previewUrl}
                    title={active?.title || 'Certificate preview'}
                    className="w-full h-[70vh] border-0 bg-white"
                    onLoad={() => setPreviewLoading(false)}
                    onError={() => { setPreviewLoading(false); setPreviewError(true); }}
                  />
                ) : isImg ? (
                  <img
                    key={previewUrl}
                    src={previewUrl}
                    alt={active?.title || 'Certificate'}
                    className="max-w-full max-h-[70vh] object-contain"
                    onLoad={() => setPreviewLoading(false)}
                    onError={() => { setPreviewLoading(false); setPreviewError(true); }}
                  />
                ) : (
                  <iframe
                    key={previewUrl}
                    src={previewUrl}
                    title={active?.title || 'Certificate preview'}
                    className="w-full h-[70vh] border-0 bg-white"
                    onLoad={() => setPreviewLoading(false)}
                    onError={() => { setPreviewLoading(false); setPreviewError(true); }}
                  />
                )
              )}
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 p-4 sm:p-5 border-t border-border/50 bg-card">
              <p className="text-xs text-muted-foreground">
                Some issuers block in-page previews. If the preview is empty, open in a new tab.
              </p>
              {previewUrl && (
                <Button asChild size="sm" className="gap-1.5">
                  <a href={previewUrl} target="_blank" rel="noopener noreferrer">
                    Open original <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </Button>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
};
