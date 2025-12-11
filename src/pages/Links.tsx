import { useLinktree } from '@/hooks/useLinktree';
import { Helmet } from 'react-helmet-async';
import { 
  Globe, Linkedin, Github, Instagram, MessageCircle, 
  Link, Mail, Phone, Youtube, Twitter, Facebook,
  ExternalLink, Sparkles
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

const Links = () => {
  const { links, settings, isLoading } = useLinktree();

  const getBackgroundClass = () => {
    switch (settings.background_theme) {
      case 'dark':
        return 'bg-[#0a0a0f]';
      case 'light':
        return 'bg-gradient-to-br from-slate-100 to-white';
      default:
        return 'bg-gradient-to-br from-[#0a0a0f] via-[#1a0a2e] to-[#0f1a2e]';
    }
  };

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
    const baseClasses = 'w-full px-6 py-4 flex items-center gap-4 transition-all duration-500 group relative overflow-hidden';
    
    const shapeClasses = {
      pill: 'rounded-full',
      rounded: 'rounded-2xl',
      square: 'rounded-lg',
    };

    return cn(
      baseClasses,
      shapeClasses[link.button_shape],
      link.animation_enabled && 'hover:scale-[1.03] hover:-translate-y-1',
      settings.enable_glassmorphism && 'backdrop-blur-md',
      'border border-white/10'
    );
  };

  const getButtonStyle = (link: typeof links[0]): React.CSSProperties => {
    const baseStyle: React.CSSProperties = {};

    switch (link.button_style) {
      case 'solid':
        return {
          ...baseStyle,
          backgroundColor: link.button_color,
        };
      case 'outline':
        return {
          ...baseStyle,
          backgroundColor: 'transparent',
          borderColor: link.button_color,
          borderWidth: '2px',
        };
      case 'neon':
        return {
          ...baseStyle,
          backgroundColor: `${link.button_color}20`,
          borderColor: link.button_color,
          boxShadow: `0 0 25px ${link.button_color}50, inset 0 0 20px ${link.button_color}10`,
        };
      case 'minimal':
        return {
          ...baseStyle,
          backgroundColor: 'rgba(255,255,255,0.05)',
        };
      default:
        return baseStyle;
    }
  };

  if (isLoading) {
    return (
      <div className={cn('min-h-screen flex items-center justify-center', getBackgroundClass())}>
        <div className="relative">
          <div className="w-12 h-12 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
          <div className="absolute inset-0 w-12 h-12 border-2 border-secondary/20 border-b-secondary rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }} />
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

      <div className={cn('min-h-screen relative overflow-hidden', getBackgroundClass(), getFontClass())}>
        {/* Animated Background Elements */}
        {settings.enable_3d_elements && (
          <>
            {/* Large gradient orbs */}
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/30 rounded-full blur-[120px] animate-pulse" />
            <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-secondary/25 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '1s' }} />
            <div className="absolute top-1/2 left-0 w-64 h-64 bg-accent/20 rounded-full blur-[80px] animate-float-1" />
            <div className="absolute top-1/3 right-0 w-48 h-48 bg-primary/20 rounded-full blur-[60px] animate-float-2" />
            
            {/* Floating spheres */}
            <div className="absolute top-20 left-[10%] w-4 h-4 bg-primary/60 rounded-full animate-float-3 shadow-lg shadow-primary/50" />
            <div className="absolute top-40 right-[15%] w-3 h-3 bg-secondary/70 rounded-full animate-float-1 shadow-lg shadow-secondary/50" />
            <div className="absolute bottom-32 left-[20%] w-5 h-5 bg-accent/50 rounded-full animate-float-2 shadow-lg shadow-accent/50" />
            <div className="absolute bottom-48 right-[25%] w-2 h-2 bg-primary/80 rounded-full animate-float-4 shadow-lg shadow-primary/50" />
            
            {/* Grid overlay */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(135,60,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(135,60,255,0.03)_1px,transparent_1px)] bg-[size:50px_50px]" />
            
            {/* Floating particles */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {[...Array(30)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-1 h-1 bg-gradient-to-r from-primary/60 to-secondary/60 rounded-full"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    animation: `pulse ${2 + Math.random() * 3}s ease-in-out infinite`,
                    animationDelay: `${Math.random() * 3}s`,
                  }}
                />
              ))}
            </div>
          </>
        )}

        {/* Content */}
        <div className="relative z-10 max-w-md mx-auto px-4 py-12 sm:py-16">
          {/* Profile Header */}
          <div className="text-center mb-12 animate-fade-in">
            {/* Profile Image with Glow */}
            <div className="relative inline-block mb-8">
              {/* Outer glow rings */}
              <div className="absolute -inset-4 rounded-full bg-gradient-to-r from-primary via-secondary to-accent opacity-30 blur-xl animate-pulse" />
              <div className="absolute -inset-2 rounded-full bg-gradient-to-r from-primary to-secondary opacity-50 blur-md animate-pulse" style={{ animationDelay: '0.5s' }} />
              
              {/* Rotating border */}
              <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-primary via-secondary to-accent animate-spin" style={{ animationDuration: '8s' }} />
              
              {/* Image container */}
              <div className="relative w-32 h-32 sm:w-36 sm:h-36 rounded-full overflow-hidden border-4 border-background">
                <img
                  src={profileImage}
                  alt={settings.page_title}
                  className="w-full h-full object-cover object-[center_20%]"
                />
              </div>
              
              {/* Sparkle decorations */}
              <Sparkles className="absolute -top-2 -right-2 w-6 h-6 text-primary animate-pulse" />
              <Sparkles className="absolute -bottom-1 -left-1 w-5 h-5 text-secondary animate-pulse" style={{ animationDelay: '0.5s' }} />
            </div>

            {/* Name with gradient */}
            <h1 className="text-2xl sm:text-3xl font-bold mb-3 bg-gradient-to-r from-white via-primary-foreground to-primary/80 bg-clip-text text-transparent">
              {settings.page_title}
            </h1>
            
            {/* Titles */}
            <div className="space-y-1">
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

          {/* Links */}
          <div className="space-y-4">
            {links.filter(l => l.is_visible).map((link, index) => {
              const IconComponent = iconMap[link.icon] || Link;
              
              return (
                <a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(getButtonClasses(link), 'animate-fade-in')}
                  style={{
                    ...getButtonStyle(link),
                    animationDelay: `${0.3 + index * 0.1}s`,
                    animationFillMode: 'backwards',
                  }}
                >
                  {/* Shimmer effect on hover */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <div 
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"
                    />
                  </div>
                  
                  {/* Glow effect on hover */}
                  <div 
                    className="absolute inset-0 opacity-0 group-hover:opacity-30 transition-opacity duration-300 rounded-inherit blur-xl"
                    style={{ backgroundColor: link.button_color }}
                  />
                  
                  {/* Icon */}
                  <div 
                    className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 relative z-10 transition-transform duration-300 group-hover:scale-110"
                    style={{ 
                      backgroundColor: link.button_style === 'solid' ? 'rgba(255,255,255,0.15)' : `${link.button_color}30`,
                    }}
                  >
                    <IconComponent 
                      className="w-5 h-5" 
                      style={{ color: link.icon_color }}
                    />
                  </div>
                  
                  {/* Text */}
                  <div className="flex-1 text-left relative z-10">
                    <div className="font-semibold text-white text-base">{link.title}</div>
                    {link.subtitle && (
                      <div className="text-xs text-white/50 mt-0.5">{link.subtitle}</div>
                    )}
                  </div>
                  
                  {/* Arrow */}
                  <ExternalLink className="w-4 h-4 text-white/30 group-hover:text-white/70 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-300 relative z-10" />
                </a>
              );
            })}
          </div>

          {/* Footer */}
          <div className="mt-16 text-center animate-fade-in" style={{ animationDelay: '0.8s' }}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10">
              <Sparkles className="w-3 h-3 text-primary" />
              <p className="text-muted-foreground/60 text-xs">
                © {new Date().getFullYear()} {settings.page_title}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Links;
