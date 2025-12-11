import { Globe, Palette, Video, Megaphone, Layers, PenTool } from 'lucide-react';
import { Button } from '@/components/ui/button';

const services = [
  {
    icon: Globe,
    title: 'Web Development',
    description: 'Clean, responsive, and fast websites built for performance and user experience.',
    deliverables: ['Landing Pages', 'Portfolio Sites', 'Business Websites', 'Website Redesign', 'Maintenance & Optimization'],
    gradient: 'from-primary to-secondary',
  },
  {
    icon: Megaphone,
    title: 'Digital Marketing',
    description: 'Strategies that boost reach, engagement, and brand visibility.',
    deliverables: ['Social Media Strategy', 'SEO Optimization', 'Content Planning', 'Ad Creatives', 'Analytics Reports'],
    gradient: 'from-secondary to-accent',
  },
  {
    icon: Palette,
    title: 'Graphic Design',
    description: 'Creative visuals that communicate brand identity and attract attention.',
    deliverables: ['Logos & Branding', 'Posters & Flyers', 'Social Media Creatives', 'Thumbnails & Banners'],
    gradient: 'from-accent to-primary',
  },
  {
    icon: Video,
    title: 'Video Editing',
    description: 'Engaging videos for businesses, personal brands, and social platforms.',
    deliverables: ['Short Reels', 'Promotional Videos', 'Editing + Color Correction', 'Motion Graphic Elements'],
    gradient: 'from-primary to-neon-blue',
  },
  {
    icon: Layers,
    title: 'UI/UX Design',
    description: 'User-centered design that creates intuitive and delightful digital experiences.',
    deliverables: ['Wireframes', 'Prototypes', 'User Research', 'Interface Design'],
    gradient: 'from-neon-blue to-secondary',
  },
  {
    icon: PenTool,
    title: 'IT Support & Technical Assistance',
    description: 'Basic troubleshooting, software setup, and digital workflow assistance.',
    deliverables: ['Software Setup', 'Troubleshooting', 'Digital Workflow', 'Productivity Tools'],
    gradient: 'from-secondary to-primary',
  },
];

export const ServicesSection = () => {
  return (
    <section id="services" className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 tech-grid opacity-20" />
      <div className="absolute top-1/4 right-0 w-96 h-96 bg-secondary/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-1/4 left-0 w-80 h-80 bg-primary/10 rounded-full blur-[100px]" />

      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="text-primary font-medium text-sm tracking-wider uppercase">What I Do</span>
          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold mt-3 mb-4">
            My <span className="gradient-text">Services</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Comprehensive digital solutions tailored to help your brand stand out and succeed online.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div
              key={index}
              className="group relative glass-card rounded-3xl p-8 hover:neon-glow transition-all duration-500 hover:-translate-y-2"
            >
              {/* Gradient Border Effect */}
              <div className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${service.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10 blur-xl`} />
              
              {/* Icon */}
              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${service.gradient} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 neon-glow`}>
                <service.icon className="w-8 h-8 text-primary-foreground" />
              </div>

              {/* Content */}
              <h3 className="font-heading text-xl font-bold mb-3 group-hover:gradient-text transition-all duration-300">
                {service.title}
              </h3>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                {service.description}
              </p>

              {/* Deliverables */}
              <div className="space-y-2 mb-6">
                {service.deliverables.map((item, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <div className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${service.gradient}`} />
                    {item}
                  </div>
                ))}
              </div>

              {/* CTA */}
              <Button variant="glass" size="sm" className="w-full group-hover:neon-glow">
                Learn More
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
