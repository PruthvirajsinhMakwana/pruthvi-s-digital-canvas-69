import { Helmet } from 'react-helmet-async';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { PackagesSection } from '@/components/PackagesSection';
import { WhatsAppButton } from '@/components/WhatsAppButton';
import { ScrollReveal } from '@/hooks/useScrollReveal';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowRight, BadgeCheck, Clock, Headphones, ShieldCheck, Sparkles } from 'lucide-react';

const highlights = [
  { icon: BadgeCheck, title: 'Transparent Pricing', desc: 'No hidden charges. Jo package me likha hai, wahi milega.' },
  { icon: Clock, title: 'On-Time Delivery', desc: 'Clear timelines and weekly progress updates on every project.' },
  { icon: ShieldCheck, title: 'Quality Guaranteed', desc: 'Revisions included until the output matches the brief.' },
  { icon: Headphones, title: 'Direct Support', desc: 'You talk to me directly — no account managers in between.' },
];

const faqs = [
  { q: 'Can I customise a package?', a: 'Yes. Every package is a starting point — tell me your scope and budget and I will build a custom plan for you.' },
  { q: 'What is the payment structure?', a: 'Usually 50% advance to start and 50% on delivery. For larger projects we split it into milestones.' },
  { q: 'How long does a project take?', a: 'A standard website takes 7–15 days. Design and video work is usually delivered within 2–5 days per batch.' },
  { q: 'Do you offer monthly retainers?', a: 'Yes — social media marketing, content and maintenance work are available on a monthly retainer basis.' },
];

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map((f) => ({
    '@type': 'Question',
    name: f.q,
    acceptedAnswer: { '@type': 'Answer', text: f.a },
  })),
};

const Plans = () => {
  return (
    <>
      <Helmet>
        <title>Plans & Pricing | Pruthvirajsinh Makwana</title>
        <meta name="description" content="Web development, design, video and marketing packages with transparent pricing. Pick a plan or request a custom quote." />
        <link rel="canonical" href="https://pruthvirajsinh.in/plans" />
        <meta property="og:title" content="Plans & Pricing — Pruthvirajsinh Makwana" />
        <meta property="og:description" content="Transparent packages for web development, design, video editing and digital marketing. Custom plans available." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://pruthvirajsinh.in/plans" />
        <meta property="og:image" content="https://pruthvirajsinh.in/favicon.jpg" />
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
      </Helmet>

      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="pt-20">
          {/* Hero */}
          <section className="py-20 sm:py-28 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-background to-background" />
            <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[150px]" />
            <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-secondary/10 rounded-full blur-[120px]" />

            <div className="container mx-auto px-4 sm:px-6 relative z-10">
              <ScrollReveal animation="fade-up">
                <div className="text-center max-w-3xl mx-auto">
                  <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 rounded-full text-sm font-medium text-primary mb-8">
                    <Sparkles className="w-4 h-4" />
                    Plans & Pricing
                  </div>
                  <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                    Simple Plans,{' '}
                    <span className="bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
                      Serious Results
                    </span>
                  </h1>
                  <p className="text-muted-foreground text-base sm:text-lg leading-relaxed mb-8">
                    Choose a package that matches your goals — or request a fully custom plan built around your scope and budget.
                  </p>
                  <div className="flex flex-wrap justify-center gap-3">
                    <Button asChild size="lg">
                      <a href="#packages">
                        View Packages
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </a>
                    </Button>
                    <Button asChild size="lg" variant="outline">
                      <Link to="/contact">Talk to me</Link>
                    </Button>
                  </div>
                </div>
              </ScrollReveal>
            </div>
          </section>

          {/* Packages */}
          <PackagesSection />

          {/* Why these plans */}
          <section className="py-20 relative">
            <div className="container mx-auto px-4 sm:px-6">
              <ScrollReveal animation="fade-up">
                <div className="text-center max-w-2xl mx-auto mb-12">
                  <h2 className="font-heading text-3xl sm:text-4xl font-bold mb-4">What Every Plan Includes</h2>
                  <p className="text-muted-foreground">Same standards on every project, whichever package you pick.</p>
                </div>
              </ScrollReveal>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
                {highlights.map((item, idx) => (
                  <ScrollReveal key={item.title} animation="fade-up" delay={idx * 100}>
                    <div className="group h-full rounded-2xl border border-border/60 bg-card p-6 transition-all duration-500 hover:-translate-y-1.5 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/5">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/15 to-secondary/15 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-500">
                        <item.icon className="w-6 h-6 text-primary" />
                      </div>
                      <h3 className="font-heading text-lg font-semibold mb-2">{item.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                    </div>
                  </ScrollReveal>
                ))}
              </div>
            </div>
          </section>

          {/* FAQ */}
          <section className="py-20 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/10 to-background" />
            <div className="container mx-auto px-4 sm:px-6 relative z-10">
              <ScrollReveal animation="fade-up">
                <div className="text-center max-w-2xl mx-auto mb-12">
                  <h2 className="font-heading text-3xl sm:text-4xl font-bold mb-4">Pricing FAQs</h2>
                  <p className="text-muted-foreground">Quick answers before you get in touch.</p>
                </div>
              </ScrollReveal>

              <div className="max-w-3xl mx-auto space-y-4">
                {faqs.map((f, idx) => (
                  <ScrollReveal key={f.q} animation="fade-up" delay={idx * 80}>
                    <div className="rounded-2xl border border-border/60 bg-card p-6">
                      <h3 className="font-heading text-lg font-semibold mb-2">{f.q}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">{f.a}</p>
                    </div>
                  </ScrollReveal>
                ))}
              </div>

              <ScrollReveal animation="fade-up" delay={300}>
                <div className="mt-14 text-center">
                  <p className="text-muted-foreground mb-4">Still unsure which plan fits? Let's figure it out together.</p>
                  <Button asChild size="lg" className="group">
                    <Link to="/contact">
                      Get a Free Consultation
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
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

export default Plans;
