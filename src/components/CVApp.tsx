import { useState } from 'react';
import { CVProvider } from '../context/CVContext';
import { LanguageProvider } from '../context/LanguageContext';
import { Sidebar } from './Sidebar';
import { CVPreview } from './CVPreview';
import { TemplateSelector } from './TemplateSelector';
import { PDFExporter } from './PDFExporter';
import { DataManager } from './DataManager';
import { FileText, Settings, Database } from 'lucide-react';

function CVApp() {
  const [showTemplateSelector, setShowTemplateSelector] = useState(false);
  const [isTemplateSelectorVisible, setIsTemplateSelectorVisible] = useState(false);
  const [showDataManager, setShowDataManager] = useState(false);

  const handleToggleTemplateSelector = () => {
    if (showTemplateSelector) {
      // Cerrar el modal de plantillas
      setIsTemplateSelectorVisible(false);
      setTimeout(() => setShowTemplateSelector(false), 300);
    } else {
      // Si el modal de datos está abierto, cerrarlo primero
      if (showDataManager) {
        setShowDataManager(false);
        // Pequeño delay para que se vea la transición
        setTimeout(() => {
          setShowTemplateSelector(true);
          setTimeout(() => setIsTemplateSelectorVisible(true), 10);
        }, 150);
      } else {
        // Abrir directamente si no hay otro modal abierto
        setShowTemplateSelector(true);
        setTimeout(() => setIsTemplateSelectorVisible(true), 10);
      }
    }
  };

  const handleToggleDataManager = () => {
    if (showDataManager) {
      // Cerrar el modal de datos
      setShowDataManager(false);
    } else {
      // Si el modal de plantillas está abierto, cerrarlo primero
      if (showTemplateSelector) {
        setIsTemplateSelectorVisible(false);
        setTimeout(() => setShowTemplateSelector(false), 300);
        // Pequeño delay para que se vea la transición
        setTimeout(() => {
          setShowDataManager(true);
        }, 150);
      } else {
        // Abrir directamente si no hay otro modal abierto
        setShowDataManager(true);
      }
    }
  };

  const handleCloseTemplateSelector = () => {
    setIsTemplateSelectorVisible(false);
    setTimeout(() => setShowTemplateSelector(false), 300);
  };

  return (
    <LanguageProvider>
      <CVProvider>
      <div className="min-h-screen w-full bg-gradient-to-br from-slate-200 via-blue-100 to-indigo-200 overflow-x-hidden cv-app-container">
        {/* Header */}
        <header className="bg-white/95 backdrop-blur-md shadow-xl border-b border-gray-200/50 px-4 md:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 md:space-x-3">
              <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-lg">
                <FileText className="h-6 w-6 md:h-8 md:w-8 text-white" />
              </div>
              <div>
                <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  CV Builder
                </h1>
                <p className="text-xs md:text-sm text-gray-600 hidden sm:block">Crea tu hoja de vida profesional</p>
              </div>
            </div>
            <div className="flex items-center space-x-2 md:space-x-4">
              <button
                onClick={handleToggleTemplateSelector}
                className="flex items-center space-x-1 md:space-x-2 px-3 md:px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg shadow-blue-600/25 hover:shadow-blue-700/30 hover:scale-105 text-sm md:text-base font-medium backdrop-blur-sm"
              >
                <Settings className="h-4 w-4" />
                <span className="hidden sm:inline">Plantillas</span>
              </button>
              <button
                onClick={handleToggleDataManager}
                className="flex items-center space-x-1 md:space-x-2 px-3 md:px-5 py-2.5 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg hover:from-purple-700 hover:to-purple-800 transition-all duration-200 shadow-lg shadow-purple-600/25 hover:shadow-purple-700/30 hover:scale-105 text-sm md:text-base font-medium backdrop-blur-sm"
              >
                <Database className="h-4 w-4" />
                <span className="hidden sm:inline">Datos</span>
              </button>
              <PDFExporter />
            </div>
          </div>
        </header>

        {/* Template Selector Modal */}
        {showTemplateSelector && (
          <div className={`fixed top-0 right-0 w-full sm:w-80 bg-gradient-to-b from-white via-gray-50 to-gray-100 backdrop-blur-md border-l border-gray-200/50 h-screen overflow-y-auto transform transition-transform duration-300 z-10 shadow-2xl ${
            isTemplateSelectorVisible ? 'translate-x-0' : 'translate-x-full'
          }`} style={{ top: '88px' }}>
            <div className="p-4 bg-gradient-to-b from-white/80 to-gray-50/80 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">Selector de Plantillas</h2>
                <button
                  onClick={handleCloseTemplateSelector}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <TemplateSelector onTemplateSelect={handleCloseTemplateSelector} />
            </div>
          </div>
        )}

        {/* Overlay for template selector */}
        {showTemplateSelector && (
          <button
            className="fixed inset-0 bg-gradient-to-br from-black/40 via-slate-900/30 to-black/40 backdrop-blur-sm z-[9] cursor-pointer border-0 p-0"
            style={{ top: '88px' }}
            onClick={handleCloseTemplateSelector}
            onKeyDown={(e) => {
              if (e.key === 'Escape') {
                handleCloseTemplateSelector();
              }
            }}
            aria-label="Cerrar selector de plantillas"
          />
        )}

        {/* Main Content */}
        <div className="flex flex-col lg:flex-row relative min-h-[calc(100vh-88px)]">
          {/* Left Sidebar - Form (Mobile: Stack above, Desktop: Side panel) */}
          <div className="w-full lg:w-1/3 bg-gradient-to-b from-white via-gray-50 to-gray-100 backdrop-blur-sm border-r border-gray-200/50 lg:h-screen overflow-y-auto shadow-lg">
            <Sidebar />
          </div>

          {/* Center Panel - Preview (Mobile: Full width, Desktop: Flex-1) */}
          <div className={`flex-1 bg-gradient-to-br from-slate-100 via-gray-200 to-slate-300 lg:h-screen overflow-y-auto transition-all duration-300 ${(showDataManager || showTemplateSelector) ? 'lg:mr-80' : 'lg:mr-0'}`}>
            <CVPreview />
          </div>

          {/* Right Panel - Data Management (Collapsible) */}
          <div className={`fixed top-0 right-0 w-full sm:w-80 bg-gradient-to-b from-white via-gray-50 to-gray-100 backdrop-blur-md border-l border-gray-200/50 h-screen overflow-y-auto transform transition-transform duration-300 z-10 shadow-2xl ${
            showDataManager ? 'translate-x-0' : 'translate-x-full'
          }`} style={{ top: '88px' }}>
            <div className="p-4 bg-gradient-to-b from-white/80 to-gray-50/80 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">Panel de Gestión</h2>
                <button
                  onClick={() => setShowDataManager(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <DataManager />
            </div>
          </div>

          {/* Overlay when data manager is open */}
          {showDataManager && (
            <button
              className="fixed inset-0 bg-gradient-to-br from-black/40 via-slate-900/30 to-black/40 backdrop-blur-sm z-[9] cursor-pointer border-0 p-0"
              style={{ top: '88px' }}
              onClick={() => setShowDataManager(false)}
              onKeyDown={(e) => {
                if (e.key === 'Escape') {
                  setShowDataManager(false);
                }
              }}
              aria-label="Cerrar panel de gestión de datos"
            />
          )}
        </div>
      </div>
    </CVProvider>
    </LanguageProvider>
  );
}

export default CVApp;
