import { Helmet } from 'react-helmet-async';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { PortfolioShowcase } from '@/components/PortfolioShowcase';
import { CompanyLogosSection } from '@/components/CompanyLogosSection';
import { EsportsServicesHighlight } from '@/components/EsportsServicesHighlight';
import { CertificationsSection } from '@/components/CertificationsSection';
import { WhatsAppButton } from '@/components/WhatsAppButton';
import { ScrollReveal } from '@/hooks/useScrollReveal';
import { ArrowRight, Sparkles, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const Services = () => {
  return (
    <>
      <Helmet>
        <title>Services | Pruthvirajsinh Makwana — Web, Design, Esports</title>
        <meta name="description" content="Web Development, Digital Marketing, Design, Video Editing, Esports commentary, event hosting and tournament organisation." />
        <link rel="canonical" href="https://pruthvirajsinh.in/services" />
        <meta property="og:title" content="Services — Pruthvirajsinh Makwana" />
        <meta property="og:description" content="Web dev, digital marketing, design, video editing and esports services — from a Gujarat-based freelance IT professional." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://pruthvirajsinh.in/services" />
        <meta property="og:image" content="https://pruthvirajsinh.in/favicon.jpg" />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="pt-20">
          {/* Hero Section */}
          <section className="py-20 sm:py-28 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-background to-background" />
            <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[150px]" />
            <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-secondary/10 rounded-full blur-[120px]" />
            
            <div className="container mx-auto px-4 sm:px-6 relative z-10">
              <ScrollReveal animation="fade-up">
                <div className="text-center max-w-4xl mx-auto">
                  <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 rounded-full text-sm font-medium text-primary mb-8">
                    <Sparkles className="w-4 h-4" />
                    Professional Services
                  </div>
                  <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold mb-6 leading-tight">
                    Creative Solutions for{' '}
                    <span className="bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
                      Your Digital Needs
                    </span>
                  </h1>
                  <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed mb-10">
                    From web development and digital marketing to esports commentary and tournament organization — 
                    I bring expertise and passion to every project.
                  </p>
                  
                  <div className="flex flex-wrap justify-center gap-4">
                    <Button size="lg" className="px-8 h-12 text-base group" asChild>
                      <Link to="/contact">
                        Let's Work Together
                        <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </Button>
                    <Button size="lg" variant="outline" className="px-8 h-12 text-base" asChild>
                      <a href="#portfolio">View My Work</a>
                    </Button>
                  </div>
                </div>
              </ScrollReveal>

              {/* Quick Service Tags */}
              <ScrollReveal animation="fade-up" delay={200}>
                <div className="flex flex-wrap justify-center gap-3 mt-14">
                  {[
                    'Web Development',
                    'Digital Marketing', 
                    'Graphic Design',
                    'Video Editing',
                    'Esports Commentary',
                    'Event Hosting',
                    'Tournament Org',
                  ].map((item, index) => (
                    <span
                      key={index}
                      className="px-4 py-2 bg-card/80 border border-border/50 rounded-full text-sm text-muted-foreground hover:border-primary/50 hover:text-primary hover:bg-primary/5 transition-all cursor-default"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </ScrollReveal>
            </div>
          </section>

          {/* Services with category filter */}
          <ServicesSection showBothCategories />

          {/* Company Logos Section - Scrolling Marquee */}
          <CompanyLogosSection />

          {/* Portfolio Showcase Section */}
          <div id="portfolio">
            <PortfolioShowcase />
          </div>

          {/* Esports Services Highlight */}
          <EsportsServicesHighlight />

          {/* Certifications Section */}
          <CertificationsSection />

          {/* Plans CTA */}
          <section className="py-16 sm:py-20 relative overflow-hidden">
            <div className="container mx-auto px-4 sm:px-6 relative z-10">
              <ScrollReveal animation="fade-up">
                <div className="max-w-4xl mx-auto rounded-3xl p-[1.5px] bg-gradient-to-r from-primary via-accent to-secondary">
                  <div className="rounded-3xl bg-card px-8 py-12 sm:px-14 text-center relative overflow-hidden">
                    <div className="absolute -top-20 -right-20 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
                    <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-secondary/10 rounded-full blur-3xl" />
                    <div className="relative">
                      <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full text-sm font-medium text-primary mb-5">
                        <Star className="w-4 h-4" />
                        Transparent Pricing
                      </div>
                      <h2 className="font-heading text-3xl sm:text-4xl font-bold mb-4">
                        Simple Plans,{' '}
                        <span className="bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
                          Honest Prices
                        </span>
                      </h2>
                      <p className="text-muted-foreground text-base sm:text-lg max-w-xl mx-auto mb-8">
                        Pick a ready-made package or request a custom quote — no hidden fees, no confusion.
                      </p>
                      <Button size="lg" className="px-10 h-12 text-base group" asChild>
                        <Link to="/plans">
                          See Plans
                          <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            </div>
          </section>

          {/* Final CTA */}
          <section className="py-20 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/5 to-background" />
            <div className="container mx-auto px-4 sm:px-6 relative z-10">
              <ScrollReveal animation="fade-up">
                <div className="max-w-3xl mx-auto text-center">
                  <h2 className="font-heading text-3xl sm:text-4xl font-bold mb-6">
                    Ready to Start Your Project?
                  </h2>
                  <p className="text-muted-foreground text-lg mb-8">
                    Let's discuss how I can help bring your ideas to life. Get in touch today!
                  </p>
                  <Button size="lg" className="px-10 h-14 text-base" asChild>
                    <Link to="/contact">
                      Contact Me
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

export default Services;