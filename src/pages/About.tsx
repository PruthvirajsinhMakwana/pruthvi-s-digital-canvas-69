import { Helmet } from 'react-helmet-async';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { AboutSection } from '@/components/AboutSection';
import { WhatsAppButton } from '@/components/WhatsAppButton';

const About = () => {
  return (
    <>
      <Helmet>
        <title>About - Pruthvirajsinh Makwana | IT Professional</title>
        <meta name="description" content="Learn about Pruthvirajsinh Makwana, an aspiring IT Professional specializing in Web Development, Digital Marketing, Graphic Design, Video Editing, and Branding." />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="pt-20">
          <AboutSection />
        </main>
        <Footer />
        <WhatsAppButton />
      </div>
    </>
  );
};

export default About;
