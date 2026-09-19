import { Navigation } from '@/components/Navigation';
import { HeroSection } from '@/components/HeroSection';
import { AboutSection } from '@/components/AboutSection';
import { ServicesSection } from '@/components/ServicesSection';
import { PackagesSection } from '@/components/PackagesSection';
import { CertificationsSection } from '@/components/CertificationsSection';
import { TestimonialsSection } from '@/components/TestimonialsSection';
import { ContactSection } from '@/components/ContactSection';
import { Footer } from '@/components/Footer';
import { WhatsAppButton } from '@/components/WhatsAppButton';
import { Helmet } from 'react-helmet-async';

const structuredData = {
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "Pruthvirajsinh Makwana",
  "alternateName": [
    "Pruthviraj",
    "Pruthviraj Makwana",
    "Pruthvirajsinh",
    "Makwana Pruthviraj",
    "Makwana Pruthvirajsinh",
    "Pruthvi Makwana",
    "Pruthvi"
  ],
  "jobTitle": "Freelance Web Developer & Digital Marketer",
  "description": "Pruthvirajsinh Makwana is an IT Professional from Gujarat, India, specializing in Web Development, Digital Marketing, Graphic Design, and Video Editing.",
  "url": "https://pruthvirajsinh.com",
  "image": "https://pruthvirajsinh.com/favicon.jpg",
  "sameAs": [
    "https://www.linkedin.com/in/pruthvirajsinh-makwana-635974393/",
    "https://github.com/pruthvirajsinh",
    "https://www.facebook.com/pruthvirajsinh.makwana.12",
    "https://www.instagram.com/pruthvi.this.ae",
    "https://twitter.com/pruthvirajsinh"
  ],
  "knowsAbout": [
    "Web Development",
    "Digital Marketing",
    "Graphic Design",
    "Video Editing",
    "SEO",
    "IT Tools",
    "Content Creation",
    "UI/UX Design",
    "Branding",
    "Esports Management"
  ],
  "areaServed": ["Ahmedabad", "Gandhinagar", "Rajkot", "Surat", "Vadodara", "Gujarat", "India"],
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Ahmedabad",
    "addressRegion": "Gujarat",
    "addressCountry": "India"
  },
  "alumniOf": {
    "@type": "EducationalOrganization",
    "name": "Shati Business School"
  }
};

const Index = () => {
  return (
    <>
      <Helmet>
        <title>Best Freelancer in Ahmedabad | Pruthvirajsinh Makwana</title>
        <meta name="description" content="Hire the best freelancer in Ahmedabad — Pruthvirajsinh Makwana builds websites and delivers SEO, social media marketing, graphic design and video editing for Gujarat businesses." />
        <meta name="keywords" content="best freelancer in Ahmedabad, freelancer Ahmedabad, freelance web developer Ahmedabad, freelance graphic designer Ahmedabad, freelance video editor Ahmedabad, SEO freelancer Ahmedabad, Pruthvirajsinh Makwana, Web Developer Gujarat, IT Professional Gujarat, Freelance Web Developer, Graphic Designer Gujarat, Video Editor Gujarat, Digital Marketing Freelancer" />
        <meta property="og:title" content="Best Freelancer in Ahmedabad | Pruthvirajsinh Makwana" />
        <meta property="og:description" content="Hire the best freelancer in Ahmedabad — Pruthvirajsinh Makwana builds websites and delivers SEO, social media marketing, graphic design and video editing for Gujarat businesses." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://pruthvirajsinh.in/" />
        <meta property="og:image" content="https://pruthvirajsinh.in/favicon.jpg" />
        <meta property="og:site_name" content="Pruthvirajsinh Makwana Portfolio" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@pruthvirajsinh" />
        <meta name="twitter:title" content="Best Freelancer in Ahmedabad | Pruthvirajsinh Makwana" />
        <meta name="twitter:description" content="Hire the best freelancer in Ahmedabad — Pruthvirajsinh Makwana builds websites and delivers SEO, social media marketing, graphic design and video editing for Gujarat businesses." />
        <meta name="twitter:image" content="https://pruthvirajsinh.in/favicon.jpg" />
        <meta name="author" content="Pruthvirajsinh Makwana" />
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        <link rel="canonical" href="https://pruthvirajsinh.in/" />
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      </Helmet>

      <div className="min-h-screen bg-background">
        <Navigation />
        <main>
          <HeroSection />
          <AboutSection />
          <ServicesSection />
          <CertificationsSection />
          <PackagesSection />
          <TestimonialsSection />
          <ContactSection />
        </main>
        <Footer />
        <WhatsAppButton />
      </div>
    </>
  );
};

export default Index;
