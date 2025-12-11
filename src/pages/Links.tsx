import { useLinktree } from '@/hooks/useLinktree';
import { Helmet } from 'react-helmet-async';
import { 
  Globe, Linkedin, Github, Instagram, MessageCircle, 
  Link, Mail, Phone, Youtube, Twitter, Facebook,
  ExternalLink, Sparkles
} from 'lucide-react';
import { cn } from '@/lib/utils';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
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

  const getGlowClass = () => {
    switch (settings.glow_intensity) {
      case 'low':
        return 'shadow-lg shadow-primary/10';
      case 'high':
        return 'shadow-2xl shadow-primary/40';
      default:
        return 'shadow-xl shadow-primary/25';
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
    const baseClasses = 'w-full px-6 py-4 flex items-center gap-4 transition-all duration-300 group relative overflow-hidden';
    
    const shapeClasses = {
      pill: 'rounded-full',
      rounded: 'rounded-2xl',
      square: 'rounded-lg',
    };

    const styleClasses = {
      solid: `bg-[${link.button_color}] hover:brightness-110 text-white`,
      outline: `border-2 border-[${link.button_color}] bg-transparent hover:bg-[${link.button_color}]/10 text-white`,
      neon: `bg-[${link.button_color}]/20 border border-[${link.button_color}] shadow-[0_0_20px_${link.button_color}40] hover:shadow-[0_0_30px_${link.button_color}60] text-white`,
      minimal: `bg-white/5 hover:bg-white/10 text-white border border-white/10`,
    };

    return cn(
      baseClasses,
      shapeClasses[link.button_shape],
      link.animation_enabled && 'hover:scale-[1.02] hover:-translate-y-1',
      settings.enable_glassmorphism && 'backdrop-blur-sm'
    );
  };

  if (isLoading) {
    return (
      <div className={cn('min-h-screen flex items-center justify-center', getBackgroundClass())}>
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
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
        {/* 3D Floating Elements */}
        {settings.enable_3d_elements && (
          <>
            <div className="absolute top-20 left-10 w-32 h-32 bg-primary/20 rounded-full blur-3xl animate-pulse" />
            <div className="absolute top-40 right-20 w-24 h-24 bg-secondary/30 rounded-full blur-2xl animate-float-1" />
            <div className="absolute bottom-40 left-20 w-40 h-40 bg-accent/20 rounded-full blur-3xl animate-float-2" />
            <div className="absolute bottom-20 right-10 w-20 h-20 bg-primary/30 rounded-full blur-2xl animate-float-3" />
            
            {/* Floating particles */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {[...Array(20)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-1 h-1 bg-primary/40 rounded-full animate-pulse"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    animationDelay: `${Math.random() * 3}s`,
                    animationDuration: `${2 + Math.random() * 3}s`,
                  }}
                />
              ))}
            </div>
          </>
        )}

        {/* Content */}
        <div className="relative z-10 max-w-md mx-auto px-4 py-12">
          {/* Profile Header */}
          <div className="text-center mb-10">
            {/* Profile Image */}
            <div className={cn('relative inline-block mb-6', getGlowClass())}>
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary via-secondary to-accent blur-md opacity-60 animate-pulse" />
              <div className="relative w-28 h-28 rounded-full overflow-hidden border-4 border-primary/50">
                <img
                  src={settings.profile_image}
                  alt={settings.page_title}
                  className="w-full h-full object-cover"
                />
              </div>
              <Sparkles className="absolute -top-1 -right-1 w-6 h-6 text-primary animate-pulse" />
            </div>

            {/* Name & Titles */}
            <h1 className="text-2xl font-bold text-white mb-2 bg-gradient-to-r from-white via-primary-foreground to-primary bg-clip-text">
              {settings.page_title}
            </h1>
            <p className="text-muted-foreground text-sm leading-relaxed">
              {settings.page_subtitle}
            </p>
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
                  className={getButtonClasses(link)}
                  style={{
                    backgroundColor: link.button_style === 'solid' ? link.button_color : undefined,
                    borderColor: ['outline', 'neon'].includes(link.button_style) ? link.button_color : undefined,
                    boxShadow: link.button_style === 'neon' ? `0 0 20px ${link.button_color}40` : undefined,
                    animationDelay: `${index * 0.1}s`,
                  }}
                >
                  {/* Hover glow effect */}
                  <div 
                    className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-300 rounded-inherit"
                    style={{ backgroundColor: link.button_color }}
                  />
                  
                  <IconComponent 
                    className="w-6 h-6 shrink-0 relative z-10" 
                    style={{ color: link.icon_color }}
                  />
                  
                  <div className="flex-1 text-left relative z-10">
                    <div className="font-semibold text-white">{link.title}</div>
                    {link.subtitle && (
                      <div className="text-xs text-white/60">{link.subtitle}</div>
                    )}
                  </div>
                  
                  <ExternalLink className="w-4 h-4 text-white/40 group-hover:text-white/80 transition-colors relative z-10" />
                </a>
              );
            })}
          </div>

          {/* Footer */}
          <div className="mt-12 text-center">
            <p className="text-muted-foreground/50 text-xs">
              © {new Date().getFullYear()} {settings.page_title}
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Links;
