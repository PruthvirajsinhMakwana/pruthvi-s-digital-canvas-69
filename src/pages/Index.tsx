import { Navigation } from '@/components/Navigation';
import { HeroSection } from '@/components/HeroSection';
import { AboutSection } from '@/components/AboutSection';
import { ServicesSection } from '@/components/ServicesSection';
import { ContactSection } from '@/components/ContactSection';
import { Footer } from '@/components/Footer';
import { WhatsAppButton } from '@/components/WhatsAppButton';
import { Helmet } from 'react-helmet-async';

const Index = () => {
  return (
    <>
      <Helmet>
        <title>Pruthvirajsinh Makwana | IT Professional - Web Developer, Digital Marketer, Creative Designer</title>
        <meta name="description" content="I'm Pruthvirajsinh Makwana, an IT Professional with strong creative and technical skills in Web Development, Digital Marketing, Graphic Design, Video Editing, and Branding. I build modern, responsive websites and engaging digital content for brands and individuals." />
        <meta name="keywords" content="Pruthvirajsinh Makwana, Pruthviraj Makwana, IT Professional, Web Developer India, Digital Marketer India, Graphic Designer, Video Editor, AI Tools Expert, Creative Technologist, Portfolio Website, SEO Optimization, Branding, Gujarat India" />
        <meta property="og:title" content="Pruthvirajsinh Makwana | IT Professional & Creative Technologist" />
        <meta property="og:description" content="I combine creativity, technology, and design to build digital experiences that make an impact. Web Development, Digital Marketing, Graphic Design, Video Editing & Branding." />
        <meta property="og:type" content="website" />
        <meta name="author" content="Pruthvirajsinh Makwana" />
        <link rel="canonical" href="https://pruthviraj.dev" />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Navigation />
        <main>
          <HeroSection />
          <AboutSection />
          <ServicesSection />
          <ContactSection />
        </main>
        <Footer />
        <WhatsAppButton />
      </div>
    </>
  );
};

export default Index;
