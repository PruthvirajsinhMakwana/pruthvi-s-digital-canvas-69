import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { WhatsAppButton } from '@/components/WhatsAppButton';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowRight, CheckCircle2, MapPin, Sparkles, Star } from 'lucide-react';
import { seoServices } from '@/data/seoLocations';

const URL = 'https://pruthvirajsinh.in/freelancer-in-ahmedabad';
const TITLE = 'Best Freelancer in Ahmedabad | Web, Design, Video & Marketing';
const DESCRIPTION =
  'Looking for the best freelancer in Ahmedabad? Pruthvirajsinh Makwana builds websites and delivers design, video editing, SEO and social media marketing for Ahmedabad businesses. Free quote in 24 hours.';

const skills = [
  { t: 'Website Development', d: 'Business sites, landing pages, e-commerce and WordPress builds that load fast and convert.' },
  { t: 'SEO & Local Ranking', d: 'On-page SEO, Google Business Profile and local keyword work so Ahmedabad customers find you.' },
  { t: 'Social Media Marketing', d: 'Content calendars, ad creatives and campaign management for Instagram, Facebook and YouTube.' },
  { t: 'Graphic Design', d: 'Logos, brand kits, packaging, posters and ad creatives with a consistent identity.' },
  { t: 'Video Editing & Shooting', d: 'Reels, YouTube edits, product videos and on-location shoots across Gujarat.' },
  { t: 'IT Support & Automation', d: 'Email hosting, domains, migrations, dashboards and workflow automation.' },
];

const reasons = [
  'Direct communication with the freelancer doing the work — no agency layers',
  'Ahmedabad and Gujarat market experience across 50+ delivered projects',
  'Transparent fixed pricing with a written scope before work starts',
  'Fast turnaround: most landing pages ship within 5–7 days',
  'Co-founder of PROFIQUES, so full-team support is available for larger work',
  'Post-delivery support and training included with every project',
];

const faq = [
  {
    q: 'Who is the best freelancer in Ahmedabad for websites and marketing?',
    a: 'Pruthvirajsinh Makwana works with Ahmedabad businesses across web development, SEO, social media marketing, graphic design and video editing — a single point of contact instead of coordinating multiple vendors.',
  },
  {
    q: 'How much does a freelancer in Ahmedabad charge for a website?',
    a: 'A single landing page starts around ₹4,999, a complete business website around ₹14,999, and e-commerce builds are quoted after a short scoping call. Monthly marketing retainers start at ₹9,999.',
  },
  {
    q: 'Do you meet clients in person in Ahmedabad?',
    a: 'Yes. In-person meetings and shoots are possible in Ahmedabad, Gandhinagar and nearby cities. Remote clients get calls, shared documents and weekly progress updates.',
  },
  {
    q: 'How fast can the project start?',
    a: 'Send your requirement on WhatsApp or the contact form and you get a quote within 24 hours. Work usually starts within 2 working days of approval.',
  },
  {
    q: 'Do you handle SEO after the website is live?',
    a: 'Yes. Technical SEO, content, local listings and monthly reporting are available as an ongoing plan so the site keeps gaining traffic.',
  },
];

const personJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  name: 'Pruthvirajsinh Makwana — Freelancer in Ahmedabad',
  description: DESCRIPTION,
  url: URL,
  image: 'https://pruthvirajsinh.in/favicon.jpg',
  priceRange: '₹₹',
  areaServed: [
    { '@type': 'City', name: 'Ahmedabad' },
    { '@type': 'City', name: 'Gandhinagar' },
    { '@type': 'State', name: 'Gujarat' },
  ],
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Ahmedabad',
    addressRegion: 'Gujarat',
    addressCountry: 'IN',
  },
  provider: {
    '@type': 'Person',
    name: 'Pruthvirajsinh Makwana',
    jobTitle: 'Freelance Web Developer & Digital Marketer',
    url: 'https://pruthvirajsinh.in/',
  },
  knowsAbout: skills.map((s) => s.t),
};

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faq.map((f) => ({
    '@type': 'Question',
    name: f.q,
    acceptedAnswer: { '@type': 'Answer', text: f.a },
  })),
};

const breadcrumbJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://pruthvirajsinh.in/' },
    { '@type': 'ListItem', position: 2, name: 'Freelancer in Ahmedabad', item: URL },
  ],
};

