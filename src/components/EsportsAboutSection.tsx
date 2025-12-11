import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Download, Mic, Trophy, Award, Youtube, Instagram, Twitch, Mail, MapPin, Gamepad2, Tv } from 'lucide-react';
import { ScrollReveal } from '@/hooks/useScrollReveal';
import profileGaming from '@/assets/profile-gaming.jpg';

const esportsSkills = [
  { name: 'Esports Commentary', level: 95, icon: '🎤' },
  { name: 'Event Hosting', level: 90, icon: '🎭' },
  { name: 'Tournament Organization', level: 85, icon: '🏆' },
  { name: 'Gameplay Analysis', level: 90, icon: '🎯' },
  { name: 'Content Creation', level: 85, icon: '📺' },
  { name: 'Live Production', level: 80, icon: '🎬' },
];

const esportsExperiences = [
  {
    year: '2023 – Present',
    title: 'Esports Commentator & Host',
    company: 'Freelance / Various Tournaments',
    type: 'work',
  },
  {
    year: '2023 – Present',
    title: 'YouTube Gaming Host',
    company: 'Gaming Content Creator',
    type: 'work',
  },
  {
    year: '2022 – Present',
    title: 'Tournament Organizer',
    company: 'Local & Online Events',
    type: 'work',
  },
];

const esportsStats = [
  { icon: Trophy, value: 50, label: 'Events', suffix: '+' },
  { icon: Mic, value: 100, label: 'Streams', suffix: '+' },
  { icon: Award, value: 3, label: 'Years', suffix: '+' },
];

const esportsSocialLinks = [
  { icon: Youtube, href: 'https://youtube.com/@pruthvirajsinh', label: 'YouTube', color: 'hover:text-[#ff0000]' },
  { icon: Instagram, href: 'https://instagram.com/pruthvirajsinh.makwana', label: 'Instagram', color: 'hover:text-[#e4405f]' },
  { icon: Twitch, href: 'https://twitch.tv/pruthvirajsinh', label: 'Twitch', color: 'hover:text-[#9146ff]' },
  { icon: Mail, href: 'mailto:pruthvirajsinh.biz@gmail.com', label: 'Email', color: 'hover:text-primary' },
];

const AnimatedCounter = ({ value, suffix = '' }: { value: number; suffix?: string }) => {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          let start = 0;
          const duration = 2000;
          const increment = value / (duration / 16);
          
          const timer = setInterval(() => {
            start += increment;
            if (start >= value) {
              setCount(value);
              clearInterval(timer);
            } else {
              setCount(Math.floor(start));
            }
          }, 16);
          
          return () => clearInterval(timer);
        }
      },
      { threshold: 0.5 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [value]);

  return (
    <div ref={ref} className="font-heading text-3xl sm:text-4xl font-bold text-secondary">
      {count}{suffix}
    </div>
  );
};

