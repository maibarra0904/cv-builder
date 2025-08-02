import type { CVData } from '../types/cv';

const STORAGE_KEY = 'cv-builder-data';
const PHOTO_STORAGE_KEY = 'cv-builder-photo';

export function useLocalStorage() {
  // Guardar datos del CV
  const saveCVData = (data: CVData) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error('Error guardando datos del CV:', error);
    }
  };

  // Cargar datos del CV
  const loadCVData = (): CVData | null => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch (error) {
      console.error('Error cargando datos del CV:', error);
      return null;
    }
  };

  // Guardar foto
  const savePhoto = (photoDataUrl: string) => {
    try {
      localStorage.setItem(PHOTO_STORAGE_KEY, photoDataUrl);
    } catch (error) {
      console.error('Error guardando foto:', error);
    }
  };

  // Cargar foto
  const loadPhoto = (): string | null => {
    try {
      return localStorage.getItem(PHOTO_STORAGE_KEY);
    } catch (error) {
      console.error('Error cargando foto:', error);
      return null;
    }
  };

  // Limpiar datos guardados
  const clearSavedData = () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(PHOTO_STORAGE_KEY);
    } catch (error) {
      console.error('Error limpiando datos guardados:', error);
    }
  };

  // Verificar si hay datos guardados
  const hasSavedData = (): boolean => {
    return localStorage.getItem(STORAGE_KEY) !== null;
  };

  return {
    saveCVData,
    loadCVData,
    savePhoto,
    loadPhoto,
    clearSavedData,
    hasSavedData,
  };
}
