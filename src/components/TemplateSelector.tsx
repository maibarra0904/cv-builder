import { useCV } from '../hooks/useCV';
import type { CVTemplate } from '../types/cv';

interface TemplateSelectorProps {
  onTemplateSelect?: () => void;
}

const templates: { id: CVTemplate; name: string; description: string; preview: string }[] = [
  {
    id: 'modern',
    name: 'Moderno',
    description: 'Diseño limpio con barra lateral azul y elementos visuales modernos',
    preview: '🎨'
  },
  {
    id: 'classic',
    name: 'Clásico',
    description: 'Formato tradicional y profesional, ideal para sectores conservadores',
    preview: '📄'
  },
  {
    id: 'creative',
    name: 'Creativo',
    description: 'Diseño vibrante con gradientes y elementos gráficos llamativos',
    preview: '🌈'
  },
  {
    id: 'gradient',
    name: 'Gradient',
    description: 'Plantilla ultramoderna con gradientes y efectos glassmorphism',
    preview: '✨'
  }
];

export function TemplateSelector({ onTemplateSelect }: TemplateSelectorProps = {}) {
  const { state, setTemplate } = useCV();
  const { currentTemplate } = state;

  const handleTemplateChange = (templateId: CVTemplate) => {
    setTemplate(templateId);
    // Cerrar el modal después de seleccionar una plantilla
    if (onTemplateSelect) {
      setTimeout(() => {
        onTemplateSelect();
      }, 150); // Pequeño delay para que se vea la selección
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
        <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z" />
        </svg>
        Selecciona una plantilla
      </h3>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-blue-800">
              Plantilla actual: {templates.find(t => t.id === currentTemplate)?.name || 'Moderno'}
            </span>
          </div>
        </div>

        <div className="space-y-3">
          {templates.map((template) => (
            <button
              key={template.id}
              onClick={() => handleTemplateChange(template.id)}
              className={`w-full flex items-center space-x-3 p-3 rounded-lg border-2 transition-all duration-200 text-left ${
                currentTemplate === template.id
                  ? 'border-blue-500 bg-blue-50 shadow-md'
                  : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
              }`}
            >
              <div className="text-2xl flex-shrink-0">{template.preview}</div>
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-gray-900 mb-1">{template.name}</h4>
                <p className="text-xs text-gray-600 leading-tight">{template.description}</p>
                {currentTemplate === template.id && (
                  <div className="mt-2 text-xs text-blue-600 font-medium flex items-center">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                    Plantilla Activa
                  </div>
                )}
              </div>
            </button>
          ))}
        </div>

        <div className="text-xs text-gray-500 space-y-2 mt-6 pt-4 border-t border-gray-200">
          <div className="space-y-1">
            <p className="font-medium text-gray-700">Información:</p>
            <p>• Puedes cambiar de plantilla en cualquier momento</p>
            <p>• Todos tus datos se mantendrán intactos</p>
            <p>• Cada plantilla tiene un diseño único y profesional</p>
            <p>• La selección se aplica inmediatamente</p>
            <p className="text-blue-600 font-medium">🎨 Escoge la que mejor represente tu estilo</p>
          </div>
        </div>
      </div>
    </div>
  );
}
