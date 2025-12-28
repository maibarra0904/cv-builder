import { createContext, useState, useCallback, useMemo } from 'react';
import type { ReactNode } from 'react';
import type { CVData, BilingualContent } from '../types/cv';

export interface LanguageContextType {
  currentLanguage: 'es' | 'en';
  setCurrentLanguage: (lang: 'es' | 'en') => void;
  bilingualData: BilingualContent<CVData> | null;
  setBilingualData: (data: BilingualContent<CVData>) => void;
  getCurrentData: () => CVData | null;
}

// eslint-disable-next-line react-refresh/only-export-components
export const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: Readonly<{ children: ReactNode }>) {
  const [currentLanguage, setCurrentLanguage] = useState<'es' | 'en'>(() => {
    try {
      const stored = localStorage.getItem('language');
      return (stored === 'en' || stored === 'es') ? (stored as 'es' | 'en') : 'es';
    } catch {
      return 'es';
    }
  });
  const [bilingualData, setBilingualDataState] = useState<BilingualContent<CVData> | null>(() => {
    try {
      const stored = localStorage.getItem('bilingualData');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const setBilingualData = useCallback((data: BilingualContent<CVData>) => {
    localStorage.setItem('bilingualData', JSON.stringify(data));
    setBilingualDataState(data);
  }, []);

  const getCurrentData = useCallback(() => {
    if (!bilingualData) return null;
    return bilingualData[currentLanguage];
  }, [bilingualData, currentLanguage]);

  const setLanguage = useCallback((lang: 'es' | 'en') => {
    try { localStorage.setItem('language', lang); } catch {console.error('Could not store language preference');};
    setCurrentLanguage(lang);
  }, []);

  const value = useMemo(() => ({
    currentLanguage,
    setCurrentLanguage: setLanguage,
    bilingualData,
    setBilingualData,
    getCurrentData
  }), [currentLanguage, setLanguage, bilingualData, setBilingualData, getCurrentData]);

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}


