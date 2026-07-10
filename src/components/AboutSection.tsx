import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Download, Briefcase, GraduationCap, Award, Linkedin, Github, Instagram, Mail, MapPin, Calendar, Code, Palette } from 'lucide-react';
import { ScrollReveal } from '@/hooks/useScrollReveal';
import { useSiteSettings } from '@/hooks/useSiteSettings';
import profileIT from '@/assets/profile-it.jpg';

const skills = [
  { name: 'Web Development', level: 90, icon: '🌐' },
  { name: 'Digital Marketing & SEO', level: 85, icon: '📈' },
  { name: 'Graphic Design', level: 85, icon: '🎨' },
  { name: 'Video Editing', level: 80, icon: '🎬' },
  { name: 'UI/UX Design', level: 75, icon: '✨' },
  { name: 'AI & Automation', level: 80, icon: '🤖' },
];

const experiences = [
  {
    year: '2024 – Present',
    title: 'B.Voc in Information Technology',
    company: 'Shati Business School',
    type: 'education',
  },
  {
    year: '2023 – Present',
    title: 'Freelance Digital Creator',
    company: 'Self-Employed',
    type: 'work',
  },
  {
    year: '2023 – Present',
    title: 'Web Developer & Designer',
    company: 'Freelance Projects',
    type: 'work',
  },
];

const stats = [
  { icon: Briefcase, value: 50, label: 'Projects', suffix: '+' },
  { icon: GraduationCap, value: 15, label: 'Tools', suffix: '+' },
  { icon: Award, value: 3, label: 'Years', suffix: '+' },
];

const socialLinks = [
  { icon: Linkedin, href: 'https://www.linkedin.com/in/pruthvirajsinh-makwana-635974393/', label: 'LinkedIn', color: 'hover:text-[#0077b5]' },
  { icon: Github, href: 'https://github.com/PruthvirajsinhMakwana', label: 'GitHub', color: 'hover:text-[#333] dark:hover:text-white' },
  { icon: Instagram, href: 'https://www.instagram.com/pruthvirajsinh__makwana/', label: 'Instagram', color: 'hover:text-[#e4405f]' },
  { icon: Mail, href: 'mailto:pruthvirajsinhpvt@gmail.com', label: 'Email', color: 'hover:text-primary' },
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
    <div ref={ref} className="font-heading text-3xl sm:text-4xl font-bold text-primary">
      {count}{suffix}
    </div>
  );
};

