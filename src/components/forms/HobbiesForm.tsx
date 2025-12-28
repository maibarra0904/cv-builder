import { useState } from 'react';
import { useCV } from '../../hooks/useCV';
import useTranslation from '../../i18n/useTranslation';
import { Plus, X, Heart } from 'lucide-react';

export function HobbiesForm() {
  const { state, updateHobbies } = useCV();
  const { hobbies } = state.cvData;
  const { t } = useTranslation();
  const [newHobby, setNewHobby] = useState('');

  const addHobby = () => {
    if (newHobby.trim()) {
      const newHobbyData = { 
        id: Date.now().toString(), 
        name: newHobby.trim(),
        description: ''
      };
      const updatedHobbies = [...hobbies, newHobbyData];
      updateHobbies(updatedHobbies);
      setNewHobby('');
    }
  };

  const removeHobby = (id: string) => {
    const filteredHobbies = hobbies.filter(hobby => hobby.id !== id);
    updateHobbies(filteredHobbies);
  };

  return (
    <div className="space-y-4">
      {/* Add new hobby */}
      <div className="flex space-x-2">
        <input
          type="text"
          value={newHobby}
          onChange={(e) => setNewHobby(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && addHobby()}
          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder={t('forms.hobbies.addPlaceholder') as string}
        />
        <button
          onClick={addHobby}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>{t('forms.hobbies.addButton')}</span>
        </button>
      </div>

      {/* Hobbies list */}
      <div className="space-y-2">
        {hobbies.map((hobby) => (
          <div key={hobby.id} className="flex items-center justify-between bg-white border border-gray-200 rounded-lg p-3">
            <div className="flex items-center space-x-3">
              <Heart className="h-5 w-5 text-pink-500" />
              <span className="font-medium text-gray-900">{hobby.name}</span>
            </div>
            <button
              onClick={() => removeHobby(hobby.id)}
              className="text-gray-400 hover:text-red-600 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>

      {hobbies.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <Heart className="h-12 w-12 mx-auto mb-3 text-gray-300" />
          <p>{t('forms.hobbies.emptyTitle')}</p>
          <p className="text-sm">{t('forms.hobbies.emptyHint')}</p>
        </div>
      )}
    </div>
  );
}
