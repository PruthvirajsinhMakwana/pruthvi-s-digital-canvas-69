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
  "alternateName": ["Pruthviraj Makwana", "Pruthvi Makwana", "Pruthvirajsinh"],
  "jobTitle": "IT Professional & Creative Technologist",
  "description": "IT Professional specializing in Web Development, Digital Marketing, Graphic Design, Video Editing, and Branding from Gujarat, India",
  "url": "https://pruthvirajsinh.com",
  "image": "https://pruthvirajsinh.com/favicon.jpg",
  "sameAs": [
    "https://linkedin.com/in/pruthvirajsinh-makwana",
    "https://github.com/pruthvirajsinh-makwana",
    "https://instagram.com/pruthvirajsinh.makwana",
    "https://twitter.com/pruthvirajsinh"
  ],
  "knowsAbout": [
    "Web Development",
    "Digital Marketing",
    "Graphic Design",
    "Video Editing",
    "SEO",
    "Branding",
    "UI/UX Design",
    "Esports Management"
  ],
  "address": {
    "@type": "PostalAddress",
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
        <title>Pruthvirajsinh Makwana | IT Professional - Web Developer, Digital Marketing Expert Gujarat India</title>
        <meta name="description" content="Pruthvirajsinh Makwana - Leading IT Professional, Web Developer, Digital Marketing Expert, Graphic Designer & Video Editor from Gujarat, India. Hire for Web Development, SEO, Branding & Creative Services." />
        <meta name="keywords" content="Pruthvirajsinh Makwana, Pruthvirajsinh, Pruthviraj Makwana, Pruthvi Makwana, pruthvirajsinh makwana, Web Developer Gujarat, Digital Marketing Expert India, Graphic Designer, Video Editor, UI/UX Designer, Branding Specialist, IT Professional India, Freelance Web Developer Gujarat, Best Web Developer India, SEO Expert Gujarat" />
        <meta property="og:title" content="Pruthvirajsinh Makwana | IT Professional & Creative Technologist" />
        <meta property="og:description" content="Helping Brands Grow With Creativity, Technology & Digital Innovation. Web Development, Digital Marketing, Graphic Design & Video Editing Services." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://pruthvirajsinh.com" />
        <meta property="og:image" content="https://pruthvirajsinh.com/favicon.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@pruthvirajsinh" />
        <meta name="twitter:title" content="Pruthvirajsinh Makwana | IT Professional" />
        <meta name="twitter:description" content="Web Developer, Digital Marketing Expert & Creative Designer from Gujarat, India" />
        <meta name="author" content="Pruthvirajsinh Makwana" />
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        <link rel="canonical" href="https://pruthvirajsinh.com" />
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
