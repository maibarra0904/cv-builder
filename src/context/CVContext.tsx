import { createContext, useReducer, useEffect, useCallback, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import type { CVData, SectionConfig, CVTemplate } from '../types/cv';

// Helper function for reordering arrays
function reorderArray<T>(array: T[], oldIndex: number, newIndex: number): T[] {
  const result = Array.from(array);
  const [removed] = result.splice(oldIndex, 1);
  result.splice(newIndex, 0, removed);
  return result;
}

interface CVState {
  cvData: CVData;
  sectionConfig: SectionConfig;
  currentTemplate: CVTemplate;
}

type CVAction =
  | { type: 'UPDATE_PERSONAL_DATA'; payload: Partial<CVData['personalData']> }
  | { type: 'UPDATE_PROFILE'; payload: Partial<CVData['profile']> }
  | { type: 'UPDATE_EXPERIENCE'; payload: CVData['experience'] }
  | { type: 'UPDATE_EDUCATION'; payload: CVData['education'] }
  | { type: 'UPDATE_SKILLS'; payload: CVData['skills'] }
  | { type: 'UPDATE_LANGUAGES'; payload: CVData['languages'] }
  | { type: 'UPDATE_HOBBIES'; payload: CVData['hobbies'] }
  | { type: 'UPDATE_PROJECTS'; payload: CVData['projects'] }
  | { type: 'UPDATE_COURSES'; payload: CVData['courses'] }
  | { type: 'UPDATE_CERTIFICATES'; payload: CVData['certificates'] }
  | { type: 'UPDATE_VOLUNTEERS'; payload: CVData['volunteers'] }
  | { type: 'UPDATE_SECTION_CONFIG'; payload: Partial<SectionConfig> }
  | { type: 'SET_TEMPLATE'; payload: CVTemplate }
  | { type: 'LOAD_CV_DATA'; payload: CVData }
  | { type: 'RESET_ALL' }
  | { type: 'REORDER_EXPERIENCE'; payload: { oldIndex: number; newIndex: number } }
  | { type: 'REORDER_EDUCATION'; payload: { oldIndex: number; newIndex: number } }
  | { type: 'REORDER_SKILLS'; payload: { oldIndex: number; newIndex: number } }
  | { type: 'REORDER_LANGUAGES'; payload: { oldIndex: number; newIndex: number } }
  | { type: 'REORDER_HOBBIES'; payload: { oldIndex: number; newIndex: number } }
  | { type: 'REORDER_PROJECTS'; payload: { oldIndex: number; newIndex: number } }
  | { type: 'REORDER_COURSES'; payload: { oldIndex: number; newIndex: number } }
  | { type: 'REORDER_CERTIFICATES'; payload: { oldIndex: number; newIndex: number } }
  | { type: 'REORDER_VOLUNTEERS'; payload: { oldIndex: number; newIndex: number } }
  | { type: 'REORDER_SECTIONS'; payload: { sectionKeys: (keyof SectionConfig)[] } };

const initialState: CVState = {
  cvData: {
    personalData: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      location: '',
      address: '',
      city: '',
      country: '',
      website: '',
      photo: ''
    },
    profile: {
      summary: ''
    },
    experience: [],
    education: [],
    skills: [],
    languages: [],
    hobbies: [],
    projects: [],
    courses: [],
    certificates: [],
    volunteers: []
  },
  sectionConfig: {
    personalData: { visible: true, order: 0 },
    profile: { visible: true, order: 1 },
    experience: { visible: true, order: 2 },
    education: { visible: true, order: 3 },
    skills: { visible: true, order: 4 },
    languages: { visible: false, order: 5 },
    hobbies: { visible: false, order: 6 },
    projects: { visible: false, order: 7 },
    courses: { visible: false, order: 8 },
    certificates: { visible: false, order: 9 },
    volunteers: { visible: false, order: 10 }
  },
  currentTemplate: 'modern'
};

