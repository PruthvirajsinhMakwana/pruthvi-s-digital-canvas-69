import { Globe, Palette, Video, Megaphone, Layers, PenTool, Mic, Trophy, Gamepad2, Radio, Users, Calendar, ExternalLink, Briefcase } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollReveal } from '@/hooks/useScrollReveal';
import { Link } from 'react-router-dom';
import { useSiteSettings } from '@/hooks/useSiteSettings';
const itServices = [
  {
    icon: Globe,
    title: 'Web Development',
    description: 'Clean, responsive, and fast websites built for performance and user experience.',
    deliverables: ['Landing Pages', 'Portfolio Sites', 'Business Websites', 'Website Redesign', 'Maintenance & Optimization'],
    color: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
    iconBg: 'bg-blue-500',
  },
  {
    icon: Megaphone,
    title: 'Digital Marketing',
    description: 'Strategies that boost reach, engagement, and brand visibility.',
    deliverables: ['Social Media Strategy', 'SEO Optimization', 'Content Planning', 'Ad Creatives', 'Analytics Reports'],
    color: 'bg-green-500/10 text-green-500 border-green-500/20',
    iconBg: 'bg-green-500',
  },
  {
    icon: Palette,
    title: 'Graphic Design',
    description: 'Creative visuals that communicate brand identity and attract attention.',
    deliverables: ['Logos & Branding', 'Posters & Flyers', 'Social Media Creatives', 'Thumbnails & Banners'],
    color: 'bg-pink-500/10 text-pink-500 border-pink-500/20',
    iconBg: 'bg-pink-500',
  },
  {
    icon: Video,
    title: 'Video Editing',
    description: 'Engaging videos for businesses, personal brands, and social platforms.',
    deliverables: ['Short Reels', 'Promotional Videos', 'Editing + Color Correction', 'Motion Graphic Elements'],
    color: 'bg-red-500/10 text-red-500 border-red-500/20',
    iconBg: 'bg-red-500',
  },
  {
    icon: Layers,
    title: 'UI/UX Design',
    description: 'User-centered design that creates intuitive and delightful digital experiences.',
    deliverables: ['Wireframes', 'Prototypes', 'User Research', 'Interface Design'],
    color: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
    iconBg: 'bg-purple-500',
  },
  {
    icon: PenTool,
    title: 'IT Support & Technical Assistance',
    description: 'Basic troubleshooting, software setup, and digital workflow assistance.',
    deliverables: ['Software Setup', 'Troubleshooting', 'Digital Workflow', 'Productivity Tools'],
    color: 'bg-orange-500/10 text-orange-500 border-orange-500/20',
    iconBg: 'bg-orange-500',
  },
];

const esportsServices = [
  {
    icon: Mic,
    title: 'Esports Commentary',
    description: 'Professional play-by-play and color commentary for competitive gaming events.',
    deliverables: ['Live Match Commentary', 'Play-by-Play Analysis', 'Color Commentary', 'Post-Match Breakdown'],
    color: 'bg-violet-500/10 text-violet-500 border-violet-500/20',
    iconBg: 'bg-violet-500',
  },
  {
    icon: Radio,
    title: 'Event Hosting',
    description: 'Energetic hosting for gaming events, award shows, and esports broadcasts.',
    deliverables: ['Stage Hosting', 'Broadcast Presenting', 'Interview Segments', 'Panel Moderation'],
    color: 'bg-cyan-500/10 text-cyan-500 border-cyan-500/20',
    iconBg: 'bg-cyan-500',
  },
  {
    icon: Trophy,
    title: 'Tournament Organization',
    description: 'End-to-end tournament management from planning to execution.',
    deliverables: ['Event Planning', 'Ruleset Creation', 'Bracket Management', 'Production Support'],
    color: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
    iconBg: 'bg-amber-500',
  },
  {
    icon: Gamepad2,
    title: 'Gaming Content Creation',
    description: 'Engaging gaming content for YouTube, Twitch, and social media platforms.',
    deliverables: ['YouTube Videos', 'Stream Content', 'Gaming Reviews', 'Tutorial Content'],
    color: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
    iconBg: 'bg-emerald-500',
  },
  {
    icon: Users,
    title: 'Player & Team Management',
    description: 'Coordination and support for esports teams and individual players.',
    deliverables: ['Team Coordination', 'Schedule Management', 'Communication', 'Event Logistics'],
    color: 'bg-rose-500/10 text-rose-500 border-rose-500/20',
    iconBg: 'bg-rose-500',
  },
  {
    icon: Calendar,
    title: 'Community Events',
    description: 'Building and managing gaming communities through events and engagement.',
    deliverables: ['Community Tournaments', 'Watch Parties', 'Gaming Meetups', 'Online Leagues'],
    color: 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20',
    iconBg: 'bg-indigo-500',
  },
];

