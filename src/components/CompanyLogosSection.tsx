import { useSiteSettings, CompanyLogo } from '@/hooks/useSiteSettings';
import { ScrollReveal } from '@/hooks/useScrollReveal';

export const CompanyLogosSection = () => {
  const { settings, isLoading } = useSiteSettings();
  const logos = settings.companyLogos?.filter(l => l.isVisible)?.sort((a, b) => a.order - b.order) || [];

  if (isLoading || logos.length === 0) {
    return null;
  }

  return (
    <section className="py-16 relative overflow-hidden border-y border-border/30 bg-gradient-to-r from-muted/20 via-muted/10 to-muted/20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal animation="fade-up">
          <div className="text-center mb-10">
            <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
              Trusted by Companies & Creators
            </p>
          </div>
        </ScrollReveal>

        {/* Logo Marquee */}
        <div className="relative overflow-hidden">
          <div className="flex animate-marquee gap-12 items-center">
            {[...logos, ...logos, ...logos].map((logo, index) => (
              <LogoItem key={`${logo.id}-${index}`} logo={logo} />
            ))}
          </div>
          
          {/* Gradient overlays for smooth edges */}
          <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />
        </div>
      </div>

      <style>{`
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-33.333%);
          }
        }
        .animate-marquee {
          animation: marquee 25s linear infinite;
          width: fit-content;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
};

const LogoItem = ({ logo }: { logo: CompanyLogo }) => {
  const handleClick = () => {
    if (logo.websiteUrl) {
      window.open(logo.websiteUrl, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div
      onClick={handleClick}
      className={`flex-shrink-0 px-6 py-4 ${logo.websiteUrl ? 'cursor-pointer' : ''} group`}
      title={logo.name}
    >
      <img
        src={logo.imageUrl}
        alt={logo.name}
        className="h-10 sm:h-12 w-auto object-contain opacity-60 grayscale hover:opacity-100 hover:grayscale-0 transition-all duration-300"
      />
    </div>
  );
};