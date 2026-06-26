'use client';

import { useEffect } from 'react';
import { useTheme } from '@/lib/theme-context';

// Syncs the customer theme choice onto <html> so the global
// `.theme-light` CSS overrides in globals.css can take effect.
export function ThemeRoot({ children }: { children: React.ReactNode }) {
  const { theme } = useTheme();

  useEffect(() => {
    document.documentElement.classList.toggle('theme-light', theme === 'light');
  }, [theme]);

  return <>{children}</>;
}