function cvReducer(state: CVState, action: CVAction): CVState {
  switch (action.type) {
    case 'UPDATE_PERSONAL_DATA':
      return {
        ...state,
        cvData: {
          ...state.cvData,
          personalData: {
            ...state.cvData.personalData,
            ...action.payload
          }
        }
      };

    case 'UPDATE_PROFILE':
      return {
        ...state,
        cvData: {
          ...state.cvData,
          profile: {
            ...state.cvData.profile,
            ...action.payload
          }
        }
      };

    case 'UPDATE_EXPERIENCE':
      return {
        ...state,
        cvData: {
          ...state.cvData,
          experience: action.payload
        }
      };

    case 'UPDATE_EDUCATION':
      return {
        ...state,
        cvData: {
          ...state.cvData,
          education: action.payload
        }
      };

    case 'UPDATE_SKILLS':
      return {
        ...state,
        cvData: {
          ...state.cvData,
          skills: action.payload
        }
      };

    case 'UPDATE_LANGUAGES':
      return {
        ...state,
        cvData: {
          ...state.cvData,
          languages: action.payload
        }
      };

    case 'UPDATE_HOBBIES':
      return {
        ...state,
        cvData: {
          ...state.cvData,
          hobbies: action.payload
        }
      };

    case 'UPDATE_PROJECTS':
      return {
        ...state,
        cvData: {
          ...state.cvData,
          projects: action.payload
        }
      };

    case 'UPDATE_COURSES':
      return {
        ...state,
        cvData: {
          ...state.cvData,
          courses: action.payload
        }
      };

    case 'UPDATE_CERTIFICATES':
      return {
        ...state,
        cvData: {
          ...state.cvData,
          certificates: action.payload
        }
      };

    case 'UPDATE_VOLUNTEERS':
      return {
        ...state,
        cvData: {
          ...state.cvData,
          volunteers: action.payload
        }
      };

    case 'UPDATE_SECTION_CONFIG':
      return {
        ...state,
        sectionConfig: {
          ...state.sectionConfig,
          ...action.payload
        }
      };

    case 'SET_TEMPLATE':
      return {
        ...state,
        currentTemplate: action.payload
      };

    case 'LOAD_CV_DATA':
      return {
        ...state,
        cvData: action.payload
      };

    case 'RESET_ALL':
      return initialState;

    case 'REORDER_EXPERIENCE':
      return {
        ...state,
        cvData: {
          ...state.cvData,
          experience: reorderArray(state.cvData.experience, action.payload.oldIndex, action.payload.newIndex)
        }
      };

    case 'REORDER_EDUCATION':
      return {
        ...state,
        cvData: {
          ...state.cvData,
          education: reorderArray(state.cvData.education, action.payload.oldIndex, action.payload.newIndex)
        }
      };

    case 'REORDER_SKILLS':
      return {
        ...state,
        cvData: {
          ...state.cvData,
          skills: reorderArray(state.cvData.skills, action.payload.oldIndex, action.payload.newIndex)
        }
      };

    case 'REORDER_LANGUAGES':
      return {
        ...state,
        cvData: {
          ...state.cvData,
          languages: reorderArray(state.cvData.languages, action.payload.oldIndex, action.payload.newIndex)
        }
      };

    case 'REORDER_HOBBIES':
      return {
        ...state,
        cvData: {
          ...state.cvData,
          hobbies: reorderArray(state.cvData.hobbies, action.payload.oldIndex, action.payload.newIndex)
        }
      };

    case 'REORDER_PROJECTS':
      return {
        ...state,
        cvData: {
          ...state.cvData,
          projects: reorderArray(state.cvData.projects, action.payload.oldIndex, action.payload.newIndex)
        }
      };

    case 'REORDER_COURSES':
      return {
        ...state,
        cvData: {
          ...state.cvData,
          courses: reorderArray(state.cvData.courses, action.payload.oldIndex, action.payload.newIndex)
        }
      };

    case 'REORDER_CERTIFICATES':
      return {
        ...state,
        cvData: {
          ...state.cvData,
          certificates: reorderArray(state.cvData.certificates, action.payload.oldIndex, action.payload.newIndex)
        }
      };

    case 'REORDER_VOLUNTEERS':
      return {
        ...state,
        cvData: {
          ...state.cvData,
          volunteers: reorderArray(state.cvData.volunteers, action.payload.oldIndex, action.payload.newIndex)
        }
      };

    case 'REORDER_SECTIONS': {
      const newSectionConfig = { ...state.sectionConfig };
      action.payload.sectionKeys.forEach((sectionKey, index) => {
        newSectionConfig[sectionKey] = {
          ...newSectionConfig[sectionKey],
          order: index
        };
      });
      return {
        ...state,
        sectionConfig: newSectionConfig
      };
    }

    default:
      return state;
  }
}

