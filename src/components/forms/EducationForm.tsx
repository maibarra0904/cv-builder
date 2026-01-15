import { useState } from 'react';
import { useCV } from '../../hooks/useCV';
import useTranslation from '../../i18n/useTranslation';
import { Plus, Edit2, Trash2, GraduationCap, GripVertical } from 'lucide-react';
import type { Education } from '../../types/cv';
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

interface SortableEducationItemProps {
  education: Education;
  onEdit: (education: Education) => void;
  onDelete: (id: string) => void;
}

function SortableEducationItem({ education, onEdit, onDelete }: Readonly<SortableEducationItemProps>) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: education.id });

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
          <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
            <GraduationCap className="h-5 w-5 text-green-600" />
          </div>
          <div className="flex-1">
            <h4 className="font-medium text-gray-900">{education.degree}</h4>
            <p className="text-sm text-gray-600">{education.institution}</p>
            {education.location && <p className="text-sm text-gray-500">{education.location}</p>}
            <p className="text-xs text-gray-500">
              {education.startDate} - {education.current ? 'Presente' : education.endDate}
            </p>
          </div>
        </div>
        <div className="flex space-x-1">
          <button
            onClick={() => onEdit(education)}
            className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
          >
            <Edit2 className="h-4 w-4" />
          </button>
          <button
            onClick={() => onDelete(education.id)}
            className="p-2 text-gray-400 hover:text-red-600 transition-colors"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

export function EducationForm() {
  const { state, updateEducation, reorderEducation } = useCV();
  const { education } = state.cvData;
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Omit<Education, 'id'>>({
    institution: '',
    degree: '',
    startDate: '',
    endDate: '',
    current: false,
    description: '',
    location: '',
  });

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const { t } = useTranslation();

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const oldIndex = education.findIndex((item) => item.id === active.id);
      const newIndex = education.findIndex((item) => item.id === over?.id);

      reorderEducation(oldIndex, newIndex);
    }
  };

  const resetForm = () => {
    setFormData({
      institution: '',
      degree: '',
      startDate: '',
      endDate: '',
      current: false,
      description: '',
      location: '',
    });
    setIsAdding(false);
    setEditingId(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingId) {
      // Actualizar educación existente
      const updatedEducation = education.map(edu => 
        edu.id === editingId ? { ...edu, ...formData } : edu
      );
      updateEducation(updatedEducation);
    } else {
      // Agregar nueva educación
      const newEducation = [...education, { ...formData, id: Date.now().toString() }];
      updateEducation(newEducation);
    }
    
    resetForm();
  };

  const handleEdit = (edu: Education) => {
    setFormData(edu);
    setEditingId(edu.id);
    setIsAdding(true);
  };

  const handleDelete = (id: string) => {
    const filteredEducation = education.filter(edu => edu.id !== id);
    updateEducation(filteredEducation);
  };

  return (
    <div className="space-y-6">
      {!isAdding && (
        <button
          onClick={() => setIsAdding(true)}
          className="w-full flex items-center justify-center space-x-2 px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 hover:text-blue-600 transition-colors"
        >
          <Plus className="h-5 w-5" />
          <span>{t('forms.education.add')}</span>
        </button>
      )}

      {isAdding && (
        <form onSubmit={handleSubmit} className="bg-gray-50 p-4 rounded-lg space-y-4">
          <h4 className="font-medium text-gray-900">
            {editingId ? t('forms.education.edit') : t('forms.education.new')}
          </h4>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('forms.education.institution')}
            </label>
            <input
              type="text"
              value={formData.institution}
              onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder={t('forms.education.institutionPlaceholder') as string}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('forms.education.degree')}
            </label>
            <input
              type="text"
              value={formData.degree}
              onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder={t('forms.education.degreePlaceholder') as string}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('forms.education.location')}
            </label>
            <input
              type="text"
              value={formData.location || ''}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder={t('forms.education.location') as string}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('forms.education.startDate')}
              </label>
              <input
                type="month"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('forms.education.endDate')}
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
              id="current-study"
              checked={formData.current}
              onChange={(e) => setFormData({ ...formData, current: e.target.checked, endDate: e.target.checked ? '' : formData.endDate })}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="current-study" className="ml-2 text-sm text-gray-700">
              {t('forms.education.studying')}
            </label>
          </div>

          <div className="flex space-x-3">
            <button
              type="submit"
              className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              {editingId ? t('forms.education.submitUpdate') : t('forms.education.submitAdd')}
            </button>
            <button
              type="button"
              onClick={resetForm}
              className="flex-1 border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
            >
              {t('forms.education.cancel')}
            </button>
          </div>
        </form>
      )}

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={education.map(edu => edu.id)} strategy={verticalListSortingStrategy}>
          <div className="space-y-3">
            {education.map((edu) => (
              <SortableEducationItem
                key={edu.id}
                education={edu}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {education.length === 0 && !isAdding && (
        <div className="text-center py-8 text-gray-500">
          <GraduationCap className="h-12 w-12 mx-auto mb-3 text-gray-300" />
          <p>{t('forms.education.emptyTitle')}</p>
          <p className="text-sm">{t('forms.education.emptyHint')}</p>
        </div>
      )}
    </div>
  );
}
