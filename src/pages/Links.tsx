import { useLinktree } from '@/hooks/useLinktree';
import { Helmet } from 'react-helmet-async';
import { 
  Globe, Linkedin, Github, Instagram, MessageCircle, 
  Link, Mail, Phone, Youtube, Twitter, Facebook,
  ExternalLink, Sparkles, Code, Palette, Video, Gamepad2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import profileImage from '@/assets/profile-hero.png';

const iconMap: Record<string, React.ComponentType<{ className?: string; style?: React.CSSProperties }>> = {
  globe: Globe,
  linkedin: Linkedin,
  github: Github,
  instagram: Instagram,
  'message-circle': MessageCircle,
  link: Link,
  mail: Mail,
  phone: Phone,
  youtube: Youtube,
  twitter: Twitter,
  facebook: Facebook,
  external: ExternalLink,
};

// Floating skill card component matching portfolio design
const FloatingCard = ({ icon: Icon, label, className, delay = 0 }: { 
  icon: React.ComponentType<{ className?: string }>; 
  label: string; 
  className?: string;
  delay?: number;
}) => (
  <div 
    className={cn(
      "glass-card rounded-xl p-3 flex items-center gap-2.5 neon-glow",
      "transition-all duration-300 ease-out",
      "hover:scale-110 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/20",
      "hover:border-primary/40 hover:bg-card/80 cursor-pointer group",
      className
    )}
    style={{ animationDelay: `${delay}s` }}
  >
    <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center
      transition-all duration-300 group-hover:from-primary/40 group-hover:to-secondary/40 group-hover:scale-110">
      <Icon className="w-4 h-4 text-primary transition-all duration-300 group-hover:drop-shadow-[0_0_8px_rgba(139,92,246,0.6)]" />
    </div>
    <span className="font-medium text-foreground text-xs transition-all duration-300 group-hover:text-primary">{label}</span>
  </div>
);

const Links = () => {
  const { links, settings, isLoading } = useLinktree();

  const getFontClass = () => {
    switch (settings.font_family) {
      case 'montserrat':
        return 'font-heading';
      case 'inter':
        return 'font-sans';
      default:
        return 'font-heading';
    }
  };

  const getButtonClasses = (link: typeof links[0]) => {
    const baseClasses = 'w-full px-5 py-4 flex items-center gap-4 transition-all duration-500 group relative overflow-hidden';
    
    const shapeClasses = {
      pill: 'rounded-full',
      rounded: 'rounded-2xl',
      square: 'rounded-xl',
    };

    return cn(
      baseClasses,
      shapeClasses[link.button_shape],
      link.animation_enabled && 'hover:scale-[1.02] hover:-translate-y-1',
      'backdrop-blur-xl border border-white/10',
      'shadow-lg shadow-black/10'
    );
  };

  const getButtonStyle = (link: typeof links[0]): React.CSSProperties => {
    switch (link.button_style) {
      case 'solid':
        return {
          backgroundColor: link.button_color,
          boxShadow: `0 8px 32px ${link.button_color}40`,
        };
      case 'outline':
        return {
          backgroundColor: 'rgba(255,255,255,0.03)',
          borderColor: link.button_color,
          borderWidth: '2px',
        };
      case 'neon':
        return {
          backgroundColor: `${link.button_color}15`,
          borderColor: link.button_color,
          boxShadow: `0 0 30px ${link.button_color}40, inset 0 0 30px ${link.button_color}10`,
        };
      case 'minimal':
        return {
          backgroundColor: 'rgba(255,255,255,0.05)',
        };
      default:
        return {};
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0a0a0f] via-[#1a0a2e] to-[#0f1a2e] flex items-center justify-center">
        <div className="relative">
          <div className="w-14 h-14 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
          <div className="absolute inset-0 w-14 h-14 border-2 border-secondary/20 border-b-secondary rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }} />
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{settings.page_title} | Links</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className={cn('min-h-screen relative overflow-hidden', getFontClass())}>
        {/* Animated Mesh Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0a0a0f] via-[#1a0a2e] to-[#0f1a2e]" />
        
        {/* Animated gradient mesh overlay */}
        <div 
          className="absolute inset-0 opacity-60 animate-mesh-gradient"
          style={{
            background: `
              radial-gradient(ellipse at 20% 20%, hsl(270 100% 50% / 0.25) 0%, transparent 50%),
              radial-gradient(ellipse at 80% 30%, hsl(220 100% 60% / 0.2) 0%, transparent 40%),
              radial-gradient(ellipse at 40% 80%, hsl(280 80% 55% / 0.2) 0%, transparent 45%),
              radial-gradient(ellipse at 90% 90%, hsl(270 100% 50% / 0.15) 0%, transparent 50%)
            `,
            backgroundSize: '400% 400%',
          }}
        />

        {/* Wave Pattern Overlay */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <svg className="absolute w-[200%] h-full opacity-10" viewBox="0 0 1440 320" preserveAspectRatio="none">
            <defs>
              <linearGradient id="wave-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="hsl(270, 100%, 62%)" />
                <stop offset="50%" stopColor="hsl(280, 80%, 55%)" />
                <stop offset="100%" stopColor="hsl(220, 100%, 65%)" />
              </linearGradient>
            </defs>
            <path 
              className="animate-wave-flow"
              fill="url(#wave-gradient)" 
              d="M0,160L48,165.3C96,171,192,181,288,170.7C384,160,480,128,576,128C672,128,768,160,864,165.3C960,171,1056,149,1152,133.3C1248,117,1344,107,1392,101.3L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
            />
          </svg>
          <svg className="absolute w-[200%] h-full opacity-5 top-1/3" viewBox="0 0 1440 320" preserveAspectRatio="none">
            <path 
              className="animate-wave-flow"
              style={{ animationDelay: '-4s' }}
              fill="url(#wave-gradient)" 
              d="M0,96L48,112C96,128,192,160,288,165.3C384,171,480,149,576,128C672,107,768,85,864,90.7C960,96,1056,128,1152,138.7C1248,149,1344,139,1392,133.3L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
            />
          </svg>
        </div>

        {/* Tech Grid Pattern */}
        <div className="absolute inset-0 tech-grid opacity-20" />
        
        {/* Floating Gradient Orbs */}
        {settings.enable_3d_elements && (
          <>
            <div className="absolute top-[10%] left-[5%] w-72 h-72 rounded-full bg-primary/25 blur-[100px] animate-orb-float" />
            <div className="absolute top-[30%] right-[10%] w-64 h-64 rounded-full bg-secondary/20 blur-[80px] animate-orb-float" style={{ animationDelay: '-4s' }} />
            <div className="absolute bottom-[20%] left-[15%] w-80 h-80 rounded-full bg-accent/15 blur-[120px] animate-orb-float" style={{ animationDelay: '-8s' }} />
            <div className="absolute bottom-[10%] right-[5%] w-56 h-56 rounded-full bg-primary/20 blur-[90px] animate-orb-float" style={{ animationDelay: '-2s' }} />
            
            {/* Smaller floating spheres */}
            <div className="absolute top-[15%] left-[25%] w-4 h-4 rounded-full bg-primary shadow-lg shadow-primary/50 animate-float-1" />
            <div className="absolute top-[40%] right-[20%] w-3 h-3 rounded-full bg-secondary shadow-lg shadow-secondary/50 animate-float-2" />
            <div className="absolute bottom-[35%] left-[10%] w-5 h-5 rounded-full bg-accent shadow-lg shadow-accent/50 animate-float-3" />
            <div className="absolute bottom-[25%] right-[30%] w-2 h-2 rounded-full bg-primary shadow-lg shadow-primary/50 animate-float-4" />
            <div className="absolute top-[60%] left-[40%] w-3 h-3 rounded-full bg-secondary shadow-lg shadow-secondary/50 animate-float-1" style={{ animationDelay: '-2s' }} />
          </>
        )}

        {/* Floating Skill Cards - Desktop only */}
        <div className="hidden lg:block">
          <FloatingCard 
            icon={Code} 
            label="Developer" 
            className="absolute top-[18%] left-[8%] animate-float-1" 
            delay={0}
          />
          <FloatingCard 
            icon={Palette} 
            label="Designer" 
            className="absolute top-[25%] right-[10%] animate-float-2" 
            delay={0.5}
          />
          <FloatingCard 
            icon={Video} 
            label="Creator" 
            className="absolute bottom-[30%] left-[5%] animate-float-3" 
            delay={1}
          />
          <FloatingCard 
            icon={Gamepad2} 
            label="Esports" 
            className="absolute bottom-[20%] right-[8%] animate-float-4" 
            delay={1.5}
          />
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-md mx-auto px-4 py-12 sm:py-16">
          {/* Profile Header */}
          <div className="text-center mb-10 animate-fade-in-up">
            {/* Profile Image with Animated Glow Border */}
            <div className="relative inline-block mb-8">
              {/* Outer rotating glow ring */}
              <div className="absolute -inset-3 rounded-full bg-gradient-to-r from-primary via-secondary to-accent opacity-40 blur-xl animate-pulse" />
              
              {/* Rotating gradient border */}
              <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-primary via-secondary to-accent animate-rotate-slow opacity-80" />
              
              {/* Inner glow */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/30 to-secondary/30 blur-md" />
              
              {/* Image container */}
              <div className="relative w-32 h-32 sm:w-36 sm:h-36 rounded-full overflow-hidden border-4 border-background shadow-2xl shadow-primary/30">
                <div className="absolute inset-0 bg-gradient-to-t from-primary/30 via-transparent to-transparent z-10 pointer-events-none" />
                <img
                  src={profileImage}
                  alt={settings.page_title}
                  className="w-full h-full object-cover object-[center_20%]"
                />
              </div>
              
              {/* Sparkle decorations */}
              <Sparkles className="absolute -top-1 -right-1 w-6 h-6 text-primary animate-pulse drop-shadow-[0_0_10px_rgba(139,92,246,0.8)]" />
              <Sparkles className="absolute -bottom-1 -left-1 w-5 h-5 text-secondary animate-pulse drop-shadow-[0_0_10px_rgba(74,128,255,0.8)]" style={{ animationDelay: '0.5s' }} />
            </div>

            {/* Name with gradient */}
            <h1 className="text-2xl sm:text-3xl font-bold mb-2 gradient-text">
              {settings.page_title}
            </h1>
            
            {/* Animated Status Badge */}
            <div className="inline-flex items-center gap-2 glass-card rounded-full px-4 py-1.5 mb-4 animate-border-glow">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-lg shadow-green-500/50" />
              <span className="text-xs text-muted-foreground">Available for work</span>
            </div>
            
            {/* Titles */}
            <div className="space-y-0.5">
              {settings.page_subtitle.split('•').map((title, i) => (
                <p 
                  key={i} 
                  className="text-muted-foreground text-sm animate-fade-in"
                  style={{ animationDelay: `${0.2 + i * 0.1}s` }}
                >
                  {title.trim()}
                </p>
              ))}
            </div>
          </div>

          {/* Links Container */}
          <div className="space-y-3 sm:space-y-4">
            {links.filter(l => l.is_visible).map((link, index) => {
              const IconComponent = iconMap[link.icon] || Link;
              
              return (
                <a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(getButtonClasses(link), 'animate-fade-in-up')}
                  style={{
                    ...getButtonStyle(link),
                    animationDelay: `${0.3 + index * 0.08}s`,
                    animationFillMode: 'backwards',
                  }}
                >
                  {/* Shimmer effect on hover */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 overflow-hidden rounded-inherit">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent -translate-x-full group-hover:animate-shimmer" />
                  </div>
                  
                  {/* Background glow on hover */}
                  <div 
                    className="absolute inset-0 opacity-0 group-hover:opacity-25 transition-opacity duration-500 blur-xl rounded-inherit"
                    style={{ backgroundColor: link.button_color }}
                  />
                  
                  {/* Icon Container */}
                  <div 
                    className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 relative z-10 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3"
                    style={{ 
                      backgroundColor: link.button_style === 'solid' ? 'rgba(255,255,255,0.2)' : `${link.button_color}25`,
                      boxShadow: `0 0 20px ${link.button_color}30`,
                    }}
                  >
                    <IconComponent 
                      className="w-5 h-5 transition-all duration-300 group-hover:scale-110" 
                      style={{ color: link.icon_color }}
                    />
                  </div>
                  
                  {/* Text */}
                  <div className="flex-1 text-left relative z-10">
                    <div className="font-semibold text-white text-base group-hover:text-white transition-colors">{link.title}</div>
                    {link.subtitle && (
                      <div className="text-xs text-white/50 mt-0.5 group-hover:text-white/70 transition-colors">{link.subtitle}</div>
                    )}
                  </div>
                  
                  {/* Arrow with animation */}
                  <ExternalLink className="w-4 h-4 text-white/30 group-hover:text-white/80 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-300 relative z-10" />
                </a>
              );
            })}
          </div>

          {/* Footer */}
          <div className="mt-14 text-center animate-fade-in" style={{ animationDelay: '0.8s' }}>
            <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full glass-card border border-primary/20">
              <Sparkles className="w-3.5 h-3.5 text-primary animate-pulse" />
              <p className="text-muted-foreground/70 text-xs font-medium">
                © {new Date().getFullYear()} {settings.page_title}
              </p>
              <Sparkles className="w-3.5 h-3.5 text-secondary animate-pulse" style={{ animationDelay: '0.5s' }} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Links;