export interface CVContextType {
  state: CVState;
  updatePersonalData: (data: Partial<CVData['personalData']>) => void;
  updateProfile: (data: Partial<CVData['profile']>) => void;
  updateExperience: (experience: CVData['experience']) => void;
  updateEducation: (education: CVData['education']) => void;
  updateSkills: (skills: CVData['skills']) => void;
  updateLanguages: (languages: CVData['languages']) => void;
  updateHobbies: (hobbies: CVData['hobbies']) => void;
  updateProjects: (projects: CVData['projects']) => void;
  updateCourses: (courses: CVData['courses']) => void;
  updateCertificates: (certificates: CVData['certificates']) => void;
  updateVolunteers: (volunteers: CVData['volunteers']) => void;
  updateSectionConfig: (config: Partial<SectionConfig>) => void;
  setTemplate: (template: CVTemplate) => void;
  loadCVData: (data: CVData) => void;
  resetAll: () => void;
  reorderExperience: (oldIndex: number, newIndex: number) => void;
  reorderEducation: (oldIndex: number, newIndex: number) => void;
  reorderSkills: (oldIndex: number, newIndex: number) => void;
  reorderLanguages: (oldIndex: number, newIndex: number) => void;
  reorderHobbies: (oldIndex: number, newIndex: number) => void;
  reorderProjects: (oldIndex: number, newIndex: number) => void;
  reorderCourses: (oldIndex: number, newIndex: number) => void;
  reorderCertificates: (oldIndex: number, newIndex: number) => void;
  reorderVolunteers: (oldIndex: number, newIndex: number) => void;
  reorderSections: (sectionKeys: (keyof SectionConfig)[]) => void;
}

// eslint-disable-next-line react-refresh/only-export-components
export const CVContext = createContext<CVContextType | undefined>(undefined);

// Helper function to load initial state from localStorage
function getInitialState(): CVState {
  try {
    const savedCVData = localStorage.getItem('cvData');
    const savedSectionConfig = localStorage.getItem('sectionConfig');
    const savedTemplate = localStorage.getItem('currentTemplate');

    return {
      cvData: savedCVData ? JSON.parse(savedCVData) : initialState.cvData,
      sectionConfig: savedSectionConfig ? JSON.parse(savedSectionConfig) : initialState.sectionConfig,
      currentTemplate: savedTemplate ? JSON.parse(savedTemplate) : initialState.currentTemplate,
    };
  } catch (error) {
    console.error('Error loading saved data from localStorage:', error);
    return initialState;
  }
}

