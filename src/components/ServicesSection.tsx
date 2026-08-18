import { Globe, Palette, Video, Megaphone, Layers, PenTool, Mic, Trophy, Gamepad2, Radio, Users, Calendar, ExternalLink, Briefcase, Dribbble, Github, FileImage, Code, Youtube, Instagram, Linkedin, Twitter, LucideIcon, ArrowRight, CheckCircle2, Smartphone, Database, Cloud, Shield, Zap, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollReveal } from '@/hooks/useScrollReveal';
import { Link } from 'react-router-dom';
import { useSiteSettings, PortfolioLink, CustomService } from '@/hooks/useSiteSettings';

// Icon mapping for portfolio links
const iconMap: Record<string, LucideIcon> = {
  briefcase: Briefcase,
  palette: Palette,
  dribbble: Dribbble,
  github: Github,
  globe: Globe,
  'file-image': FileImage,
  code: Code,
  youtube: Youtube,
  instagram: Instagram,
  linkedin: Linkedin,
  twitter: Twitter,
  'external-link': ExternalLink,
};

// Icon mapping for services
const serviceIconMap: Record<string, LucideIcon> = {
  globe: Globe,
  palette: Palette,
  video: Video,
  megaphone: Megaphone,
  layers: Layers,
  'pen-tool': PenTool,
  mic: Mic,
  trophy: Trophy,
  gamepad: Gamepad2,
  radio: Radio,
  users: Users,
  calendar: Calendar,
  code: Code,
  smartphone: Smartphone,
  database: Database,
  cloud: Cloud,
  shield: Shield,
  zap: Zap,
};

const getPortfolioIcon = (iconName?: string): LucideIcon => {
  return iconMap[iconName || 'briefcase'] || Briefcase;
};

const getServiceIcon = (iconName?: string): LucideIcon => {
  return serviceIconMap[iconName || 'globe'] || Globe;
};

const getShadowColor = (gradient: string): string => {
  if (gradient.includes('blue')) return 'shadow-blue-500/20';
  if (gradient.includes('green') || gradient.includes('emerald')) return 'shadow-green-500/20';
  if (gradient.includes('pink') || gradient.includes('rose')) return 'shadow-pink-500/20';
  if (gradient.includes('red')) return 'shadow-red-500/20';
  if (gradient.includes('purple') || gradient.includes('violet')) return 'shadow-purple-500/20';
  if (gradient.includes('orange') || gradient.includes('amber')) return 'shadow-orange-500/20';
  if (gradient.includes('cyan')) return 'shadow-cyan-500/20';
  if (gradient.includes('indigo')) return 'shadow-indigo-500/20';
  return 'shadow-primary/20';
};

const getCheckColor = (gradient: string): string => {
  if (gradient.includes('blue') || gradient.includes('cyan')) return '#3b82f6';
  if (gradient.includes('green') || gradient.includes('emerald')) return '#22c55e';
  if (gradient.includes('pink') || gradient.includes('rose')) return '#ec4899';
  if (gradient.includes('red') || gradient.includes('orange')) return '#ef4444';
  if (gradient.includes('purple') || gradient.includes('violet')) return '#a855f7';
  if (gradient.includes('amber') || gradient.includes('yellow')) return '#f59e0b';
  if (gradient.includes('indigo')) return '#6366f1';
  return '#8b5cf6';
};

