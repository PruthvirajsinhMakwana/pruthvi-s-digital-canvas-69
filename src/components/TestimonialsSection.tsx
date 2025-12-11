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
    <section id="testimonials" className="py-16 sm:py-24 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 tech-grid opacity-30" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] sm:w-[600px] h-[400px] sm:h-[600px] bg-primary/10 rounded-full blur-[120px]" />

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        {/* Section Header */}
        <ScrollReveal animation="fade-up">
          <div className="text-center mb-10 sm:mb-16">
            <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
              Testimonials
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-heading font-bold mb-4 sm:mb-6">
              What <span className="gradient-text">Clients Say</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-base sm:text-lg">
              Feedback from people I've had the pleasure of working with.
            </p>
          </div>
        </ScrollReveal>

        {/* Testimonial Card */}
        <ScrollReveal animation="scale" delay={200}>
          <div className="max-w-4xl mx-auto">
            <div className="bg-card border border-border rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-12 relative">
              {/* Quote Icon */}
              <div className="absolute -top-5 sm:-top-6 left-6 sm:left-8 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg">
                <Quote className="w-5 h-5 sm:w-6 sm:h-6 text-primary-foreground" />
              </div>

              {/* Content */}
              <div className="pt-4 sm:pt-6">
                {/* Stars */}
                <div className="flex gap-1 mb-4 sm:mb-6">
                  {[...Array(currentTestimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 sm:w-5 sm:h-5 fill-primary text-primary" />
                  ))}
                </div>

                {/* Quote Text */}
                <blockquote className="text-lg sm:text-xl md:text-2xl font-medium text-foreground leading-relaxed mb-6 sm:mb-8">
                  "{currentTestimonial.content}"
                </blockquote>

                {/* Author & Navigation */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0">
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-primary-foreground font-bold text-base sm:text-lg flex-shrink-0">
                      {currentTestimonial.avatar}
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground text-base sm:text-lg">{currentTestimonial.name}</h4>
                      <p className="text-muted-foreground text-sm sm:text-base">{currentTestimonial.role}</p>
                    </div>
                  </div>

                  {/* Navigation Arrows */}
                  <div className="flex gap-2 self-end sm:self-auto">
                    <button
                      onClick={prevTestimonial}
                      className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-muted hover:bg-primary hover:text-primary-foreground flex items-center justify-center transition-all duration-300 cursor-pointer active:scale-95 touch-manipulation"
                      aria-label="Previous testimonial"
                      type="button"
                    >
                      <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
                    </button>
                    <button
                      onClick={nextTestimonial}
                      className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-muted hover:bg-primary hover:text-primary-foreground flex items-center justify-center transition-all duration-300 cursor-pointer active:scale-95 touch-manipulation"
                      aria-label="Next testimonial"
                      type="button"
                    >
                      <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Dots Indicator */}
            <div className="flex justify-center gap-2 mt-6 sm:mt-8">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  type="button"
                  className={cn(
                    'h-2.5 sm:h-3 rounded-full transition-all duration-300 cursor-pointer touch-manipulation',
                    index === currentIndex
                      ? 'bg-primary w-6 sm:w-8'
                      : 'bg-muted-foreground/30 hover:bg-muted-foreground/50 w-2.5 sm:w-3'
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