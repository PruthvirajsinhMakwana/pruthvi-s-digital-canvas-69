import { useMemo, useState } from 'react';
import { ExternalLink, FolderOpen, Image, Palette, Video, Film, Sparkles, PlayCircle, FileVideo, Clapperboard, MonitorPlay, Camera, Brush, Type, Layout, Megaphone, Globe, Code, LucideIcon, Grid3X3, WandSparkles, Images, Play, Link2 } from 'lucide-react';
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

type WorkType = 'graphic-design' | 'video' | 'photo' | 'website' | 'ai' | 'other';

const filters: { id: 'all' | WorkType; label: string; icon: LucideIcon }[] = [
  { id: 'all', label: 'All Work', icon: Grid3X3 },
  { id: 'graphic-design', label: 'Graphic Design', icon: Palette },
  { id: 'video', label: 'Video', icon: Play },
  { id: 'photo', label: 'Photo', icon: Camera },
  { id: 'website', label: 'Websites', icon: Globe },
  { id: 'ai', label: 'AI Creative', icon: WandSparkles },
  { id: 'other', label: 'Other', icon: FolderOpen },
];

const inferWorkType = (item: PortfolioCategory): WorkType => {
  if (item.category) return item.category;
  const value = `${item.title} ${item.description} ${item.icon} ${item.driveLink}`.toLowerCase();
  if (/\b(ai|artificial|generated|prompt)\b/.test(value)) return 'ai';
  if (/\b(video|reel|film|edit|livestream|webinar|motion|youtube)\b/.test(value)) return 'video';
  if (/\b(photo|photography|shoot|camera|portrait)\b/.test(value)) return 'photo';
  if (/\b(web|website|landing|app|ui|ux|code|netlify|lovable)\b/.test(value)) return 'website';
  if (/\b(design|poster|graphic|logo|brand|creative|banner|thumbnail)\b/.test(value)) return 'graphic-design';
  return 'other';
};

const getSource = (url: string) => {
  const value = url.toLowerCase();
  if (value.includes('drive.google.com')) return 'Google Drive';
  if (value.includes('behance.net')) return 'Behance';
  if (value.includes('youtube.com') || value.includes('youtu.be')) return 'YouTube';
  if (value.includes('github.com')) return 'GitHub';
  return 'Live project';
};

interface PortfolioCategoryCardProps {
  category: PortfolioCategory;
  index: number;
  type: WorkType;
}

const PortfolioCategoryCard = ({ category, index, type }: PortfolioCategoryCardProps) => {
  const IconComponent = getIcon(category.icon);
  const typeLabel = filters.find(filter => filter.id === type)?.label || 'Other';
  const details = category.description.split(/[•\n]/).map(item => item.trim()).filter(Boolean);
  const summary = details[0];
  const highlights = details.slice(1, 3);

  return (
    <ScrollReveal animation="fade-up" delay={Math.min(index, 5) * 70} className="h-full">
      <a
        href={category.driveLink}
        target="_blank"
        rel="noopener noreferrer"
        className="group relative flex h-full min-h-[310px] flex-col overflow-hidden rounded-lg border border-border/70 bg-card transition-[transform,border-color,box-shadow] duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      >
        <div className={`relative flex items-center justify-center overflow-hidden border-b border-border/60 bg-muted/45 ${category.imageUrl ? 'aspect-video' : 'min-h-[96px] sm:min-h-[120px]'}`}>
          {category.imageUrl ? (
            <img
              src={category.imageUrl}
              alt={`${category.title} project preview`}
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
            />
          ) : (
            <>
              <div className="absolute inset-0 tech-grid opacity-30" />
              <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-card to-transparent" />
              <div className="relative flex h-16 w-16 items-center justify-center rounded-lg border border-primary/25 bg-background/70 text-primary shadow-neon transition-transform duration-300 group-hover:scale-105">
                <IconComponent className="h-8 w-8" strokeWidth={1.5} />
              </div>
            </>
          )}
          <span className="absolute left-4 top-4 rounded-md border border-border/70 bg-background/80 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-foreground backdrop-blur-md">
            {typeLabel}
          </span>
          <span className="absolute bottom-4 right-4 flex h-9 w-9 items-center justify-center rounded-full border border-border/70 bg-background/85 text-foreground backdrop-blur-md transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5">
            <ExternalLink className="h-4 w-4" />
          </span>
        </div>

        <div className="flex flex-1 flex-col p-5">
          <h3 className="font-heading text-lg font-bold leading-snug transition-colors duration-300 group-hover:text-primary">
            {category.title}
          </h3>
          {summary && <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted-foreground">{summary}</p>}
          {highlights.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {highlights.map(item => (
                <span key={item} className="rounded-md bg-muted px-2 py-1 text-[11px] text-muted-foreground">
                  {item}
                </span>
              ))}
            </div>
          )}
          <div className="mt-auto flex items-center gap-2 pt-5 text-xs font-medium text-primary">
            <Link2 className="h-3.5 w-3.5" />
            {getSource(category.driveLink)}
          </div>
        </div>
      </a>
    </ScrollReveal>
  );
};

