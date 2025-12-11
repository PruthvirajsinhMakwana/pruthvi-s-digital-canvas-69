import { useState, useEffect } from 'react';
import { Sun, Moon, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

type Theme = 'dark' | 'light' | 'neon';

export const ThemeToggle = () => {
  const [theme, setTheme] = useState<Theme>('dark');

  useEffect(() => {
    const savedTheme = localStorage.getItem('portfolio-theme') as Theme;
    if (savedTheme) {
      setTheme(savedTheme);
      applyTheme(savedTheme);
    }
  }, []);

  const applyTheme = (newTheme: Theme) => {
    const root = document.documentElement;
    root.classList.remove('light', 'neon');
    
    if (newTheme === 'light') {
      root.classList.add('light');
    } else if (newTheme === 'neon') {
      root.classList.add('neon');
    }
  };

  const cycleTheme = () => {
    const themes: Theme[] = ['dark', 'light', 'neon'];
    const currentIndex = themes.indexOf(theme);
    const nextIndex = (currentIndex + 1) % themes.length;
    const nextTheme = themes[nextIndex];
    
    setTheme(nextTheme);
    applyTheme(nextTheme);
    localStorage.setItem('portfolio-theme', nextTheme);
  };

  const getIcon = () => {
    switch (theme) {
      case 'light':
        return <Sun size={18} />;
      case 'neon':
        return <Sparkles size={18} />;
      default:
        return <Moon size={18} />;
    }
  };

  const getLabel = () => {
    switch (theme) {
      case 'light':
        return 'Light';
      case 'neon':
        return 'Neon';
      default:
        return 'Dark';
    }
  };

  return (
    <button
      onClick={cycleTheme}
      className={cn(
        'flex items-center gap-2 px-3 py-2 rounded-lg',
        'bg-muted/50 hover:bg-muted border border-border/50',
        'text-muted-foreground hover:text-foreground',
        'transition-all duration-300',
        theme === 'neon' && 'neon-glow'
      )}
      aria-label={`Switch theme. Current: ${getLabel()}`}
    >
      {getIcon()}
      <span className="text-sm font-medium hidden sm:block">{getLabel()}</span>
    </button>
  );
};
