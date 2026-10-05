import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Download, Linkedin, Github, Instagram, Mail, MapPin, GraduationCap, ArrowUpRight,
  Globe, TrendingUp, PenTool, Film, Sparkles, Bot, Briefcase, CheckCircle2, Rocket,
} from 'lucide-react';
import { ScrollReveal } from '@/hooks/useScrollReveal';
import { useSiteSettings } from '@/hooks/useSiteSettings';
import profileIT from '@/assets/profile-it.jpg';

const skills = [
  { name: 'Web Development', level: 90, icon: Globe },
  { name: 'Digital Marketing & SEO', level: 85, icon: TrendingUp },
  { name: 'Graphic Design', level: 85, icon: PenTool },
  { name: 'Video Editing', level: 80, icon: Film },
  { name: 'UI/UX Design', level: 75, icon: Sparkles },
  { name: 'AI & Automation', level: 80, icon: Bot },
];

const experiences = [
  { year: '2023 – Present', title: 'Co-Founder', company: 'PROFIQUES — Digital Marketing Agency', icon: Rocket },
  { year: '2023 – Present', title: 'Freelance Web Developer & Designer', company: 'Independent client projects', icon: Briefcase },
  { year: '2024 – Present', title: 'B.Voc in Information Technology', company: 'Shati Business School', icon: GraduationCap },
];

const stats = [
  { value: 50, label: 'Projects delivered', suffix: '+' },
  { value: 15, label: 'Tools mastered', suffix: '+' },
  { value: 3, label: 'Years of practice', suffix: '+' },
];

const strengths = ['Problem Solver', 'Quick Learner', 'Creative Thinker', 'Detail Oriented', 'Team Player'];

const socialLinks = [
  { icon: Linkedin, href: 'https://www.linkedin.com/in/pruthvirajsinh-makwana-635974393/', label: 'LinkedIn' },
  { icon: Github, href: 'https://github.com/PruthvirajsinhMakwana', label: 'GitHub' },
  { icon: Instagram, href: 'https://www.instagram.com/pruthvirajsinh__makwana/', label: 'Instagram' },
  { icon: Mail, href: 'mailto:pruthvirajsinhpvt@gmail.com', label: 'Email' },
];

const useInView = <T extends HTMLElement>() => {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    if (!ref.current) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setInView(true); obs.disconnect(); }
    }, { threshold: 0.3 });
    obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return { ref, inView };
};

