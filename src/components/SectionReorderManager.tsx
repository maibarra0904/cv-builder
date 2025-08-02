import { useCV } from '../hooks/useCV';
import { GripVertical } from 'lucide-react';
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
import type { SectionConfig } from '../types/cv';

const sectionTitles = {
  personalData: 'Datos Personales',
  profile: 'Perfil Profesional',
  education: 'Formación',
  experience: 'Experiencia',
  skills: 'Competencias',
  languages: 'Idiomas',
  hobbies: 'Pasatiempos',
  certificates: 'Certificados',
  courses: 'Cursos',
  projects: 'Proyectos',
  volunteers: 'Voluntariado',
} as const;

const sectionIcons = {
  personalData: '👤',
  profile: '📄',
  education: '🎓',
  experience: '💼',
  skills: '⭐',
  languages: '🌍',
  hobbies: '❤️',
  certificates: '🏆',
  courses: '📚',
  projects: '💻',
  volunteers: '🤝',
} as const;

interface SortableSectionItemProps {
  sectionKey: keyof SectionConfig;
  isEnabled: boolean;
}

function SortableSectionItem({ sectionKey, isEnabled }: SortableSectionItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: sectionKey });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const title = sectionTitles[sectionKey];
  const icon = sectionIcons[sectionKey];

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`bg-white border rounded-lg p-3 shadow-sm transition-all duration-200 ${
        isDragging ? 'ring-2 ring-blue-500' : 'hover:shadow-md'
      } ${isEnabled ? 'border-green-200 bg-green-50' : 'border-gray-200 bg-gray-50'}`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div
            {...attributes}
            {...listeners}
            className="cursor-grab active:cursor-grabbing p-1 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <GripVertical className="h-4 w-4" />
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-lg">{icon}</span>
            <span className={`font-medium ${isEnabled ? 'text-green-800' : 'text-gray-500'}`}>
              {title}
            </span>
          </div>
        </div>
        <div className={`px-2 py-1 rounded-full text-xs font-medium ${
          isEnabled 
            ? 'bg-green-100 text-green-700 border border-green-200' 
            : 'bg-gray-100 text-gray-600 border border-gray-200'
        }`}>
          {isEnabled ? 'Visible' : 'Oculta'}
        </div>
      </div>
    </div>
  );
}

export function SectionReorderManager() {
  const { state, reorderSections } = useCV();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Ordenar las secciones por su orden actual
  const sortedSections = Object.keys(state.sectionConfig)
    .map(key => key as keyof SectionConfig)
    .sort((a, b) => state.sectionConfig[a].order - state.sectionConfig[b].order);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = sortedSections.findIndex(key => key === active.id);
      const newIndex = sortedSections.findIndex(key => key === over.id);
      
      const newSortedSections = [...sortedSections];
      const [removed] = newSortedSections.splice(oldIndex, 1);
      newSortedSections.splice(newIndex, 0, removed);
      
      reorderSections(newSortedSections);
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center">
          <GripVertical className="h-5 w-5 mr-2 text-purple-600" />
          Ordenar Secciones
        </h3>
        <p className="text-sm text-gray-600">
          Arrastra las secciones para cambiar su orden en el CV. Las secciones ocultas también pueden reordenarse.
        </p>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={sortedSections} strategy={verticalListSortingStrategy}>
          <div className="space-y-2">
            {sortedSections.map((sectionKey) => (
              <SortableSectionItem
                key={sectionKey}
                sectionKey={sectionKey}
                isEnabled={state.sectionConfig[sectionKey].visible}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
        <h4 className="text-sm font-medium text-blue-900 mb-1">💡 Consejos:</h4>
        <ul className="text-xs text-blue-800 space-y-1">
          <li>• Arrastra las secciones para cambiar su orden en el CV</li>
          <li>• Las secciones ocultas seguirán el orden que definas aquí</li>
          <li>• Los "Datos Personales" siempre aparecen primero</li>
          <li>• Usa la barra lateral para activar/desactivar secciones</li>
        </ul>
      </div>
    </div>
  );
}
