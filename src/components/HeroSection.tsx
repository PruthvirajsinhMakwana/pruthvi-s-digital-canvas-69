import { Button } from '@/components/ui/button';
import { ArrowDown, Code, Palette, Video, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';
import profileImage from '@/assets/profile-hero.png';

const FloatingCard = ({ icon: Icon, label, className }: { icon: any; label: string; className?: string }) => (
  <div className={`glass-card rounded-xl sm:rounded-2xl p-2.5 sm:p-4 flex items-center gap-2 sm:gap-3 neon-glow ${className}`}>
    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
      <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
    </div>
    <span className="font-medium text-foreground text-xs sm:text-sm">{label}</span>
  </div>
);

export const HeroSection = () => {
  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16 sm:pt-20">
      {/* Background Elements */}
      <div className="absolute inset-0 tech-grid opacity-30" />
      <div className="absolute top-1/4 left-1/4 w-64 sm:w-96 h-64 sm:h-96 bg-primary/20 rounded-full blur-[120px] animate-pulse-neon" />
      <div className="absolute bottom-1/4 right-1/4 w-56 sm:w-80 h-56 sm:h-80 bg-secondary/20 rounded-full blur-[100px] animate-pulse-neon" style={{ animationDelay: '1s' }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] sm:w-[600px] h-[400px] sm:h-[600px] bg-accent/10 rounded-full blur-[150px]" />
      
      {/* Animated Orbs - Hidden on mobile */}
      <div className="absolute top-20 right-20 w-4 h-4 rounded-full bg-primary floating animate-glow hidden sm:block" />
      <div className="absolute bottom-40 left-20 w-6 h-6 rounded-full bg-secondary floating-delayed animate-glow hidden sm:block" />
      <div className="absolute top-40 left-40 w-3 h-3 rounded-full bg-accent floating-slow animate-glow hidden sm:block" />
      
      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left Content */}
          <div className="text-center lg:text-left animate-fade-in-up order-2 lg:order-1">
            <div className="inline-flex items-center gap-2 glass-card rounded-full px-3 sm:px-4 py-1.5 sm:py-2 mb-4 sm:mb-6">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-xs sm:text-sm text-muted-foreground">Available for freelance work</span>
            </div>
            
            <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight mb-4 sm:mb-6">
              <span className="text-foreground">Hi, I'm</span>
              <br />
              <span className="gradient-text">Pruthvirajsinh</span>
              <br />
              <span className="text-foreground">Makwana</span>
            </h1>
            
            <p className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-xl mx-auto lg:mx-0 mb-3 sm:mb-4 leading-relaxed">
              <span className="text-primary font-medium">IT Professional</span> | <span className="text-secondary font-medium">Web Developer</span> | <span className="text-primary font-medium">Creative Designer</span>
            </p>
            
            <p className="text-xs sm:text-sm md:text-base text-muted-foreground max-w-xl mx-auto lg:mx-0 mb-4 sm:mb-6 leading-relaxed">
              I build responsive websites, engaging digital content, and modern brand experiences using technology, creativity, and innovation.
            </p>

            <div className="flex flex-wrap gap-2 sm:gap-3 justify-center lg:justify-start mb-6 sm:mb-8">
              <span className="glass-card px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full text-[10px] sm:text-xs font-medium text-foreground">Web Development</span>
              <span className="glass-card px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full text-[10px] sm:text-xs font-medium text-foreground">Digital Marketing</span>
              <span className="glass-card px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full text-[10px] sm:text-xs font-medium text-foreground">Graphic Design</span>
              <span className="glass-card px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full text-[10px] sm:text-xs font-medium text-foreground">Video Editing</span>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start">
              <Button size="lg" className="w-full sm:w-auto" asChild>
                <Link to="/contact">
                  Hire Me
                  <ArrowDown className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" className="w-full sm:w-auto" asChild>
                <Link to="/services">View Services</Link>
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 sm:gap-6 mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-border/30">
              <div className="text-center lg:text-left">
                <div className="font-heading text-2xl sm:text-3xl md:text-4xl font-bold gradient-text">50+</div>
                <div className="text-[10px] sm:text-xs md:text-sm text-muted-foreground mt-1">Projects Done</div>
              </div>
              <div className="text-center lg:text-left">
                <div className="font-heading text-2xl sm:text-3xl md:text-4xl font-bold gradient-text">15+</div>
                <div className="text-[10px] sm:text-xs md:text-sm text-muted-foreground mt-1">Tools Mastered</div>
              </div>
              <div className="text-center lg:text-left">
                <div className="font-heading text-2xl sm:text-3xl md:text-4xl font-bold gradient-text">3+</div>
                <div className="text-[10px] sm:text-xs md:text-sm text-muted-foreground mt-1">Years Learning</div>
              </div>
            </div>
          </div>

          {/* Right Content - Profile Image */}
          <div className="relative flex justify-center lg:justify-end animate-scale-in order-1 lg:order-2" style={{ animationDelay: '0.3s' }}>
            {/* Glow Ring */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-56 h-56 sm:w-72 sm:h-72 md:w-80 md:h-80 lg:w-96 lg:h-96 rounded-full border-2 border-primary/30 animate-rotate-slow" />
              <div className="absolute w-48 h-48 sm:w-64 sm:h-64 md:w-72 md:h-72 lg:w-80 lg:h-80 rounded-full border border-secondary/20 animate-rotate-slow" style={{ animationDirection: 'reverse', animationDuration: '25s' }} />
            </div>
            
            {/* Profile Image Container */}
            <div className="relative">
              <div className="w-48 h-48 sm:w-64 sm:h-64 md:w-72 md:h-72 lg:w-80 lg:h-80 xl:w-96 xl:h-96 rounded-full overflow-hidden neon-glow-lg relative z-10">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-primary/30" />
                <img
                  src={profileImage}
                  alt="Pruthvirajsinh Makwana"
                  className="w-full h-full object-cover object-top"
                />
              </div>
              
              {/* Floating Cards - Hidden on small mobile */}
              <FloatingCard
                icon={Code}
                label="Developer"
                className="absolute -left-4 sm:-left-8 top-1/4 floating hidden sm:flex"
              />
              <FloatingCard
                icon={Palette}
                label="Designer"
                className="absolute -right-2 sm:-right-4 top-1/3 floating-delayed hidden sm:flex"
              />
              <FloatingCard
                icon={Video}
                label="Editor"
                className="absolute -left-2 sm:-left-4 bottom-1/4 floating-slow hidden md:flex"
              />
              <FloatingCard
                icon={Globe}
                label="Marketer"
                className="absolute -right-4 sm:-right-8 bottom-1/3 floating hidden md:flex"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator - Hidden on mobile */}
      <div className="absolute bottom-4 sm:bottom-8 left-1/2 -translate-x-1/2 flex-col items-center gap-2 animate-bounce hidden sm:flex">
        <span className="text-xs text-muted-foreground">Scroll Down</span>
        <ArrowDown className="w-5 h-5 text-primary" />
      </div>
    </section>
  );
};