export const AboutSection = () => {
  const { settings } = useSiteSettings();
  return (
    <section id="about" className="py-24 relative overflow-hidden bg-gradient-to-b from-background via-muted/30 to-background">
      {/* Decorative Elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/5 rounded-full blur-3xl" />
      
      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        {/* Section Header */}
        <ScrollReveal animation="fade-up">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium mb-4">
              Get to Know Me
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold">
              About <span className="text-primary">Me</span>
            </h2>
          </div>
        </ScrollReveal>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-5 gap-8 mb-16">
          {/* Left Column - Profile Card */}
          <ScrollReveal animation="fade-up" delay={100} className="lg:col-span-2">
            <div className="bg-card border border-border rounded-3xl p-8 h-full">
              <div className="text-center mb-6">
                <div className="w-32 h-32 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary to-secondary p-1">
                  <img 
                    src={profileIT} 
                    alt="Pruthvirajsinh Makwana" 
                    className="w-full h-full rounded-full object-cover"
                  />
                </div>
                <h3 className="font-heading text-2xl font-bold">Pruthvirajsinh Makwana</h3>
                <p className="text-primary font-medium text-center">💻 IT Professional & Digital Creator</p>
                <p className="text-muted-foreground text-sm mt-1">🎨 Designer | 🌐 Developer | 📈 Marketer</p>
                <a
                  href="https://profiques.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-primary/15 to-secondary/15 border border-primary/30 hover:border-primary/60 transition-all"
                >
                  <span>🚀</span>
                  <span className="text-xs font-semibold">
                    Co-founder of <span className="gradient-text">PROFIQUES</span>
                  </span>
                </a>
              </div>



              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3 text-muted-foreground">
                  <MapPin className="w-4 h-4 text-primary" />
                  <span>Gujarat, India</span>
                </div>
                <div className="flex items-center gap-3 text-muted-foreground">
                  <Calendar className="w-4 h-4 text-primary" />
                  <span>Available for Freelance & Internships</span>
                </div>
                <div className="flex items-center gap-3 text-muted-foreground">
                  <GraduationCap className="w-4 h-4 text-primary" />
                  <span>B.Voc IT Student</span>
                </div>
              </div>

              {/* Social Links */}
              <div className="border-t border-border pt-6">
                <p className="text-sm text-muted-foreground mb-4 text-center">Connect with me</p>
                <div className="flex justify-center gap-3">
                  {socialLinks.map((social, index) => (
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

              {/* Download Resume */}
              <a 
                href={settings.resumeLink || 'https://drive.google.com/file/d/1G7plYbEEkstJyR24LzOvGsANdz7_FeJw/view?usp=sharing'} 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-full block mt-6"
              >
                <Button variant="default" size="lg" className="w-full group">
                  <Download className="w-4 h-4 mr-2 group-hover:-translate-y-0.5 transition-transform" />
                  Download Resume
                </Button>
              </a>
            </div>
          </ScrollReveal>

          {/* Right Column - Bio & Details */}
          <ScrollReveal animation="fade-up" delay={200} className="lg:col-span-3">
            <div className="space-y-6 h-full">
              {/* Bio Card */}
              <div className="bg-card border border-border rounded-3xl p-8">
                <h3 className="font-heading text-xl font-bold mb-4 flex items-center gap-2">
                  <span className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">👋</span>
                  Hello!
                </h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  I'm <span className="text-foreground font-medium">Pruthvirajsinh Makwana</span>, an aspiring <span className="text-primary font-medium">IT Professional</span> currently pursuing a Bachelor of Vocation (B.Voc) in Information Technology from Shati Business School. I specialize in <span className="text-primary font-medium">Web Development</span>, <span className="text-primary font-medium">Digital Marketing</span>, <span className="text-primary font-medium">Graphic Design</span>, <span className="text-primary font-medium">Video Editing</span>, and <span className="text-primary font-medium">Brand Creation</span>.
                </p>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  I'm passionate about working at the intersection of <span className="text-foreground">technology, design, and innovation</span>, where ideas turn into solutions. I enjoy building responsive websites, improving brand visibility through strategic marketing, designing compelling visuals, and leveraging modern tools to enhance productivity and quality.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  Driven by curiosity and continuous learning, I strive to deliver excellence in every project. My goal is to support business growth and establish myself as a <span className="text-primary font-medium">versatile professional</span> in the digital and IT ecosystem. I'm open to collaborations, freelance projects, internships, and opportunities to innovate and grow.
                </p>
              </div>

              {/* Stats Row */}
              <div className="grid grid-cols-3 gap-2 sm:gap-4">
                {stats.map((stat, index) => (
                  <div
                    key={index}
                    className="bg-card border border-border rounded-2xl p-4 text-center hover:border-primary/50 transition-colors"
                  >
                    <stat.icon className="w-6 h-6 text-primary mx-auto mb-2" />
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
                <span className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">⚡</span>
                My Skills
              </h3>
              <div className="grid grid-cols-1 xs:grid-cols-2 gap-3 sm:gap-4">
                {skills.map((skill, index) => (
                  <div
                    key={index}
                    className="group p-4 rounded-xl bg-muted/50 hover:bg-primary/10 transition-all duration-300 cursor-default"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-xl">{skill.icon}</span>
                      <span className="font-medium text-sm group-hover:text-primary transition-colors">
                        {skill.name}
                      </span>
                    </div>
                    <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-primary to-secondary rounded-full transition-all duration-700"
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
                <span className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">📅</span>
                Experience
              </h3>
              <div className="space-y-4">
                {experiences.map((exp, index) => (
                  <div
                    key={index}
                    className="relative pl-6 border-l-2 border-primary/30 hover:border-primary transition-colors"
                  >
                    <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-primary" />
                    <span className="text-xs text-primary font-medium">{exp.year}</span>
                    <h4 className="font-heading font-semibold text-foreground">{exp.title}</h4>
                    <p className="text-sm text-muted-foreground">{exp.company}</p>
                  </div>
                ))}
              </div>

              {/* Quick Facts */}
              <div className="mt-8 pt-6 border-t border-border">
                <h4 className="font-medium text-sm text-muted-foreground mb-3">What I Bring</h4>
                <div className="flex flex-wrap gap-2">
                  {['Problem Solver', 'Quick Learner', 'Creative Thinker', 'Detail Oriented', 'Team Player'].map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-primary/10 text-primary text-xs rounded-full"
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