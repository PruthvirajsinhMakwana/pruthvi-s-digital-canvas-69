import { Button } from '@/components/ui/button';
import { ArrowDown, Code, Palette, Video, Globe } from 'lucide-react';
import profileImage from '@/assets/profile-hero.png';

const FloatingCard = ({ icon: Icon, label, className }: { icon: any; label: string; className?: string }) => (
  <div className={`glass-card rounded-2xl p-4 flex items-center gap-3 neon-glow ${className}`}>
    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
      <Icon className="w-5 h-5 text-primary" />
    </div>
    <span className="font-medium text-foreground text-sm">{label}</span>
  </div>
);

export const HeroSection = () => {
  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Background Elements */}
      <div className="absolute inset-0 tech-grid opacity-30" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[120px] animate-pulse-neon" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-secondary/20 rounded-full blur-[100px] animate-pulse-neon" style={{ animationDelay: '1s' }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/10 rounded-full blur-[150px]" />
      
      {/* Animated Orbs */}
      <div className="absolute top-20 right-20 w-4 h-4 rounded-full bg-primary floating animate-glow" />
      <div className="absolute bottom-40 left-20 w-6 h-6 rounded-full bg-secondary floating-delayed animate-glow" />
      <div className="absolute top-40 left-40 w-3 h-3 rounded-full bg-accent floating-slow animate-glow" />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="text-center lg:text-left animate-fade-in-up">
            <div className="inline-flex items-center gap-2 glass-card rounded-full px-4 py-2 mb-6">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-sm text-muted-foreground">Available for freelance work</span>
            </div>
            
            <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight mb-6">
              <span className="text-foreground">Hi, I'm</span>
              <br />
              <span className="gradient-text">Pruthvirajsinh</span>
              <br />
              <span className="text-foreground">Makwana</span>
            </h1>
            
            <p className="text-base sm:text-lg text-muted-foreground max-w-xl mx-auto lg:mx-0 mb-4 leading-relaxed">
              <span className="text-primary font-medium">IT Professional</span> | <span className="text-secondary font-medium">Web Developer</span> | <span className="text-accent font-medium">Digital Marketer</span> | <span className="text-primary font-medium">Creative Designer</span>
            </p>
            
            <p className="text-sm sm:text-base text-muted-foreground max-w-xl mx-auto lg:mx-0 mb-6 leading-relaxed">
              I build responsive websites, engaging digital content, and modern brand experiences using the power of technology, creativity, and innovation.
            </p>

            <div className="flex flex-wrap gap-3 justify-center lg:justify-start mb-8">
              <span className="glass-card px-3 py-1.5 rounded-full text-xs font-medium text-foreground">Web Development</span>
              <span className="glass-card px-3 py-1.5 rounded-full text-xs font-medium text-foreground">Digital Marketing & SEO</span>
              <span className="glass-card px-3 py-1.5 rounded-full text-xs font-medium text-foreground">Graphic Design</span>
              <span className="glass-card px-3 py-1.5 rounded-full text-xs font-medium text-foreground">Video Editing</span>
              <span className="glass-card px-3 py-1.5 rounded-full text-xs font-medium text-foreground">Branding & Automation</span>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button variant="hero" size="xl" className="group" onClick={() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })}>
                Hire Me
                <ArrowDown className="w-5 h-5 group-hover:translate-y-1 transition-transform" />
              </Button>
              <Button variant="hero-outline" size="xl" onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}>
                Explore My Work
              </Button>
              <Button variant="glass" size="xl" onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}>
                Contact Me
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 mt-12 pt-8 border-t border-border/30">
              <div className="text-center lg:text-left">
                <div className="font-heading text-3xl sm:text-4xl font-bold gradient-text">50+</div>
                <div className="text-sm text-muted-foreground mt-1">Projects Done</div>
              </div>
              <div className="text-center lg:text-left">
                <div className="font-heading text-3xl sm:text-4xl font-bold gradient-text">15+</div>
                <div className="text-sm text-muted-foreground mt-1">Tools Mastered</div>
              </div>
              <div className="text-center lg:text-left">
                <div className="font-heading text-3xl sm:text-4xl font-bold gradient-text">3+</div>
                <div className="text-sm text-muted-foreground mt-1">Years Learning</div>
              </div>
            </div>
          </div>

          {/* Right Content - Profile Image */}
          <div className="relative flex justify-center lg:justify-end animate-scale-in" style={{ animationDelay: '0.3s' }}>
            {/* Glow Ring */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-80 h-80 sm:w-96 sm:h-96 rounded-full border-2 border-primary/30 animate-rotate-slow" />
              <div className="absolute w-72 h-72 sm:w-80 sm:h-80 rounded-full border border-secondary/20 animate-rotate-slow" style={{ animationDirection: 'reverse', animationDuration: '25s' }} />
            </div>
            
            {/* Profile Image Container */}
            <div className="relative">
              <div className="w-72 h-72 sm:w-80 sm:h-80 lg:w-96 lg:h-96 rounded-full overflow-hidden neon-glow-lg relative z-10">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-primary/30" />
                <img
                  src={profileImage}
                  alt="Pruthvirajsinh Makwana"
                  className="w-full h-full object-cover object-top"
                />
              </div>
              
              {/* Floating Cards */}
              <FloatingCard
                icon={Code}
                label="Web Developer"
                className="absolute -left-8 top-1/4 floating hidden sm:flex"
              />
              <FloatingCard
                icon={Palette}
                label="Designer"
                className="absolute -right-4 top-1/3 floating-delayed hidden sm:flex"
              />
              <FloatingCard
                icon={Video}
                label="Video Editor"
                className="absolute -left-4 bottom-1/4 floating-slow hidden sm:flex"
              />
              <FloatingCard
                icon={Globe}
                label="Digital Marketer"
                className="absolute -right-8 bottom-1/3 floating hidden sm:flex"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
        <span className="text-xs text-muted-foreground">Scroll Down</span>
        <ArrowDown className="w-5 h-5 text-primary" />
      </div>
    </section>
  );
};
