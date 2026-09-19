import { Mic, Radio, Trophy, Gamepad2, Users, Monitor, Zap, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollReveal } from '@/hooks/useScrollReveal';
import { Link } from 'react-router-dom';
import { useSiteSettings } from '@/hooks/useSiteSettings';

const esportsFeatures = [
  {
    icon: Radio,
    title: 'Live Streaming',
    description: 'Professional live stream production for your esports events with overlays, transitions, and multi-camera setups.',
    gradient: 'from-cyan-500 to-blue-500',
  },
  {
    icon: Trophy,
    title: 'Tournament Organization',
    description: 'End-to-end tournament management for colleges, institutions, and gaming communities.',
    gradient: 'from-amber-500 to-yellow-500',
  },
  {
    icon: Mic,
    title: 'Esports Commentary',
    description: 'Professional shoutcasting and play-by-play commentary for LAN and online tournaments.',
    gradient: 'from-violet-500 to-purple-500',
  },
  {
    icon: Users,
    title: 'Event Hosting',
    description: 'Energetic stage hosting and broadcast presenting for gaming events and award shows.',
    gradient: 'from-rose-500 to-pink-500',
  },
];

export const EsportsServicesHighlight = () => {
  const { settings } = useSiteSettings();
  const whatsappDigits = (settings.whatsappNumber || '').replace(/\D/g, '');

  return (
    <section className="py-24 lg:py-32 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-secondary/5 to-background" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-secondary/10 rounded-full blur-[200px]" />
      
      {/* Decorative gaming elements */}
      <div className="absolute top-20 right-10 opacity-10">
        <Gamepad2 className="w-32 h-32 text-secondary" />
      </div>
      <div className="absolute bottom-20 left-10 opacity-10">
        <Monitor className="w-24 h-24 text-primary" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <ScrollReveal animation="fade-up">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-secondary/20 to-secondary/10 border border-secondary/30 rounded-full text-sm font-medium text-secondary mb-6">
              <Zap className="w-4 h-4" />
              Esports & Gaming Services
            </div>
            <h2 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
              Bring Your <span className="bg-gradient-to-r from-secondary to-cyan-400 bg-clip-text text-transparent">Esports Vision</span> to Life
            </h2>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto leading-relaxed">
              Want to organize an esports tournament for your college or institution? Need professional commentary and live streaming? 
              I provide complete esports event solutions from planning to execution.
            </p>
          </div>
        </ScrollReveal>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 gap-6 lg:gap-8 mb-12">
          {esportsFeatures.map((feature, index) => (
            <ScrollReveal key={index} animation="fade-up" delay={index * 100}>
              <div className="group relative h-full">
                <div className="relative bg-card/60 backdrop-blur-sm border border-border/50 rounded-2xl p-6 lg:p-8 h-full transition-all duration-500 hover:border-secondary/30 hover:-translate-y-1 hover:shadow-xl hover:shadow-secondary/10">
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-[0.03] rounded-2xl transition-opacity duration-500`} />
                  
                  <div className="flex items-start gap-5">
                    <div className={`relative w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform duration-500`}>
                      <feature.icon className="w-7 h-7 text-white" strokeWidth={1.5} />
                    </div>
                    
                    <div>
                      <h3 className="font-heading text-xl font-bold mb-2 group-hover:text-secondary transition-colors duration-300">
                        {feature.title}
                      </h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>

        {/* CTA */}
        <ScrollReveal animation="fade-up" delay={400}>
          <div className="text-center">
            <div className="inline-flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="px-8 h-12 text-base group" asChild>
                <Link to="/contact">
                  Get a Quote
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="px-8 h-12 text-base" asChild>
                <a href="https://wa.me/919016790161" target="_blank" rel="noopener noreferrer">
                  WhatsApp Me
                </a>
              </Button>
            </div>
            <p className="text-sm text-muted-foreground mt-4">
              Available for colleges, institutions, gaming cafes, and esports organizations
            </p>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};