const defaultItServices = [
  {
    icon: Globe,
    title: 'Web Development',
    description: 'Clean, responsive, and fast websites built for performance and user experience.',
    deliverables: ['Landing Pages', 'Portfolio Sites', 'Business Websites', 'Website Redesign', 'Maintenance'],
    gradient: 'from-blue-500 to-cyan-500',
    shadowColor: 'shadow-blue-500/20',
  },
  {
    icon: Megaphone,
    title: 'Digital Marketing',
    description: 'Strategies that boost reach, engagement, and brand visibility.',
    deliverables: ['Social Media Strategy', 'SEO Optimization', 'Content Planning', 'Ad Creatives', 'Analytics'],
    gradient: 'from-green-500 to-emerald-500',
    shadowColor: 'shadow-green-500/20',
  },
  {
    icon: Palette,
    title: 'Graphic Design',
    description: 'Creative visuals that communicate brand identity and attract attention.',
    deliverables: ['Logos & Branding', 'Posters & Flyers', 'Social Media Creatives', 'Thumbnails'],
    gradient: 'from-pink-500 to-rose-500',
    shadowColor: 'shadow-pink-500/20',
  },
  {
    icon: Video,
    title: 'Video Editing',
    description: 'Engaging videos for businesses, personal brands, and social platforms.',
    deliverables: ['Short Reels', 'Promotional Videos', 'Color Correction', 'Motion Graphics'],
    gradient: 'from-red-500 to-orange-500',
    shadowColor: 'shadow-red-500/20',
  },
  {
    icon: Layers,
    title: 'UI/UX Design',
    description: 'User-centered design that creates intuitive and delightful digital experiences.',
    deliverables: ['Wireframes', 'Prototypes', 'User Research', 'Interface Design'],
    gradient: 'from-purple-500 to-violet-500',
    shadowColor: 'shadow-purple-500/20',
  },
  {
    icon: PenTool,
    title: 'IT Support',
    description: 'Basic troubleshooting, software setup, and digital workflow assistance.',
    deliverables: ['Software Setup', 'Troubleshooting', 'Digital Workflow', 'Productivity Tools'],
    gradient: 'from-orange-500 to-amber-500',
    shadowColor: 'shadow-orange-500/20',
  },
];

const defaultEsportsServices = [
  {
    icon: Mic,
    title: 'Esports Commentary',
    description: 'Professional play-by-play and color commentary for competitive gaming events.',
    deliverables: ['Live Commentary', 'Play-by-Play', 'Color Commentary', 'Post-Match Analysis'],
    gradient: 'from-violet-500 to-purple-500',
    shadowColor: 'shadow-violet-500/20',
  },
  {
    icon: Radio,
    title: 'Event Hosting',
    description: 'Energetic hosting for gaming events, award shows, and esports broadcasts.',
    deliverables: ['Stage Hosting', 'Broadcast Presenting', 'Interviews', 'Panel Moderation'],
    gradient: 'from-cyan-500 to-blue-500',
    shadowColor: 'shadow-cyan-500/20',
  },
  {
    icon: Trophy,
    title: 'Tournament Organization',
    description: 'End-to-end tournament management from planning to execution.',
    deliverables: ['Event Planning', 'Ruleset Creation', 'Bracket Management', 'Production'],
    gradient: 'from-amber-500 to-yellow-500',
    shadowColor: 'shadow-amber-500/20',
  },
  {
    icon: Gamepad2,
    title: 'Gaming Content',
    description: 'Engaging gaming content for YouTube, Twitch, and social media platforms.',
    deliverables: ['YouTube Videos', 'Stream Content', 'Gaming Reviews', 'Tutorials'],
    gradient: 'from-emerald-500 to-green-500',
    shadowColor: 'shadow-emerald-500/20',
  },
  {
    icon: Users,
    title: 'Team Management',
    description: 'Coordination and support for esports teams and individual players.',
    deliverables: ['Team Coordination', 'Schedule Management', 'Communication', 'Logistics'],
    gradient: 'from-rose-500 to-pink-500',
    shadowColor: 'shadow-rose-500/20',
  },
  {
    icon: Calendar,
    title: 'Community Events',
    description: 'Building and managing gaming communities through events and engagement.',
    deliverables: ['Community Tournaments', 'Watch Parties', 'Gaming Meetups', 'Online Leagues'],
    gradient: 'from-indigo-500 to-blue-500',
    shadowColor: 'shadow-indigo-500/20',
  },
];

interface ServiceData {
  icon: LucideIcon;
  title: string;
  description: string;
  deliverables: string[];
  gradient: string;
  shadowColor: string;
  linkUrl?: string;
}

interface ServiceCardProps {
  service: ServiceData;
  index: number;
}

