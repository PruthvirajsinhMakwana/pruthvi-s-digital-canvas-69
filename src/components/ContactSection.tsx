import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Mail, Phone, MapPin, Send, Linkedin, Github, Instagram, Twitter } from 'lucide-react';
import { toast } from 'sonner';
import { ScrollReveal } from '@/hooks/useScrollReveal';
import { supabase } from '@/integrations/supabase/client';
import { useSiteSettings } from '@/hooks/useSiteSettings';

export const ContactSection = () => {
  const { settings } = useSiteSettings();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lastSubmitTime, setLastSubmitTime] = useState<number>(0);

  // Rate limit: 1 submission per 60 seconds
  const RATE_LIMIT_MS = 60000;

  const contactInfo = [
    { icon: Mail, label: 'Email', value: settings.email, href: `mailto:${settings.email}` },
    { icon: Phone, label: 'Phone', value: '+91 7016592727', href: 'tel:+917016592727' },
    { icon: MapPin, label: 'Location', value: 'Gujarat, India', href: '#' },
  ];

  const socialLinks = [
    { icon: Linkedin, href: settings.linkedinUrl, label: 'LinkedIn' },
    { icon: Github, href: settings.githubUrl, label: 'GitHub' },
    { icon: Instagram, href: settings.instagramUrl, label: 'Instagram' },
    { icon: Twitter, href: settings.twitterUrl, label: 'Twitter' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Rate limiting check
    const now = Date.now();
    if (now - lastSubmitTime < RATE_LIMIT_MS) {
      const remainingSeconds = Math.ceil((RATE_LIMIT_MS - (now - lastSubmitTime)) / 1000);
      toast.error(`Please wait ${remainingSeconds} seconds before submitting again`);
      return;
    }
    
    // Client-side validation
    const trimmedName = formData.name.trim();
    const trimmedEmail = formData.email.trim();
    const trimmedPhone = formData.phone.trim();
    const trimmedMessage = formData.message.trim();
    
    if (trimmedName.length > 100) {
      toast.error('Name is too long (max 100 characters)');
      return;
    }
    if (trimmedEmail.length > 255) {
      toast.error('Email is too long (max 255 characters)');
      return;
    }
    if (trimmedPhone.length > 20) {
      toast.error('Phone number is too long (max 20 characters)');
      return;
    }
    if (trimmedMessage.length < 10) {
      toast.error('Message is too short (min 10 characters)');
      return;
    }
    if (trimmedMessage.length > 2000) {
      toast.error('Message is too long (max 2000 characters)');
      return;
    }
    
    setIsSubmitting(true);
    setLastSubmitTime(now);
    
    try {
      const { error } = await supabase
        .from('contact_messages')
        .insert({
          name: trimmedName,
          email: trimmedEmail,
          phone: trimmedPhone || null,
          message: trimmedMessage,
        });

      if (error) throw error;

      // Send Telegram notification (don't block on failure)
      supabase.functions.invoke('send-telegram-notification', {
        body: {
          name: trimmedName,
          email: trimmedEmail,
          phone: trimmedPhone || null,
          message: trimmedMessage,
        },
      }).catch((err) => {
        console.error('Telegram notification failed:', err);
      });
      
      toast.success('Message sent successfully!', {
        description: "I'll get back to you as soon as possible.",
      });
      
      setFormData({ name: '', email: '', phone: '', message: '' });
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-16 sm:py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 tech-grid opacity-10" />
      <div className="absolute top-0 left-1/4 w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] bg-primary/8 rounded-full blur-[100px] sm:blur-[150px]" />
      <div className="absolute bottom-0 right-1/4 w-[250px] sm:w-[400px] h-[250px] sm:h-[400px] bg-secondary/8 rounded-full blur-[80px] sm:blur-[120px]" />

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        {/* Section Header */}
        <ScrollReveal animation="fade-up">
          <div className="text-center mb-10 sm:mb-16">
            <span className="inline-block px-3 sm:px-4 py-1.5 sm:py-2 bg-primary/10 text-primary rounded-full text-xs sm:text-sm font-medium mb-3 sm:mb-4">
              📬 Let's Connect
            </span>
            <h2 className="font-heading text-2xl sm:text-3xl lg:text-5xl font-bold mb-3 sm:mb-4">
              Get In <span className="text-primary">Touch</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-sm sm:text-lg px-4">
              I'm always open to new opportunities, collaborations, and exciting projects. Let's create something amazing together!
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 sm:gap-8 max-w-6xl mx-auto">
          {/* Contact Info - Left Side */}
          <ScrollReveal animation="fade-right" delay={100}>
            <div className="lg:col-span-2 space-y-4 sm:space-y-6 order-2 lg:order-1">
              {/* Contact Cards */}
              <div className="bg-card border border-border rounded-xl sm:rounded-2xl p-4 sm:p-6 hover:border-primary/30 transition-all duration-300">
                <h3 className="font-heading text-lg sm:text-xl font-bold mb-4 sm:mb-6 flex items-center gap-2">
                  <span className="w-7 h-7 sm:w-8 sm:h-8 bg-primary/10 rounded-lg flex items-center justify-center text-sm sm:text-base">
                    📍
                  </span>
                  Contact Info
                </h3>
                <div className="space-y-2 sm:space-y-4">
                  {contactInfo.map((item, index) => (
                    <a
                      key={index}
                      href={item.href}
                      className="flex items-center gap-3 sm:gap-4 group p-2.5 sm:p-3 rounded-lg sm:rounded-xl hover:bg-muted/50 transition-all duration-300"
                    >
                      <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-lg sm:rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center group-hover:from-primary group-hover:to-primary/80 transition-all duration-300 shadow-sm flex-shrink-0">
                        <item.icon className="w-4 h-4 sm:w-5 sm:h-5 text-primary group-hover:text-primary-foreground transition-colors" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-[10px] sm:text-xs text-muted-foreground uppercase tracking-wider">{item.label}</div>
                        <div className="font-medium text-foreground text-sm sm:text-base truncate">{item.value}</div>
                      </div>
                    </a>
                  ))}
                </div>
              </div>

              {/* Social Links */}
              <div className="bg-card border border-border rounded-xl sm:rounded-2xl p-4 sm:p-6 hover:border-primary/30 transition-all duration-300">
                <h3 className="font-heading text-lg sm:text-xl font-bold mb-4 sm:mb-6 flex items-center gap-2">
                  <span className="w-7 h-7 sm:w-8 sm:h-8 bg-secondary/10 rounded-lg flex items-center justify-center text-sm sm:text-base">
                    🔗
                  </span>
                  Follow Me
                </h3>
                <div className="grid grid-cols-4 gap-2 sm:gap-3">
                  {socialLinks.map((social, index) => (
                    <a
                      key={index}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="aspect-square rounded-lg sm:rounded-xl bg-muted/50 border border-border flex items-center justify-center hover:bg-primary hover:border-primary hover:scale-105 transition-all duration-300 group"
                      aria-label={social.label}
                    >
                      <social.icon className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground group-hover:text-primary-foreground transition-colors" />
                    </a>
                  ))}
                </div>
              </div>

              {/* Quick Response Badge */}
              <div className="bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20 rounded-xl sm:rounded-2xl p-4 sm:p-5 text-center">
                <div className="flex items-center justify-center gap-2 mb-1.5 sm:mb-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-xs sm:text-sm font-medium text-foreground">Quick Response</span>
                </div>
                <p className="text-[10px] sm:text-xs text-muted-foreground">
                  Usually responds within 24 hours
                </p>
              </div>
            </div>
          </ScrollReveal>

          {/* Contact Form - Right Side */}
          <ScrollReveal animation="fade-left" delay={200}>
            <div className="lg:col-span-3 order-1 lg:order-2">
              <div className="bg-card border border-border rounded-xl sm:rounded-2xl p-5 sm:p-8 hover:border-primary/30 transition-all duration-300">
                <h3 className="font-heading text-lg sm:text-xl font-bold mb-4 sm:mb-6 flex items-center gap-2">
                  <span className="w-7 h-7 sm:w-8 sm:h-8 bg-primary/10 rounded-lg flex items-center justify-center text-sm sm:text-base">
                    ✉️
                  </span>
                  Send a Message
                </h3>
                <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <label className="text-xs sm:text-sm font-medium text-foreground mb-1.5 sm:mb-2 block">Name *</label>
                      <Input
                        required
                        placeholder="Your full name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="bg-muted/30 border-border/50 focus:border-primary h-10 sm:h-12 text-sm sm:text-base"
                      />
                    </div>
                    <div>
                      <label className="text-xs sm:text-sm font-medium text-foreground mb-1.5 sm:mb-2 block">Email *</label>
                      <Input
                        required
                        type="email"
                        placeholder="your@email.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="bg-muted/30 border-border/50 focus:border-primary h-10 sm:h-12 text-sm sm:text-base"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs sm:text-sm font-medium text-foreground mb-1.5 sm:mb-2 block">Phone (Optional)</label>
                    <Input
                      type="tel"
                      placeholder="+91 XXXXX XXXXX"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="bg-muted/30 border-border/50 focus:border-primary h-10 sm:h-12 text-sm sm:text-base"
                    />
                  </div>
                  <div>
                    <label className="text-xs sm:text-sm font-medium text-foreground mb-1.5 sm:mb-2 block">Message *</label>
                    <Textarea
                      required
                      placeholder="Tell me about your project, idea, or just say hello..."
                      rows={4}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="bg-muted/30 border-border/50 focus:border-primary resize-none text-sm sm:text-base min-h-[100px] sm:min-h-[120px]"
                    />
                  </div>
                  <Button
                    type="submit"
                    size="lg"
                    className="w-full h-10 sm:h-12 text-sm sm:text-base font-semibold group"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-2">
                        <span className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                        Sending...
                      </span>
                    ) : (
                      <>
                        Send Message
                        <Send className="w-4 h-4 sm:w-5 sm:h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </Button>
                </form>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
};
