import { useCV } from '../../hooks/useCV';

export function ProfileForm() {
  const { state, updateProfile } = useCV();
  const { profile } = state.cvData;

  const handleSummaryChange = (value: string) => {
    updateProfile({ summary: value });
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Resumen Profesional
        </label>
        <textarea
          value={profile.summary}
          onChange={(e) => handleSummaryChange(e.target.value)}
          rows={6}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          placeholder="Describe tu experiencia, habilidades y objetivos profesionales. Este es el primer texto que leerán los reclutadores, así que haz que sea impactante y conciso."
        />
        <p className="text-xs text-gray-500 mt-1">
          Recomendado: 2-4 líneas que resuman tu experiencia y valor único
        </p>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="text-sm font-medium text-blue-800 mb-2">💡 Consejos para un buen perfil</h4>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• Menciona tu especialidad y años de experiencia</li>
          <li>• Incluye tus principales fortalezas técnicas</li>
          <li>• Destaca logros cuantificables</li>
          <li>• Evita clichés como "proactivo" o "responsable"</li>
          <li>• Personaliza según el tipo de trabajo que buscas</li>
        </ul>
      </div>
    </div>
  );
}