const AnimatedCounter = ({ value, suffix = '' }: { value: number; suffix?: string }) => {
  const [count, setCount] = useState(0);
  const { ref, inView } = useInView<HTMLDivElement>();
  useEffect(() => {
    if (!inView) return;
    let frame = 0;
    const start = performance.now();
    const tick = (t: number) => {
      const p = Math.min((t - start) / 1400, 1);
      setCount(Math.round(value * (1 - Math.pow(1 - p, 3))));
      if (p < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [inView, value]);
  return (
    <div ref={ref} className="font-heading text-3xl sm:text-4xl font-bold text-foreground tabular-nums">
      {count}<span className="text-primary">{suffix}</span>
    </div>
  );
};

const SkillBars = () => {
  const { ref, inView } = useInView<HTMLDivElement>();
  return (
    <div ref={ref} className="space-y-5">
      {skills.map((skill, i) => (
        <div key={skill.name} className="group">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <skill.icon className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-foreground">{skill.name}</span>
            </div>
            <span className="text-xs text-muted-foreground tabular-nums">{skill.level}%</span>
          </div>
          <div className="h-1 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary to-secondary rounded-full transition-[width] duration-1000 ease-out"
              style={{ width: inView ? `${skill.level}%` : '0%', transitionDelay: `${i * 80}ms` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export const AboutSection = () => {
  const { settings } = useSiteSettings();
  const resume = settings.resumeLink || 'https://drive.google.com/file/d/1G7plYbEEkstJyR24LzOvGsANdz7_FeJw/view?usp=sharing';

  return (
    <section id="about" className="py-20 sm:py-28 relative overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 relative z-10 max-w-6xl">
        {/* Header */}
        <ScrollReveal animation="fade-up">
          <div className="mb-12 sm:mb-16 max-w-2xl">
            <div className="flex items-center gap-3 mb-4">
              <span className="h-px w-10 bg-primary" />
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">About Me</span>
            </div>
            <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight">
              Building brands where <span className="gradient-text">technology meets design.</span>
            </h2>
          </div>
        </ScrollReveal>

        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Portrait */}
          <ScrollReveal animation="fade-up" delay={100} className="lg:col-span-5">
            <div className="lg:sticky lg:top-24">
              <div className="relative rounded-3xl overflow-hidden border border-border bg-card group">
                <div className="aspect-[4/5] overflow-hidden">
                  <img
                    src={profileIT}
                    alt="Pruthvirajsinh Makwana — Freelancer in Ahmedabad"
                    loading="lazy"
                    className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-[1.03]"
                  />
                </div>
                <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-background via-background/85 to-transparent pt-24">
                  <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-primary/15 border border-primary/30 mb-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                    <span className="text-[11px] font-medium text-foreground">Available for projects</span>
                  </div>
                  <h3 className="font-heading text-2xl font-bold text-foreground">Pruthvirajsinh Makwana</h3>
                  <p className="text-sm text-muted-foreground mt-1">IT Professional & Digital Creator</p>
                  <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-primary" />Gujarat, India</span>
                    <span className="flex items-center gap-1.5"><GraduationCap className="w-3.5 h-3.5 text-primary" />B.Voc IT</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 mt-5">
                <a href={resume} target="_blank" rel="noopener noreferrer" className="flex-1">
                  <Button size="lg" className="w-full group">
                    <Download className="w-4 h-4 mr-2 transition-transform group-hover:-translate-y-0.5" />
                    Download Resume
                  </Button>
                </a>
                {socialLinks.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.label}
                    className="w-11 h-11 shrink-0 rounded-xl border border-border bg-card flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/50 transition-colors"
                  >
                    <s.icon className="w-4 h-4" />
                  </a>
                ))}
              </div>
            </div>
          </ScrollReveal>

          {/* Content */}
          <div className="lg:col-span-7 space-y-10">
            <ScrollReveal animation="fade-up" delay={150}>
              <div className="space-y-4 text-muted-foreground leading-relaxed text-[15px] sm:text-base">
                <p className="text-lg sm:text-xl text-foreground leading-relaxed">
                  I'm Pruthvirajsinh — a multidisciplinary creator helping businesses grow through websites, design, video and marketing that actually perform.
                </p>
                <p>
                  Currently pursuing a B.Voc in Information Technology at Shati Business School, I work across{' '}
                  <span className="text-foreground">web development, digital marketing, graphic design, video editing</span> and brand creation — turning ideas into polished, measurable results.
                </p>
                <p>
                  I care about clean execution, fast turnaround and honest communication. Open to freelance work, collaborations and long-term partnerships.
                </p>
              </div>
            </ScrollReveal>

            {/* Stats */}
            <ScrollReveal animation="fade-up" delay={200}>
              <div className="grid grid-cols-3 divide-x divide-border border-y border-border py-6">
                {stats.map((s) => (
                  <div key={s.label} className="px-3 sm:px-6 first:pl-0">
                    <AnimatedCounter value={s.value} suffix={s.suffix} />
                    <div className="text-xs sm:text-sm text-muted-foreground mt-1">{s.label}</div>
                  </div>
                ))}
              </div>
            </ScrollReveal>

            {/* PROFIQUES */}
            <ScrollReveal animation="fade-up" delay={250}>
              <a
                href="https://profiques.com"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-start gap-4 rounded-2xl border border-border bg-card p-5 sm:p-6 hover:border-primary/50 transition-colors"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shrink-0">
                  <Rocket className="w-5 h-5 text-primary-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-[11px] font-semibold uppercase tracking-[0.15em] text-primary">Co-Founder</span>
                  <h4 className="font-heading text-lg font-bold mt-0.5">
                    <span className="gradient-text">PROFIQUES</span> — Digital Marketing Agency
                  </h4>
                  <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed">
                    Web development, branding, social media growth and video production for businesses across India.
                  </p>
                </div>
                <ArrowUpRight className="w-5 h-5 text-muted-foreground shrink-0 transition-all group-hover:text-primary group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </a>
            </ScrollReveal>

            {/* Skills + Experience */}
            <div className="grid sm:grid-cols-2 gap-8 sm:gap-10">
              <ScrollReveal animation="fade-up" delay={300}>
                <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground mb-5">Expertise</h3>
                <SkillBars />
              </ScrollReveal>

              <ScrollReveal animation="fade-up" delay={350}>
                <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground mb-5">Experience</h3>
                <ol className="relative border-l border-border ml-2 space-y-6">
                  {experiences.map((e) => (
                    <li key={e.title} className="pl-6 relative">
                      <span className="absolute -left-[13px] top-0 w-6 h-6 rounded-full bg-card border border-primary/40 flex items-center justify-center">
                        <e.icon className="w-3 h-3 text-primary" />
                      </span>
                      <span className="text-[11px] font-medium text-primary">{e.year}</span>
                      <h4 className="font-heading font-semibold text-foreground text-sm mt-0.5">{e.title}</h4>
                      <p className="text-xs text-muted-foreground mt-0.5">{e.company}</p>
                    </li>
                  ))}
                </ol>
              </ScrollReveal>
            </div>

            <ScrollReveal animation="fade-up" delay={400}>
              <div className="flex flex-wrap gap-x-5 gap-y-2">
                {strengths.map((t) => (
                  <span key={t} className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <CheckCircle2 className="w-4 h-4 text-primary" />{t}
                  </span>
                ))}
              </div>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </section>
  );
};
