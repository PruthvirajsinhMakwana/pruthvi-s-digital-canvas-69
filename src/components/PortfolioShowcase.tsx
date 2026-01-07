import { ExternalLink, FolderOpen, Image, Palette, Video, Film, Sparkles, PlayCircle, FileVideo, Clapperboard, MonitorPlay, Camera, Brush, Type, Layout, Megaphone, Globe, Code, LucideIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollReveal } from '@/hooks/useScrollReveal';
import { useSiteSettings, PortfolioCategory } from '@/hooks/useSiteSettings';

const portfolioIconMap: Record<string, LucideIcon> = {
  image: Image,
  palette: Palette,
  video: Video,
  film: Film,
  sparkles: Sparkles,
  'play-circle': PlayCircle,
  'file-video': FileVideo,
  clapperboard: Clapperboard,
  'monitor-play': MonitorPlay,
  camera: Camera,
  brush: Brush,
  type: Type,
  layout: Layout,
  megaphone: Megaphone,
  globe: Globe,
  code: Code,
};

const getIcon = (iconName: string): LucideIcon => {
  return portfolioIconMap[iconName] || FolderOpen;
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

interface PortfolioCategoryCardProps {
  category: PortfolioCategory;
  index: number;
}

const PortfolioCategoryCard = ({ category, index }: PortfolioCategoryCardProps) => {
  const IconComponent = getIcon(category.icon);
  const shadowColor = getShadowColor(category.gradient);

  const handleClick = () => {
    if (category.driveLink) {
      window.open(category.driveLink, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <ScrollReveal animation="fade-up" delay={index * 100}>
      <div 
        onClick={handleClick}
        className={`group relative cursor-pointer bg-card/80 backdrop-blur-sm border border-border/50 rounded-2xl p-6 transition-all duration-500 hover:border-primary/30 hover:-translate-y-2 hover:shadow-2xl ${shadowColor}`}
      >
        <div className={`absolute inset-0 bg-gradient-to-br ${category.gradient} opacity-0 group-hover:opacity-[0.05] rounded-2xl transition-opacity duration-500`} />
        
        {/* Icon */}
        <div className={`relative w-14 h-14 rounded-2xl bg-gradient-to-br ${category.gradient} flex items-center justify-center mb-5 shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}>
          <IconComponent className="w-7 h-7 text-white" strokeWidth={1.5} />
        </div>

        {/* Title */}
        <h3 className="font-heading text-xl font-bold mb-2 group-hover:text-primary transition-colors duration-300">
          {category.title}
        </h3>
        
        {/* Description */}
        {category.description && (
          <p className="text-muted-foreground text-sm leading-relaxed mb-4">
            {category.description}
          </p>
        )}

        {/* View Button */}
        <div className="flex items-center gap-2 text-sm font-medium text-primary group-hover:gap-3 transition-all">
          <span>View Work</span>
          <ExternalLink className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-0.5 transition-transform" />
        </div>

        {/* Hover glow effect */}
        <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${category.gradient} opacity-0 group-hover:opacity-[0.03] blur-xl transition-opacity duration-500`} />
      </div>
    </ScrollReveal>
  );
};

export const PortfolioShowcase = () => {
  const { settings, isLoading } = useSiteSettings();
  const portfolioCategories = settings.portfolioCategories?.filter(c => c.isVisible) || [];

  if (isLoading || portfolioCategories.length === 0) {
    return null;
  }

  return (
    <section className="py-24 lg:py-32 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/5 to-background" />
      <div className="absolute top-1/4 left-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[150px]" />
      <div className="absolute bottom-1/4 right-0 w-[400px] h-[400px] bg-secondary/5 rounded-full blur-[120px]" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <ScrollReveal animation="fade-up">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 rounded-full text-sm font-medium text-primary mb-6">
              <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
              My Work Samples
            </div>
            <h2 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
              Explore My <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">Portfolio</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
              Browse through different categories of my work. Click on any category to view samples and projects.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {portfolioCategories.map((category, index) => (
            <PortfolioCategoryCard 
              key={category.id} 
              category={category} 
              index={index} 
            />
          ))}
        </div>

        <ScrollReveal animation="fade-up" delay={300}>
          <div className="mt-12 text-center">
            <p className="text-sm text-muted-foreground">
              <FolderOpen className="w-4 h-4 inline mr-2" />
              Click on any category to view my work samples
            </p>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};