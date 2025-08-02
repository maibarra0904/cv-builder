import { useCallback } from 'react';
import type { CVData, BilingualContent } from '../types/cv';

// Función de traducción automática simple (se puede expandir con API real)
const translateText = async (text: string, targetLang: 'en' | 'es'): Promise<string> => {
  if (!text.trim()) return text;
  
  // Diccionario básico para traducciones comunes
  const translations: Record<string, Record<string, string>> = {
    'en': {
      // Títulos y secciones
      'Desarrollador Frontend': 'Frontend Developer',
      'Desarrollador Backend': 'Backend Developer',
      'Desarrollador Full Stack': 'Full Stack Developer',
      'Desarrollador de Software': 'Software Developer',
      'Ingeniero de Software': 'Software Engineer',
      'Diseñador UI/UX': 'UI/UX Designer',
      'Analista de Sistemas': 'Systems Analyst',
      'Administrador de Base de Datos': 'Database Administrator',
      'Gerente de Proyecto': 'Project Manager',
      'Consultor IT': 'IT Consultant',
      
      // Educación
      'Universidad': 'University',
      'Instituto': 'Institute',
      'Colegio': 'College',
      'Licenciatura': 'Bachelor\'s Degree',
      'Maestría': 'Master\'s Degree',
      'Doctorado': 'PhD',
      'Ingeniería': 'Engineering',
      'Informática': 'Computer Science',
      'Sistemas': 'Systems',
      'Administración': 'Administration',
      'Gestión': 'Management',
      
      // Experiencia
      'Empresa': 'Company',
      'Desarrollé': 'Developed',
      'Implementé': 'Implemented',
      'Colaboré': 'Collaborated',
      'Gestioné': 'Managed',
      'Lideré': 'Led',
      'Diseñé': 'Designed',
      'Creé': 'Created',
      'Mantuve': 'Maintained',
      'Optimicé': 'Optimized',
      
      // Niveles de idiomas
      'Básico': 'Basic',
      'Intermedio': 'Intermediate',
      'Avanzado': 'Advanced',
      'Nativo': 'Native',
      
      // Palabras comunes
      'en': 'at',
      'de': 'of',
      'con': 'with',
      'para': 'for',
      'desde': 'since',
      'hasta': 'until',
      'actual': 'current',
      'presente': 'present'
    },
    'es': {
      // Reverse translations
      'Frontend Developer': 'Desarrollador Frontend',
      'Backend Developer': 'Desarrollador Backend',
      'Full Stack Developer': 'Desarrollador Full Stack',
      'Software Developer': 'Desarrollador de Software',
      'Software Engineer': 'Ingeniero de Software',
      'UI/UX Designer': 'Diseñador UI/UX',
      'Systems Analyst': 'Analista de Sistemas',
      'Database Administrator': 'Administrador de Base de Datos',
      'Project Manager': 'Gerente de Proyecto',
      'IT Consultant': 'Consultor IT',
      
      'University': 'Universidad',
      'Institute': 'Instituto',
      'College': 'Colegio',
      'Bachelor\'s Degree': 'Licenciatura',
      'Master\'s Degree': 'Maestría',
      'PhD': 'Doctorado',
      'Engineering': 'Ingeniería',
      'Computer Science': 'Informática',
      'Systems': 'Sistemas',
      'Administration': 'Administración',
      'Management': 'Gestión',
      
      'Company': 'Empresa',
      'Developed': 'Desarrollé',
      'Implemented': 'Implementé',
      'Collaborated': 'Colaboré',
      'Managed': 'Gestioné',
      'Led': 'Lideré',
      'Designed': 'Diseñé',
      'Created': 'Creé',
      'Maintained': 'Mantuve',
      'Optimized': 'Optimicé',
      
      'Basic': 'Básico',
      'Intermediate': 'Intermedio',
      'Advanced': 'Avanzado',
      'Native': 'Nativo',
      
      'at': 'en',
      'of': 'de',
      'with': 'con',
      'for': 'para',
      'since': 'desde',
      'until': 'hasta',
      'current': 'actual',
      'present': 'presente'
    }
  };

  // Buscar traducción directa
  const directTranslation = translations[targetLang]?.[text];
  if (directTranslation) {
    return directTranslation;
  }

  // Buscar traducciones parciales en el texto
  let translatedText = text;
  Object.entries(translations[targetLang] || {}).forEach(([original, translated]) => {
    const regex = new RegExp(`\\b${original}\\b`, 'gi');
    translatedText = translatedText.replace(regex, translated);
  });

  return translatedText !== text ? translatedText : text;
};

// Hook principal para traducir CVs
export function useTranslateCV() {
  const translateCVData = useCallback(async (cvData: CVData): Promise<BilingualContent<CVData>> => {
    console.log('Iniciando traducción del CV...');
    
    // Clonar datos originales en español
    const esData = JSON.parse(JSON.stringify(cvData));
    
    // Crear versión en inglés
    const enData: CVData = {
      personalData: {
        ...cvData.personalData,
        title: await translateText(cvData.personalData.title || '', 'en'),
      },
      profile: {
        summary: await translateText(cvData.profile.summary, 'en'),
      },
      education: await Promise.all(
        cvData.education.map(async (edu) => ({
          ...edu,
          institution: await translateText(edu.institution, 'en'),
          degree: await translateText(edu.degree, 'en'),
          field: await translateText(edu.field, 'en'),
          description: edu.description ? await translateText(edu.description, 'en') : undefined,
        }))
      ),
      experience: await Promise.all(
        cvData.experience.map(async (exp) => ({
          ...exp,
          company: await translateText(exp.company, 'en'),
          position: await translateText(exp.position, 'en'),
          description: await translateText(exp.description, 'en'),
          achievements: exp.achievements ? 
            await Promise.all(exp.achievements.map(a => translateText(a, 'en'))) : 
            undefined,
        }))
      ),
      skills: cvData.skills.map(skill => ({
        ...skill,
        name: skill.name, // Los nombres de habilidades técnicas generalmente no se traducen
      })),
      languages: cvData.languages.map(lang => ({
        ...lang,
        level: lang.level, // Los niveles se traducen por el diccionario
      })),
      hobbies: await Promise.all(
        cvData.hobbies.map(async (hobby) => ({
          ...hobby,
          name: await translateText(hobby.name, 'en'),
          description: hobby.description ? await translateText(hobby.description, 'en') : undefined,
        }))
      ),
      certificates: await Promise.all(
        cvData.certificates.map(async (cert) => ({
          ...cert,
          name: await translateText(cert.name, 'en'),
          issuer: await translateText(cert.issuer, 'en'),
        }))
      ),
      courses: await Promise.all(
        cvData.courses.map(async (course) => ({
          ...course,
          name: await translateText(course.name, 'en'),
          institution: await translateText(course.institution, 'en'),
          description: course.description ? await translateText(course.description, 'en') : undefined,
        }))
      ),
      projects: await Promise.all(
        cvData.projects.map(async (project) => ({
          ...project,
          name: await translateText(project.name, 'en'),
          description: await translateText(project.description, 'en'),
          technologies: project.technologies, // Las tecnologías no se traducen
        }))
      ),
      volunteers: await Promise.all(
        cvData.volunteers.map(async (vol) => ({
          ...vol,
          organization: await translateText(vol.organization, 'en'),
          role: await translateText(vol.role, 'en'),
          description: await translateText(vol.description, 'en'),
        }))
      ),
    };

    console.log('Traducción completada');
    
    return {
      es: esData,
      en: enData,
    };
  }, []);

  return {
    translateCVData,
  };
}
