import { Helmet } from 'react-helmet-async';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { ContactSection } from '@/components/ContactSection';
import { WhatsAppButton } from '@/components/WhatsAppButton';

const Contact = () => {
  return (
    <>
      <Helmet>
        <title>Contact - Pruthvirajsinh Makwana | Get In Touch</title>
        <meta name="description" content="Get in touch with Pruthvirajsinh Makwana for collaborations, freelance opportunities, internships, and full-time roles in Web Development, Digital Marketing, and Design." />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="pt-20">
          <ContactSection />
        </main>
        <Footer />
        <WhatsAppButton />
      </div>
    </>
  );
};

export default Contact;
