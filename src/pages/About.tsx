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
        <title>About Pruthvirajsinh Makwana | IT Pro & Esports Host</title>
        <meta name="description" content="About Pruthvirajsinh Makwana — IT Professional in Web Dev, Digital Marketing, Design, plus Esports commentator, host & tournament organiser." />
        <link rel="canonical" href="https://pruthvirajsinh.in/about" />
        <meta property="og:title" content="About Pruthvirajsinh Makwana" />
        <meta property="og:description" content="IT Professional in Web Development, Digital Marketing & Design — also an Esports commentator, host and tournament organiser from Gujarat." />
        <meta property="og:type" content="profile" />
        <meta property="og:url" content="https://pruthvirajsinh.in/about" />
        <meta property="og:image" content="https://pruthvirajsinh.in/favicon.jpg" />
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