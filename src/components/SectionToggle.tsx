import { useCV } from '../hooks/useCV';
import type { SectionConfig } from '../types/cv';

interface SectionToggleProps {
  section: keyof SectionConfig;
}

export function SectionToggle({ section }: Readonly<SectionToggleProps>) {
  const { state, updateSectionConfig } = useCV();
  const isEnabled = state.sectionConfig[section].visible;

  const handleToggle = () => {
    // No permitir deshabilitar datos personales
    if (section === 'personalData') return;
    const newVisible = !isEnabled;
    updateSectionConfig({
      [section]: {
        ...state.sectionConfig[section],
        visible: newVisible
      }
    });
    if (newVisible === false) {
      setTimeout(() => {
        try { window.location.reload(); } catch (e) { /* ignore */ }
      }, 220);
    }
  };

  return (
    <button
      onClick={handleToggle}
      disabled={section === 'personalData'}
      className={`w-4 h-4 rounded-sm border-2 mr-2 flex items-center justify-center transition-all duration-200 backdrop-blur-sm shadow-sm ${
        isEnabled
          ? 'bg-gradient-to-br from-blue-600 to-purple-600 border-blue-500 text-white shadow-blue-500/25'
          : 'border-gray-300 hover:border-gray-400 bg-white/80 hover:bg-gray-50'
      } ${section === 'personalData' ? 'cursor-not-allowed opacity-50' : 'cursor-pointer hover:scale-110'}`}
    >
      {isEnabled && (
        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
            clipRule="evenodd"
          />
        </svg>
      )}
    </button>
  );
}