const ServiceCard = ({ service, index }: ServiceCardProps) => {
  const handleArrowClick = () => {
    if (service.linkUrl) {
      if (service.linkUrl.startsWith('http')) {
        window.open(service.linkUrl, '_blank', 'noopener,noreferrer');
      } else {
        window.location.href = service.linkUrl;
      }
    }
  };

  return (
    <ScrollReveal animation="fade-up" delay={index * 100}>
      <div className="group relative h-full">
        <div className={`relative bg-card/80 backdrop-blur-sm border border-border/50 rounded-2xl p-6 lg:p-7 h-full transition-all duration-500 hover:border-primary/30 hover:-translate-y-2 hover:shadow-2xl ${service.shadowColor}`}>
          <div className={`absolute inset-0 bg-gradient-to-br ${service.gradient} opacity-0 group-hover:opacity-[0.03] rounded-2xl transition-opacity duration-500`} />
          
          <div className={`relative w-14 h-14 rounded-2xl bg-gradient-to-br ${service.gradient} flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}>
            <service.icon className="w-7 h-7 text-white" strokeWidth={1.5} />
          </div>

          <h3 className="font-heading text-xl font-bold mb-3 group-hover:text-primary transition-colors duration-300">
            {service.title}
          </h3>
          <p className="text-muted-foreground text-sm leading-relaxed mb-5">
            {service.description}
          </p>

          <div className="space-y-2.5 pb-14">
            {service.deliverables.slice(0, 4).map((item, i) => (
              <div key={i} className="flex items-center gap-2.5 text-sm text-muted-foreground group-hover:text-foreground/80 transition-colors">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0" style={{ color: getCheckColor(service.gradient) }} />
                <span>{item}</span>
              </div>
            ))}
          </div>

          {service.linkUrl && (
            <button
              onClick={handleArrowClick}
              className="absolute bottom-6 right-6 w-11 h-11 rounded-xl bg-gradient-to-br from-primary/80 to-primary flex items-center justify-center shadow-lg hover:scale-110 hover:shadow-xl transition-all duration-300 cursor-pointer group/btn"
              aria-label={`View ${service.title} projects`}
            >
              <ArrowRight className="w-5 h-5 text-white group-hover/btn:translate-x-0.5 transition-transform" />
            </button>
          )}
        </div>
      </div>
    </ScrollReveal>
  );
};

interface ServicesSectionProps {
  showBothCategories?: boolean;
}

export const ServicesSection = ({ showBothCategories = false }: ServicesSectionProps) => {
  const { settings } = useSiteSettings();
  const portfolioLinks = settings.portfolioLinks || [];
  const serviceLinks = settings.serviceLinks || [];
  const customServices = settings.customServices || [];

  const getServiceLink = (serviceName: string): string | undefined => {
    const link = serviceLinks.find(l => l.serviceName === serviceName);
    return link?.url;
  };

  // Convert custom services to ServiceData format
  const customItServices: ServiceData[] = customServices
    .filter(s => s.category === 'it' && s.isVisible)
    .map(s => ({
      icon: getServiceIcon(s.icon),
      title: s.title,
      description: s.description,
      deliverables: s.deliverables.filter(d => d.trim()),
      gradient: s.gradient,
      shadowColor: getShadowColor(s.gradient),
      linkUrl: s.linkUrl,
    }));

  const customEsportsServices: ServiceData[] = customServices
    .filter(s => s.category === 'esports' && s.isVisible)
    .map(s => ({
      icon: getServiceIcon(s.icon),
      title: s.title,
      description: s.description,
      deliverables: s.deliverables.filter(d => d.trim()),
      gradient: s.gradient,
      shadowColor: getShadowColor(s.gradient),
      linkUrl: s.linkUrl,
    }));

  // Combine default and custom services
  const itServicesData: ServiceData[] = [
    ...defaultItServices.map(s => ({
      ...s,
      linkUrl: getServiceLink(s.title),
    })),
    ...customItServices,
  ];

  const esportsServicesData: ServiceData[] = [
    ...defaultEsportsServices.map(s => ({
      ...s,
      linkUrl: getServiceLink(s.title),
    })),
    ...customEsportsServices,
  ];

  return (
    <section id="services" className="py-24 lg:py-32 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/10 to-background" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-primary/5 rounded-full blur-[150px]" />
      <div className="absolute bottom-1/4 right-0 w-[400px] h-[400px] bg-secondary/5 rounded-full blur-[120px]" />
      <div className="absolute top-1/3 left-0 w-[300px] h-[300px] bg-primary/3 rounded-full blur-[100px]" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <ScrollReveal animation="fade-up">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 rounded-full text-sm font-medium text-primary mb-6">
              <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
              IT & Digital Services
            </div>
            <h2 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
              Digital <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">Solutions</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
              Comprehensive digital solutions tailored to help your brand stand out and succeed in the online world.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mb-24">
          {itServicesData.map((service, index) => (
            <ServiceCard key={`it-${index}`} service={service} index={index} />
          ))}
        </div>

        {showBothCategories && (
          <>
            <ScrollReveal animation="fade-up">
              <div className="flex items-center gap-6 mb-24">
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
                <div className="flex items-center gap-3 px-6 py-3 bg-muted/50 border border-border/50 rounded-full">
                  <Gamepad2 className="w-5 h-5 text-secondary" />
                  <span className="text-sm font-medium text-muted-foreground">Also Available</span>
                </div>
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
              </div>
            </ScrollReveal>

            <ScrollReveal animation="fade-up">
              <div className="text-center mb-16">
                <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-secondary/10 to-secondary/5 border border-secondary/20 rounded-full text-sm font-medium text-secondary mb-6">
                  <span className="w-2 h-2 bg-secondary rounded-full animate-pulse" />
                  Esports & Gaming Services
                </div>
                <h2 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
                  Gaming <span className="bg-gradient-to-r from-secondary to-secondary/60 bg-clip-text text-transparent">Services</span>
                </h2>
                <p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
                  Professional esports services to elevate your gaming events and competitive experiences.
                </p>
              </div>
            </ScrollReveal>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {esportsServicesData.map((service, index) => (
                <ServiceCard key={`esports-${index}`} service={service} index={index} />
              ))}
            </div>
          </>
        )}

        <ScrollReveal animation="fade-up" delay={200}>
          <div className="mt-24">
            <div className="relative max-w-4xl mx-auto">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-primary/10 to-secondary/20 rounded-3xl blur-2xl" />
              
              <div className="relative bg-gradient-to-br from-card via-card to-card/80 border border-border/50 rounded-3xl p-8 sm:p-12 lg:p-16 overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-primary/10 to-transparent rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-secondary/10 to-transparent rounded-full blur-2xl" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
                
                <div className="relative z-10 text-center">
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 text-primary rounded-full text-sm font-medium mb-8">
                    <Briefcase className="w-4 h-4" />
                    My Portfolio
                  </div>
                  <h3 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
                    Want to See My <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Work</span>?
                  </h3>
                  <p className="text-muted-foreground text-lg mb-10 max-w-xl mx-auto leading-relaxed">
                    Check out my portfolio to see real projects I've delivered. From websites to designs, explore the work that speaks for itself.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center flex-wrap">
                    {portfolioLinks.length > 0 ? (
                      portfolioLinks.map((link) => {
                        const IconComponent = getPortfolioIcon(link.icon);
                        return (
                          <Button key={link.id} size="lg" className="px-8 h-12 text-base group" asChild>
                            <a 
                              href={link.url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                            >
                              <IconComponent className="w-5 h-5 mr-2" />
                              {link.title || 'View My Work'}
                              <ExternalLink className="w-4 h-4 ml-2 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                            </a>
                          </Button>
                        );
                      })
                    ) : (
                      <Button size="lg" className="px-8 h-12 text-base group" asChild>
                        <a 
                          href="https://www.behance.net/jaypatel351" 
                          target="_blank" 
                          rel="noopener noreferrer"
                        >
                          <Briefcase className="w-5 h-5 mr-2" />
                          View My Work
                          <ExternalLink className="w-4 h-4 ml-2 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                        </a>
                      </Button>
                    )}
                    <Button variant="outline" size="lg" className="px-8 h-12 text-base group" asChild>
                      <Link to="/contact">
                        Get in Touch
                        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </Button>
                  </div>

                  <div className="mt-10 pt-10 border-t border-border/40">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20 text-primary rounded-full text-sm font-medium mb-4">
                      <Sparkles className="w-4 h-4" />
                      Pricing & Packages
                    </div>
                    <h4 className="font-heading text-2xl sm:text-3xl font-bold mb-3">
                      Explore My <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Packages</span>
                    </h4>
                    <p className="text-muted-foreground mb-6 max-w-lg mx-auto">
                      Transparent pricing with flexible tiers — from starter websites to full-scale business solutions.
                    </p>
                    <Button size="lg" className="px-8 h-12 text-base group bg-gradient-to-r from-primary to-secondary hover:opacity-90" asChild>
                      <a href="/plans">
                        <Sparkles className="w-5 h-5 mr-2" />
                        See Packages
                        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                      </a>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};