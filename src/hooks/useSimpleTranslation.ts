import { useCallback } from 'react';
import type { CVData, BilingualContent } from '../types/cv';

// Traductor simple que agrega [EN] para testing
const simpleTranslate = (text: string): string => {
  if (!text || text.trim() === '') return text;
  return `[EN] ${text}`;
};

export function useSimpleTranslation() {
  const translateCVData = useCallback(async (originalData: CVData): Promise<BilingualContent<CVData>> => {
    console.log('🔄 Iniciando traducción simple...');
    
    // Simular delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Crear versión en inglés
    const englishData: CVData = {
      personalData: {
        ...originalData.personalData,
        // Los datos personales no se traducen
      },
      profile: {
        summary: simpleTranslate(originalData.profile.summary),
      },
      education: originalData.education.map(item => ({
        ...item,
        institution: simpleTranslate(item.institution),
        degree: simpleTranslate(item.degree),
        field: simpleTranslate(item.field),
        description: simpleTranslate(item.description || ''),
      })),
      experience: originalData.experience.map(item => ({
        ...item,
        company: simpleTranslate(item.company),
        position: simpleTranslate(item.position),
        description: simpleTranslate(item.description),
      })),
      skills: originalData.skills.map(item => ({
        ...item,
        name: simpleTranslate(item.name),
      })),
      languages: originalData.languages,
      hobbies: originalData.hobbies.map(item => ({
        ...item,
        name: simpleTranslate(item.name),
      })),
      certificates: originalData.certificates.map(item => ({
        ...item,
        name: simpleTranslate(item.name),
        issuer: simpleTranslate(item.issuer),
      })),
      courses: originalData.courses.map(item => ({
        ...item,
        name: simpleTranslate(item.name),
        institution: simpleTranslate(item.institution),
      })),
      projects: originalData.projects.map(item => ({
        ...item,
        name: simpleTranslate(item.name),
        description: simpleTranslate(item.description),
      })),
      volunteers: originalData.volunteers.map(item => ({
        ...item,
        organization: simpleTranslate(item.organization),
        role: simpleTranslate(item.role),
        description: simpleTranslate(item.description),
      })),
    };

    const result: BilingualContent<CVData> = {
      es: originalData,
      en: englishData,
    };

    console.log('✅ Traducción completada:', result);
    return result;
  }, []);

  return { translateCVData };
}
