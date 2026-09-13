import { useMemo, useState } from 'react';
import { Globe, Palette, Video, Megaphone, Layers, PenTool, Mic, Trophy, Gamepad2, Radio, Users, Calendar, Code, LucideIcon, ArrowRight, CheckCircle2, Smartphone, Database, Cloud, Shield, Zap, LayoutGrid } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollReveal } from '@/hooks/useScrollReveal';
import { Link } from 'react-router-dom';
import { useSiteSettings } from '@/hooks/useSiteSettings';

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

const getServiceIcon = (iconName?: string): LucideIcon => serviceIconMap[iconName || 'globe'] || Globe;

type GroupId = 'websites' | 'design' | 'video' | 'marketing' | 'support' | 'esports';

const groups: { id: GroupId; label: string; icon: LucideIcon }[] = [
  { id: 'websites', label: 'Websites', icon: Globe },
  { id: 'design', label: 'Design', icon: Palette },
  { id: 'video', label: 'Video', icon: Video },
  { id: 'marketing', label: 'Marketing & SEO', icon: Megaphone },
  { id: 'support', label: 'IT Support', icon: PenTool },
  { id: 'esports', label: 'Esports', icon: Gamepad2 },
];

interface ServiceData {
  icon: LucideIcon;
  title: string;
  description: string;
  deliverables: string[];
  group: GroupId;
  linkUrl?: string;
}

const baseServices: ServiceData[] = [
  {
    icon: Globe,
    title: 'Web Development',
    description: 'Fast, responsive websites built for real business results.',
    deliverables: ['Landing Pages', 'Business Websites', 'Portfolio Sites', 'Redesign & Maintenance'],
    group: 'websites',
  },
  {
    icon: Layers,
    title: 'UI/UX Design',
    description: 'Clear, easy-to-use screens people actually enjoy using.',
    deliverables: ['Wireframes', 'Prototypes', 'Interface Design', 'User Research'],
    group: 'design',
  },
  {
    icon: Palette,
    title: 'Graphic Design',
    description: 'Brand visuals that look sharp everywhere they appear.',
    deliverables: ['Logos & Branding', 'Posters & Flyers', 'Social Creatives', 'Thumbnails'],
    group: 'design',
  },
  {
    icon: Video,
    title: 'Video Editing',
    description: 'Scroll-stopping edits for brands, reels and campaigns.',
    deliverables: ['Short Reels', 'Promo Videos', 'Motion Graphics', 'Colour Correction'],
    group: 'video',
  },
  {
    icon: Megaphone,
    title: 'Digital Marketing & SEO',
    description: 'More reach, better ranking and steady enquiries.',
    deliverables: ['SEO Optimisation', 'Social Media Strategy', 'Ad Creatives', 'Analytics & Reports'],
    group: 'marketing',
  },
  {
    icon: PenTool,
    title: 'IT Support',
    description: 'Setup, troubleshooting and smoother daily workflows.',
    deliverables: ['Software Setup', 'Troubleshooting', 'Workflow Automation', 'Productivity Tools'],
    group: 'support',
  },
  {
    icon: Mic,
    title: 'Esports Commentary',
    description: 'Live play-by-play and colour casting for competitive events.',
    deliverables: ['Live Commentary', 'Play-by-Play', 'Post-Match Analysis'],
    group: 'esports',
  },
  {
    icon: Radio,
    title: 'Event Hosting',
    description: 'High-energy hosting for gaming shows and broadcasts.',
    deliverables: ['Stage Hosting', 'Broadcast Presenting', 'Interviews', 'Panel Moderation'],
    group: 'esports',
  },
  {
    icon: Trophy,
    title: 'Tournament Organisation',
    description: 'End-to-end tournament planning and production.',
    deliverables: ['Event Planning', 'Ruleset Creation', 'Bracket Management', 'Production'],
    group: 'esports',
  },
];

const inferGroup = (title: string, category?: string): GroupId => {
  if (category && ['websites', 'design', 'video', 'marketing', 'support', 'esports'].includes(category)) {
    return category as GroupId;
  }
  if (category === 'esports') return 'esports';
  const t = title.toLowerCase();
  if (t.includes('web') || t.includes('app') || t.includes('site') || t.includes('develop')) return 'websites';
  if (t.includes('video') || t.includes('reel') || t.includes('shoot') || t.includes('edit')) return 'video';
  if (t.includes('design') || t.includes('brand') || t.includes('logo') || t.includes('ui')) return 'design';
  if (t.includes('market') || t.includes('seo') || t.includes('social') || t.includes('ads')) return 'marketing';
  return 'support';
};

