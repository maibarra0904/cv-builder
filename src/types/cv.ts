export interface PersonalData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  photo?: string;
  linkedIn?: string;
  website?: string;
  title?: string; // Título profesional
  location?: string; // Campo unificado de localización
}

// Estructura para contenido bilingüe simplificada
export type SupportedLanguage = 'es' | 'en';

export interface BilingualContent<T = unknown> {
  es: T; // Contenido en español
  en: T; // Contenido en inglés (traducido)
}

export interface Profile {
  summary: string;
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description?: string;
  location?: string;
  visible?: boolean;
}

export interface Experience {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
  achievements?: string[];
  location?: string;
  visible?: boolean;
}

export interface Skill {
  id: string;
  name: string;
  level: 1 | 2 | 3 | 4 | 5;
  category: 'technical' | 'soft' | 'language';
  visible?: boolean;
}

export interface Language {
  id: string;
  name: string;
  level: 'Básico' | 'Intermedio' | 'Avanzado' | 'Nativo';
  visible?: boolean;
}

export interface Hobby {
  id: string;
  name: string;
  description?: string;
  visible?: boolean;
}

export interface Certificate {
  id: string;
  name: string;
  issuer: string;
  date: string;
  url?: string;
  visible?: boolean;
}

export interface Course {
  id: string;
  name: string;
  institution: string;
  duration: string;
  date: string;
  description?: string;
  url?: string;
  visible?: boolean;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  technologies: string[];
  url?: string;
  startDate: string;
  endDate: string;
  visible?: boolean;
}

export interface Volunteer {
  id: string;
  organization: string;
  role: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
  visible?: boolean;
}

export interface CVData {
  personalData: PersonalData;
  profile: Profile;
  education: Education[];
  experience: Experience[];
  skills: Skill[];
  languages: Language[];
  hobbies: Hobby[];
  certificates: Certificate[];
  courses: Course[];
  projects: Project[];
  volunteers: Volunteer[];
}

export interface SectionConfig {
  personalData: { visible: boolean; order: number };
  profile: { visible: boolean; order: number };
  education: { visible: boolean; order: number };
  experience: { visible: boolean; order: number };
  skills: { visible: boolean; order: number };
  languages: { visible: boolean; order: number };
  hobbies: { visible: boolean; order: number };
  certificates: { visible: boolean; order: number };
  courses: { visible: boolean; order: number };
  projects: { visible: boolean; order: number };
  volunteers: { visible: boolean; order: number };
}

export type CVTemplate = 'modern' | 'classic' | 'creative' | 'gradient';

// Tipos para componentes/documentos PDF usados por react-pdf
import type React from 'react';

export type DocumentProps = {
  data: CVData;
  sectionConfig: SectionConfig;
  language?: SupportedLanguage;
};

export type DocumentComponentType = React.FC<DocumentProps>;

export type DocumentElement = React.ReactElement<DocumentProps>;
