import { useEffect, useState, useRef, useCallback } from 'react';
import { useCV } from '../hooks/useCV';
import { ModernTemplate } from './templates/ModernTemplate';
import { ClassicTemplate } from './templates/ClassicTemplate';
import { CreativeTemplate } from './templates/CreativeTemplate';
import { GradientTemplate } from './templates/GradientTemplate';

export function CVPreview() {
  const { state } = useCV();
  const cvData = state.cvData; // Usar siempre los datos del CVContext
  const sectionConfig = state.sectionConfig;
  const template = state.currentTemplate;
  const [fontSize, setFontSize] = useState(100); // Porcentaje del tamaño base
  const [isCalculating, setIsCalculating] = useState(false);
  const [isExtended, setIsExtended] = useState(false); // Nueva state para indicar extensión
  const [contentHeight, setContentHeight] = useState(0); // Nueva state para altura del contenido
  const measureRef = useRef<HTMLDivElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);

  const renderTemplate = useCallback(() => {
    switch (template) {
      case 'modern':
        return <ModernTemplate data={cvData} config={sectionConfig} />;
      case 'classic':
        return <ClassicTemplate data={cvData} config={sectionConfig} />;
      case 'creative':
        return <CreativeTemplate data={cvData} config={sectionConfig} />;
      case 'gradient':
        return <GradientTemplate data={cvData} config={sectionConfig} />;
      default:
        return <ModernTemplate data={cvData} config={sectionConfig} />;
    }
  }, [template, cvData, sectionConfig]);

  // Función para mantener el tamaño de fuente fijo y permitir expansión
  const maintainOptimalDisplay = useCallback(() => {
    if (!measureRef.current) return;

    setIsCalculating(true);
    
    setTimeout(() => {
      const baseFontSize = 125; // Tamaño de fuente fijo y legible (125%)
      
      // Establecer tamaño de fuente fijo
      if (measureRef.current) {
        measureRef.current.style.fontSize = `${baseFontSize}%`;
        
        setTimeout(() => {
          const measuredHeight = measureRef.current?.scrollHeight || 0;
          const A4_HEIGHT_PX = 297 * 3.78; // Aproximadamente 1122px para A4 en 96 DPI
          const isContentExtended = measuredHeight > A4_HEIGHT_PX;
          
          setContentHeight(measuredHeight);
          setIsExtended(isContentExtended);
          
          console.log(`Altura del contenido: ${measuredHeight}px, tamaño de fuente fijo: ${baseFontSize}%`);
          console.log(`A4 estándar: ${A4_HEIGHT_PX}px, Extendido: ${isContentExtended ? 'Sí' : 'No'}`);
          
          setFontSize(baseFontSize);
          setIsCalculating(false);
        }, 50);
      }
    }, 100);
  }, []);

  // Recalcular cuando cambie el contenido
  useEffect(() => {
    maintainOptimalDisplay();
  }, [maintainOptimalDisplay]);

  // Función auxiliar para obtener el texto del formato
  const getFormatText = () => {
    if (isCalculating) return 'Cargando...';
    const formatType = isExtended ? 'Formato Extendido' : 'Formato A4';
    return `Tamaño: ${fontSize}% • ${formatType}`;
  };

  return (
    <div className="p-4 md:p-8 bg-gradient-to-br from-slate-100/50 via-transparent to-slate-200/50 relative">
      {/* Subtle pattern overlay */}
      <div className="absolute inset-0 opacity-10 bg-gradient-to-r from-transparent via-gray-300 to-transparent transform rotate-45" 
           style={{ 
             backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(0,0,0,0.02) 10px, rgba(0,0,0,0.02) 20px)',
           }}></div>
      
      <div className="w-full max-w-none mx-auto relative z-10">
        {/* Template de medición (oculto) */}
        <div 
          ref={measureRef}
          className="absolute -top-[9999px] left-0 opacity-0 pointer-events-none"
          style={{ 
            width: '210mm',
            padding: '3mm',
            boxSizing: 'border-box'
          }}
        >
          {renderTemplate()}
        </div>

        {/* CV Paper */}
        <div 
          ref={previewRef}
          id="cv-preview" 
          className="bg-white shadow-2xl relative border-2 border-gray-200/30 rounded-lg overflow-visible mx-auto transition-all duration-300"
          style={{ 
            width: '210mm', 
            minHeight: '297mm', // Altura mínima A4
            height: 'auto', // Altura automática, se ajustará dinámicamente
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.8), 0 0 100px rgba(59, 130, 246, 0.1)',
            fontSize: `${fontSize}%`,
            padding: '3mm',
            boxSizing: 'border-box'
          }}
        >
          {isCalculating ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-500 border-t-transparent mx-auto mb-4"></div>
                <p className="text-gray-600">Preparando vista...</p>
              </div>
            </div>
          ) : (
            renderTemplate()
          )}
        </div>
        
        {/* Template Info con indicador de extensión */}
        <div className="mt-6 text-center">
          <div className="inline-flex items-center space-x-4 bg-white/80 backdrop-blur-md rounded-full px-5 py-3 shadow-lg border border-gray-200/50">
            <div className="flex items-center space-x-2">
              <div className="w-2.5 h-2.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-semibold text-gray-700">
                Plantilla: {template.charAt(0).toUpperCase() + template.slice(1)}
              </span>
            </div>
            <div className="hidden sm:flex items-center space-x-2">
              <div className={`w-2.5 h-2.5 rounded-full ${isExtended ? 'bg-gradient-to-r from-orange-500 to-red-500' : 'bg-gradient-to-r from-green-500 to-emerald-500'}`}></div>
              <span className="text-sm text-gray-600">
                {getFormatText()}
              </span>
            </div>
          </div>
          
          {/* Información adicional cuando está extendido */}
          {isExtended && !isCalculating && (
            <div className="mt-3 inline-flex items-center space-x-2 bg-orange-50 text-orange-700 px-4 py-2 rounded-full border border-orange-200">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd"></path>
              </svg>
              <span className="text-sm font-medium">
                CV extendido ({Math.round(contentHeight)}px). Se exportará en formato extendido manteniendo la calidad.
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