export const PortfolioShowcase = () => {
  const { settings, isLoading } = useSiteSettings();
  const [active, setActive] = useState<'all' | WorkType>('all');
  const [showAll, setShowAll] = useState(false);
  const INITIAL_COUNT = 8;
  const portfolioCategories = useMemo(() => (settings.portfolioCategories || [])
    .filter(item => item.isVisible && item.title.trim() && item.driveLink.trim())
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
    .filter((item, index, items) => items.findIndex(candidate => candidate.driveLink.trim().toLowerCase() === item.driveLink.trim().toLowerCase()) === index)
    .map(item => ({ ...item, workType: inferWorkType(item) })), [settings.portfolioCategories]);
  const availableFilters = filters.filter(filter => filter.id === 'all' || portfolioCategories.some(item => item.workType === filter.id));
  const visibleItems = active === 'all' ? portfolioCategories : portfolioCategories.filter(item => item.workType === active);

  if (isLoading || portfolioCategories.length === 0) {
    return null;
  }

  return (
    <section className="relative overflow-hidden border-y border-border/50 bg-card/25 py-20 lg:py-28">
      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal animation="fade-up">
          <div className="mb-10 grid gap-6 border-b border-border/60 pb-10 lg:grid-cols-[1fr_auto] lg:items-end">
            <div className="max-w-2xl">
              <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-primary">
                <Images className="h-4 w-4" />
                Selected projects
              </div>
              <h2 className="font-heading text-4xl font-bold sm:text-5xl lg:text-6xl">
                See My <span className="gradient-text">Work</span>
              </h2>
              <p className="mt-4 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
                Real design, video, photography and website projects—organised so you can find relevant work quickly.
              </p>
            </div>
            <div className="text-sm text-muted-foreground"><strong className="text-foreground">{portfolioCategories.length}</strong> work collections</div>
          </div>
        </ScrollReveal>

        {availableFilters.length > 2 && (
          <div className="mb-10 flex gap-2 overflow-x-auto pb-2 sm:flex-wrap" aria-label="Filter portfolio projects">
            {availableFilters.map(filter => {
              const count = filter.id === 'all' ? portfolioCategories.length : portfolioCategories.filter(item => item.workType === filter.id).length;
              return (
                <Button key={filter.id} type="button" size="sm" variant={active === filter.id ? 'default' : 'outline'} onClick={() => { setActive(filter.id); setShowAll(false); }} className="shrink-0 rounded-md">
                  <filter.icon className="h-4 w-4" />
                  {filter.label}
                  <span className="opacity-70">{count}</span>
                </Button>
              );
            })}
          </div>
        )}

        <div key={active} className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {(showAll ? visibleItems : visibleItems.slice(0, INITIAL_COUNT)).map((category, index) => (
            <PortfolioCategoryCard 
              key={category.id} 
              category={category} 
              index={index} 
              type={category.workType}
            />
          ))}
        </div>
        {visibleItems.length > INITIAL_COUNT && (
          <div className="mt-10 flex justify-center">
            <Button type="button" variant="outline" onClick={() => setShowAll(v => !v)}>
              {showAll ? 'Show less' : `Show all ${visibleItems.length} projects`}
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};