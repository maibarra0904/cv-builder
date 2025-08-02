import { useState } from 'react';
import { useCV } from '../../hooks/useCV';
import { Plus, X, Folder, Calendar, ExternalLink } from 'lucide-react';

export function ProjectsForm() {
  const { state, updateProjects } = useCV();
  const { projects } = state.cvData;
  const [isAdding, setIsAdding] = useState(false);
  const [newProject, setNewProject] = useState({
    name: '',
    description: '',
    technologies: '',
    url: '',
    startDate: '',
    endDate: ''
  });

  const addProject = () => {
    if (newProject.name.trim() && newProject.description.trim()) {
      const projectToAdd = { 
        id: Date.now().toString(), 
        ...newProject,
        technologies: newProject.technologies.split(',').map(tech => tech.trim()).filter(Boolean)
      };
      updateProjects([...projects, projectToAdd]);
      setNewProject({
        name: '',
        description: '',
        technologies: '',
        url: '',
        startDate: '',
        endDate: ''
      });
      setIsAdding(false);
    }
  };

  const removeProject = (id: string) => {
    const updatedProjects = projects.filter(project => project.id !== id);
    updateProjects(updatedProjects);
  };

  return (
    <div className="space-y-4">
      {/* Add project button */}
      {!isAdding && (
        <button
          onClick={() => setIsAdding(true)}
          className="w-full flex items-center justify-center space-x-2 bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-5 w-5" />
          <span>Agregar Proyecto</span>
        </button>
      )}

      {/* Add project form */}
      {isAdding && (
        <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label htmlFor="project-name" className="block text-sm font-medium text-gray-700 mb-1">
                Nombre del Proyecto *
              </label>
              <input
                id="project-name"
                type="text"
                value={newProject.name}
                onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="ej. E-commerce App"
              />
            </div>
            <div>
              <label htmlFor="project-description" className="block text-sm font-medium text-gray-700 mb-1">
                Descripción *
              </label>
              <textarea
                id="project-description"
                value={newProject.description}
                onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Describe el proyecto, sus objetivos y logros..."
              />
            </div>
            <div>
              <label htmlFor="project-technologies" className="block text-sm font-medium text-gray-700 mb-1">
                Tecnologías Utilizadas
              </label>
              <input
                id="project-technologies"
                type="text"
                value={newProject.technologies}
                onChange={(e) => setNewProject({ ...newProject, technologies: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="React, Node.js, MongoDB (separadas por comas)"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="project-start" className="block text-sm font-medium text-gray-700 mb-1">
                  Fecha de Inicio
                </label>
                <input
                  id="project-start"
                  type="date"
                  value={newProject.startDate}
                  onChange={(e) => setNewProject({ ...newProject, startDate: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label htmlFor="project-end" className="block text-sm font-medium text-gray-700 mb-1">
                  Fecha de Finalización
                </label>
                <input
                  id="project-end"
                  type="date"
                  value={newProject.endDate}
                  onChange={(e) => setNewProject({ ...newProject, endDate: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="project-url" className="block text-sm font-medium text-gray-700 mb-1">
                  URL del Proyecto
                </label>
                <input
                  id="project-url"
                  type="url"
                  value={newProject.url}
                  onChange={(e) => setNewProject({ ...newProject, url: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="https://mi-proyecto.com"
                />
              </div>
            </div>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={addProject}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Guardar
            </button>
            <button
              onClick={() => setIsAdding(false)}
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* Projects list */}
      <div className="space-y-4">
        {projects.map((project) => (
          <div key={project.id} className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3">
                <Folder className="h-6 w-6 text-purple-500 mt-1" />
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{project.name}</h3>
                  <p className="text-sm text-gray-600 mt-1">{project.description}</p>
                  
                  {project.technologies && project.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {project.technologies.map((tech) => (
                        <span
                          key={`${project.id}-${tech}`}
                          className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                  
                  {(project.startDate || project.endDate) && (
                    <div className="flex items-center space-x-1 text-sm text-gray-500 mt-2">
                      <Calendar className="h-4 w-4" />
                      <span>
                        {project.startDate && new Date(project.startDate).toLocaleDateString()}
                        {project.startDate && project.endDate && ' - '}
                        {project.endDate && new Date(project.endDate).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                  
                  <div className="flex space-x-4 mt-2">
                    {project.url && (
                      <a
                        href={project.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-1 text-sm text-blue-600 hover:text-blue-800"
                      >
                        <ExternalLink className="h-4 w-4" />
                        <span>Ver proyecto</span>
                      </a>
                    )}
                  </div>
                </div>
              </div>
              <button
                onClick={() => removeProject(project.id)}
                className="text-gray-400 hover:text-red-600 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {projects.length === 0 && !isAdding && (
        <div className="text-center py-8 text-gray-500">
          <Folder className="h-12 w-12 mx-auto mb-3 text-gray-300" />
          <p>No has agregado proyectos aún</p>
          <p className="text-sm">Muestra tus trabajos y proyectos destacados</p>
        </div>
      )}
    </div>
  );
}
