import { useEffect, useState } from 'react';
import { Award, ExternalLink } from 'lucide-react';
import { ScrollReveal } from '@/hooks/useScrollReveal';
import { supabase } from '@/integrations/supabase/client';

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

export const CertificationsSection = () => {
  const [items, setItems] = useState<Certification[]>([]);
  const [loading, setLoading] = useState(true);

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

  if (!loading && items.length === 0) return null;

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
            return (
              <ScrollReveal key={cert.id} animation="fade-up" delay={index * 100}>
                <div className="group relative h-full">
                  <div className={`absolute -inset-0.5 bg-gradient-to-br ${gradient} rounded-2xl opacity-0 group-hover:opacity-30 blur-lg transition-all duration-500`} />

                  <div className="relative h-full bg-card/80 backdrop-blur-sm border border-border/50 rounded-2xl overflow-hidden transition-all duration-500 hover:border-primary/40 hover:-translate-y-2 hover:shadow-2xl">
                    <div className="relative aspect-[16/10] overflow-hidden bg-muted">
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
                      <div className="absolute inset-0 bg-gradient-to-t from-card via-card/30 to-transparent z-10" />
                    </div>

                    <div className="p-6 lg:p-7">
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

                      {cert.certificate_url && (
                        <a
                          href={cert.certificate_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-sm font-medium text-primary mt-4 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300"
                        >
                          View Certificate
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
};
