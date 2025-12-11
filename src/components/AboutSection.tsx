import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Download, Briefcase, GraduationCap, Award } from 'lucide-react';
import { ScrollReveal } from '@/hooks/useScrollReveal';

const skills = [
  { name: 'Web Development (HTML, CSS, JS, WordPress)', level: 90, color: 'from-primary to-secondary' },
  { name: 'Digital Marketing & SEO', level: 85, color: 'from-secondary to-accent' },
  { name: 'Graphic Design (Photoshop, Canva, Illustrator)', level: 85, color: 'from-accent to-primary' },
  { name: 'Video Editing & Motion Graphics', level: 80, color: 'from-primary to-neon-blue' },
  { name: 'UI/UX Design', level: 75, color: 'from-neon-blue to-secondary' },
  { name: 'Automation & AI Tools', level: 80, color: 'from-secondary to-primary' },
];

const experiences = [
  {
    year: '2024 – Present',
    title: 'B.Voc in Information Technology',
    company: 'Shati Business School',
    description: 'Learning IT fundamentals, development, networking, marketing, and creative digital tools.',
  },
  {
    year: '2023 – Present',
    title: 'Freelance Digital Creator',
    company: 'Self-Employed',
    description: 'Worked on multiple design, marketing, and video editing projects for local brands and businesses.',
  },
  {
    year: '2023 – Present',
    title: 'Web Development Projects',
    company: 'Freelance',
    description: 'Created personal and client-based web designs, landing pages, and business sites.',
  },
  {
    year: '2022 – 2023',
    title: 'Independent Learning & Skill Building',
    company: 'Self-Learning',
    description: 'Self-learned digital marketing, graphic design, and foundational programming.',
  },
];

const stats = [
  { icon: Briefcase, value: 50, label: 'Projects Completed', suffix: '+' },
  { icon: GraduationCap, value: 15, label: 'Tools Mastered', suffix: '+' },
  { icon: Award, value: 3, label: 'Years Learning', suffix: '+' },
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
    <div ref={ref} className="font-heading text-4xl sm:text-5xl font-bold gradient-text">
      {count}{suffix}
    </div>
  );
};

export const AboutSection = () => {
  return (
    <section id="about" className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 tech-grid opacity-20" />
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-primary/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-secondary/10 rounded-full blur-[100px]" />

      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        <ScrollReveal animation="fade-up">
          <div className="text-center mb-16">
            <span className="text-primary font-medium text-sm tracking-wider uppercase">About Me</span>
            <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold mt-3 mb-4">
              Interactive <span className="gradient-text">Resume</span>
            </h2>
            <p className="text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              I'm Pruthvirajsinh Makwana, an aspiring IT Professional currently pursuing a Bachelor of Vocation (B.Voc) in Information Technology from Shati Business School. I specialize in Web Development, Digital Marketing, Graphic Design, Video Editing, and Brand Creation — bringing together both technical expertise and creative problem-solving to craft powerful digital experiences.
            </p>
          </div>
        </ScrollReveal>

        {/* Stats Row */}
        <ScrollReveal animation="scale" delay={200}>
          <div className="grid grid-cols-3 gap-6 mb-16">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="glass-card rounded-2xl p-6 text-center hover:neon-glow transition-all duration-300"
              >
                <stat.icon className="w-8 h-8 text-primary mx-auto mb-4" />
                <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                <div className="text-sm text-muted-foreground mt-2">{stat.label}</div>
              </div>
            ))}
          </div>
        </ScrollReveal>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Skills Matrix */}
          <div className="glass-card rounded-3xl p-8">
            <h3 className="font-heading text-2xl font-bold mb-8">Skills Matrix</h3>
            <div className="space-y-6">
              {skills.map((skill, index) => (
                <div key={index} className="group">
                  <div className="flex justify-between mb-2">
                    <span className="font-medium text-foreground group-hover:text-primary transition-colors">
                      {skill.name}
                    </span>
                    <span className="text-muted-foreground">{skill.level}%</span>
                  </div>
                  <div className="h-3 bg-muted rounded-full overflow-hidden">
                    <div
                      className={`h-full bg-gradient-to-r ${skill.color} rounded-full transition-all duration-1000 ease-out`}
                      style={{ width: `${skill.level}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Experience Timeline */}
          <div className="glass-card rounded-3xl p-8">
            <h3 className="font-heading text-2xl font-bold mb-8">Experience Timeline</h3>
            <div className="relative">
              {/* Timeline Line */}
              <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-secondary to-accent" />
              
              <div className="space-y-8">
                {experiences.map((exp, index) => (
                  <div key={index} className="relative pl-12 group">
                    {/* Timeline Dot */}
                    <div className="absolute left-0 top-1 w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center neon-glow group-hover:scale-125 transition-transform duration-300">
                      <div className="w-3 h-3 rounded-full bg-background" />
                    </div>
                    
                    <div className="glass-card rounded-xl p-4 hover:neon-glow transition-all duration-300">
                      <span className="text-primary font-semibold text-sm">{exp.year}</span>
                      <h4 className="font-heading font-bold text-lg mt-1">{exp.title}</h4>
                      <p className="text-muted-foreground text-sm">{exp.company}</p>
                      <p className="text-muted-foreground text-sm mt-2">{exp.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Download Resume */}
        <div className="text-center mt-12">
          <Button variant="hero" size="xl" className="group">
            <Download className="w-5 h-5 group-hover:-translate-y-1 transition-transform" />
            Download Resume
          </Button>
        </div>
      </div>
    </section>
  );
};
