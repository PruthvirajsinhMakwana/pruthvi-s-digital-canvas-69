import { useState } from 'react';
import { Quote, ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ScrollReveal } from '@/hooks/useScrollReveal';

const testimonials = [
  {
    id: 1,
    name: 'Rajesh Patel',
    role: 'Business Owner',
    content: 'Pruthvirajsinh delivers outstanding creativity and professionalism. His designs gave our brand a modern and polished look that truly stands out.',
    rating: 5,
    avatar: 'RP',
  },
  {
    id: 2,
    name: 'Meera Shah',
    role: 'Marketing Manager',
    content: 'Very reliable and quick with communication. He understood my requirements perfectly and delivered high-quality work on time.',
    rating: 5,
    avatar: 'MS',
  },
  {
    id: 3,
    name: 'Amit Desai',
    role: 'Startup Founder',
    content: 'Exceptional web development skills combined with a great eye for design. Our website conversion rate improved significantly after the redesign.',
    rating: 5,
    avatar: 'AD',
  },
];

export const TestimonialsSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const currentTestimonial = testimonials[currentIndex];

  return (
    <section id="testimonials" className="py-24 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 tech-grid opacity-30" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px]" />

      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        <ScrollReveal animation="fade-up">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
              Testimonials
            </span>
            <h2 className="text-4xl md:text-5xl font-heading font-bold mb-6">
              What <span className="gradient-text">Clients Say</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              Feedback from people I've had the pleasure of working with.
            </p>
          </div>
        </ScrollReveal>

        {/* Testimonial Card */}
        <ScrollReveal animation="scale" delay={200}>
          <div className="max-w-4xl mx-auto">
          <div className="glass-card rounded-3xl p-8 md:p-12 relative neon-border">
            {/* Quote Icon */}
            <div className="absolute -top-6 left-8 w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center neon-glow">
              <Quote className="w-6 h-6 text-primary-foreground" />
            </div>

            {/* Content */}
            <div className="pt-4">
              {/* Stars */}
              <div className="flex gap-1 mb-6">
                {[...Array(currentTestimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-primary text-primary" />
                ))}
              </div>

              {/* Quote Text */}
              <blockquote className="text-xl md:text-2xl font-medium text-foreground leading-relaxed mb-8">
                "{currentTestimonial.content}"
              </blockquote>

              {/* Author */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-primary-foreground font-bold text-lg">
                    {currentTestimonial.avatar}
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground text-lg">{currentTestimonial.name}</h4>
                    <p className="text-muted-foreground">{currentTestimonial.role}</p>
                  </div>
                </div>

                {/* Navigation */}
                <div className="flex gap-2">
                  <button
                    onClick={prevTestimonial}
                    className="w-10 h-10 rounded-full bg-muted/50 hover:bg-primary hover:text-primary-foreground flex items-center justify-center transition-all duration-300"
                    aria-label="Previous testimonial"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button
                    onClick={nextTestimonial}
                    className="w-10 h-10 rounded-full bg-muted/50 hover:bg-primary hover:text-primary-foreground flex items-center justify-center transition-all duration-300"
                    aria-label="Next testimonial"
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Dots Indicator */}
          <div className="flex justify-center gap-2 mt-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={cn(
                  'w-3 h-3 rounded-full transition-all duration-300',
                  index === currentIndex
                    ? 'bg-primary w-8'
                    : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'
                )}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>
        </ScrollReveal>
      </div>
    </section>
  );
};