const ServiceCard = ({ service, index }: { service: ServiceData; index: number }) => {
  const openLink = () => {
    if (!service.linkUrl) return;
    if (service.linkUrl.startsWith('http')) window.open(service.linkUrl, '_blank', 'noopener,noreferrer');
    else window.location.href = service.linkUrl;
  };

  return (
    <ScrollReveal animation="fade-up" delay={Math.min(index, 5) * 70}>
      <div className="group relative h-full bg-card border border-border/60 rounded-2xl p-6 lg:p-7 transition-all duration-300 hover:border-primary/40 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/5 flex flex-col">
        <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-5 transition-colors group-hover:bg-primary/15">
          <service.icon className="w-6 h-6 text-primary" strokeWidth={1.75} />
        </div>

        <h3 className="font-heading text-lg font-bold mb-2 group-hover:text-primary transition-colors">
          {service.title}
        </h3>
        <p className="text-muted-foreground text-sm leading-relaxed mb-5">{service.description}</p>

        <div className="space-y-2 mb-6">
          {service.deliverables.slice(0, 4).map((item, i) => (
            <div key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-primary/70" />
              <span>{item}</span>
            </div>
          ))}
        </div>

        <div className="mt-auto flex items-center gap-3">
          <Button size="sm" variant="outline" className="group/btn" asChild>
            <Link to="/contact">
              Enquire
              <ArrowRight className="w-4 h-4 ml-1.5 group-hover/btn:translate-x-0.5 transition-transform" />
            </Link>
          </Button>
          {service.linkUrl && (
            <button
              onClick={openLink}
              className="text-sm font-medium text-primary hover:underline"
              aria-label={`View ${service.title} work`}
            >
              View work
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
  const serviceLinks = settings.serviceLinks || [];
  const customServices = settings.customServices || [];

  const [active, setActive] = useState<GroupId | 'all'>('all');

  const allServices: ServiceData[] = useMemo(() => {
    const getLink = (name: string) => serviceLinks.find(l => l.serviceName === name)?.url;
    const custom: ServiceData[] = [...customServices]
      .filter(s => s.isVisible)
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
      .map(s => ({
        icon: getServiceIcon(s.icon),
        title: s.title,
        description: s.description,
        deliverables: (s.deliverables || []).filter(d => d.trim()),
        group: inferGroup(s.title, s.category),
        linkUrl: s.linkUrl,
      }));

    const customTitles = new Set(custom.map(service => service.title.trim().toLowerCase()));
    const base = baseServices
      .filter(service => !customTitles.has(service.title.trim().toLowerCase()))
      .map(service => ({ ...service, linkUrl: getLink(service.title) }));
    const combined = [...custom, ...base].filter((service, index, services) => {
      const key = service.title.trim().toLowerCase();
      return key.length > 0 && services.findIndex(item => item.title.trim().toLowerCase() === key) === index;
    });
    return showBothCategories ? combined : combined.filter(s => s.group !== 'esports');
  }, [customServices, serviceLinks, showBothCategories]);

  const availableGroups = useMemo(
    () => groups.filter(g => allServices.some(s => s.group === g.id)),
    [allServices]
  );

  const visible = active === 'all' ? allServices : allServices.filter(s => s.group === active);

  return (
    <section id="services" className="py-20 lg:py-28 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/10 to-background" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-primary/5 rounded-full blur-[150px]" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <ScrollReveal animation="fade-up">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary/10 border border-primary/20 rounded-full text-sm font-medium text-primary mb-6">
              <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
              What I Do
            </div>
            <h2 className="font-heading text-4xl sm:text-5xl font-bold mb-5">
              Services, <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">Sorted by Need</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
              Pick a category below to see exactly what you get — no clutter, no confusion.
            </p>
          </div>
        </ScrollReveal>

        {/* Category filter */}
        <ScrollReveal animation="fade-up" delay={80}>
          <div className="flex flex-wrap justify-center gap-2.5 mb-12">
            <Button
              type="button"
              size="sm"
              variant={active === 'all' ? 'default' : 'outline'}
              onClick={() => setActive('all')}
              className="rounded-full"
            >
              <LayoutGrid className="w-4 h-4" />
              All ({allServices.length})
            </Button>
            {availableGroups.map(g => {
              const count = allServices.filter(s => s.group === g.id).length;
              const isActive = active === g.id;
              return (
                <Button
                  type="button"
                  size="sm"
                  variant={isActive ? 'default' : 'outline'}
                  key={g.id}
                  onClick={() => setActive(g.id)}
                  className="rounded-full"
                >
                  <g.icon className="w-4 h-4" />
                  {g.label} ({count})
                </Button>
              );
            })}
          </div>
        </ScrollReveal>

        <div key={active} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {visible.map((service, index) => (
            <ServiceCard key={`${service.title}-${index}`} service={service} index={index} />
          ))}
        </div>

      </div>
    </section>
  );
};
