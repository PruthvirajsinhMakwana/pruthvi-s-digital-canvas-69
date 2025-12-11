import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ExternalLink, Github, ArrowRight } from 'lucide-react';

const categories = ['All', 'Web Development', 'Graphic Design', 'Video Editing'];

const projects = [
  {
    id: 1,
    title: 'E-Commerce Platform',
    category: 'Web Development',
    description: 'A modern e-commerce solution with seamless checkout and inventory management.',
    problem: 'Client needed a scalable online store.',
    solution: 'Built a responsive React-based platform.',
    result: '40% increase in online sales.',
    tools: ['React', 'Node.js', 'Stripe', 'MongoDB'],
    image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&h=400&fit=crop',
    featured: true,
  },
  {
    id: 2,
    title: 'Brand Identity Design',
    category: 'Graphic Design',
    description: 'Complete brand overhaul including logo, colors, and marketing materials.',
    problem: 'Outdated brand identity.',
    solution: 'Modern, memorable visual identity.',
    result: 'Brand recognition improved by 60%.',
    tools: ['Illustrator', 'Photoshop', 'Figma'],
    image: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=600&h=400&fit=crop',
    featured: true,
  },
  {
    id: 3,
    title: 'Promotional Video Campaign',
    category: 'Video Editing',
    description: 'High-impact promotional videos for social media marketing.',
    problem: 'Low engagement on video content.',
    solution: 'Dynamic, scroll-stopping video edits.',
    result: '3x increase in video views.',
    tools: ['Premiere Pro', 'After Effects', 'DaVinci'],
    image: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=600&h=400&fit=crop',
    featured: true,
  },
  {
    id: 4,
    title: 'Portfolio Website',
    category: 'Web Development',
    description: 'Personal portfolio showcasing creative work with stunning animations.',
    problem: 'Needed an impressive online presence.',
    solution: 'Custom animated portfolio site.',
    result: 'Increased client inquiries by 80%.',
    tools: ['React', 'Tailwind', 'Framer Motion'],
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop',
    featured: false,
  },
  {
    id: 5,
    title: 'Social Media Kit',
    category: 'Graphic Design',
    description: 'Comprehensive social media template package for brand consistency.',
    problem: 'Inconsistent social presence.',
    solution: 'Branded template system.',
    result: 'Content creation time reduced by 50%.',
    tools: ['Canva', 'Photoshop', 'Figma'],
    image: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=600&h=400&fit=crop',
    featured: false,
  },
  {
    id: 6,
    title: 'Product Launch Video',
    category: 'Video Editing',
    description: 'Cinematic product launch video with motion graphics.',
    problem: 'Product launch needed impact.',
    solution: 'Cinematic reveal video.',
    result: 'Viral reach with 500K+ views.',
    tools: ['After Effects', 'Premiere Pro'],
    image: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=600&h=400&fit=crop',
    featured: false,
  },
];

export const ProjectsSection = () => {
  const [activeCategory, setActiveCategory] = useState('All');

  const filteredProjects = activeCategory === 'All'
    ? projects
    : projects.filter(p => p.category === activeCategory);

  return (
    <section id="projects" className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 tech-grid opacity-20" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-accent/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-secondary/10 rounded-full blur-[100px]" />

      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="text-primary font-medium text-sm tracking-wider uppercase">Portfolio</span>
          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold mt-3 mb-4">
            Featured <span className="gradient-text">Projects</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            A showcase of my best work across web development, design, and video production.
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-6 py-2.5 rounded-full font-medium text-sm transition-all duration-300 ${
                activeCategory === category
                  ? 'bg-gradient-to-r from-primary to-secondary text-primary-foreground neon-glow'
                  : 'glass-card text-muted-foreground hover:text-foreground hover:neon-glow'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project, index) => (
            <div
              key={project.id}
              className="group glass-card rounded-3xl overflow-hidden hover:neon-glow transition-all duration-500 hover:-translate-y-2"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Image */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent opacity-60" />
                
                {/* Featured Badge */}
                {project.featured && (
                  <div className="absolute top-4 left-4 px-3 py-1 bg-gradient-to-r from-primary to-secondary text-primary-foreground text-xs font-semibold rounded-full">
                    Featured
                  </div>
                )}

                {/* Overlay Actions */}
                <div className="absolute inset-0 bg-background/80 flex items-center justify-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <Button variant="hero" size="icon" className="rounded-full">
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                  <Button variant="hero-outline" size="icon" className="rounded-full">
                    <Github className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <span className="text-primary text-xs font-medium uppercase tracking-wider">
                  {project.category}
                </span>
                <h3 className="font-heading text-xl font-bold mt-2 mb-3 group-hover:gradient-text transition-all duration-300">
                  {project.title}
                </h3>
                <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                  {project.description}
                </p>

                {/* Tools */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.tools.slice(0, 3).map((tool, i) => (
                    <span
                      key={i}
                      className="px-2 py-1 text-xs bg-muted rounded-md text-muted-foreground"
                    >
                      {tool}
                    </span>
                  ))}
                  {project.tools.length > 3 && (
                    <span className="px-2 py-1 text-xs bg-muted rounded-md text-muted-foreground">
                      +{project.tools.length - 3}
                    </span>
                  )}
                </div>

                {/* View Project Link */}
                <Button variant="ghost" size="sm" className="p-0 h-auto text-primary group/btn">
                  View Project
                  <ArrowRight className="w-4 h-4 ml-1 group-hover/btn:translate-x-1 transition-transform" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <Button variant="hero-outline" size="xl">
            View All Projects
            <ArrowRight className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </section>
  );
};
