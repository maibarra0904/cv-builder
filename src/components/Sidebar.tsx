import React, { useState } from 'react';
import { useCV } from '../hooks/useCV';
import { PersonalDataForm } from './forms/PersonalDataForm';
import { ProfileForm } from './forms/ProfileForm';
import { EducationForm } from './forms/EducationForm';
import { ExperienceForm } from './forms/ExperienceForm';
import { SkillsForm } from './forms/SkillsForm';
import { LanguagesForm } from './forms/LanguagesForm';
import { HobbiesForm } from './forms/HobbiesForm';
import { CertificatesForm } from './forms/CertificatesForm';
import { CoursesForm } from './forms/CoursesForm';
import { ProjectsForm } from './forms/ProjectsForm';
import { VolunteersForm } from './forms/VolunteersForm';
import { 
  ChevronDown,
  ChevronUp,
  ArrowUpDown,
  Eye,
  EyeOff,
  GripVertical,
  User,
  FileText,
  GraduationCap,
  Briefcase,
  Code,
  Users,
  Heart,
  Award,
  BookOpen,
  FolderOpen,
  Globe
} from 'lucide-react';
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

// Definir iconos para cada sección
const sectionIconsMap = {
  personalData: User,
  profile: FileText,
  education: GraduationCap,
  experience: Briefcase,
  skills: Code,
  languages: Users,
  hobbies: Heart,
  certificates: Award,
  courses: BookOpen,
  projects: FolderOpen,
  volunteers: Globe,
} as const;

const sectionLabels = {
  personalData: 'Datos Personales',
  profile: 'Perfil',
  education: 'Educación',
  experience: 'Experiencia',
  skills: 'Habilidades',
  languages: 'Idiomas',
  hobbies: 'Pasatiempos',
  certificates: 'Certificados',
  courses: 'Cursos',
  projects: 'Proyectos',
  volunteers: 'Voluntariado',
} as const;

// Definir secciones principales y secundarias
const mainSections: (keyof SectionConfig)[] = ['personalData', 'profile', 'education', 'experience', 'skills'];
const additionalSections: (keyof SectionConfig)[] = ['languages', 'certificates', 'courses', 'projects', 'hobbies', 'volunteers'];

