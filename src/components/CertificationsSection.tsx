import { Award, ExternalLink } from 'lucide-react';
import { ScrollReveal } from '@/hooks/useScrollReveal';

interface Certification {
  id: string;
  title: string;
  issuer: string;
  description: string;
  image: string;
  gradient: string;
  url?: string;
}

const certifications: Certification[] = [
  {
    id: '1',
    title: 'Web Development',
    issuer: 'Online Certification',
    description: 'Comprehensive training in modern web development including HTML, CSS, JavaScript and responsive design principles.',
    image: 'https://images.unsplash.com/photo-1593720219276-0b1eacd0aef4?w=800&h=600&fit=crop',
    gradient: 'from-blue-500 to-cyan-500',
  },
  {
    id: '2',
    title: 'Digital Marketing',
    issuer: 'Google',
    description: 'Mastered SEO, social media marketing, content strategy and analytics to drive measurable business growth.',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop',
    gradient: 'from-green-500 to-emerald-500',
  },
  {
    id: '3',
    title: 'Graphic Design',
    issuer: 'Creative Academy',
    description: 'Professional design fundamentals covering branding, typography, color theory and visual composition.',
    image: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=800&h=600&fit=crop',
    gradient: 'from-pink-500 to-rose-500',
  },
  {
    id: '4',
    title: 'Video Editing',
    issuer: 'Adobe',
    description: 'Advanced editing techniques, color grading, motion graphics and storytelling for engaging video content.',
    image: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=800&h=600&fit=crop',
    gradient: 'from-red-500 to-orange-500',
  },
  {
    id: '5',
    title: 'UI/UX Design',
    issuer: 'Design Institute',
    description: 'User-centered design principles, wireframing, prototyping and creating intuitive digital experiences.',
    image: 'https://images.unsplash.com/photo-1561070791-2526d30994b8?w=800&h=600&fit=crop',
    gradient: 'from-purple-500 to-violet-500',
  },
  {
    id: '6',
    title: 'Esports Management',
    issuer: 'Gaming Federation',
    description: 'Tournament organization, event hosting, broadcasting and community management for competitive gaming.',
    image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&h=600&fit=crop',
    gradient: 'from-amber-500 to-yellow-500',
  },
];

export const CertificationsSection = () => {
  return (
    <section id="certifications" className="py-24 lg:py-32 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/10 to-background" />
      <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[140px]" />
      <div className="absolute bottom-1/4 left-0 w-[400px] h-[400px] bg-secondary/5 rounded-full blur-[120px]" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <ScrollReveal animation="fade-up">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 rounded-full text-sm font-medium text-primary mb-6">
              <Award className="w-4 h-4" />
              Achievements & Certifications
            </div>
            <h2 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
              My{' '}
              <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                Certifications
              </span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
              Continuous learning is at the heart of what I do. Here are some of the certifications that
              shape my expertise.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {certifications.map((cert, index) => (
            <ScrollReveal key={cert.id} animation="fade-up" delay={index * 100}>
              <div className="group relative h-full">
                <div
                  className={`absolute -inset-0.5 bg-gradient-to-br ${cert.gradient} rounded-2xl opacity-0 group-hover:opacity-30 blur-lg transition-all duration-500`}
                />

                <div className="relative h-full bg-card/80 backdrop-blur-sm border border-border/50 rounded-2xl overflow-hidden transition-all duration-500 hover:border-primary/40 hover:-translate-y-2 hover:shadow-2xl">
                  {/* Image */}
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${cert.gradient} opacity-20 group-hover:opacity-30 transition-opacity duration-500 z-10`}
                    />
                    <img
                      src={cert.image}
                      alt={`${cert.title} certification`}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute top-4 right-4 z-20">
                      <div
                        className={`w-11 h-11 rounded-xl bg-gradient-to-br ${cert.gradient} flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}
                      >
                        <Award className="w-5 h-5 text-white" strokeWidth={2} />
                      </div>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-card via-card/30 to-transparent z-10" />
                  </div>

                  {/* Content */}
                  <div className="p-6 lg:p-7">
                    <p className="text-xs uppercase tracking-wider text-primary font-semibold mb-2">
                      {cert.issuer}
                    </p>
                    <h3 className="font-heading text-xl font-bold mb-3 group-hover:text-primary transition-colors duration-300">
                      {cert.title}
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {cert.description}
                    </p>

                    {cert.url && (
                      <a
                        href={cert.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-sm font-medium text-primary mt-4 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300"
                      >
                        View Certificate
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};