export function CVProvider({ children }: Readonly<{ children: ReactNode }>) {
  const [state, dispatch] = useReducer(cvReducer, getInitialState());
  const [isInitialized, setIsInitialized] = useState(false);

  // Mark as initialized after first render
  useEffect(() => {
    setIsInitialized(true);
  }, []);

  // Save to localStorage whenever state changes (but not on initial load)
  useEffect(() => {
    if (!isInitialized) return;
    
    try {
      localStorage.setItem('cvData', JSON.stringify(state.cvData));
    } catch (error) {
      console.error('Error saving CV data:', error);
    }
  }, [state.cvData, isInitialized]);

  useEffect(() => {
    if (!isInitialized) return;
    
    try {
      localStorage.setItem('sectionConfig', JSON.stringify(state.sectionConfig));
    } catch (error) {
      console.error('Error saving section config:', error);
    }
  }, [state.sectionConfig, isInitialized]);

  useEffect(() => {
    if (!isInitialized) return;
    
    try {
      localStorage.setItem('currentTemplate', JSON.stringify(state.currentTemplate));
    } catch (error) {
      console.error('Error saving template:', error);
    }
  }, [state.currentTemplate, isInitialized]);

  // Create stable callback functions
  const updatePersonalData = useCallback((data: Partial<CVData['personalData']>) => {
    dispatch({ type: 'UPDATE_PERSONAL_DATA', payload: data });
  }, []);

  const updateProfile = useCallback((data: Partial<CVData['profile']>) => {
    dispatch({ type: 'UPDATE_PROFILE', payload: data });
  }, []);

  const updateExperience = useCallback((experience: CVData['experience']) => {
    dispatch({ type: 'UPDATE_EXPERIENCE', payload: experience });
  }, []);

  const updateEducation = useCallback((education: CVData['education']) => {
    dispatch({ type: 'UPDATE_EDUCATION', payload: education });
  }, []);

  const updateSkills = useCallback((skills: CVData['skills']) => {
    dispatch({ type: 'UPDATE_SKILLS', payload: skills });
  }, []);

  const updateLanguages = useCallback((languages: CVData['languages']) => {
    dispatch({ type: 'UPDATE_LANGUAGES', payload: languages });
  }, []);

  const updateHobbies = useCallback((hobbies: CVData['hobbies']) => {
    dispatch({ type: 'UPDATE_HOBBIES', payload: hobbies });
  }, []);

  const updateProjects = useCallback((projects: CVData['projects']) => {
    dispatch({ type: 'UPDATE_PROJECTS', payload: projects });
  }, []);

  const updateCourses = useCallback((courses: CVData['courses']) => {
    dispatch({ type: 'UPDATE_COURSES', payload: courses });
  }, []);

  const updateCertificates = useCallback((certificates: CVData['certificates']) => {
    dispatch({ type: 'UPDATE_CERTIFICATES', payload: certificates });
  }, []);

  const updateVolunteers = useCallback((volunteers: CVData['volunteers']) => {
    dispatch({ type: 'UPDATE_VOLUNTEERS', payload: volunteers });
  }, []);

  const updateSectionConfig = useCallback((config: Partial<SectionConfig>) => {
    dispatch({ type: 'UPDATE_SECTION_CONFIG', payload: config });
  }, []);

  const setTemplate = useCallback((template: CVTemplate) => {
    dispatch({ type: 'SET_TEMPLATE', payload: template });
  }, []);

  const loadCVData = useCallback((data: CVData) => {
    dispatch({ type: 'LOAD_CV_DATA', payload: data });
  }, []);

  const resetAll = useCallback(() => {
    dispatch({ type: 'RESET_ALL' });
  }, []);

  const reorderExperience = useCallback((oldIndex: number, newIndex: number) => {
    dispatch({ type: 'REORDER_EXPERIENCE', payload: { oldIndex, newIndex } });
  }, []);

  const reorderEducation = useCallback((oldIndex: number, newIndex: number) => {
    dispatch({ type: 'REORDER_EDUCATION', payload: { oldIndex, newIndex } });
  }, []);

  const reorderSkills = useCallback((oldIndex: number, newIndex: number) => {
    dispatch({ type: 'REORDER_SKILLS', payload: { oldIndex, newIndex } });
  }, []);

  const reorderLanguages = useCallback((oldIndex: number, newIndex: number) => {
    dispatch({ type: 'REORDER_LANGUAGES', payload: { oldIndex, newIndex } });
  }, []);

  const reorderHobbies = useCallback((oldIndex: number, newIndex: number) => {
    dispatch({ type: 'REORDER_HOBBIES', payload: { oldIndex, newIndex } });
  }, []);

  const reorderProjects = useCallback((oldIndex: number, newIndex: number) => {
    dispatch({ type: 'REORDER_PROJECTS', payload: { oldIndex, newIndex } });
  }, []);

  const reorderCourses = useCallback((oldIndex: number, newIndex: number) => {
    dispatch({ type: 'REORDER_COURSES', payload: { oldIndex, newIndex } });
  }, []);

  const reorderCertificates = useCallback((oldIndex: number, newIndex: number) => {
    dispatch({ type: 'REORDER_CERTIFICATES', payload: { oldIndex, newIndex } });
  }, []);

  const reorderVolunteers = useCallback((oldIndex: number, newIndex: number) => {
    dispatch({ type: 'REORDER_VOLUNTEERS', payload: { oldIndex, newIndex } });
  }, []);

  const reorderSections = useCallback((sectionKeys: (keyof SectionConfig)[]) => {
    dispatch({ type: 'REORDER_SECTIONS', payload: { sectionKeys } });
  }, []);

  const contextValue = useMemo(() => ({
    state,
    updatePersonalData,
    updateProfile,
    updateExperience,
    updateEducation,
    updateSkills,
    updateLanguages,
    updateHobbies,
    updateProjects,
    updateCourses,
    updateCertificates,
    updateVolunteers,
    updateSectionConfig,
    setTemplate,
    loadCVData,
    resetAll,
    reorderExperience,
    reorderEducation,
    reorderSkills,
    reorderLanguages,
    reorderHobbies,
    reorderProjects,
    reorderCourses,
    reorderCertificates,
    reorderVolunteers,
    reorderSections
  }), [
    state,
    updatePersonalData,
    updateProfile,
    updateExperience,
    updateEducation,
    updateSkills,
    updateLanguages,
    updateHobbies,
    updateProjects,
    updateCourses,
    updateCertificates,
    updateVolunteers,
    updateSectionConfig,
    setTemplate,
    loadCVData,
    resetAll,
    reorderExperience,
    reorderEducation,
    reorderSkills,
    reorderLanguages,
    reorderHobbies,
    reorderProjects,
    reorderCourses,
    reorderCertificates,
    reorderVolunteers,
    reorderSections
  ]);

  return (
    <CVContext.Provider value={contextValue}>
      {children}
    </CVContext.Provider>
  );
}


