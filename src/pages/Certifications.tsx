import { Helmet } from 'react-helmet-async';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { CertificationsSection } from '@/components/CertificationsSection';
import { WhatsAppButton } from '@/components/WhatsAppButton';
import { ScrollReveal } from '@/hooks/useScrollReveal';
import { Award, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const Certifications = () => {
  return (
    <>
      <Helmet>
        <title>Certifications - Pruthvirajsinh Makwana</title>
        <meta name="description" content="Verified certifications, achievements, and credentials earned by Pruthvirajsinh Makwana across web development, design, marketing and esports." />
        <link rel="canonical" href="https://pruthvirajsinh.in/certifications" />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="pt-20">
          <section className="py-20 sm:py-28 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-background to-background" />
            <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[150px]" />
            <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-secondary/10 rounded-full blur-[120px]" />

            <div className="container mx-auto px-4 sm:px-6 relative z-10">
              <ScrollReveal animation="fade-up">
                <div className="text-center max-w-4xl mx-auto">
                  <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 rounded-full text-sm font-medium text-primary mb-8">
                    <Award className="w-4 h-4" />
                    Verified Achievements
                  </div>
                  <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold mb-6 leading-tight">
                    My{' '}
                    <span className="bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
                      Certifications
                    </span>
                  </h1>
                  <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                    A collection of credentials and recognitions earned through continuous learning and real-world projects.
                  </p>
                </div>
              </ScrollReveal>
            </div>
          </section>

          <CertificationsSection />

          <section className="py-20 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/5 to-background" />
            <div className="container mx-auto px-4 sm:px-6 relative z-10">
              <ScrollReveal animation="fade-up">
                <div className="max-w-3xl mx-auto text-center">
                  <h2 className="font-heading text-3xl sm:text-4xl font-bold mb-6">
                    Want to Work Together?
                  </h2>
                  <p className="text-muted-foreground text-lg mb-8">
                    Let's bring your next project to life with proven expertise.
                  </p>
                  <Button size="lg" className="px-10 h-14 text-base" asChild>
                    <Link to="/contact">
                      Get In Touch
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Link>
                  </Button>
                </div>
              </ScrollReveal>
            </div>
          </section>
        </main>
        <Footer />
        <WhatsAppButton />
      </div>
    </>
  );
};

export default Certifications;
