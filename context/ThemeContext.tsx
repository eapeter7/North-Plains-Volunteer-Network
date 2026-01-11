
import React, { createContext, useContext, useState, useEffect } from 'react';

// --- Translation Dictionary ---
import { DICTIONARY } from '../services/translations';

type Language = 'en' | 'es';

interface ThemeContextType {
  textSize: 'normal' | 'large' | 'xl';
  setTextSize: (size: 'normal' | 'large' | 'xl') => void;
  highContrast: boolean;
  setHighContrast: (enabled: boolean) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [textSize, setTextSize] = useState<'normal' | 'large' | 'xl'>('normal');
  const [highContrast, setHighContrast] = useState(false);
  const [language, setLanguage] = useState<Language>('en');

  // Helper Translation Function
  const t = (key: string) => {
    // @ts-ignore
    return DICTIONARY[language][key] || key;
  };

  // Apply Root Level Font Scaling
  useEffect(() => {
    const root = document.documentElement;
    switch (textSize) {
      case 'large':
        root.style.fontSize = '18px'; // ~112.5%
        break;
      case 'xl':
        root.style.fontSize = '22px'; // ~137.5%
        break;
      default:
        // Reduced from 16px to 14px as requested for the smallest option
        root.style.fontSize = '14px';
    }
  }, [textSize]);

  // Apply High Contrast Body Class
  useEffect(() => {
    if (highContrast) {
      document.body.classList.add('high-contrast');
      document.documentElement.classList.add('dark');
    } else {
      document.body.classList.remove('high-contrast');
      document.documentElement.classList.remove('dark');
    }
  }, [highContrast]);

  return (
    <ThemeContext.Provider value={{ textSize, setTextSize, highContrast, setHighContrast, language, setLanguage, t }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
