import { useState } from 'react';
import { useCV } from '../../hooks/useCV';
import { Plus, X, GripVertical, Globe } from 'lucide-react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { Language } from '../../types/cv';

type LanguageLevel = 'Básico' | 'Intermedio' | 'Avanzado' | 'Nativo';

interface NewLanguageState {
  name: string;
  level: LanguageLevel;
}

interface SortableLanguageItemProps {
  language: Language;
  onDelete: (id: string) => void;
  onUpdate: (id: string, updates: Partial<Language>) => void;
}

function SortableLanguageItem({ language, onDelete, onUpdate }: Readonly<SortableLanguageItemProps>) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: language.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const getLevelColor = (level: LanguageLevel) => {
    switch (level) {
      case 'Básico':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Intermedio':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Avanzado':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Nativo':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`bg-white border rounded-lg p-4 mb-3 shadow-sm hover:shadow-md transition-all duration-200 ${
        isDragging ? 'ring-2 ring-blue-500' : ''
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center mb-2">
            <button
              {...attributes}
              {...listeners}
              className="text-gray-400 hover:text-gray-600 mr-2 cursor-move p-1"
              aria-label="Reordenar idioma"
            >
              <GripVertical className="h-4 w-4" />
            </button>
            <input
              type="text"
              value={language.name}
              onChange={(e) => onUpdate(language.id, { name: e.target.value })}
              placeholder="Idioma"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
          </div>
          <div className="ml-7">
            <select
              value={language.level}
              onChange={(e) => onUpdate(language.id, { level: e.target.value as LanguageLevel })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            >
              <option value="Básico">Básico</option>
              <option value="Intermedio">Intermedio</option>
              <option value="Avanzado">Avanzado</option>
              <option value="Nativo">Nativo</option>
            </select>
            <div className="mt-2">
              <span className={`inline-block px-2 py-1 text-xs rounded-full border ${getLevelColor(language.level)}`}>
                {language.level}
              </span>
            </div>
          </div>
        </div>
        <button
          onClick={() => onDelete(language.id)}
          className="text-red-500 hover:text-red-700 p-1 ml-2"
          aria-label="Eliminar idioma"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

export function LanguagesForm() {
  const { state, updateLanguages, reorderLanguages } = useCV();
  const [newLanguage, setNewLanguage] = useState<NewLanguageState>({
    name: '',
    level: 'Básico',
  });

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const addLanguage = () => {
    if (newLanguage.name.trim()) {
      const language: Language = {
        id: Date.now().toString(),
        name: newLanguage.name.trim(),
        level: newLanguage.level,
      };
      
      const newLanguages = [...state.cvData.languages, language];
      updateLanguages(newLanguages);
      
      setNewLanguage({ name: '', level: 'Básico' });
    }
  };

  const deleteLanguage = (id: string) => {
    const filteredLanguages = state.cvData.languages.filter(lang => lang.id !== id);
    updateLanguages(filteredLanguages);
  };

  const updateLanguage = (id: string, updates: Partial<Language>) => {
    const updatedLanguages = state.cvData.languages.map(lang => 
      lang.id === id ? { ...lang, ...updates } : lang
    );
    updateLanguages(updatedLanguages);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = state.cvData.languages.findIndex(lang => lang.id === active.id);
      const newIndex = state.cvData.languages.findIndex(lang => lang.id === over.id);

      reorderLanguages(oldIndex, newIndex);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addLanguage();
    }
  };

  return (
    <div className="space-y-6">
      {/* Add new language */}
      <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-4">
        <div className="flex items-center mb-3">
          <Globe className="h-5 w-5 text-gray-400 mr-2" />
          <h4 className="text-sm font-medium text-gray-700">Agregar Idioma</h4>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <input
            type="text"
            value={newLanguage.name}
            onChange={(e) => setNewLanguage({ ...newLanguage, name: e.target.value })}
            onKeyDown={handleKeyPress}
            placeholder="Nombre del idioma"
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          />
          
          <select
            value={newLanguage.level}
            onChange={(e) => setNewLanguage({ ...newLanguage, level: e.target.value as LanguageLevel })}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          >
            <option value="Básico">Básico</option>
            <option value="Intermedio">Intermedio</option>
            <option value="Avanzado">Avanzado</option>
            <option value="Nativo">Nativo</option>
          </select>
        </div>
        
        <button
          onClick={addLanguage}
          disabled={!newLanguage.name.trim()}
          className="mt-3 flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed text-sm transition-colors"
        >
          <Plus className="h-4 w-4 mr-2" />
          Agregar Idioma
        </button>
      </div>

      {/* Languages list */}
      {state.cvData.languages.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-3">
            Idiomas ({state.cvData.languages.length})
          </h4>
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={state.cvData.languages.map(lang => lang.id)}
              strategy={verticalListSortingStrategy}
            >
              {state.cvData.languages.map((language) => (
                <SortableLanguageItem
                  key={language.id}
                  language={language}
                  onDelete={deleteLanguage}
                  onUpdate={updateLanguage}
                />
              ))}
            </SortableContext>
          </DndContext>
        </div>
      )}

      {state.cvData.languages.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <Globe className="h-12 w-12 mx-auto mb-3 text-gray-300" />
          <p className="text-sm">No hay idiomas agregados</p>
          <p className="text-xs text-gray-400 mt-1">
            Agrega los idiomas que dominas para enriquecer tu CV
          </p>
        </div>
      )}
    </div>
  );
}