interface ServiceCardProps {
  service: typeof itServices[0];
  index: number;
}

const ServiceCard = ({ service, index }: ServiceCardProps) => (
  <ScrollReveal animation="fade-up" delay={index * 80}>
    <div className="group relative bg-card border border-border rounded-2xl p-6 hover:border-primary/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl h-full">
      {/* Icon */}
      <div className={`w-14 h-14 rounded-xl ${service.iconBg} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
        <service.icon className="w-7 h-7 text-white" />
      </div>

      {/* Content */}
      <h3 className="font-heading text-lg font-bold mb-2 group-hover:text-primary transition-colors">
        {service.title}
      </h3>
      <p className="text-muted-foreground text-sm mb-4 leading-relaxed">
        {service.description}
      </p>

      {/* Deliverables */}
      <div className="space-y-1.5">
        {service.deliverables.map((item, i) => (
          <div key={i} className="flex items-center gap-2 text-xs text-muted-foreground">
            <div className={`w-1.5 h-1.5 rounded-full ${service.iconBg}`} />
            {item}
          </div>
        ))}
      </div>
    </div>
  </ScrollReveal>
);

interface ServicesSectionProps {
  showBothCategories?: boolean;
}

export const ServicesSection = ({ showBothCategories = false }: ServicesSectionProps) => {
  const { settings } = useSiteSettings();
  const portfolioLinks = settings.portfolioLinks || [];

  return (
    <section id="services" className="py-24 relative overflow-hidden bg-gradient-to-b from-background via-muted/20 to-background">
      {/* Background */}
      <div className="absolute top-1/4 right-0 w-96 h-96 bg-secondary/5 rounded-full blur-[120px]" />
      <div className="absolute bottom-1/4 left-0 w-80 h-80 bg-primary/5 rounded-full blur-[100px]" />

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        {/* IT Services Section */}
        <ScrollReveal animation="fade-up">
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium mb-4">
              💻 IT & Digital Services
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
              Digital <span className="text-primary">Solutions</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Comprehensive digital solutions tailored to help your brand stand out and succeed online.
            </p>
          </div>
        </ScrollReveal>

        {/* IT Services Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
          {itServices.map((service, index) => (
            <ServiceCard key={index} service={service} index={index} />
          ))}
        </div>

        {showBothCategories && (
          <>
            {/* Divider */}
            <div className="flex items-center gap-4 mb-20">
              <div className="flex-1 h-px bg-border" />
              <span className="text-muted-foreground text-sm">Also Available</span>
              <div className="flex-1 h-px bg-border" />
            </div>

            {/* Esports Services Section */}
            <ScrollReveal animation="fade-up">
              <div className="text-center mb-12">
                <span className="inline-block px-4 py-2 bg-secondary/10 text-secondary rounded-full text-sm font-medium mb-4">
                  🎮 Esports & Gaming Services
                </span>
                <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
                  Gaming <span className="text-secondary">Services</span>
                </h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  Professional esports services to elevate your gaming events and competitive experiences.
                </p>
              </div>
            </ScrollReveal>

            {/* Esports Services Grid */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {esportsServices.map((service, index) => (
                <ServiceCard key={index} service={service} index={index} />
              ))}
            </div>
          </>
        )}

        {/* Portfolio CTA Section */}
        <ScrollReveal animation="fade-up" delay={200}>
          <div className="mt-16">
            <div className="bg-gradient-to-br from-primary/5 via-card to-secondary/5 border border-border rounded-3xl p-8 sm:p-12 max-w-4xl mx-auto relative overflow-hidden">
              {/* Background decoration */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-secondary/10 rounded-full blur-2xl" />
              
              <div className="relative z-10 text-center">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium mb-6">
                  <Briefcase className="w-4 h-4" />
                  My Portfolio
                </div>
                <h3 className="font-heading text-2xl sm:text-3xl font-bold mb-4">
                  Want to See My Work?
                </h3>
                <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
                  Check out my portfolio to see real projects I've delivered. From websites to designs, explore the work that speaks for itself.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center flex-wrap">
                  {portfolioLinks.length > 0 ? (
                    portfolioLinks.map((link) => (
                      <Button key={link.id} size="lg" className="px-8 group" asChild>
                        <a 
                          href={link.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                        >
                          <Briefcase className="w-5 h-5 mr-2" />
                          {link.title || 'View My Work'}
                          <ExternalLink className="w-4 h-4 ml-2 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                        </a>
                      </Button>
                    ))
                  ) : (
                    <Button size="lg" className="px-8 group" asChild>
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
                  <Button variant="outline" size="lg" className="px-8" asChild>
                    <Link to="/contact">Get in Touch</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};