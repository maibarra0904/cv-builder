import { useContext, useCallback } from 'react';
import { LanguageContext } from '../context/LanguageContext';
import { translations } from './translations';
import type { SupportedLanguage } from '../types/cv';

type UseTranslationResult = {
  t: (path: string, fallback?: string) => string;
  currentLanguage: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
};

export function useTranslation(): UseTranslationResult {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    // Fallback simple t
    return {
      t: (path: string, fallback?: string) => {
        const keys = path.split('.');
        let node: unknown = translations.es;
        for (const k of keys) {
          if (!node || typeof node !== 'object') return fallback ?? path;
          node = (node as Record<string, unknown>)[k];
        }
        return typeof node === 'string' ? node : (fallback ?? path);
      },
      currentLanguage: 'es',
      setLanguage: (_: SupportedLanguage) => {}
    };
  }

  const { currentLanguage, setCurrentLanguage } = ctx;

  const t = useCallback((path: string, fallback?: string) => {
    const keys = path.split('.');
    let node: unknown = translations[currentLanguage];
    for (const k of keys) {
      if (node == null || typeof node !== 'object') return fallback ?? path;
      node = (node as Record<string, unknown>)[k];
    }
    return typeof node === 'string' ? node : (fallback ?? path);
  }, [currentLanguage]);

  return { t, currentLanguage, setLanguage: setCurrentLanguage } as const;
}

export default useTranslation;
