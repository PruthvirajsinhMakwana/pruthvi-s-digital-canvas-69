import { Heart, ArrowUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSiteSettings } from '@/hooks/useSiteSettings';
import { useLinktree } from '@/hooks/useLinktree';

export const Footer = () => {
  const { settings } = useSiteSettings();
  const { settings: linktreeSettings } = useLinktree();
  
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative py-12 border-t border-border/30">
      <div className="absolute inset-0 tech-grid opacity-10" />
      
      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          {/* Logo & Copyright */}
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center font-heading font-bold text-primary-foreground neon-glow">
              {settings.name.charAt(0)}
            </div>
            <div>
              <p className="font-heading font-semibold text-foreground">{settings.name}</p>
              <p className="text-sm text-muted-foreground flex items-center gap-1">
                Made with <Heart className="w-3 h-3 text-destructive fill-destructive" /> in India
              </p>
            </div>
          </div>

          {/* Quick Links */}
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-sm text-muted-foreground">
            <Link to="/" className="hover:text-primary transition-colors">Home</Link>
            <Link to="/about" className="hover:text-primary transition-colors">About</Link>
            <Link to="/services" className="hover:text-primary transition-colors">Services</Link>
            <Link to="/blog" className="hover:text-primary transition-colors">Blog</Link>
            <Link to="/contact" className="hover:text-primary transition-colors">Contact</Link>
          </div>

          {/* Back to Top */}
          <button
            onClick={scrollToTop}
            className="w-10 h-10 rounded-xl glass-card flex items-center justify-center hover:neon-glow transition-all duration-300 group"
            aria-label="Back to top"
          >
            <ArrowUp className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
          </button>
        </div>

        <div className="mt-8 pt-8 border-t border-border/30 text-center">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} {settings.name}. All rights reserved.
            {/* Hidden admin access - click the dot */}
            <Link 
              to="/auth" 
              className="ml-1 inline-block w-1.5 h-1.5 rounded-full bg-muted-foreground/30 hover:bg-primary transition-colors cursor-pointer"
              title=""
              aria-label="Admin access"
            />
          </p>
          
          {/* Pruthvi Links - Hidden Linktree access */}
          {linktreeSettings.footer_link_visible && (
            <Link 
              to="/links" 
              className="mt-3 inline-block text-xs text-muted-foreground/40 hover:text-muted-foreground/60 transition-colors"
            >
              Pruthvi Links
            </Link>
          )}
        </div>
      </div>
    </footer>
  );
};
