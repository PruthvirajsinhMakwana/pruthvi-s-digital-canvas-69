import { useEffect, useState } from 'react';
import { Award, ExternalLink, Eye, Loader2, AlertCircle, X } from 'lucide-react';
import { ScrollReveal } from '@/hooks/useScrollReveal';
import { supabase } from '@/integrations/supabase/client';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

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

  return (
    <section id="certifications" className="py-24 lg:py-32 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/10 to-background" />
      <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[140px]" />
      <div className="absolute bottom-1/4 left-0 w-[400px] h-[400px] bg-secondary/5 rounded-full blur-[120px]" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <ScrollReveal animation="fade-up">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 rounded-full text-sm font-medium text-primary mb-6">
              <Award className="w-4 h-4" />
              Achievements & Certifications
            </div>
            <h2 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
              My{' '}
              <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                Certifications
              </span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
              Continuous learning is at the heart of what I do. Here are some of the certifications that
              shape my expertise.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {items.map((cert, index) => {
            const gradient = cert.gradient || 'from-blue-500 to-cyan-500';
            const canPreview = !!(cert.certificate_url || cert.image_url);
            return (
              <ScrollReveal key={cert.id} animation="fade-up" delay={index * 100}>
                <div className="group relative h-full">
                  <div className={`absolute -inset-0.5 bg-gradient-to-br ${gradient} rounded-2xl opacity-0 group-hover:opacity-30 blur-lg transition-all duration-500`} />

                  <div className="relative h-full bg-card/80 backdrop-blur-sm border border-border/50 rounded-2xl overflow-hidden transition-all duration-500 hover:border-primary/40 hover:-translate-y-2 hover:shadow-2xl flex flex-col">
                    <button
                      type="button"
                      onClick={() => canPreview && openPreview(cert)}
                      disabled={!canPreview}
                      aria-label={`Preview ${cert.title} certificate`}
                      className="relative aspect-[16/10] overflow-hidden bg-muted text-left disabled:cursor-default cursor-zoom-in"
                    >
                      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-20 group-hover:opacity-30 transition-opacity duration-500 z-10`} />
                      {cert.image_url ? (
                        <img
                          src={cert.image_url}
                          alt={`${cert.title} certification`}
                          loading="lazy"
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Award className="w-16 h-16 text-muted-foreground/30" />
                        </div>
                      )}
                      <div className="absolute top-4 right-4 z-20">
                        <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}>
                          <Award className="w-5 h-5 text-white" strokeWidth={2} />
                        </div>
                      </div>
                      {canPreview && (
                        <div className="absolute inset-0 z-20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-background/40 backdrop-blur-sm">
                          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary text-primary-foreground text-sm font-medium shadow-lg">
                            <Eye className="w-4 h-4" /> Preview
                          </span>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-card via-card/30 to-transparent z-10 pointer-events-none" />
                    </button>

                    <div className="p-6 lg:p-7 flex flex-col flex-1">
                      {cert.issuer && (
                        <p className="text-xs uppercase tracking-wider text-primary font-semibold mb-2">
                          {cert.issuer}
                        </p>
                      )}
                      <h3 className="font-heading text-xl font-bold mb-3 group-hover:text-primary transition-colors duration-300">
                        {cert.title}
                      </h3>
                      {cert.description && (
                        <p className="text-muted-foreground text-sm leading-relaxed">
                          {cert.description}
                        </p>
                      )}

                      {canPreview && (
                        <button
                          type="button"
                          onClick={() => openPreview(cert)}
                          className="inline-flex items-center gap-1.5 text-sm font-medium text-primary mt-4 hover:gap-2.5 transition-all duration-300 self-start"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          View Certificate
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            );
          })}
        </div>
      </div>

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
