import { Button } from '@/components/ui/button';
import { ArrowDown, Code, Palette, Video, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';
import profileImage from '@/assets/profile-hero.png';
import { useSiteSettings } from '@/hooks/useSiteSettings';

const FloatingCard = ({ icon: Icon, label, className }: { icon: any; label: string; className?: string }) => (
  <div
    role="img"
    aria-label={label}
    className={`glass-card rounded-xl sm:rounded-2xl p-2.5 sm:p-4 flex items-center gap-2 sm:gap-3 neon-glow cursor-pointer
    transition-all duration-300 ease-out
    hover:scale-110 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/20
    hover:border-primary/40 hover:bg-card/80
    group ${className}`}>
    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center
      transition-all duration-300 group-hover:from-primary/40 group-hover:to-secondary/40 group-hover:scale-110">
      <Icon aria-hidden="true" className="w-4 h-4 sm:w-5 sm:h-5 text-primary transition-all duration-300 group-hover:text-primary group-hover:drop-shadow-[0_0_8px_rgba(139,92,246,0.6)]" />
    </div>
    <span className="font-medium text-foreground text-xs sm:text-sm transition-all duration-300 group-hover:text-primary">{label}</span>
  </div>
);

export const HeroSection = () => {
  const { settings } = useSiteSettings();
  
  const nameParts = settings.name.split(' ');
  const firstName = nameParts[0] || '';
  const lastName = nameParts.slice(1).join(' ') || '';

  return (
    <section id="home" className="relative min-h-[100dvh] flex items-center justify-center overflow-hidden py-20 sm:py-24 lg:pt-20">
      {/* Background Elements */}
      <div className="absolute inset-0 tech-grid opacity-30" />
      <div className="absolute top-1/4 left-1/4 w-48 sm:w-72 lg:w-96 h-48 sm:h-72 lg:h-96 bg-primary/20 rounded-full blur-[80px] sm:blur-[120px] animate-pulse-neon" />
      <div className="absolute bottom-1/4 right-1/4 w-40 sm:w-64 lg:w-80 h-40 sm:h-64 lg:h-80 bg-secondary/20 rounded-full blur-[60px] sm:blur-[100px] animate-pulse-neon" style={{ animationDelay: '1s' }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] sm:w-[500px] lg:w-[600px] h-[300px] sm:h-[500px] lg:h-[600px] bg-accent/10 rounded-full blur-[100px] sm:blur-[150px]" />
      
      {/* Animated Orbs - Hidden on mobile */}
      <div className="absolute top-20 right-20 w-4 h-4 rounded-full bg-primary floating animate-glow hidden lg:block" />
      <div className="absolute bottom-40 left-20 w-6 h-6 rounded-full bg-secondary floating-delayed animate-glow hidden lg:block" />
      <div className="absolute top-40 left-40 w-3 h-3 rounded-full bg-accent floating-slow animate-glow hidden lg:block" />
      
      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 items-center">
          {/* Left Content */}
          <div className="text-center lg:text-left animate-fade-in-up order-2 lg:order-1">
            <div className="inline-flex items-center gap-2 glass-card rounded-full px-3 py-1.5 sm:px-4 sm:py-2 mb-3 sm:mb-4 lg:mb-6">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-[11px] sm:text-xs lg:text-sm text-muted-foreground">{settings.availabilityStatus}</span>
            </div>
            
            <h1 className="font-heading text-[2rem] sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-[1.1] sm:leading-tight mb-3 sm:mb-4 lg:mb-6">
              <span className="text-foreground">Hi, I'm</span>
              <br />
              <span className="gradient-text">{firstName}</span>{' '}
              <span className="text-foreground">{lastName}</span>
              <br />
              <span className="block text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl font-semibold text-muted-foreground mt-2 sm:mt-3">
                Web Developer, Designer &amp; Digital Marketer
              </span>
            </h1>
            
            <p className="text-[13px] sm:text-sm md:text-base lg:text-lg text-muted-foreground max-w-xl mx-auto lg:mx-0 mb-2 sm:mb-3 lg:mb-4 leading-relaxed">
              {settings.title.split(' | ').map((part, index) => (
                <span key={index}>
                  {index > 0 && ' | '}
                  <span className={index % 2 === 0 ? 'text-primary font-medium' : 'text-secondary font-medium'}>{part}</span>
                </span>
              ))}
            </p>
            
            <p className="text-xs sm:text-sm md:text-base text-muted-foreground max-w-xl mx-auto lg:mx-0 mb-4 sm:mb-5 lg:mb-6 leading-relaxed line-clamp-3 sm:line-clamp-none">
              {settings.description}
            </p>

            <div className="flex flex-wrap gap-1.5 sm:gap-2 lg:gap-3 justify-center lg:justify-start mb-4 sm:mb-6 lg:mb-8">
              {settings.skillTags.map((tag) => (
                <span key={tag} className="glass-card px-2 sm:px-2.5 lg:px-3 py-1 sm:py-1.5 rounded-full text-[9px] sm:text-[10px] lg:text-xs font-medium text-foreground">
                  {tag}
                </span>
              ))}
            </div>
            
            <div className="flex flex-row gap-2 sm:gap-3 lg:gap-4 justify-center lg:justify-start">
              <Button size="default" className="flex-1 sm:flex-none sm:px-6 lg:px-8 text-sm sm:text-base" asChild>
                <Link to={settings.hireMeLink}>
                  {settings.hireMeText}
                  <ArrowDown className="w-4 h-4 ml-1.5 sm:ml-2" />
                </Link>
              </Button>
              <Button variant="outline" size="default" className="flex-1 sm:flex-none sm:px-6 lg:px-8 text-sm sm:text-base" asChild>
                <Link to={settings.servicesLink}>{settings.servicesText}</Link>
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3 sm:gap-4 lg:gap-6 mt-6 sm:mt-8 lg:mt-12 pt-4 sm:pt-6 lg:pt-8 border-t border-border/30">
              <div className="text-center lg:text-left">
                <div className="font-heading text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold gradient-text">{settings.projectsDone}</div>
                <div className="text-[9px] sm:text-[10px] md:text-xs lg:text-sm text-muted-foreground mt-0.5 sm:mt-1">Projects Done</div>
              </div>
              <div className="text-center lg:text-left">
                <div className="font-heading text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold gradient-text">{settings.toolsMastered}</div>
                <div className="text-[9px] sm:text-[10px] md:text-xs lg:text-sm text-muted-foreground mt-0.5 sm:mt-1">Tools Mastered</div>
              </div>
              <div className="text-center lg:text-left">
                <div className="font-heading text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold gradient-text">{settings.yearsLearning}</div>
                <div className="text-[9px] sm:text-[10px] md:text-xs lg:text-sm text-muted-foreground mt-0.5 sm:mt-1">Years Learning</div>
              </div>
            </div>
          </div>

          {/* Right Content - Profile Image */}
          <div className="relative flex items-center justify-center lg:justify-center animate-scale-in order-1 lg:order-2 py-6 lg:py-0" style={{ animationDelay: '0.3s' }}>
            {/* Glow Ring - Centered */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-56 h-56 sm:w-80 sm:h-80 md:w-[22rem] md:h-[22rem] lg:w-[24rem] lg:h-[24rem] xl:w-[28rem] xl:h-[28rem] rounded-full border-2 border-primary/30 animate-rotate-slow" />
              <div className="absolute w-48 h-48 sm:w-72 sm:h-72 md:w-80 md:h-80 lg:w-[22rem] lg:h-[22rem] xl:w-[26rem] xl:h-[26rem] rounded-full border border-secondary/20 animate-rotate-slow" style={{ animationDirection: 'reverse', animationDuration: '25s' }} />
            </div>
            
            {/* Profile Image Container - Properly Centered */}
            <div className="relative flex items-center justify-center">
              {/* Glowing background behind image */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/50 via-secondary/40 to-accent/50 blur-3xl scale-125 opacity-60" />
              
              {/* Main Image Container */}
              <div className="w-48 h-48 sm:w-72 sm:h-72 md:w-80 md:h-80 lg:w-[22rem] lg:h-[22rem] xl:w-[24rem] xl:h-[24rem] rounded-full overflow-hidden relative z-10 
                border-4 border-primary/30 shadow-2xl shadow-primary/20
                transition-transform duration-500 hover:scale-[1.02]">
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-primary/30 via-transparent to-transparent z-10 pointer-events-none" />
                <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-secondary/20 z-10 pointer-events-none" />
                
                {/* Profile Image */}
                <img
                  src={profileImage}
                  alt={settings.name}
                  className="w-full h-full object-cover object-[center_20%]"
                  width={600}
                  height={600}
                  loading="eager"
                  fetchPriority="high"
                  decoding="async"
                />

              </div>
              
              {/* Floating Cards - All visible on lg screens with smooth loop animations */}
              <FloatingCard
                icon={Code}
                label="Developer"
                className="absolute -left-20 xl:-left-28 top-[10%] hidden lg:flex z-20 animate-float-1"
              />
              <FloatingCard
                icon={Palette}
                label="Designer"
                className="absolute -right-16 xl:-right-24 top-[20%] hidden lg:flex z-20 animate-float-2"
              />
              <FloatingCard
                icon={Video}
                label="Editor"
                className="absolute -left-16 xl:-left-24 bottom-[15%] hidden lg:flex z-20 animate-float-3"
              />
              <FloatingCard
                icon={Globe}
                label="Marketer"
                className="absolute -right-20 xl:-right-28 bottom-[25%] hidden lg:flex z-20 animate-float-4"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator - Hidden on mobile */}
      <div className="absolute bottom-4 sm:bottom-6 lg:bottom-8 left-1/2 -translate-x-1/2 flex-col items-center gap-1.5 sm:gap-2 animate-bounce hidden md:flex">
        <span className="text-[10px] sm:text-xs text-muted-foreground">Scroll Down</span>
        <ArrowDown className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
      </div>
    </section>
  );
};
