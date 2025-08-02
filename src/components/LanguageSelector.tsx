import { useEffect } from 'react';
import { useLanguage } from '../hooks/useLanguage';
import { useCV } from '../hooks/useCV';
import { useSimpleTranslation } from '../hooks/useSimpleTranslation';

export function LanguageSelector() {
  const { currentLanguage, setCurrentLanguage, setBilingualData, bilingualData } = useLanguage();
  const { state } = useCV();
  const { translateCVData } = useSimpleTranslation();

  // Generar datos bilingües cuando cambian los datos del CV
  useEffect(() => {
    const generateBilingualData = async () => {
      if (state.cvData.personalData.firstName && !bilingualData) {
        try {
          console.log('🔄 Generando datos bilingües...');
          const translatedData = await translateCVData(state.cvData);
          setBilingualData(translatedData);
          console.log('✅ Datos bilingües generados');
        } catch (error) {
          console.error('❌ Error generando datos bilingües:', error);
        }
      }
    };

    generateBilingualData();
  }, [state.cvData, setBilingualData, bilingualData, translateCVData]);

  const handleLanguageChange = (language: 'es' | 'en') => {
    console.log('🌐 Cambiando idioma a:', language);
    setCurrentLanguage(language);
  };

  return (
    <div className="flex items-center gap-2 p-2 bg-gray-100 rounded-lg">
      <span className="text-sm font-medium text-gray-700">Idioma:</span>
      <div className="flex bg-white rounded-md shadow-sm">
        <button
          onClick={() => handleLanguageChange('es')}
          className={`px-3 py-1 text-sm font-medium rounded-l-md transition-colors ${
            currentLanguage === 'es'
              ? 'bg-blue-500 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-50'
          }`}
        >
          ES
        </button>
        <button
          onClick={() => handleLanguageChange('en')}
          className={`px-3 py-1 text-sm font-medium rounded-r-md transition-colors ${
            currentLanguage === 'en'
              ? 'bg-blue-500 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-50'
          }`}
        >
          EN
        </button>
      </div>
      
      {/* Debug info */}
      <div className="ml-4 text-xs text-gray-500">
        Actual: {currentLanguage} | Datos: {bilingualData ? '✅' : '❌'}
      </div>
    </div>
  );
}
