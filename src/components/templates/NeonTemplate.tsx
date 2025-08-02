import React from 'react';
import type { CVData, SectionConfig } from '../../types/cv';

interface NeonTemplateProps {
  data: CVData;
  sectionConfig: SectionConfig;
}

const NeonTemplate: React.FC<NeonTemplateProps> = ({ data, sectionConfig }) => {
  const { personalData, profile, experience, education, skills, languages, projects, courses, certificates } = data;

  return (
    <div id="cv-content" className="min-h-[297mm] bg-gray-900 text-white font-mono text-sm leading-relaxed relative overflow-hidden">
      {/* Cyber background effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-900/20 via-gray-900 to-purple-900/20"></div>
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400"></div>
      
      <div className="relative z-10 p-8">
        {/* Header */}
        <header className="border-b border-cyan-500/30 pb-6 mb-8">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h1 className="text-4xl font-bold text-cyan-400 mb-2 tracking-wider">
                <span className="text-cyan-400">[</span>
                {personalData.firstName || personalData.lastName ? `${personalData.firstName} ${personalData.lastName}` : 'NOMBRE'}
                <span className="text-cyan-400">]</span>
              </h1>
              <p className="text-xl text-purple-300 mb-4 font-light">
                {personalData.title || 'TÍTULO PROFESIONAL'}
              </p>
            </div>
            
            {personalData.photo && (
              <div className="ml-8 relative">
                <div className="w-32 h-32 rounded-lg overflow-hidden border-2 border-cyan-400 relative">
                  <img 
                    src={personalData.photo} 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-cyan-400/10"></div>
                </div>
              </div>
            )}
          </div>
          
          {/* Contact Info */}
          <div className="grid grid-cols-2 gap-4 mt-6 text-cyan-300">
            {personalData.email && (
              <div className="flex items-center">
                <span className="text-cyan-400 mr-2">$</span>
                <span>email: {personalData.email}</span>
              </div>
            )}
            {personalData.phone && (
              <div className="flex items-center">
                <span className="text-cyan-400 mr-2">$</span>
                <span>phone: {personalData.phone}</span>
              </div>
            )}
            {personalData.location && (
              <div className="flex items-center">
                <span className="text-cyan-400 mr-2">$</span>
                <span>location: {personalData.location}</span>
              </div>
            )}
            {personalData.linkedIn && (
              <div className="flex items-center">
                <span className="text-cyan-400 mr-2">$</span>
                <span>linkedin: {personalData.linkedIn}</span>
              </div>
            )}
          </div>
        </header>

        <div className="grid grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="col-span-1 space-y-8">
            {/* Profile */}
            {sectionConfig.profile.visible && profile.summary && (
              <section>
                <h2 className="text-lg font-bold text-cyan-400 mb-4 flex items-center">
                  <span className="text-cyan-400 mr-2">{'>'}</span>
                  <span className="border-b border-cyan-400/50">PERFIL.EXE</span>
                </h2>
                <div className="bg-gray-800/50 border border-cyan-500/30 p-4 rounded">
                  <p className="text-gray-300 leading-relaxed">{profile.summary}</p>
                </div>
              </section>
            )}

            {/* Skills */}
            {sectionConfig.skills.visible && skills.length > 0 && (
              <section>
                <h2 className="text-lg font-bold text-cyan-400 mb-4 flex items-center">
                  <span className="text-cyan-400 mr-2">{'>'}</span>
                  <span className="border-b border-cyan-400/50">SKILLS.SYS</span>
                </h2>
                <div className="space-y-3">
                  {skills.map((skill, index) => (
                    <div key={index} className="bg-gray-800/50 border border-cyan-500/30 p-3 rounded">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-cyan-300 font-semibold">{skill.name}</span>
                        <span className="text-purple-400 text-xs">[{skill.level}%]</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-cyan-400 to-purple-400 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${skill.level}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Languages */}
            {sectionConfig.languages.visible && languages.length > 0 && (
              <section>
                <h2 className="text-lg font-bold text-cyan-400 mb-4 flex items-center">
                  <span className="text-cyan-400 mr-2">{'>'}</span>
                  <span className="border-b border-cyan-400/50">LANG.DLL</span>
                </h2>
                <div className="space-y-2">
                  {languages.map((lang, index) => (
                    <div key={index} className="bg-gray-800/50 border border-cyan-500/30 p-3 rounded">
                      <div className="flex justify-between">
                        <span className="text-cyan-300">{lang.name}</span>
                        <span className="text-purple-400 text-sm">{lang.level}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Right Column */}
          <div className="col-span-2 space-y-8">
            {/* Experience */}
            {sectionConfig.experience.visible && experience.length > 0 && (
              <section>
                <h2 className="text-lg font-bold text-cyan-400 mb-4 flex items-center">
                  <span className="text-cyan-400 mr-2">{'>'}</span>
                  <span className="border-b border-cyan-400/50">WORK.LOG</span>
                </h2>
                <div className="space-y-6">
                  {experience.map((exp, index) => (
                    <div key={index} className="bg-gray-800/50 border border-cyan-500/30 p-6 rounded relative">
                      <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-cyan-400 to-purple-400"></div>
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="text-lg font-semibold text-cyan-300">{exp.position}</h3>
                          <p className="text-purple-300">{exp.company}</p>
                        </div>
                        <span className="text-cyan-400 text-sm bg-gray-700 px-2 py-1 rounded">
                          {exp.current ? `${exp.startDate} - Presente` : `${exp.startDate} - ${exp.endDate}`}
                        </span>
                      </div>
                      {exp.description && (
                        <p className="text-gray-300 leading-relaxed">{exp.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Education */}
            {sectionConfig.education.visible && education.length > 0 && (
              <section>
                <h2 className="text-lg font-bold text-cyan-400 mb-4 flex items-center">
                  <span className="text-cyan-400 mr-2">{'>'}</span>
                  <span className="border-b border-cyan-400/50">EDU.DB</span>
                </h2>
                <div className="space-y-4">
                  {education.map((edu, index) => (
                    <div key={index} className="bg-gray-800/50 border border-cyan-500/30 p-4 rounded">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="text-cyan-300 font-semibold">{edu.degree}</h3>
                          <p className="text-purple-300">{edu.institution}</p>
                        </div>
                        <span className="text-cyan-400 text-sm">{edu.current ? `${edu.startDate} - Presente` : `${edu.startDate} - ${edu.endDate}`}</span>
                      </div>
                      {edu.description && (
                        <p className="text-gray-300 text-sm">{edu.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Projects */}
            {sectionConfig.projects.visible && projects.length > 0 && (
              <section>
                <h2 className="text-lg font-bold text-cyan-400 mb-4 flex items-center">
                  <span className="text-cyan-400 mr-2">{'>'}</span>
                  <span className="border-b border-cyan-400/50">PROJ.ZIP</span>
                </h2>
                <div className="space-y-4">
                  {projects.map((project, index) => (
                    <div key={index} className="bg-gray-800/50 border border-cyan-500/30 p-4 rounded">
                      <h3 className="text-cyan-300 font-semibold mb-2">{project.name}</h3>
                      {project.description && (
                        <p className="text-gray-300 text-sm mb-2">{project.description}</p>
                      )}
                      {project.technologies && (
                        <div className="flex flex-wrap gap-2">
                          {project.technologies.map((tech, techIndex) => (
                            <span 
                              key={techIndex} 
                              className="text-xs bg-purple-900/50 text-purple-300 px-2 py-1 rounded border border-purple-500/30"
                            >
                              {tech.trim()}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Additional sections if needed */}
            {sectionConfig.courses.visible && courses.length > 0 && (
              <section>
                <h2 className="text-lg font-bold text-cyan-400 mb-4 flex items-center">
                  <span className="text-cyan-400 mr-2">{'>'}</span>
                  <span className="border-b border-cyan-400/50">COURSES.TXT</span>
                </h2>
                <div className="grid grid-cols-2 gap-3">
                  {courses.map((course, index) => (
                    <div key={index} className="bg-gray-800/50 border border-cyan-500/30 p-3 rounded">
                      <h4 className="text-cyan-300 text-sm font-semibold">{course.name}</h4>
                      <p className="text-purple-300 text-xs">{course.institution}</p>
                      <p className="text-gray-400 text-xs">{course.date}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {sectionConfig.certificates.visible && certificates.length > 0 && (
              <section>
                <h2 className="text-lg font-bold text-cyan-400 mb-4 flex items-center">
                  <span className="text-cyan-400 mr-2">{'>'}</span>
                  <span className="border-b border-cyan-400/50">CERTS.KEY</span>
                </h2>
                <div className="grid grid-cols-2 gap-3">
                  {certificates.map((cert, index) => (
                    <div key={index} className="bg-gray-800/50 border border-cyan-500/30 p-3 rounded">
                      <h4 className="text-cyan-300 text-sm font-semibold">{cert.name}</h4>
                      <p className="text-purple-300 text-xs">{cert.issuer}</p>
                      <p className="text-gray-400 text-xs">{cert.date}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NeonTemplate;