export function Sidebar() {
  const { state, updateSectionConfig, reorderSections } = useCV();
  const [activeSection, setActiveSection] = useState<keyof SectionConfig>('personalData');
  const [showAdditionalSections, setShowAdditionalSections] = useState(false);
  const [showSectionReorder, setShowSectionReorder] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Obtener secciones ordenadas por su orden actual
  const getSortedSections = (sections: (keyof SectionConfig)[]) => {
    return sections.sort((a, b) => state.sectionConfig[a].order - state.sectionConfig[b].order);
  };

  const sortedMainSections = getSortedSections(mainSections);
  const sortedAdditionalSections = getSortedSections(additionalSections);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      // Combinar todas las secciones para el reordenamiento
      const allSections = [...sortedMainSections, ...sortedAdditionalSections];
      const oldIndex = allSections.findIndex(key => key === active.id);
      const newIndex = allSections.findIndex(key => key === over.id);
      
      const newSortedSections = [...allSections];
      const [removed] = newSortedSections.splice(oldIndex, 1);
      newSortedSections.splice(newIndex, 0, removed);
      
      reorderSections(newSortedSections);
    }
  };

  // Componente para las secciones que se pueden reordenar
  const SortableSectionItem = ({ 
    sectionKey, 
    isActive, 
    canReorder 
  }: {
    sectionKey: keyof SectionConfig;
    isActive: boolean;
    canReorder: boolean;
  }) => {
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

    const IconComponent = sectionIconsMap[sectionKey];
    const label = sectionLabels[sectionKey];

    return (
      <div
        ref={setNodeRef}
        style={style}
        className={`p-3 rounded-lg border-2 transition-all duration-200 ${
          isActive 
            ? 'bg-blue-50 border-blue-300 text-blue-900' 
            : 'bg-white border-gray-200 hover:border-gray-300 hover:bg-gray-50'
        }`}
      >
        <div className="flex items-center justify-between">
          <button
            onClick={() => setActiveSection(sectionKey)}
            className="flex items-center gap-3 flex-1 text-left"
          >
            {canReorder && (
              <div
                {...attributes}
                {...listeners}
                className="cursor-grab active:cursor-grabbing"
              >
                <GripVertical size={16} className="text-gray-400" />
              </div>
            )}
            <IconComponent size={20} />
            <span className="font-medium">{label}</span>
          </button>
          <button
            onClick={() => 
              updateSectionConfig({ 
                [sectionKey]: {
                  ...state.sectionConfig[sectionKey],
                  visible: !state.sectionConfig[sectionKey].visible 
                }
              })
            }
            className="ml-2 p-1 rounded-md hover:bg-gray-100 transition-colors"
          >
            {state.sectionConfig[sectionKey].visible ? (
              <Eye size={16} className="text-gray-600" />
            ) : (
              <EyeOff size={16} className="text-gray-400" />
            )}
          </button>
        </div>
      </div>
    );
  };

  const renderForm = () => {
    switch (activeSection) {
      case 'personalData':
        return <PersonalDataForm />;
      case 'profile':
        return <ProfileForm />;
      case 'education':
        return <EducationForm />;
      case 'experience':
        return <ExperienceForm />;
      case 'skills':
        return <SkillsForm />;
      case 'languages':
        return <LanguagesForm />;
      case 'hobbies':
        return <HobbiesForm />;
      case 'certificates':
        return <CertificatesForm />;
      case 'courses':
        return <CoursesForm />;
      case 'projects':
        return <ProjectsForm />;
      case 'volunteers':
        return <VolunteersForm />;
      default:
        return <PersonalDataForm />;
    }
  };

  return (
    <div className="h-full flex flex-col bg-gradient-to-b from-white via-gray-50/30 to-gray-100/20">
      {/* Section Navigation */}
      <div className="border-b border-gray-200/50 p-3 md:p-4 bg-gradient-to-r from-white to-gray-50/50">
        <div className="flex items-center justify-between mb-3 md:mb-4">
          <h2 className="text-base md:text-lg font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
            Secciones del CV
          </h2>
          <button
            onClick={() => setShowSectionReorder(!showSectionReorder)}
            className={`p-2 rounded-lg transition-all duration-200 ${
              showSectionReorder 
                ? 'bg-purple-100 text-purple-700 border border-purple-200' 
                : 'bg-white text-gray-600 border border-gray-200 hover:bg-purple-50'
            }`}
            title={showSectionReorder ? 'Desactivar reordenamiento' : 'Activar reordenamiento'}
          >
            <ArrowUpDown className="h-4 w-4" />
          </button>
        </div>
        
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <div className="space-y-2">
            {/* Secciones Principales */}
            <SortableContext 
              items={sortedMainSections} 
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-2">
                {sortedMainSections.map(sectionKey => (
                  <SortableSectionItem
                    key={sectionKey}
                    sectionKey={sectionKey}
                    isActive={activeSection === sectionKey}
                    canReorder={showSectionReorder}
                  />
                ))}
              </div>
            </SortableContext>
            
            {/* Separador y Botón para Más Secciones */}
            <div className="pt-3">
              <button
                onClick={() => setShowAdditionalSections(!showAdditionalSections)}
                className="w-full flex items-center justify-between px-2 md:px-3 py-2 text-left rounded-lg transition-all duration-200 hover:bg-gradient-to-r hover:from-gray-100 hover:to-gray-50 text-gray-600 border border-gray-200/70 bg-white/80 backdrop-blur-sm shadow-sm"
              >
                <span className="text-sm font-medium">Más Secciones</span>
                {showAdditionalSections ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </button>
            </div>
            
            {/* Secciones Adicionales */}
            {showAdditionalSections && (
              <SortableContext 
                items={sortedAdditionalSections} 
                strategy={verticalListSortingStrategy}
              >
                <div className="space-y-2 pt-2">
                  {sortedAdditionalSections.map(sectionKey => (
                    <SortableSectionItem
                      key={sectionKey}
                      sectionKey={sectionKey}
                      isActive={activeSection === sectionKey}
                      canReorder={showSectionReorder}
                    />
                  ))}
                </div>
              </SortableContext>
            )}
          </div>
        </DndContext>
      </div>

      {/* Current Section Form */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-3 md:p-4">
          {state.sectionConfig[activeSection].visible ? (
            <div>
              <h3 className="text-base md:text-lg font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-3 md:mb-4">
                {sectionLabels[activeSection]}
              </h3>
              <div className="bg-white/60 backdrop-blur-sm rounded-lg p-4 shadow-sm border border-gray-200/50">
                {renderForm()}
              </div>
            </div>
          ) : (
            <div className="text-center py-6 md:py-8 bg-white/40 backdrop-blur-sm rounded-lg border border-gray-200/50">
              <div className="text-gray-400 mb-2">
                {React.createElement(sectionIconsMap[activeSection], { size: 48, className: "mx-auto text-gray-300" })}
              </div>
              <p className="text-sm md:text-base text-gray-500">
                Esta sección está deshabilitada. Actívala para comenzar a editarla.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
