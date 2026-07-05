import { Navigation } from '@/components/Navigation';
import { HeroSection } from '@/components/HeroSection';
import { AboutSection } from '@/components/AboutSection';
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
  "jobTitle": "Web Developer & IT Professional",
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
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Gujarat",
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
        <title>Pruthvirajsinh Makwana – Web Developer & IT Professional</title>
        <meta name="description" content="Portfolio of Pruthvirajsinh Makwana — Web Developer, Digital Marketer, Designer & Video Editor from Gujarat, India." />
        <meta name="keywords" content="Pruthvirajsinh Makwana, Web Developer Gujarat, IT Professional Gujarat, Freelance Web Developer, Graphic Designer Gujarat, Video Editor Gujarat, Digital Marketing Freelancer" />
        <meta property="og:title" content="Pruthvirajsinh Makwana – Web Developer & IT Professional" />
        <meta property="og:description" content="Portfolio of Pruthvirajsinh Makwana — Web Developer, Digital Marketer, Designer & Video Editor from Gujarat, India." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://pruthvirajsinh.in/" />
        <meta property="og:image" content="https://pruthvirajsinh.in/favicon.jpg" />
        <meta property="og:site_name" content="Pruthvirajsinh Makwana Portfolio" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@pruthvirajsinh" />
        <meta name="twitter:title" content="Pruthvirajsinh Makwana – Web Developer & IT Professional" />
        <meta name="twitter:description" content="Portfolio of Pruthvirajsinh Makwana — Web Developer, Digital Marketer, Designer & Video Editor from Gujarat, India." />
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
