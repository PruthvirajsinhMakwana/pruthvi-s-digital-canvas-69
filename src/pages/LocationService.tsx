import { useParams, Link, Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { WhatsAppButton } from '@/components/WhatsAppButton';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowRight, CheckCircle2, MapPin, Sparkles, Star } from 'lucide-react';
import { findService, findCity, seoCities, seoServices } from '@/data/seoLocations';

const LocationService = () => {
  const { service: serviceSlug, city: citySlug } = useParams();
  const service = findService(serviceSlug || '');
  const city = findCity(citySlug || '');

  if (!service || !city) return <Navigate to="/services" replace />;

  const title = `${service.name} in ${city.name} | Pruthvirajsinh Makwana`;
  const description = `Hire a trusted freelancer for ${service.name.toLowerCase()} in ${city.name}, ${city.state}. ${service.short} Starting ${service.priceFrom}.`;
  const url = `https://pruthvirajsinh.in/services/${service.slug}/in/${city.slug}`;
  const h1 = `${service.name} in ${city.name}, ${city.state}`;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: `${service.name} in ${city.name}`,
    serviceType: service.name,
    description,
    provider: {
      '@type': 'Person',
      name: 'Pruthvirajsinh Makwana',
      url: 'https://pruthvirajsinh.in',
    },
    areaServed: { '@type': 'City', name: city.name, containedInPlace: city.state },
    offers: { '@type': 'Offer', priceCurrency: 'INR', price: service.priceFrom.replace(/[^\d]/g, '') },
  };

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: service.faq.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };

  // Related pages: other cities for this service + other services for this city
  const relatedCities = seoCities.filter((c) => c.slug !== city.slug).slice(0, 8);
  const relatedServices = seoServices.filter((s) => s.slug !== service.slug);

  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={url} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={url} />
        <meta property="og:image" content="https://pruthvirajsinh.in/favicon.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
        <script type="application/ld+json">{JSON.stringify(faqJsonLd)}</script>
      </Helmet>

      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="pt-20">
          {/* Hero */}
          <section className="relative py-16 sm:py-24 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-background to-background" />
            <div className="absolute top-10 left-1/4 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[140px]" />
            <div className="container mx-auto px-4 sm:px-6 relative z-10">
              <nav className="text-sm text-muted-foreground mb-6 flex items-center gap-2 flex-wrap">
                <Link to="/" className="hover:text-primary">Home</Link> /
                <Link to="/services" className="hover:text-primary">Services</Link> /
                <Link to={`/services/${service.slug}`} className="hover:text-primary">{service.name}</Link> /
                <span className="text-foreground">{city.name}</span>
              </nav>

              <div className="max-w-4xl">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full text-sm text-primary mb-6">
                  <MapPin className="w-4 h-4" /> Serving {city.name}, {city.state}
                </div>
                <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                  {h1}
                </h1>
                <p className="text-lg sm:text-xl text-muted-foreground mb-4 leading-relaxed">
                  {service.short}
                </p>
                <p className="text-base text-muted-foreground mb-8">{city.intro}</p>

                <div className="flex flex-wrap gap-4">
                  <Button size="lg" className="px-8 h-12 group" asChild>
                    <Link to="/contact">
                      Get a Free Quote
                      <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </Button>
                  <Button size="lg" variant="outline" className="px-8 h-12" asChild>
                    <a href={`https://wa.me/917016592727?text=Hi, I need ${service.name} in ${city.name}`} target="_blank" rel="noopener noreferrer">
                      WhatsApp Now
                    </a>
                  </Button>
                </div>

                <div className="flex flex-wrap items-center gap-6 mt-8 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-primary text-primary" /> 5.0 client rating
                  </div>
                  <div>Starting {service.priceFrom}</div>
                  <div>50+ projects delivered</div>
                </div>
              </div>
            </div>
          </section>

          {/* Benefits */}
          <section className="py-16 border-t border-border/30">
            <div className="container mx-auto px-4 sm:px-6">
              <h2 className="font-heading text-3xl sm:text-4xl font-bold mb-4">
                Why choose me for {service.name.toLowerCase()} in {city.name}
              </h2>
              <p className="text-muted-foreground max-w-2xl mb-10">
                Freelance-run means no agency overhead — direct communication, faster turnaround, and pricing that works for {city.name} businesses.
              </p>
              <div className="grid sm:grid-cols-2 gap-4">
                {service.benefits.map((b, i) => (
                  <Card key={i} className="p-5 flex items-start gap-3 hover:border-primary/50 transition-colors">
                    <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-foreground">{b}</span>
                  </Card>
                ))}
              </div>
            </div>
          </section>

          {/* Deliverables */}
          <section className="py-16 border-t border-border/30 bg-muted/20">
            <div className="container mx-auto px-4 sm:px-6 max-w-4xl">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full text-sm text-primary mb-4">
                <Sparkles className="w-4 h-4" /> What you get
              </div>
              <h2 className="font-heading text-3xl sm:text-4xl font-bold mb-8">
                {service.name} package for {city.name} clients
              </h2>
              <ul className="space-y-3">
                {service.deliverables.map((d, i) => (
                  <li key={i} className="flex items-start gap-3 p-4 bg-card rounded-lg border border-border/50">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-sm font-bold">
                      {i + 1}
                    </span>
                    <span className="text-foreground">{d}</span>
                  </li>
                ))}
              </ul>
              <p className="text-muted-foreground mt-6">
                All packages come with a written scope, milestones, and post-delivery support. Prices start at <strong className="text-foreground">{service.priceFrom}</strong> and scale with project size.
              </p>
            </div>
          </section>

          {/* FAQ */}
          <section className="py-16 border-t border-border/30">
            <div className="container mx-auto px-4 sm:px-6 max-w-3xl">
              <h2 className="font-heading text-3xl sm:text-4xl font-bold mb-8">
                {service.name} in {city.name} — FAQs
              </h2>
              <div className="space-y-4">
                {service.faq.map((f, i) => (
                  <Card key={i} className="p-6">
                    <h3 className="font-heading text-lg font-semibold mb-2">{f.q}</h3>
                    <p className="text-muted-foreground">{f.a}</p>
                  </Card>
                ))}
              </div>
            </div>
          </section>

          {/* Related pages (internal linking for SEO) */}
          <section className="py-16 border-t border-border/30 bg-muted/20">
            <div className="container mx-auto px-4 sm:px-6">
              <h2 className="font-heading text-2xl sm:text-3xl font-bold mb-8">
                {service.name} in other cities
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-12">
                {relatedCities.map((c) => (
                  <Link
                    key={c.slug}
                    to={`/services/${service.slug}/in/${c.slug}`}
                    className="p-3 bg-card border border-border/50 rounded-lg text-sm hover:border-primary hover:text-primary transition-all text-center"
                  >
                    {service.name} in {c.name}
                  </Link>
                ))}
              </div>

              <h2 className="font-heading text-2xl sm:text-3xl font-bold mb-8">
                Other services in {city.name}
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                {relatedServices.map((s) => (
                  <Link
                    key={s.slug}
                    to={`/services/${s.slug}/in/${city.slug}`}
                    className="p-3 bg-card border border-border/50 rounded-lg text-sm hover:border-primary hover:text-primary transition-all text-center"
                  >
                    {s.name} in {city.name}
                  </Link>
                ))}
              </div>
            </div>
          </section>

          {/* CTA */}
          <section className="py-20 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/5 to-background" />
            <div className="container mx-auto px-4 sm:px-6 relative z-10 max-w-3xl text-center">
              <h2 className="font-heading text-3xl sm:text-4xl font-bold mb-4">
                Ready to start your {service.name.toLowerCase()} project in {city.name}?
              </h2>
              <p className="text-muted-foreground mb-8">
                Free 20-min consultation. Written proposal within 24 hours.
              </p>
              <Button size="lg" className="px-10 h-14" asChild>
                <Link to="/contact">Contact Me <ArrowRight className="w-5 h-5 ml-2" /></Link>
              </Button>
            </div>
          </section>
        </main>
        <Footer />
        <WhatsAppButton />
      </div>
    </>
  );
};

export default LocationService;
