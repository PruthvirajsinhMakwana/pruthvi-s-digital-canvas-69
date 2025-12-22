// Scroll reveal animation hook and component
import { useEffect, useRef, useState } from 'react';
interface UseScrollRevealOptions {
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
}

export const useScrollReveal = (options: UseScrollRevealOptions = {}) => {
  const { threshold = 0.1, rootMargin = '0px', triggerOnce = true } = options;
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (triggerOnce) {
            observer.unobserve(element);
          }
        } else if (!triggerOnce) {
          setIsVisible(false);
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [threshold, rootMargin, triggerOnce]);

  return { ref, isVisible };
};

// Component wrapper for scroll reveal
interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  animation?: 'fade-up' | 'fade-down' | 'fade-left' | 'fade-right' | 'scale' | 'none';
  delay?: number;
  duration?: number;
}

export function ScrollReveal({
  children,
  className = '',
  animation = 'fade-up',
  delay = 0,
  duration = 600,
}: ScrollRevealProps) {
  const { ref, isVisible } = useScrollReveal();

  const getAnimationStyles = () => {
    const baseStyles = {
      transition: `opacity ${duration}ms ease-out, transform ${duration}ms ease-out`,
      transitionDelay: `${delay}ms`,
    };

    if (!isVisible) {
      switch (animation) {
        case 'fade-up':
          return { ...baseStyles, opacity: 0, transform: 'translateY(40px)' };
        case 'fade-down':
          return { ...baseStyles, opacity: 0, transform: 'translateY(-40px)' };
        case 'fade-left':
          return { ...baseStyles, opacity: 0, transform: 'translateX(-40px)' };
        case 'fade-right':
          return { ...baseStyles, opacity: 0, transform: 'translateX(40px)' };
        case 'scale':
          return { ...baseStyles, opacity: 0, transform: 'scale(0.9)' };
        default:
          return baseStyles;
      }
    }

    return { ...baseStyles, opacity: 1, transform: 'translateY(0) translateX(0) scale(1)' };
  };

  return (
    <div ref={ref} className={className} style={getAnimationStyles()}>
      {children}
    </div>
  );
}
