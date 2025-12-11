import { Helmet } from 'react-helmet-async';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { ServicesSection } from '@/components/ServicesSection';
import { WhatsAppButton } from '@/components/WhatsAppButton';
import { ScrollReveal } from '@/hooks/useScrollReveal';

const Services = () => {
  return (
    <>
      <Helmet>
        <title>Services - Pruthvirajsinh Makwana | Web Development, Digital Marketing, Design & Esports</title>
        <meta name="description" content="Professional services including Web Development, Digital Marketing, Graphic Design, Video Editing, UI/UX Design, IT Support, Esports Commentary, Event Hosting, and Tournament Organization." />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="pt-20">
          {/* Hero Section */}
          <section className="py-16 sm:py-24 relative overflow-hidden bg-gradient-to-b from-primary/5 to-background">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,hsl(var(--primary)/0.1),transparent_50%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,hsl(var(--secondary)/0.1),transparent_50%)]" />
            
            <div className="container mx-auto px-4 sm:px-6 relative z-10">
              <ScrollReveal animation="fade-up">
                <div className="text-center max-w-4xl mx-auto">
                  <span className="inline-block px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium mb-6">
                    Professional Services
                  </span>
                  <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
                    What I Can <span className="text-primary">Do</span> For You
                  </h1>
                  <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                    From web development and digital marketing to esports commentary and tournament organization — I offer a diverse range of professional services to meet your needs.
                  </p>
                </div>
              </ScrollReveal>

              {/* Service Categories Preview */}
              <ScrollReveal animation="fade-up" delay={200}>
                <div className="flex flex-wrap justify-center gap-3 mt-10">
                  {['Web Development', 'Digital Marketing', 'Graphic Design', 'Video Editing', 'Esports Commentary', 'Event Hosting'].map((item, index) => (
                    <span
                      key={index}
                      className="px-4 py-2 bg-card border border-border rounded-full text-sm text-muted-foreground hover:border-primary/50 hover:text-primary transition-colors"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </ScrollReveal>
            </div>
          </section>

          {/* Services Section - Show Both IT and Esports */}
          <ServicesSection showBothCategories={true} />
        </main>
        <Footer />
        <WhatsAppButton />
      </div>
    </>
  );
};

export default Services;