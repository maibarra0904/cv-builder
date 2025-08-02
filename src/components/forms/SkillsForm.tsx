import { useState } from 'react';
import { useCV } from '../../hooks/useCV';
import { Plus, X, Star, GripVertical } from 'lucide-react';
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

type SkillLevel = 1 | 2 | 3 | 4 | 5;
type SkillCategory = 'technical' | 'soft' | 'language';

interface NewSkillState {
  name: string;
  level: SkillLevel;
  category: SkillCategory;
}

interface Skill {
  id: string;
  name: string;
  level: SkillLevel;
  category: SkillCategory;
}

interface SortableSkillItemProps {
  skill: Skill;
  onDelete: (id: string) => void;
}

function SortableSkillItem({ skill, onDelete }: Readonly<SortableSkillItemProps>) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: skill.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const getCategoryColor = (category: SkillCategory) => {
    switch (category) {
      case 'technical': return 'bg-blue-100 text-blue-800';
      case 'soft': return 'bg-green-100 text-green-800';
      case 'language': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryLabel = (category: SkillCategory) => {
    switch (category) {
      case 'technical': return 'Técnica';
      case 'soft': return 'Blanda';
      case 'language': return 'Idioma';
      default: return category;
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-white border border-gray-200 rounded-lg p-3"
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
          <div>
            <h4 className="font-medium text-gray-900">{skill.name}</h4>
            <div className="flex items-center space-x-2 mt-1">
              <span className={`px-2 py-1 text-xs rounded-full ${getCategoryColor(skill.category)}`}>
                {getCategoryLabel(skill.category)}
              </span>
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-3 w-3 ${
                      star <= skill.level
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
        <button
          onClick={() => onDelete(skill.id)}
          className="p-1 text-gray-400 hover:text-red-600 transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

export function SkillsForm() {
  const { state, updateSkills, reorderSkills } = useCV();
  const { skills } = state.cvData;
  const [newSkill, setNewSkill] = useState<NewSkillState>({ 
    name: '', 
    level: 3, 
    category: 'technical' 
  });

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = skills.findIndex((item) => item.id === active.id);
      const newIndex = skills.findIndex((item) => item.id === over.id);

      reorderSkills(oldIndex, newIndex);
    }
  };

  const addSkill = () => {
    if (newSkill.name.trim()) {
      const newSkillData = { ...newSkill, id: Date.now().toString() };
      updateSkills([...skills, newSkillData]);
      setNewSkill({ name: '', level: 3, category: 'technical' });
    }
  };

  const removeSkill = (id: string) => {
    updateSkills(skills.filter(skill => skill.id !== id));
  };

  const updateLevel = (id: string, level: SkillLevel) => {
    updateSkills(skills.map(skill => 
      skill.id === id ? { ...skill, level } : skill
    ));
  };

  const renderStars = (level: number, skillId?: string, onLevelChange?: (level: SkillLevel) => void) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 cursor-pointer ${
          i < level ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
        onClick={() => {
          const newLevel = (i + 1) as SkillLevel;
          if (skillId) {
            updateLevel(skillId, newLevel);
          } else if (onLevelChange) {
            onLevelChange(newLevel);
          }
        }}
      />
    ));
  };

  const skillsByCategory = {
    technical: skills.filter(s => s.category === 'technical'),
    soft: skills.filter(s => s.category === 'soft'),
    language: skills.filter(s => s.category === 'language'),
  };

  return (
    <div className="space-y-6">
      {/* Add new skill */}
      <div className="bg-gray-50 p-4 rounded-lg space-y-3">
        <h4 className="font-medium text-gray-900">Agregar nueva competencia</h4>
        
        <div className="space-y-3">
          <input
            type="text"
            value={newSkill.name}
            onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Nombre de la competencia"
          />
          
          <div className="flex items-center space-x-4">
            <select
              value={newSkill.category}
              onChange={(e) => setNewSkill({ ...newSkill, category: e.target.value as SkillCategory })}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="technical">Técnica</option>
              <option value="soft">Blanda</option>
              <option value="language">Idioma</option>
            </select>
            
            <div className="flex items-center space-x-1">
              {renderStars(newSkill.level, undefined, (level) => setNewSkill({ ...newSkill, level }))}
            </div>
            
            <button
              onClick={addSkill}
              className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="h-4 w-4" />
              <span>Agregar</span>
            </button>
          </div>
        </div>
      </div>

      {/* Skills by category */}
      {Object.entries(skillsByCategory).map(([category, categorySkills]) => {
        const categoryNames = {
          technical: 'Competencias Técnicas',
          soft: 'Habilidades Blandas',
          language: 'Idiomas',
        };

        if (categorySkills.length === 0) return null;

        return (
          <div key={category}>
            <h4 className="font-medium text-gray-900 mb-3">{categoryNames[category as keyof typeof categoryNames]}</h4>
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={categorySkills.map(skill => skill.id)}
                strategy={verticalListSortingStrategy}
              >
                <div className="space-y-2">
                  {categorySkills.map((skill) => (
                    <SortableSkillItem
                      key={skill.id}
                      skill={skill}
                      onDelete={removeSkill}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          </div>
        );
      })}

      {skills.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <Star className="h-12 w-12 mx-auto mb-3 text-gray-300" />
          <p>No has agregado competencias aún</p>
          <p className="text-sm">Agrega tus habilidades técnicas y blandas</p>
        </div>
      )}
    </div>
  );
}
