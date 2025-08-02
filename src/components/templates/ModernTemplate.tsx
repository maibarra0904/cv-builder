import { Mail, Phone, MapPin, Globe } from 'lucide-react';
import type { CVData, SectionConfig } from '../../types/cv';
import { getSortedVisibleSections } from '../../utils/sectionHelpers';

interface TemplateProps {
  data: CVData;
  config: SectionConfig;
}

export function ModernTemplate({ data, config }: Readonly<TemplateProps>) {
  const { personalData, profile, education, experience, skills } = data;
  const sortedSections = getSortedVisibleSections(config);

  const renderPercentage = (level: number) => {
    const percentage = level * 20;
    return (
      <div className="w-full">
        <div className="flex justify-between items-center mb-1">
          <span className="text-xs font-medium">{percentage}%</span>
        </div>
        <div className="w-full bg-blue-300 rounded-full h-2">
          <div 
            className="bg-white h-2 rounded-full transition-all duration-300"
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
      </div>
    );
  };

  const renderSection = (sectionKey: keyof typeof config) => {
    switch (sectionKey) {
      case 'profile':
        return profile.summary && (
          <div className="mb-4" key={sectionKey}>
            <h2 className="text-lg font-bold text-gray-800 mb-2 flex items-center">
              <div className="w-1 h-5 bg-blue-600 mr-2"></div>
              PERFIL PROFESIONAL
            </h2>
            <p className="text-sm text-gray-700 leading-relaxed text-justify">{profile.summary}</p>
          </div>
        );

      case 'experience':
        return experience.length > 0 && (
          <div className="mb-4" key={sectionKey}>
            <h2 className="text-lg font-bold text-gray-800 mb-2 flex items-center">
              <div className="w-1 h-5 bg-blue-600 mr-2"></div>
              EXPERIENCIA PROFESIONAL
            </h2>
            <div className="space-y-3">
              {experience.map((exp) => (
                <div key={exp.id} className="relative pl-6">
                  <div className="absolute left-0 top-2 w-3 h-3 bg-blue-600 rounded-full"></div>
                  <div className="absolute left-1.5 top-5 w-0.5 h-full bg-blue-200"></div>
                  
                  <div className="mb-1">
                    <h3 className="text-base font-semibold text-gray-800">{exp.position}</h3>
                    <div className="text-blue-600 font-medium text-sm">{exp.company}</div>
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
            <h2 className="text-lg font-bold text-gray-800 mb-2 flex items-center">
              <div className="w-1 h-5 bg-blue-600 mr-2"></div>
              FORMACIÓN ACADÉMICA
            </h2>
            <div className="space-y-3">
              {education.map((edu) => (
                <div key={edu.id} className="relative pl-6">
                  <div className="absolute left-0 top-2 w-3 h-3 bg-blue-600 rounded-full"></div>
                  
                  <div>
                    <h3 className="font-semibold text-gray-800 text-sm">{edu.degree}</h3>
                    <div className="text-blue-600 text-sm">{edu.institution}</div>
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

      case 'certificates':
        return data.certificates && data.certificates.length > 0 && (
          <div className="mb-4" key={sectionKey}>
            <h2 className="text-lg font-bold text-gray-800 mb-2 flex items-center">
              <div className="w-1 h-5 bg-blue-600 mr-2"></div>
              CERTIFICADOS
            </h2>
            <div className="space-y-3">
              {data.certificates.map((cert) => (
                <div key={cert.id} className="relative pl-6">
                  <div className="absolute left-0 top-2 w-3 h-3 bg-blue-600 rounded-full"></div>
                  
                  <div>
                    {cert.url ? (
                      <a 
                        href={cert.url.startsWith('http') ? cert.url : `https://${cert.url}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-semibold text-gray-800 hover:text-blue-600 hover:underline cursor-pointer"
                      >
                        {cert.name}
                      </a>
                    ) : (
                      <h3 className="font-semibold text-gray-800">{cert.name}</h3>
                    )}
                    <div className="text-blue-600">{cert.issuer}</div>
                    {cert.date && (
                      <div className="text-sm text-gray-500">{cert.date}</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'courses':
        return data.courses && data.courses.length > 0 && (
          <div className="mb-4" key={sectionKey}>
            <h2 className="text-lg font-bold text-gray-800 mb-2 flex items-center">
              <div className="w-1 h-5 bg-blue-600 mr-2"></div>
              CURSOS
            </h2>
            <div className="space-y-3">
              {data.courses.map((course) => (
                <div key={course.id} className="relative pl-6">
                  <div className="absolute left-0 top-2 w-3 h-3 bg-blue-600 rounded-full"></div>
                  
                  <div>
                    {course.url ? (
                      <a 
                        href={course.url.startsWith('http') ? course.url : `https://${course.url}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-semibold text-gray-800 hover:text-blue-600 hover:underline cursor-pointer"
                      >
                        {course.name}
                      </a>
                    ) : (
                      <h3 className="font-semibold text-gray-800">{course.name}</h3>
                    )}
                    <div className="text-blue-600">{course.institution}</div>
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
                </div>
              ))}
            </div>
          </div>
        );

      case 'projects':
        return data.projects && data.projects.length > 0 && (
          <div className="mb-4" key={sectionKey}>
            <h2 className="text-lg font-bold text-gray-800 mb-2 flex items-center">
              <div className="w-1 h-5 bg-blue-600 mr-2"></div>
              PROYECTOS
            </h2>
            <div className="space-y-3">
              {data.projects.map((project) => (
                <div key={project.id} className="relative pl-6">
                  <div className="absolute left-0 top-2 w-3 h-3 bg-blue-600 rounded-full"></div>
                  
                  <div>
                    {project.url ? (
                      <a 
                        href={project.url.startsWith('http') ? project.url : `https://${project.url}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-semibold text-gray-800 hover:text-blue-600 hover:underline cursor-pointer"
                      >
                        {project.name}
                      </a>
                    ) : (
                      <h3 className="font-semibold text-gray-800">{project.name}</h3>
                    )}
                    {project.technologies && (
                      <div className="text-blue-600 text-sm">{project.technologies}</div>
                    )}
                    {project.description && (
                      <p className="text-gray-700 text-sm leading-relaxed mt-2 text-justify">{project.description}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'volunteers':
        return data.volunteers && data.volunteers.length > 0 && (
          <div className="mb-4" key={sectionKey}>
            <h2 className="text-lg font-bold text-gray-800 mb-2 flex items-center">
              <div className="w-1 h-5 bg-blue-600 mr-2"></div>
              VOLUNTARIADO
            </h2>
            <div className="space-y-3">
              {data.volunteers.map((vol) => (
                <div key={vol.id} className="relative pl-6">
                  <div className="absolute left-0 top-2 w-3 h-3 bg-blue-600 rounded-full"></div>
                  
                  <div>
                    <h3 className="font-semibold text-gray-800">{vol.role}</h3>
                    <div className="text-blue-600">{vol.organization}</div>
                    <div className="text-sm text-gray-500">
                      {vol.startDate} - {vol.current ? 'Presente' : vol.endDate}
                    </div>
                    {vol.description && (
                      <p className="text-gray-700 text-sm leading-relaxed mt-2 text-justify">{vol.description}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'hobbies':
        return data.hobbies && data.hobbies.length > 0 && (
          <div className="mb-4" key={sectionKey}>
            <h2 className="text-lg font-bold text-gray-800 mb-2 flex items-center">
              <div className="w-1 h-5 bg-blue-600 mr-2"></div>
              INTERESES
            </h2>
            <div className="flex flex-wrap gap-2">
              {data.hobbies.map((hobby) => (
                <span key={hobby.id} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                  {hobby.name}
                </span>
              ))}
            </div>
          </div>
        );

      case 'languages':
        return data.languages && data.languages.length > 0 && (
          <div className="mb-4" key={sectionKey}>
            <h2 className="text-lg font-bold text-gray-800 mb-2 flex items-center">
              <div className="w-1 h-5 bg-blue-600 mr-2"></div>
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

      default:
        return null;
    }
  };

  return (
    <div className="flex min-h-full">
      {/* Left Sidebar */}
      <div className="w-1/3 bg-gradient-to-b from-blue-600 to-blue-800 text-white p-3 flex flex-col">
        <div className="flex-1 space-y-4">
        {/* Photo */}
        {personalData.photo && (
          <div className="text-center">
            <img
              src={personalData.photo}
              alt="Profile"
              className="w-20 h-24 rounded-full mx-auto object-cover border-4 border-white shadow-lg"
            />
          </div>
        )}

        {/* Contact Info */}
        <div>
          <h3 className="text-base font-bold mb-2 border-b border-blue-400 pb-1">CONTACTO</h3>
          <div className="space-y-3 text-xs">
            {personalData.email && (
              <div className="flex items-start gap-2">
                <Mail className="h-3 w-3 flex-shrink-0 mt-0.5" />
                <a 
                  href={`mailto:${personalData.email}`}
                  className="break-all hover:underline"
                >
                  {personalData.email}
                </a>
              </div>
            )}
            {personalData.phone && (
              <div className="flex items-start gap-2">
                <Phone className="h-3 w-3 flex-shrink-0 mt-0.5" />
                <a 
                  href={`tel:${personalData.phone}`}
                  className="hover:underline"
                >
                  {personalData.phone}
                </a>
              </div>
            )}
            {personalData.address && (
              <div className="flex items-start gap-2">
                <MapPin className="h-3 w-3 flex-shrink-0 mt-0.5" />
                <span className="break-words">{personalData.address}</span>
              </div>
            )}
            {personalData.website && (
              <div className="flex items-start gap-2">
                <Globe className="h-3 w-3 flex-shrink-0 mt-0.5" />
                <a 
                  href={personalData.website.startsWith('http') ? personalData.website : `https://${personalData.website}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="break-all hover:underline"
                >
                  {personalData.website.replace(/^https?:\/\/(www\.)?/, '')}
                </a>
              </div>
            )}
            {personalData.linkedIn && (
              <div className="flex items-start gap-2">
                <Globe className="h-3 w-3 flex-shrink-0 mt-0.5" />
                <a 
                  href={personalData.linkedIn.startsWith('http') ? personalData.linkedIn : `https://${personalData.linkedIn}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="break-all hover:underline"
                >
                  {personalData.linkedIn.replace(/^https?:\/\/(www\.)?/, '').replace(/^linkedin\.com\//, '')}
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Skills */}
        {config.skills.visible && skills.length > 0 && (
          <div>
            <h3 className="text-base font-bold mb-2 border-b border-blue-400 pb-1">COMPETENCIAS</h3>
            <div className="space-y-3">
              {skills.map((skill) => (
                <div key={skill.id}>
                  <div className="mb-2">
                    <span className="text-sm font-medium">{skill.name}</span>
                  </div>
                  {renderPercentage(skill.level)}
                </div>
              ))}
            </div>
          </div>
        )}
        </div>
      </div>

      {/* Right Content */}
      <div className="w-2/3 p-3 flex flex-col">
        {/* Header */}
        <div className="mb-4">
          <h1 className="text-3xl font-bold text-gray-800 mb-1">
            {personalData.firstName} {personalData.lastName}
          </h1>
          <div className="h-1 bg-gradient-to-r from-blue-600 to-blue-400 w-20 mb-2"></div>
        </div>

        {/* Render sections in order */}
        {sortedSections
          .filter(section => section !== 'personalData' && section !== 'skills') // Skills en sidebar, personalData es header
          .map(section => renderSection(section))}
      </div>
    </div>
  );
}
