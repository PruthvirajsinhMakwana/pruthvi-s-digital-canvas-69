import { Helmet } from 'react-helmet-async';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { ContactSection } from '@/components/ContactSection';
import { WhatsAppButton } from '@/components/WhatsAppButton';

const Contact = () => {
  return (
    <>
      <Helmet>
        <title>Contact Pruthvirajsinh Makwana | Get in Touch</title>
        <meta name="description" content="Contact Pruthvirajsinh Makwana for freelance, internships, or collaborations in Web Development, Digital Marketing and Design." />
        <link rel="canonical" href="https://pruthvirajsinh.in/contact" />
        <meta property="og:title" content="Contact Pruthvirajsinh Makwana" />
        <meta property="og:description" content="Reach out for freelance projects, internships, or collaborations in Web Development, Digital Marketing and Design." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://pruthvirajsinh.in/contact" />
        <meta property="og:image" content="https://pruthvirajsinh.in/favicon.jpg" />
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
