import { Navigation } from '@/components/Navigation';
import { HeroSection } from '@/components/HeroSection';
import { AboutSection } from '@/components/AboutSection';
import { ServicesSection } from '@/components/ServicesSection';
import { ProjectsSection } from '@/components/ProjectsSection';
import { ContactSection } from '@/components/ContactSection';
import { Footer } from '@/components/Footer';
import { WhatsAppButton } from '@/components/WhatsAppButton';
import { Helmet } from 'react-helmet-async';

const Index = () => {
  return (
    <>
      <Helmet>
        <title>Pruthvirajsinh Makwana | IT Professional - Web Developer, Digital Marketing & Design</title>
        <meta name="description" content="Pruthvirajsinh Makwana is a skilled IT professional specializing in Web Development, Digital Marketing, Graphic Design, Video Editing, and Branding. Helping brands grow with creativity and innovation." />
        <meta name="keywords" content="Pruthvirajsinh Makwana, Web Developer, Digital Marketing, Graphic Design, Video Editing, UI/UX Design, Branding, IT Professional, Gujarat, India" />
        <meta property="og:title" content="Pruthvirajsinh Makwana | IT Professional" />
        <meta property="og:description" content="Helping Brands Grow With Creativity, Technology & Digital Innovation." />
        <meta property="og:type" content="website" />
        <link rel="canonical" href="https://pruthviraj.dev" />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Navigation />
        <main>
          <HeroSection />
          <AboutSection />
          <ServicesSection />
          <ProjectsSection />
          <ContactSection />
        </main>
        <Footer />
        <WhatsAppButton />
      </div>
    </>
  );
};

export default Index;
