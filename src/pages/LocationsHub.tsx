import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { WhatsAppButton } from '@/components/WhatsAppButton';
import { MapPin } from 'lucide-react';
import { seoServices, seoCities } from '@/data/seoLocations';

const LocationsHub = () => {
  const gujarat = seoCities.filter((c) => c.region === 'gujarat');
  const india = seoCities.filter((c) => c.region === 'india');
  const url = 'https://pruthvirajsinh.in/locations';

  return (
    <>
      <Helmet>
        <title>Service Areas | Web, Design & Marketing across India</title>
        <meta name="description" content="Freelance web development, digital marketing, video editing and design services across Gujarat and major Indian cities." />
        <link rel="canonical" href={url} />
        <meta property="og:title" content="Service Areas — Pruthvirajsinh Makwana" />
        <meta property="og:description" content="Serving Ahmedabad, Surat, Rajkot, Mumbai, Delhi, Bangalore and 12+ more cities across India." />
        <meta property="og:url" content={url} />
        <meta property="og:image" content="https://pruthvirajsinh.in/favicon.jpg" />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="pt-20">
          <section className="py-16 sm:py-24 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-background to-background" />
            <div className="container mx-auto px-4 sm:px-6 relative z-10">
              <div className="max-w-3xl">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full text-sm text-primary mb-6">
                  <MapPin className="w-4 h-4" /> Serving 18+ cities
                </div>
                <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
                  Service areas across India
                </h1>
                <p className="text-lg text-muted-foreground">
                  Find dedicated landing pages for every service in every city I serve — {seoServices.length} services × {seoCities.length} cities = {seoServices.length * seoCities.length} focused pages.
                </p>
              </div>
            </div>
          </section>

          {[{ title: 'Gujarat', cities: gujarat }, { title: 'Rest of India', cities: india }].map((group) => (
            <section key={group.title} className="py-16 border-t border-border/30">
              <div className="container mx-auto px-4 sm:px-6">
                <h2 className="font-heading text-3xl font-bold mb-10">{group.title}</h2>
                <div className="space-y-10">
                  {group.cities.map((city) => (
                    <div key={city.slug}>
                      <h3 className="font-heading text-xl font-semibold mb-3">
                        <Link to={`/services/web-development/in/${city.slug}`} className="hover:text-primary">
                          {city.name}, {city.state}
                        </Link>
                      </h3>
                      <p className="text-sm text-muted-foreground mb-4">{city.intro}</p>
                      <div className="flex flex-wrap gap-2">
                        {seoServices.map((s) => (
                          <Link
                            key={s.slug}
                            to={`/services/${s.slug}/in/${city.slug}`}
                            className="px-3 py-1.5 bg-card border border-border/50 rounded-full text-xs hover:border-primary hover:text-primary transition-all"
                          >
                            {s.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          ))}
        </main>
        <Footer />
        <WhatsAppButton />
      </div>
    </>
  );
};

export default LocationsHub;
