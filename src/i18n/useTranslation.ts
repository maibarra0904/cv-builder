import { useContext, useCallback } from 'react';
import { LanguageContext } from '../context/LanguageContext';
import { translations } from './translations';

export function useTranslation() {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    // Fallback simple t
    return {
      t: (path: string, fallback?: string) => {
        const keys = path.split('.');
        let node: any = translations.es;
        for (const k of keys) {
          if (!node) return fallback ?? path;
          node = node[k];
        }
        return typeof node === 'string' ? node : (fallback ?? path);
      },
      currentLanguage: 'es',
      setLanguage: (_: 'es' | 'en') => {}
    };
  }

  const { currentLanguage, setCurrentLanguage } = ctx;

  const t = useCallback((path: string, fallback?: any) => {
    const keys = path.split('.');
    let node: any = translations[currentLanguage];
    for (const k of keys) {
      if (node == null) return fallback ?? path;
      node = node[k];
    }
    return node == null ? (fallback ?? path) : node;
  }, [currentLanguage]);

  return { t, currentLanguage, setLanguage: setCurrentLanguage } as const;
}

export default useTranslation;
