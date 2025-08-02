import { useState } from 'react';
import { useCV } from '../../hooks/useCV';
import { Plus, Edit2, Trash2, Briefcase, GripVertical } from 'lucide-react';
import type { Experience } from '../../types/cv';
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

interface SortableExperienceItemProps {
  experience: Experience;
  onEdit: (experience: Experience) => void;
  onDelete: (id: string) => void;
}

function SortableExperienceItem({ experience, onEdit, onDelete }: Readonly<SortableExperienceItemProps>) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: experience.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-white border border-gray-200 rounded-lg p-4"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3 flex-1">
          <div
            {...attributes}
            {...listeners}
            className="cursor-grab active:cursor-grabbing p-1 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <GripVertical className="h-4 w-4" />
          </div>
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <Briefcase className="h-5 w-5 text-blue-600" />
          </div>
          <div className="flex-1">
            <h4 className="font-medium text-gray-900">{experience.position}</h4>
            <p className="text-sm text-gray-600">{experience.company}</p>
            {experience.location && <p className="text-sm text-gray-500">{experience.location}</p>}
            <p className="text-xs text-gray-500">
              {experience.startDate} - {experience.current ? 'Presente' : experience.endDate}
            </p>
            {experience.description && (
              <p className="text-sm text-gray-700 mt-2 line-clamp-2">
                {experience.description}
              </p>
            )}
          </div>
        </div>
        <div className="flex space-x-1">
          <button
            onClick={() => onEdit(experience)}
            className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
          >
            <Edit2 className="h-4 w-4" />
          </button>
          <button
            onClick={() => onDelete(experience.id)}
            className="p-2 text-gray-400 hover:text-red-600 transition-colors"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

export function ExperienceForm() {
  const { state, updateExperience, reorderExperience } = useCV();
  const { experience } = state.cvData;
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Omit<Experience, 'id'>>({
    company: '',
    position: '',
    startDate: '',
    endDate: '',
    current: false,
    description: '',
    achievements: [],
    location: '',
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
      const oldIndex = experience.findIndex((item) => item.id === active.id);
      const newIndex = experience.findIndex((item) => item.id === over.id);

      reorderExperience(oldIndex, newIndex);
    }
  };

  const resetForm = () => {
    setFormData({
      company: '',
      position: '',
      startDate: '',
      endDate: '',
      current: false,
      description: '',
      achievements: [],
      location: '',
    });
    setIsAdding(false);
    setEditingId(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingId) {
      // Actualizar experiencia existente
      const updatedExperience = experience.map(exp => 
        exp.id === editingId ? { ...exp, ...formData } : exp
      );
      updateExperience(updatedExperience);
    } else {
      // Agregar nueva experiencia
      const newExperience = [...experience, { ...formData, id: Date.now().toString() }];
      updateExperience(newExperience);
    }
    
    resetForm();
  };

  const handleEdit = (exp: Experience) => {
    setFormData(exp);
    setEditingId(exp.id);
    setIsAdding(true);
  };

  const handleDelete = (id: string) => {
    const filteredExperience = experience.filter(exp => exp.id !== id);
    updateExperience(filteredExperience);
  };

  const handleCurrentChange = (checked: boolean) => {
    setFormData({ ...formData, current: checked, endDate: checked ? '' : formData.endDate });
  };

  return (
    <div className="space-y-6">
      {/* Add Button */}
      {!isAdding && (
        <button
          onClick={() => setIsAdding(true)}
          className="w-full flex items-center justify-center space-x-2 px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 hover:text-blue-600 transition-colors"
        >
          <Plus className="h-5 w-5" />
          <span>Agregar Experiencia</span>
        </button>
      )}

      {/* Form */}
      {isAdding && (
        <form onSubmit={handleSubmit} className="bg-gray-50 p-4 rounded-lg space-y-4">
          <h4 className="font-medium text-gray-900">
            {editingId ? 'Editar Experiencia' : 'Nueva Experiencia'}
          </h4>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Empresa *
              </label>
              <input
                type="text"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Nombre de la empresa"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cargo *
              </label>
              <input
                type="text"
                value={formData.position}
                onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Tu cargo o posición"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Localidad
            </label>
            <input
              type="text"
              value={formData.location || ''}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Ciudad, País"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fecha de inicio *
              </label>
              <input
                type="month"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fecha de fin
              </label>
              <input
                type="month"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={formData.current}
              />
            </div>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="current-job"
              checked={formData.current}
              onChange={(e) => handleCurrentChange(e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="current-job" className="ml-2 text-sm text-gray-700">
              Trabajo actual
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Descripción
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              placeholder="Describe tus responsabilidades principales y logros en este puesto..."
            />
          </div>

          <div className="flex space-x-3">
            <button
              type="submit"
              className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              {editingId ? 'Actualizar' : 'Agregar'}
            </button>
            <button
              type="button"
              onClick={resetForm}
              className="flex-1 border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
          </div>
        </form>
      )}

      {/* Experience List */}
      {experience.length > 0 && (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={experience.map(exp => exp.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-3">
              {experience.map((exp) => (
                <SortableExperienceItem
                  key={exp.id}
                  experience={exp}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}

      {experience.length === 0 && !isAdding && (
        <div className="text-center py-8 text-gray-500">
          <Briefcase className="h-12 w-12 mx-auto mb-3 text-gray-300" />
          <p>No has agregado experiencia laboral aún</p>
          <p className="text-sm">Haz clic en "Agregar Experiencia" para comenzar</p>
        </div>
      )}
    </div>
  );
}