const FreelancerAhmedabad = () => {
  return (
    <>
      <Helmet>
        <title>{TITLE}</title>
        <meta name="description" content={DESCRIPTION} />
        <meta
          name="keywords"
          content="best freelancer in Ahmedabad, freelancer Ahmedabad, freelance web developer Ahmedabad, freelance graphic designer Ahmedabad, freelance video editor Ahmedabad, SEO freelancer Ahmedabad, social media marketing freelancer Ahmedabad"
        />
        <link rel="canonical" href={URL} />
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1" />
        <meta property="og:title" content={TITLE} />
        <meta property="og:description" content={DESCRIPTION} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={URL} />
        <meta property="og:locale" content="en_IN" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={TITLE} />
        <meta name="twitter:description" content={DESCRIPTION} />
        <meta name="geo.region" content="IN-GJ" />
        <meta name="geo.placename" content="Ahmedabad" />
        <script type="application/ld+json">{JSON.stringify(personJsonLd)}</script>
        <script type="application/ld+json">{JSON.stringify(faqJsonLd)}</script>
        <script type="application/ld+json">{JSON.stringify(breadcrumbJsonLd)}</script>
      </Helmet>

      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="pt-20">
          {/* Hero */}
          <section className="relative py-16 sm:py-24 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-background to-background" />
            <div className="container mx-auto px-4 sm:px-6 relative z-10">
              <nav className="text-sm text-muted-foreground mb-6 flex items-center gap-2 flex-wrap">
                <Link to="/" className="hover:text-primary">Home</Link> /
                <span className="text-foreground">Freelancer in Ahmedabad</span>
              </nav>

              <div className="max-w-4xl">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full text-sm text-primary mb-6">
                  <MapPin className="w-4 h-4" /> Serving Ahmedabad &amp; all of Gujarat
                </div>
                <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                  Best Freelancer in Ahmedabad for Websites, Design, Video &amp; Marketing
                </h1>
                <p className="text-lg sm:text-xl text-muted-foreground mb-4 leading-relaxed">
                  I'm Pruthvirajsinh Makwana — a freelance web developer, designer, video editor and digital
                  marketer working with Ahmedabad businesses, startups and creators.
                </p>
                <p className="text-base text-muted-foreground mb-8">
                  One freelancer for your website, brand design, reels and ads — with clear pricing, fixed
                  timelines and honest reporting.
                </p>

                <div className="flex flex-wrap gap-4">
                  <Button size="lg" className="px-8 h-12 group" asChild>
                    <Link to="/contact">
                      Get a Free Quote
                      <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </Button>
                  <Button size="lg" variant="outline" className="px-8 h-12" asChild>
                    <a
                      href="https://wa.me/917016592727?text=Hi,%20I%20need%20a%20freelancer%20in%20Ahmedabad"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      WhatsApp Now
                    </a>
                  </Button>
                </div>

                <div className="flex flex-wrap items-center gap-6 mt-8 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-primary text-primary" /> 5.0 client rating
                  </div>
                  <div>50+ projects delivered</div>
                  <div>Quote within 24 hours</div>
                </div>
              </div>
            </div>
          </section>

          {/* Skills */}
          <section className="py-16 border-t border-border/30">
            <div className="container mx-auto px-4 sm:px-6">
              <h2 className="font-heading text-3xl sm:text-4xl font-bold mb-4">
                Freelance services available in Ahmedabad
              </h2>
              <p className="text-muted-foreground max-w-2xl mb-10">
                Hire for one service or the full stack — everything is delivered by the same person you talk to.
              </p>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {skills.map((s) => (
                  <Card key={s.t} className="p-6 hover:border-primary/50 transition-colors">
                    <h3 className="font-heading text-lg font-semibold mb-2">{s.t}</h3>
                    <p className="text-sm text-muted-foreground">{s.d}</p>
                  </Card>
                ))}
              </div>
            </div>
          </section>

          {/* Why me */}
          <section className="py-16 border-t border-border/30 bg-muted/20">
            <div className="container mx-auto px-4 sm:px-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full text-sm text-primary mb-4">
                <Sparkles className="w-4 h-4" /> Why clients choose me
              </div>
              <h2 className="font-heading text-3xl sm:text-4xl font-bold mb-8">
                What makes a good freelancer in Ahmedabad
              </h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {reasons.map((r) => (
                  <Card key={r} className="p-5 flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-foreground">{r}</span>
                  </Card>
                ))}
              </div>
            </div>
          </section>

          {/* FAQ */}
          <section className="py-16 border-t border-border/30">
            <div className="container mx-auto px-4 sm:px-6 max-w-3xl">
              <h2 className="font-heading text-3xl sm:text-4xl font-bold mb-8">
                Hiring a freelancer in Ahmedabad — FAQs
              </h2>
              <div className="space-y-4">
                {faq.map((f) => (
                  <Card key={f.q} className="p-6">
                    <h3 className="font-heading text-lg font-semibold mb-2">{f.q}</h3>
                    <p className="text-muted-foreground">{f.a}</p>
                  </Card>
                ))}
              </div>
            </div>
          </section>

          {/* Internal links */}
          <section className="py-16 border-t border-border/30 bg-muted/20">
            <div className="container mx-auto px-4 sm:px-6">
              <h2 className="font-heading text-2xl sm:text-3xl font-bold mb-8">
                Explore services in Ahmedabad
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 mb-10">
                {seoServices.map((s) => (
                  <Link
                    key={s.slug}
                    to={`/services/${s.slug}/in/ahmedabad`}
                    className="p-3 bg-card border border-border/50 rounded-lg text-sm hover:border-primary hover:text-primary transition-all text-center"
                  >
                    {s.name} in Ahmedabad
                  </Link>
                ))}
              </div>
              <div className="flex flex-wrap gap-3">
                <Button variant="outline" asChild>
                  <Link to="/services">All Services</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link to="/plans">See Plans &amp; Pricing</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link to="/locations">Other Cities</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link to="/blog">Read the Blog</Link>
                </Button>
              </div>
            </div>
          </section>

          {/* CTA */}
          <section className="py-20 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/5 to-background" />
            <div className="container mx-auto px-4 sm:px-6 relative z-10 max-w-3xl text-center">
              <h2 className="font-heading text-3xl sm:text-4xl font-bold mb-4">
                Ready to start your Ahmedabad project?
              </h2>
              <p className="text-muted-foreground mb-8">
                Share your requirement and get a clear quote, timeline and scope within 24 hours.
              </p>
              <Button size="lg" className="px-8 h-12 group" asChild>
                <Link to="/contact">
                  Contact Me
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
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

export default FreelancerAhmedabad;
