import { useState } from 'react';
import { useCV } from '../../hooks/useCV';
import { Plus, X, BookOpen } from 'lucide-react';
import type { Course } from '../../types/cv';

export function CoursesForm() {
  const { state, updateCourses } = useCV();
  const { courses } = state.cvData;
  const [isAdding, setIsAdding] = useState(false);
  const [newCourse, setNewCourse] = useState({
    name: '',
    institution: '',
    duration: '',
    date: '',
    url: ''
  });

  const addCourse = () => {
    if (newCourse.name.trim() && newCourse.institution.trim()) {
      const newCourseData: Course = { 
        id: Date.now().toString(), 
        ...newCourse
      };
      updateCourses([...courses, newCourseData]);
      setNewCourse({
        name: '',
        institution: '',
        duration: '',
        date: '',
        url: ''
      });
      setIsAdding(false);
    }
  };

  const deleteCourse = (id: string) => {
    updateCourses(courses.filter(course => course.id !== id));
  };

  const updateCourse = (id: string, field: keyof Omit<Course, 'id'>, value: string) => {
    updateCourses(courses.map(course => 
      course.id === id ? { ...course, [field]: value } : course
    ));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">Cursos y Certificaciones</h3>
        </div>
        <button
          onClick={() => setIsAdding(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Agregar Curso
        </button>
      </div>

      {isAdding && (
        <div className="bg-gray-50 p-4 rounded-lg space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="course-name" className="block text-sm font-medium text-gray-700 mb-1">
                Nombre del Curso *
              </label>
              <input
                id="course-name"
                type="text"
                value={newCourse.name}
                onChange={(e) => setNewCourse({ ...newCourse, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ej: React Avanzado"
              />
            </div>
            <div>
              <label htmlFor="course-institution" className="block text-sm font-medium text-gray-700 mb-1">
                Institución *
              </label>
              <input
                id="course-institution"
                type="text"
                value={newCourse.institution}
                onChange={(e) => setNewCourse({ ...newCourse, institution: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ej: Universidad TechnoLab"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="course-duration" className="block text-sm font-medium text-gray-700 mb-1">
                Duración
              </label>
              <input
                id="course-duration"
                type="text"
                value={newCourse.duration}
                onChange={(e) => setNewCourse({ ...newCourse, duration: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ej: 40 horas"
              />
            </div>
            <div>
              <label htmlFor="course-date" className="block text-sm font-medium text-gray-700 mb-1">
                Año
              </label>
              <input
                id="course-date"
                type="text"
                value={newCourse.date}
                onChange={(e) => setNewCourse({ ...newCourse, date: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ej: 2024"
              />
            </div>
          </div>
          <div>
            <label htmlFor="course-url" className="block text-sm font-medium text-gray-700 mb-1">
              URL del Certificado
            </label>
            <input
              id="course-url"
              type="url"
              value={newCourse.url}
              onChange={(e) => setNewCourse({ ...newCourse, url: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="https://ejemplo.com/certificado"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={addCourse}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            >
              Agregar
            </button>
            <button
              onClick={() => {
                setIsAdding(false);
                setNewCourse({ name: '', institution: '', duration: '', date: '', url: '' });
              }}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {courses.map((course) => (
          <div key={course.id} className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label htmlFor={`course-name-${course.id}`} className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre del Curso
                </label>
                <input
                  id={`course-name-${course.id}`}
                  type="text"
                  value={course.name}
                  onChange={(e) => updateCourse(course.id, 'name', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label htmlFor={`course-institution-${course.id}`} className="block text-sm font-medium text-gray-700 mb-1">
                  Institución
                </label>
                <input
                  id={`course-institution-${course.id}`}
                  type="text"
                  value={course.institution}
                  onChange={(e) => updateCourse(course.id, 'institution', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label htmlFor={`course-duration-${course.id}`} className="block text-sm font-medium text-gray-700 mb-1">
                  Duración
                </label>
                <input
                  id={`course-duration-${course.id}`}
                  type="text"
                  value={course.duration}
                  onChange={(e) => updateCourse(course.id, 'duration', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label htmlFor={`course-date-${course.id}`} className="block text-sm font-medium text-gray-700 mb-1">
                  Año
                </label>
                <input
                  id={`course-date-${course.id}`}
                  type="text"
                  value={course.date}
                  onChange={(e) => updateCourse(course.id, 'date', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4 mb-4">
              <div>
                <label htmlFor={`course-url-${course.id}`} className="block text-sm font-medium text-gray-700 mb-1">
                  URL del Certificado
                </label>
                <input
                  id={`course-url-${course.id}`}
                  type="url"
                  value={course.url || ''}
                  onChange={(e) => updateCourse(course.id, 'url', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="flex justify-end">
              <button
                onClick={() => deleteCourse(course.id)}
                className="flex items-center gap-2 px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
              >
                <X className="w-4 h-4" />
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
