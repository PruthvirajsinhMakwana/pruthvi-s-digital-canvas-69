import { useEffect, useState } from 'react';
import { Check, Sparkles, Zap, Crown, ArrowRight, Star, Rocket, Award, Gem, Trophy, LucideIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollReveal } from '@/hooks/useScrollReveal';
import { ProjectInquiryDialog } from './ProjectInquiryDialog';
import { supabase } from '@/integrations/supabase/client';

const ICON_MAP: Record<string, LucideIcon> = {
  Zap, Sparkles, Crown, Star, Rocket, Award, Gem, Trophy,
};

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
}

export const PackagesSection = () => {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<{ pkg: string; services: string[] } | null>(null);
  const [packages, setPackages] = useState<Pkg[]>([]);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from('packages' as any)
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true });
      if (data) setPackages(data as any);
    })();
  }, []);

  const openWith = (pkg: string, services: string[]) => {
    setSelected({ pkg, services });
    setOpen(true);
  };

  if (packages.length === 0) return null;

  return (
    <section id="packages" className="py-20 sm:py-28 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/10 to-background" />
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[140px] animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-secondary/10 rounded-full blur-[120px]" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <ScrollReveal animation="fade-up">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20 rounded-full text-sm font-medium text-primary mb-6">
              <Star className="w-4 h-4" />
              Pricing & Packages
            </div>
            <h2 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold mb-5">
              Choose Your{' '}
              <span className="bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
                Perfect Plan
              </span>
            </h2>
            <p className="text-muted-foreground text-base sm:text-lg leading-relaxed">
              Transparent pricing. No hidden fees. Pick a package or build a custom one — every plan starts a conversation, not a contract.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto">
          {packages.map((pkg, idx) => {
            const Icon = ICON_MAP[pkg.icon] || Sparkles;
            return (
              <ScrollReveal key={pkg.id} animation="fade-up" delay={idx * 120}>
                <div
                  className={`group relative h-full rounded-3xl p-[1.5px] transition-all duration-500 hover:-translate-y-2 ${
                    pkg.popular ? 'bg-gradient-to-br from-primary via-accent to-secondary' : 'bg-border/60 hover:bg-gradient-to-br hover:from-primary/40 hover:to-secondary/40'
                  }`}
                >
                  {pkg.popular && (
                    <>
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-20">
                        <div className="px-4 py-1.5 bg-gradient-to-r from-primary to-secondary text-primary-foreground text-xs font-bold rounded-full shadow-lg flex items-center gap-1.5 animate-pulse">
                          <Sparkles className="w-3.5 h-3.5" />
                          MOST POPULAR
                        </div>
                      </div>
                      <div className="absolute inset-0 rounded-3xl shadow-primary/40 shadow-2xl opacity-60 blur-xl -z-10" />
                    </>
                  )}

                  <div className="relative h-full bg-card rounded-3xl p-7 lg:p-8 flex flex-col overflow-hidden">
                    <div className={`absolute -top-16 -right-16 w-48 h-48 bg-gradient-to-br ${pkg.gradient} opacity-10 rounded-full blur-3xl group-hover:opacity-20 transition-opacity duration-700`} />

                    <div className={`relative w-14 h-14 rounded-2xl bg-gradient-to-br ${pkg.gradient} flex items-center justify-center mb-5 shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}>
                      <Icon className="w-7 h-7 text-white" strokeWidth={2} />
                    </div>

                    <h3 className="font-heading text-2xl font-bold mb-1">{pkg.name}</h3>
                    <p className="text-sm text-muted-foreground mb-5">{pkg.tagline}</p>

                    <div className="mb-6 pb-6 border-b border-border/50">
                      <div className="flex items-baseline gap-2">
                        <span className={`text-4xl font-bold bg-gradient-to-r ${pkg.gradient} bg-clip-text text-transparent`}>
                          {pkg.price}
                        </span>
                        <span className="text-xs text-muted-foreground uppercase tracking-wider">{pkg.price_note}</span>
                      </div>
                    </div>

                    <ul className="space-y-3 mb-8 flex-1">
                      {pkg.features.map((f, i) => (
                        <li key={i} className="flex items-start gap-2.5 text-sm">
                          <div className={`mt-0.5 w-5 h-5 rounded-full bg-gradient-to-br ${pkg.gradient} flex items-center justify-center flex-shrink-0`}>
                            <Check className="w-3 h-3 text-white" strokeWidth={3} />
                          </div>
                          <span className="text-foreground/80">{f}</span>
                        </li>
                      ))}
                    </ul>

                    <Button
                      onClick={() => openWith(pkg.name, pkg.services)}
                      size="lg"
                      variant={pkg.popular ? 'default' : 'outline'}
                      className="w-full group/btn"
                    >
                      Get Started
                      <ArrowRight className="w-4 h-4 ml-1 group-hover/btn:translate-x-1 transition-transform" />
                    </Button>
                  </div>
                </div>
              </ScrollReveal>
            );
          })}
        </div>

        <ScrollReveal animation="fade-up" delay={400}>
          <div className="mt-12 text-center">
            <p className="text-muted-foreground mb-4">Need something custom? Let's design a plan that fits.</p>
            <Button onClick={() => openWith('Custom', [])} variant="outline" size="lg" className="group">
              <Sparkles className="w-4 h-4 mr-2" />
              Request Custom Quote
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </ScrollReveal>
      </div>

      <ProjectInquiryDialog
        open={open}
        onOpenChange={setOpen}
        defaultPackage={selected?.pkg}
        defaultServices={selected?.services}
      />
    </section>
  );
};
