import { Mail, Phone, MapPin, Globe, Users } from 'lucide-react';
import type { CVData, SectionConfig } from '../../types/cv';
import { getSortedVisibleSections } from '../../utils/sectionHelpers';

interface TemplateProps {
  data: CVData;
  config: SectionConfig;
}

export function GradientTemplate({ data, config }: Readonly<TemplateProps>) {
  const { personalData, profile, education, experience, skills } = data;
  const sortedSections = getSortedVisibleSections(config);

  const renderSection = (sectionKey: keyof typeof config) => {
    switch (sectionKey) {
      case 'profile':
        return profile.summary && (
          <div className="mb-6" key={sectionKey}>
            <h2 className="text-xl font-bold text-white mb-3 bg-gradient-to-r from-emerald-500 to-teal-600 p-3 rounded-lg shadow-lg">
              PERFIL PROFESIONAL
            </h2>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
              <p className="text-sm text-gray-100 leading-relaxed text-justify">{profile.summary}</p>
            </div>
          </div>
        );

      case 'experience':
        return experience.length > 0 && (
          <div className="mb-6" key={sectionKey}>
            <h2 className="text-xl font-bold text-white mb-3 bg-gradient-to-r from-emerald-500 to-teal-600 p-3 rounded-lg shadow-lg">
              EXPERIENCIA PROFESIONAL
            </h2>
            <div className="space-y-4">
              {experience.map((exp) => (
                <div key={exp.id} className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20 shadow-lg">
                  <div className="mb-2">
                    <h3 className="text-base font-semibold text-white">{exp.position}</h3>
                    <div className="text-emerald-300 font-medium text-sm">{exp.company}</div>
                    {exp.location && <div className="text-sm text-gray-300">{exp.location}</div>}
                    <div className="text-sm text-gray-400">
                      {exp.startDate} - {exp.current ? 'Presente' : exp.endDate}
                    </div>
                  </div>
                  
                  {exp.description && (
                    <p className="text-gray-200 text-sm leading-relaxed text-justify">{exp.description}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        );

      case 'education':
        return education.length > 0 && (
          <div className="mb-6" key={sectionKey}>
            <h2 className="text-xl font-bold text-white mb-3 bg-gradient-to-r from-emerald-500 to-teal-600 p-3 rounded-lg shadow-lg">
              FORMACIÓN ACADÉMICA
            </h2>
            <div className="space-y-4">
              {education.map((edu) => (
                <div key={edu.id} className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20 shadow-lg">
                  <div>
                    <h3 className="font-semibold text-white text-sm">{edu.degree}</h3>
                    <div className="text-emerald-300 text-sm">{edu.institution}</div>
                    {edu.field && <div className="text-gray-300 text-sm">{edu.field}</div>}
                    {edu.location && <div className="text-gray-300 text-sm">{edu.location}</div>}
                    <div className="text-sm text-gray-400">
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
          <div className="mb-6" key={sectionKey}>
            <h2 className="text-xl font-bold text-white mb-3 bg-gradient-to-r from-emerald-500 to-teal-600 p-3 rounded-lg shadow-lg">
              COMPETENCIAS
            </h2>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20 shadow-lg">
              <div className="grid grid-cols-1 gap-4">
                {skills.map((skill) => (
                  <div key={skill.id}>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium text-white">{skill.name}</span>
                      <span className="text-xs text-emerald-300">{skill.level * 20}%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-emerald-400 to-teal-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${skill.level * 20}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'languages':
        return data.languages && data.languages.length > 0 && (
          <div className="mb-6" key={sectionKey}>
            <h2 className="text-xl font-bold text-white mb-3 bg-gradient-to-r from-emerald-500 to-teal-600 p-3 rounded-lg shadow-lg">
              IDIOMAS
            </h2>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20 shadow-lg">
              <div className="space-y-2">
                {data.languages.map((lang) => (
                  <div key={lang.id} className="flex justify-between items-center">
                    <span className="text-sm font-medium text-white">{lang.name}</span>
                    <span className="text-xs text-emerald-300">{lang.level}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'certificates':
        return data.certificates && data.certificates.length > 0 && (
          <div className="mb-6" key={sectionKey}>
            <h2 className="text-xl font-bold text-white mb-3 bg-gradient-to-r from-emerald-500 to-teal-600 p-3 rounded-lg shadow-lg">
              CERTIFICADOS
            </h2>
            <div className="space-y-3">
              {data.certificates.map((cert) => (
                <div key={cert.id} className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20 shadow-lg">
                  {cert.url ? (
                    <a 
                      href={cert.url.startsWith('http') ? cert.url : `https://${cert.url}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-semibold text-white hover:text-emerald-300 hover:underline cursor-pointer"
                    >
                      {cert.name}
                    </a>
                  ) : (
                    <h3 className="font-semibold text-white">{cert.name}</h3>
                  )}
                  <div className="text-emerald-300">{cert.issuer}</div>
                  {cert.date && (
                    <div className="text-sm text-gray-400">{cert.date}</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        );

      case 'courses':
        return data.courses && data.courses.length > 0 && (
          <div className="mb-6" key={sectionKey}>
            <h2 className="text-xl font-bold text-white mb-3 bg-gradient-to-r from-emerald-500 to-teal-600 p-3 rounded-lg shadow-lg">
              CURSOS
            </h2>
            <div className="space-y-3">
              {data.courses.map((course) => (
                <div key={course.id} className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20 shadow-lg">
                  {course.url ? (
                    <a 
                      href={course.url.startsWith('http') ? course.url : `https://${course.url}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-semibold text-white hover:text-emerald-300 hover:underline cursor-pointer"
                    >
                      {course.name}
                    </a>
                  ) : (
                    <h3 className="font-semibold text-white">{course.name}</h3>
                  )}
                  <div className="text-emerald-300">{course.institution}</div>
                  {course.duration && (
                    <div className="text-gray-300 text-sm">{course.duration}</div>
                  )}
                  {course.date && (
                    <div className="text-sm text-gray-400">{course.date}</div>
                  )}
                  {course.description && (
                    <p className="text-gray-200 text-sm leading-relaxed mt-2 text-justify">{course.description}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        );

      case 'projects':
        return data.projects && data.projects.length > 0 && (
          <div className="mb-6" key={sectionKey}>
            <h2 className="text-xl font-bold text-white mb-3 bg-gradient-to-r from-emerald-500 to-teal-600 p-3 rounded-lg shadow-lg">
              PROYECTOS
            </h2>
            <div className="space-y-3">
              {data.projects.map((project) => (
                <div key={project.id} className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20 shadow-lg">
                  {project.url ? (
                    <a 
                      href={project.url.startsWith('http') ? project.url : `https://${project.url}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-semibold text-white hover:text-emerald-300 hover:underline cursor-pointer"
                    >
                      {project.name}
                    </a>
                  ) : (
                    <h3 className="font-semibold text-white">{project.name}</h3>
                  )}
                  {project.technologies && (
                    <div className="text-emerald-300 text-sm">{project.technologies}</div>
                  )}
                  {project.description && (
                    <p className="text-gray-200 text-sm leading-relaxed mt-2 text-justify">{project.description}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        );

      case 'volunteers':
        return data.volunteers && data.volunteers.length > 0 && (
          <div className="mb-6" key={sectionKey}>
            <h2 className="text-xl font-bold text-white mb-3 bg-gradient-to-r from-emerald-500 to-teal-600 p-3 rounded-lg shadow-lg">
              VOLUNTARIADO
            </h2>
            <div className="space-y-3">
              {data.volunteers.map((vol) => (
                <div key={vol.id} className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20 shadow-lg">
                  <h3 className="font-semibold text-white">{vol.role}</h3>
                  <div className="text-emerald-300">{vol.organization}</div>
                  <div className="text-sm text-gray-400">
                    {vol.startDate} - {vol.current ? 'Presente' : vol.endDate}
                  </div>
                  {vol.description && (
                    <p className="text-gray-200 text-sm leading-relaxed mt-2 text-justify">{vol.description}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        );

      case 'hobbies':
        return data.hobbies && data.hobbies.length > 0 && (
          <div className="mb-6" key={sectionKey}>
            <h2 className="text-xl font-bold text-white mb-3 bg-gradient-to-r from-emerald-500 to-teal-600 p-3 rounded-lg shadow-lg">
              INTERESES
            </h2>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20 shadow-lg">
              <div className="flex flex-wrap gap-2">
                {data.hobbies.map((hobby) => (
                  <span key={hobby.id} className="px-3 py-1 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-full text-sm">
                    {hobby.name}
                  </span>
                ))}
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-full bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800">
      <div className="flex">
        {/* Left Sidebar */}
        <div className="w-1/3 bg-gradient-to-b from-slate-800 to-gray-900 p-4">
          {/* Photo */}
          {personalData.photo && (
            <div className="text-center mb-6">
              <img
                src={personalData.photo}
                alt="Profile"
                className="w-20 h-24 rounded-lg mx-auto object-cover border-4 border-emerald-400 shadow-xl"
              />
            </div>
          )}

          {/* Contact Info */}
          <div className="mb-6">
            <h3 className="text-lg font-bold text-white mb-3 bg-gradient-to-r from-emerald-500 to-teal-600 p-2 rounded">
              CONTACTO
            </h3>
            <div className="space-y-3 text-xs">
              {personalData.email && (
                <div className="flex items-start gap-2">
                  <Mail className="h-3 w-3 flex-shrink-0 mt-0.5 text-emerald-400" />
                  <a 
                    href={`mailto:${personalData.email}`}
                    className="break-all hover:underline text-gray-300"
                  >
                    {personalData.email}
                  </a>
                </div>
              )}
              {personalData.phone && (
                <div className="flex items-start gap-2">
                  <Phone className="h-3 w-3 flex-shrink-0 mt-0.5 text-emerald-400" />
                  <a 
                    href={`tel:${personalData.phone}`}
                    className="hover:underline text-gray-300"
                  >
                    {personalData.phone}
                  </a>
                </div>
              )}
              {personalData.address && (
                <div className="flex items-start gap-2">
                  <MapPin className="h-3 w-3 flex-shrink-0 mt-0.5 text-emerald-400" />
                  <span className="break-words text-gray-300">{personalData.address}</span>
                </div>
              )}
              {personalData.website && (
                <div className="flex items-start gap-2">
                  <Globe className="h-3 w-3 flex-shrink-0 mt-0.5 text-emerald-400" />
                  <a 
                    href={personalData.website.startsWith('http') ? personalData.website : `https://${personalData.website}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="break-all hover:underline text-gray-300"
                  >
                    {personalData.website.replace(/^https?:\/\/(www\.)?/, '')}
                  </a>
                </div>
              )}
              {personalData.linkedIn && (
                <div className="flex items-start gap-2">
                  <Users className="h-3 w-3 flex-shrink-0 mt-0.5 text-emerald-400" />
                  <a 
                    href={personalData.linkedIn.startsWith('http') ? personalData.linkedIn : `https://${personalData.linkedIn}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="break-all hover:underline text-gray-300"
                  >
                    {personalData.linkedIn.replace(/^https?:\/\/(www\.)?/, '').replace(/^linkedin\.com\//, '')}
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Content */}
        <div className="w-2/3 p-4">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-4xl font-bold text-white mb-2 bg-gradient-to-r from-emerald-400 to-teal-500 bg-clip-text text-transparent">
              {personalData.firstName} {personalData.lastName}
            </h1>
            <div className="h-1 bg-gradient-to-r from-emerald-400 to-teal-500 w-32 rounded"></div>
          </div>

          {/* Render sections in order */}
          {sortedSections
            .filter(section => section !== 'personalData') // personalData es el header
            .map(section => renderSection(section))}
        </div>
      </div>
    </div>
  );
}
