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

  // Prefer embeddable preview: use certificate_url only if it's an image/PDF,
  // otherwise fall back to the uploaded image (external sites usually block iframes).
  const certUrl = active?.certificate_url || '';
  const certIsEmbeddable = certUrl && (isImageUrl(certUrl) || isPdfUrl(certUrl));
  const previewUrl = certIsEmbeddable ? certUrl : (active?.image_url || '');
  const externalUrl = active?.certificate_url || active?.image_url || '';
  const isPdf = previewUrl && isPdfUrl(previewUrl);
  const isImg = previewUrl && !isPdf;

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
                  {externalUrl && (
                    <Button asChild variant="outline" className="mt-2">
                      <a href={externalUrl} target="_blank" rel="noopener noreferrer">
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
              {externalUrl && (
                <Button asChild size="sm" className="gap-1.5">
                  <a href={externalUrl} target="_blank" rel="noopener noreferrer">
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

interface CardProps {
  cert: Certification;
  index: number;
  onPreview: (c: Certification) => void;
}

const CertificationCard = ({ cert, onPreview }: CardProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ rx: 0, ry: 0, mx: 50, my: 50 });
  const gradient = cert.gradient || 'from-blue-500 to-cyan-500';
  const canPreview = !!(cert.certificate_url || cert.image_url);

  const handleMove = (e: MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;
    const px = x / r.width;
    const py = y / r.height;
    setTilt({
      rx: (0.5 - py) * 10,
      ry: (px - 0.5) * 12,
      mx: px * 100,
      my: py * 100,
    });
  };
  const handleLeave = () => setTilt({ rx: 0, ry: 0, mx: 50, my: 50 });

  return (
    <div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      className="group relative h-full [transform-style:preserve-3d] transition-transform duration-300 ease-out will-change-transform"
      style={{ transform: `rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg)` }}
    >
      {/* Outer glow */}
      <div className={`absolute -inset-0.5 bg-gradient-to-br ${gradient} rounded-2xl opacity-0 group-hover:opacity-50 blur-xl transition-all duration-700 animate-gradient-shift bg-[length:200%_200%]`} />
      {/* Animated border */}
      <div className={`absolute -inset-[1px] rounded-2xl bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-[length:200%_200%] animate-gradient-shift`} />

      <div className="relative h-full bg-card/90 backdrop-blur-xl border border-border/50 rounded-2xl overflow-hidden transition-all duration-500 group-hover:border-transparent group-hover:-translate-y-2 group-hover:shadow-[0_25px_60px_-15px_hsl(var(--primary)/0.5)] flex flex-col">
        {/* Cursor spotlight */}
        <div
          className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-30"
          style={{
            background: `radial-gradient(400px circle at ${tilt.mx}% ${tilt.my}%, hsl(var(--primary) / 0.15), transparent 60%)`,
          }}
        />

        {/* Verified ribbon with shine */}
        <div className="absolute top-0 left-0 z-30 pointer-events-none overflow-hidden rounded-br-xl">
          <div className={`relative flex items-center gap-1 pl-3 pr-4 py-1.5 bg-gradient-to-r ${gradient} text-white text-[10px] font-bold uppercase tracking-wider shadow-lg overflow-hidden`}>
            <BadgeCheck className="w-3 h-3 animate-pulse" />
            Verified
            <span className="absolute inset-0 w-1/3 bg-gradient-to-r from-transparent via-white/50 to-transparent animate-ribbon-shine" />
          </div>
        </div>

        {/* Corner sparkle */}
        <Star className="absolute top-2 right-20 w-3 h-3 text-primary/70 z-30 animate-sparkle" style={{ animationDelay: '0.5s' }} />
        <Sparkles className="absolute bottom-24 left-3 w-3 h-3 text-accent/70 z-30 animate-sparkle" style={{ animationDelay: '1.2s' }} />

        {/* Image */}
        <button
          type="button"
          onClick={() => canPreview && onPreview(cert)}
          disabled={!canPreview}
          aria-label={`Preview ${cert.title} certificate`}
          className="relative aspect-[16/10] overflow-hidden bg-muted text-left disabled:cursor-default cursor-zoom-in [transform:translateZ(40px)]"
        >
          <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-20 group-hover:opacity-30 transition-opacity duration-500 z-10`} />
          {/* Shimmer sweep */}
          <div className="absolute inset-0 z-20 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />

          {cert.image_url ? (
            <img
              src={cert.image_url}
              alt={`${cert.title} certification`}
              loading="lazy"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 group-hover:rotate-1"
            />
          ) : (
            <div className={`w-full h-full flex items-center justify-center bg-gradient-to-br ${gradient} bg-opacity-10`}>
              <Award className="w-20 h-20 text-white/40 animate-float" />
            </div>
          )}

          {/* Floating award badge with orbit */}
          <div className="absolute top-4 right-4 z-20">
            <div className={`relative w-12 h-12 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-xl group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 animate-tilt`}>
              <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${gradient} animate-ping opacity-25`} />
              <Award className="w-5 h-5 text-white relative z-10" strokeWidth={2.5} />
              {/* Orbiting dot */}
              <span className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <span className="absolute w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_10px_white] animate-orbit" />
              </span>
            </div>
          </div>

          {/* Hover preview overlay */}
          {canPreview && (
            <div className="absolute inset-0 z-20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 bg-background/50 backdrop-blur-sm">
              <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary text-primary-foreground text-sm font-semibold shadow-2xl scale-90 group-hover:scale-100 transition-transform duration-300 animate-glow">
                <Eye className="w-4 h-4" /> View Certificate
              </span>
            </div>
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-card via-card/40 to-transparent z-10 pointer-events-none" />
        </button>

        {/* Body */}
        <div className="p-6 lg:p-7 flex flex-col flex-1 [transform:translateZ(20px)]">
          {cert.issuer && (
            <div className="flex items-center gap-2 mb-2">
              <div className={`w-1 h-4 rounded-full bg-gradient-to-b ${gradient} animate-pulse`} />
              <p className="text-[11px] uppercase tracking-[0.15em] text-primary font-bold">
                {cert.issuer}
              </p>
            </div>
          )}
          <h3 className="font-heading text-xl font-bold mb-3 group-hover:text-primary transition-colors duration-300 leading-snug">
            {cert.title}
          </h3>
          {cert.description && (
            <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3">
              {cert.description}
            </p>
          )}

          {canPreview && (
            <div className="mt-5 pt-4 border-t border-border/50 flex items-center justify-between">
              <button
                type="button"
                onClick={() => onPreview(cert)}
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:gap-2.5 transition-all duration-300 group/btn"
              >
                <Eye className="w-3.5 h-3.5 group-hover/btn:scale-125 transition-transform" />
                View Certificate
                <span className="ml-0.5 transition-transform duration-300 group-hover/btn:translate-x-1">→</span>
              </button>
              <div className="flex items-center gap-1 text-[10px] text-muted-foreground uppercase tracking-wider">
                <Calendar className="w-3 h-3" />
                Verified
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
