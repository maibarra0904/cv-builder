import { Mail, Phone, MapPin, Globe } from 'lucide-react';
import type { CVData, SectionConfig } from '../../types/cv';
import { getSortedVisibleSections } from '../../utils/sectionHelpers';

interface TemplateProps {
  data: CVData;
  config: SectionConfig;
}

export function ClassicTemplate({ data, config }: Readonly<TemplateProps>) {
  const { personalData, profile, education, experience, skills } = data;
  const sortedSections = getSortedVisibleSections(config);

  const renderSection = (sectionKey: keyof typeof config) => {
    switch (sectionKey) {
      case 'profile':
        return profile.summary && (
          <div className="mb-4" key={sectionKey}>
            <h2 className="text-lg font-bold text-gray-800 mb-2 border-b border-gray-300 pb-1">
              PERFIL PROFESIONAL
            </h2>
            <p className="text-sm text-gray-700 leading-relaxed text-justify">{profile.summary}</p>
          </div>
        );

      case 'experience':
        return experience.length > 0 && (
          <div className="mb-4" key={sectionKey}>
            <h2 className="text-lg font-bold text-gray-800 mb-2 border-b border-gray-300 pb-1">
              EXPERIENCIA PROFESIONAL
            </h2>
            <div className="space-y-3">
              {experience.map((exp) => (
                <div key={exp.id} className="border-l-2 border-gray-300 pl-4">
                  <div className="mb-1">
                    <h3 className="text-base font-semibold text-gray-800">{exp.position}</h3>
                    <div className="text-gray-600 font-medium text-sm">{exp.company}</div>
                    {exp.location && <div className="text-sm text-gray-600">{exp.location}</div>}
                    <div className="text-sm text-gray-500">
                      {exp.startDate} - {exp.current ? 'Presente' : exp.endDate}
                    </div>
                  </div>
                  
                  {exp.description && (
                    <p className="text-gray-700 text-sm leading-relaxed text-justify">{exp.description}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        );

      case 'education':
        return education.length > 0 && (
          <div className="mb-4" key={sectionKey}>
            <h2 className="text-lg font-bold text-gray-800 mb-2 border-b border-gray-300 pb-1">
              FORMACIÓN ACADÉMICA
            </h2>
            <div className="space-y-3">
              {education.map((edu) => (
                <div key={edu.id} className="border-l-2 border-gray-300 pl-4">
                  <div>
                    <h3 className="font-semibold text-gray-800 text-sm">{edu.degree}</h3>
                    <div className="text-gray-600 text-sm">{edu.institution}</div>
                    {edu.field && <div className="text-gray-600 text-sm">{edu.field}</div>}
                    {edu.location && <div className="text-gray-600 text-sm">{edu.location}</div>}
                    <div className="text-sm text-gray-500">
                      {edu.startDate} - {edu.current ? 'Presente' : edu.endDate}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'skills':
        return skills.length > 0 && (
          <div className="mb-4" key={sectionKey}>
            <h2 className="text-lg font-bold text-gray-800 mb-2 border-b border-gray-300 pb-1">
              COMPETENCIAS
            </h2>
            <div className="grid grid-cols-2 gap-2">
              {skills.map((skill) => (
                <div key={skill.id} className="flex justify-between items-center">
                  <span className="text-sm font-medium">{skill.name}</span>
                  <div className="flex space-x-1">
                    {[1, 2, 3, 4, 5].map((level) => (
                      <div
                        key={level}
                        className={`w-3 h-3 border border-gray-400 ${
                          level <= skill.level ? 'bg-gray-800' : 'bg-white'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'languages':
        return data.languages && data.languages.length > 0 && (
          <div className="mb-4" key={sectionKey}>
            <h2 className="text-lg font-bold text-gray-800 mb-2 border-b border-gray-300 pb-1">
              IDIOMAS
            </h2>
            <div className="space-y-2">
              {data.languages.map((lang) => (
                <div key={lang.id} className="flex justify-between items-center">
                  <span className="text-sm font-medium">{lang.name}</span>
                  <span className="text-xs text-gray-600">{lang.level}</span>
                </div>
              ))}
            </div>
          </div>
        );

      case 'certificates':
        return data.certificates && data.certificates.length > 0 && (
          <div className="mb-4" key={sectionKey}>
            <h2 className="text-lg font-bold text-gray-800 mb-2 border-b border-gray-300 pb-1">
              CERTIFICADOS
            </h2>
            <div className="space-y-2">
              {data.certificates.map((cert) => (
                <div key={cert.id} className="border-l-2 border-gray-300 pl-4">
                  {cert.url ? (
                    <a 
                      href={cert.url.startsWith('http') ? cert.url : `https://${cert.url}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-semibold text-gray-800 hover:text-gray-600 hover:underline cursor-pointer"
                    >
                      {cert.name}
                    </a>
                  ) : (
                    <h3 className="font-semibold text-gray-800">{cert.name}</h3>
                  )}
                  <div className="text-gray-600">{cert.issuer}</div>
                  {cert.date && (
                    <div className="text-sm text-gray-500">{cert.date}</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        );

      case 'courses':
        return data.courses && data.courses.length > 0 && (
          <div className="mb-4" key={sectionKey}>
            <h2 className="text-lg font-bold text-gray-800 mb-2 border-b border-gray-300 pb-1">
              CURSOS
            </h2>
            <div className="space-y-2">
              {data.courses.map((course) => (
                <div key={course.id} className="border-l-2 border-gray-300 pl-4">
                  {course.url ? (
                    <a 
                      href={course.url.startsWith('http') ? course.url : `https://${course.url}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-semibold text-gray-800 hover:text-gray-600 hover:underline cursor-pointer"
                    >
                      {course.name}
                    </a>
                  ) : (
                    <h3 className="font-semibold text-gray-800">{course.name}</h3>
                  )}
                  <div className="text-gray-600">{course.institution}</div>
                  {course.duration && (
                    <div className="text-gray-600 text-sm">{course.duration}</div>
                  )}
                  {course.date && (
                    <div className="text-sm text-gray-500">{course.date}</div>
                  )}
                  {course.description && (
                    <p className="text-gray-700 text-sm leading-relaxed mt-2 text-justify">{course.description}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        );

      case 'projects':
        return data.projects && data.projects.length > 0 && (
          <div className="mb-4" key={sectionKey}>
            <h2 className="text-lg font-bold text-gray-800 mb-2 border-b border-gray-300 pb-1">
              PROYECTOS
            </h2>
            <div className="space-y-2">
              {data.projects.map((project) => (
                <div key={project.id} className="border-l-2 border-gray-300 pl-4">
                  {project.url ? (
                    <a 
                      href={project.url.startsWith('http') ? project.url : `https://${project.url}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-semibold text-gray-800 hover:text-gray-600 hover:underline cursor-pointer"
                    >
                      {project.name}
                    </a>
                  ) : (
                    <h3 className="font-semibold text-gray-800">{project.name}</h3>
                  )}
                  {project.technologies && (
                    <div className="text-gray-600 text-sm">{project.technologies}</div>
                  )}
                  {project.description && (
                    <p className="text-gray-700 text-sm leading-relaxed mt-2 text-justify">{project.description}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        );

      case 'volunteers':
        return data.volunteers && data.volunteers.length > 0 && (
          <div className="mb-4" key={sectionKey}>
            <h2 className="text-lg font-bold text-gray-800 mb-2 border-b border-gray-300 pb-1">
              VOLUNTARIADO
            </h2>
            <div className="space-y-2">
              {data.volunteers.map((vol) => (
                <div key={vol.id} className="border-l-2 border-gray-300 pl-4">
                  <h3 className="font-semibold text-gray-800">{vol.role}</h3>
                  <div className="text-gray-600">{vol.organization}</div>
                  <div className="text-sm text-gray-500">
                    {vol.startDate} - {vol.current ? 'Presente' : vol.endDate}
                  </div>
                  {vol.description && (
                    <p className="text-gray-700 text-sm leading-relaxed mt-2 text-justify">{vol.description}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        );

      case 'hobbies':
        return data.hobbies && data.hobbies.length > 0 && (
          <div className="mb-4" key={sectionKey}>
            <h2 className="text-lg font-bold text-gray-800 mb-2 border-b border-gray-300 pb-1">
              INTERESES
            </h2>
            <div className="flex flex-wrap gap-2">
              {data.hobbies.map((hobby) => (
                <span key={hobby.id} className="px-3 py-1 bg-gray-200 text-gray-800 rounded text-sm">
                  {hobby.name}
                </span>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="p-4 text-gray-800 min-h-full">
      <div className="space-y-3">
      {/* Header */}
      <div className="text-center border-b-2 border-gray-800 pb-3">
        {personalData.photo && (
          <div className="mt-3">
            <img
              src={personalData.photo}
              alt="Profile"
              className="w-20 h-24 rounded mx-auto object-cover border-2 border-gray-300"
            />
          </div>
        )}
        <h1 className="text-2xl font-bold mb-1">
          {personalData.firstName} {personalData.lastName}
        </h1>
        
        <div className="flex justify-center items-center flex-wrap gap-4 text-xs">
          
          {personalData.email && (
            <div className="flex items-center space-x-2 min-w-0 flex-shrink-0">
              <Mail className="h-4 w-4 flex-shrink-0" />
              <a 
                href={`mailto:${personalData.email}`}
                className="break-all hover:underline min-w-0"
              >
                {personalData.email}
              </a>
            </div>
          )}
          {personalData.phone && (
            <div className="flex items-center space-x-2 min-w-0 flex-shrink-0">
              <Phone className="h-4 w-4 flex-shrink-0" />
              <a 
                href={`tel:${personalData.phone}`}
                className="whitespace-nowrap hover:underline min-w-0"
              >
                {personalData.phone}
              </a>
            </div>
          )}
          {personalData.address && (
            <div className="flex items-center space-x-2 min-w-0 flex-shrink-0">
              <MapPin className="h-4 w-4 flex-shrink-0" />
              <span className="break-words min-w-0">{personalData.address}</span>
            </div>
          )}
          {personalData.website && (
            <div className="flex items-center space-x-2 min-w-0 flex-shrink-0">
              <Globe className="h-4 w-4 flex-shrink-0" />
              <a 
                href={personalData.website.startsWith('http') ? personalData.website : `https://${personalData.website}`}
                target="_blank"
                rel="noopener noreferrer"
                className="break-all hover:underline cursor-pointer min-w-0"
              >
                {personalData.website.replace(/^https?:\/\/(www\.)?/, '')}
              </a>
            </div>
          )}
          {personalData.linkedIn && (
            <div className="flex items-center space-x-2 min-w-0 flex-shrink-0">
              <Globe className="h-4 w-4 flex-shrink-0" />
              <a 
                href={personalData.linkedIn.startsWith('http') ? personalData.linkedIn : `https://${personalData.linkedIn}`}
                target="_blank"
                rel="noopener noreferrer"
                className="break-all hover:underline cursor-pointer min-w-0"
              >
                {personalData.linkedIn.replace(/^https?:\/\/(www\.)?/, '').replace(/^linkedin\.com\//, '')}
              </a>
            </div>
          )}
        </div>
        
        {/* Photo */}
        
      </div>

      {/* Render sections in order */}
      {sortedSections
        .filter(section => section !== 'personalData') // personalData es el header
        .map(section => renderSection(section))}
      </div>
    </div>
  );
}
