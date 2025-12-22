import { useState, forwardRef } from 'react';
import { MessageCircle } from 'lucide-react';
import { useSiteSettings } from '@/hooks/useSiteSettings';

export const WhatsAppButton = forwardRef<HTMLDivElement>((_, ref) => {
  const [isHovered, setIsHovered] = useState(false);
  const { settings } = useSiteSettings();
  
  // Support both wa.link URLs and phone numbers
  const whatsappUrl = settings.whatsappNumber.startsWith('http') 
    ? settings.whatsappNumber 
    : `https://wa.me/${settings.whatsappNumber.replace(/[^\d]/g, '')}?text=${encodeURIComponent("Hi! I'm interested in your services.")}`;

  return (
    <div ref={ref} className="fixed bottom-6 right-6 z-50">
      {/* Tooltip */}
      <div
        className={`absolute bottom-full right-0 mb-3 glass-card rounded-xl p-3 transition-all duration-300 ${
          isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'
        }`}
      >
        <p className="text-sm font-medium text-foreground whitespace-nowrap">Chat with me!</p>
        <div className="absolute bottom-0 right-6 transform translate-y-1/2 rotate-45 w-2 h-2 bg-card border-r border-b border-border/30" />
      </div>

      {/* Button */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="relative flex items-center justify-center w-14 h-14 rounded-full bg-[#25D366] text-white shadow-xl hover:scale-110 hover:shadow-2xl transition-all duration-300 group"
        style={{
          boxShadow: '0 0 20px rgba(37, 211, 102, 0.4)',
        }}
        aria-label="Chat on WhatsApp"
      >
        <MessageCircle className="w-7 h-7 group-hover:scale-110 transition-transform" />
        
        {/* Pulse Animation */}
        <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-30" />
      </a>
    </div>
  );
});

WhatsAppButton.displayName = 'WhatsAppButton';