export const EsportsAboutSection = () => {
  return (
    <section className="py-24 relative overflow-hidden bg-gradient-to-b from-background via-secondary/5 to-background">
      {/* Decorative Elements */}
      <div className="absolute top-20 right-10 w-72 h-72 bg-secondary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      
      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        <ScrollReveal animation="fade-up">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-2 bg-secondary/10 text-secondary rounded-full text-sm font-medium mb-4">
              🎮 Gaming Identity
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold">
              Esports <span className="text-secondary">Professional</span>
            </h2>
          </div>
        </ScrollReveal>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-5 gap-8 mb-16">
          {/* Left Column - Profile Card */}
          <ScrollReveal animation="fade-up" delay={100} className="lg:col-span-2">
            <div className="bg-card border border-secondary/30 rounded-3xl p-8 h-full">
              <div className="text-center mb-6">
                <div className="w-32 h-32 mx-auto mb-4 rounded-full bg-gradient-to-br from-secondary to-primary p-1">
                  <img 
                    src={profileGaming} 
                    alt="Pruthvirajsinh Makwana - Gaming" 
                    className="w-full h-full rounded-full object-cover"
                  />
                </div>
                <h3 className="font-heading text-2xl font-bold">Pruthvirajsinh Makwana</h3>
                <p className="text-secondary font-medium text-center">🎤 Esports Commentator | ⚙️ Tech Enthusiast</p>
                <p className="text-muted-foreground text-sm mt-1">📺 YouTube Host | Voice of Gaming</p>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3 text-muted-foreground">
                  <MapPin className="w-4 h-4 text-secondary" />
                  <span>Gujarat, India</span>
                </div>
                <div className="flex items-center gap-3 text-muted-foreground">
                  <Gamepad2 className="w-4 h-4 text-secondary" />
                  <span>Available for Events & Commentary</span>
                </div>
                <div className="flex items-center gap-3 text-muted-foreground">
                  <Tv className="w-4 h-4 text-secondary" />
                  <span>Esports Professional</span>
                </div>
              </div>

              {/* Social Links */}
              <div className="border-t border-border pt-6">
                <p className="text-sm text-muted-foreground mb-4 text-center">Connect with me</p>
                <div className="flex justify-center gap-3">
                  {esportsSocialLinks.map((social, index) => (
                    <a
                      key={index}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={social.label}
                      className={`w-10 h-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground transition-all duration-300 hover:scale-110 ${social.color}`}
                    >
                      <social.icon className="w-5 h-5" />
                    </a>
                  ))}
                </div>
              </div>

              {/* Contact Button */}
              <Button variant="secondary" size="lg" className="w-full mt-6 group">
                <Mail className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                Book for Events
              </Button>
            </div>
          </ScrollReveal>

          {/* Right Column - Bio & Details */}
          <ScrollReveal animation="fade-up" delay={200} className="lg:col-span-3">
            <div className="space-y-6 h-full">
              {/* Bio Card */}
              <div className="bg-card border border-border rounded-3xl p-8">
                <h3 className="font-heading text-xl font-bold mb-4 flex items-center gap-2">
                  <span className="w-8 h-8 rounded-lg bg-secondary/10 flex items-center justify-center text-secondary">🎮</span>
                  Hello, Gamers!
                </h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  I'm <span className="text-foreground font-medium">Pruthvirajsinh Makwana</span>, an energetic <span className="text-secondary font-medium">Esports Commentator</span>, <span className="text-secondary font-medium">Event Host</span>, <span className="text-secondary font-medium">YouTube Gaming Presenter</span>, and <span className="text-secondary font-medium">Tournament Organizer</span> with a strong passion for the competitive gaming industry.
                </p>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  I specialize in <span className="text-foreground">live commentary</span>, <span className="text-foreground">match analysis</span>, <span className="text-foreground">hosting</span>, and <span className="text-foreground">gaming content creation</span>, bringing energy, clarity, and excitement to every event. I've worked across community tournaments, online leagues, and local esports competitions—handling everything from voice casting to event structure, rulesets, scheduling, and production flow.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  Beyond tournaments, I create <span className="text-foreground">engaging gaming content</span>, host <span className="text-foreground">YouTube shows</span>, and interact with esports audiences to help grow the gaming ecosystem. With a blend of passion, professionalism, and creativity, I aim to continue contributing to the esports scene as a <span className="text-secondary font-medium">dedicated voice of gaming</span> and a reliable event partner.
                </p>
              </div>

              {/* Stats Row */}
              <div className="grid grid-cols-3 gap-4">
                {esportsStats.map((stat, index) => (
                  <div
                    key={index}
                    className="bg-card border border-border rounded-2xl p-4 text-center hover:border-secondary/50 transition-colors"
                  >
                    <stat.icon className="w-6 h-6 text-secondary mx-auto mb-2" />
                    <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                    <div className="text-xs text-muted-foreground mt-1">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </ScrollReveal>
        </div>

        {/* Skills & Experience Grid */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Skills */}
          <ScrollReveal animation="fade-up" delay={300}>
            <div className="bg-card border border-border rounded-3xl p-8">
              <h3 className="font-heading text-xl font-bold mb-6 flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-secondary/10 flex items-center justify-center text-secondary">⚡</span>
                Gaming Skills
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {esportsSkills.map((skill, index) => (
                  <div
                    key={index}
                    className="group p-4 rounded-xl bg-muted/50 hover:bg-secondary/10 transition-all duration-300 cursor-default"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-xl">{skill.icon}</span>
                      <span className="font-medium text-sm group-hover:text-secondary transition-colors">
                        {skill.name}
                      </span>
                    </div>
                    <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-secondary to-primary rounded-full transition-all duration-700"
                        style={{ width: `${skill.level}%` }}
                      />
                    </div>
                    <span className="text-xs text-muted-foreground mt-1 block">{skill.level}%</span>
                  </div>
                ))}
              </div>
            </div>
          </ScrollReveal>

          {/* Experience Timeline */}
          <ScrollReveal animation="fade-up" delay={400}>
            <div className="bg-card border border-border rounded-3xl p-8">
              <h3 className="font-heading text-xl font-bold mb-6 flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-secondary/10 flex items-center justify-center text-secondary">📅</span>
                Gaming Journey
              </h3>
              <div className="space-y-4">
                {esportsExperiences.map((exp, index) => (
                  <div
                    key={index}
                    className="relative pl-6 border-l-2 border-secondary/30 hover:border-secondary transition-colors"
                  >
                    <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-secondary" />
                    <span className="text-xs text-secondary font-medium">{exp.year}</span>
                    <h4 className="font-heading font-semibold text-foreground">{exp.title}</h4>
                    <p className="text-sm text-muted-foreground">{exp.company}</p>
                  </div>
                ))}
              </div>

              {/* Quick Facts */}
              <div className="mt-8 pt-6 border-t border-border">
                <h4 className="font-medium text-sm text-muted-foreground mb-3">What I Bring</h4>
                <div className="flex flex-wrap gap-2">
                  {['High Energy', 'Game Knowledge', 'Audience Engagement', 'Professional Voice', 'Creative Vision'].map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-secondary/10 text-secondary text-xs rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
};