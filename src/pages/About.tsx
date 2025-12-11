import { Helmet } from 'react-helmet-async';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { AboutSection } from '@/components/AboutSection';
import { EsportsAboutSection } from '@/components/EsportsAboutSection';
import { WhatsAppButton } from '@/components/WhatsAppButton';

const About = () => {
  return (
    <>
      <Helmet>
        <title>About - Pruthvirajsinh Makwana | IT Professional & Esports Commentator</title>
        <meta name="description" content="Learn about Pruthvirajsinh Makwana - IT Professional specializing in Web Development, Digital Marketing, Graphic Design AND Esports Commentator, Event Host, and Tournament Organizer." />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="pt-20">
          {/* IT Professional Section */}
          <AboutSection />
          
          {/* Esports Professional Section */}
          <EsportsAboutSection />
        </main>
        <Footer />
        <WhatsAppButton />
      </div>
    </>
  );
};

export default About;