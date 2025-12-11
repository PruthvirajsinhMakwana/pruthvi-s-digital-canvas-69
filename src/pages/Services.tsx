import { Helmet } from 'react-helmet-async';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { ServicesSection } from '@/components/ServicesSection';
import { WhatsAppButton } from '@/components/WhatsAppButton';

const Services = () => {
  return (
    <>
      <Helmet>
        <title>Services - Pruthvirajsinh Makwana | Web Development, Digital Marketing, Design</title>
        <meta name="description" content="Professional services including Web Development, Digital Marketing, Graphic Design, Video Editing, UI/UX Design, and IT Support by Pruthvirajsinh Makwana." />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="pt-20">
          <ServicesSection />
        </main>
        <Footer />
        <WhatsAppButton />
      </div>
    </>
  );
};

export default Services;
