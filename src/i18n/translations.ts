export const translations = {
  es: {
    // Navegación y controles
    navigation: {
      mode: 'Modo',
      templates: 'Plantillas',
      export: 'Exportar',
      data: 'Datos',
      language: 'Idioma'
    },
    // Secciones del CV
    sections: {
      personalData: 'Datos Personales',
      profile: 'Perfil Profesional',
      education: 'Educación',
      experience: 'Experiencia',
      skills: 'Habilidades',
      languages: 'Idiomas',
      hobbies: 'Pasatiempos',
      certificates: 'Certificaciones',
      courses: 'Cursos',
      projects: 'Proyectos',
      volunteers: 'Voluntariado'
    },
    // Mensajes
    messages: {
      translating: 'Traduciendo...',
      generating: 'Generando...',
      reloadPreview: 'Recargar vista',
      dataLoaded: 'Datos cargados',
      exporting: 'Exportando...'
    }
    ,
    coverLetter: {
      title: 'Carta de Presentación',
      cv: 'Hoja de Vida',
      editableLabel: 'Texto editable de la carta',
      company: 'Empresa',
      companyPlaceholder: 'Nombre de la empresa',
      url: 'URL (opcional)',
      position: 'Puesto',
      style: 'Estilo',
      maxWords: 'Máx. palabras',
      generate: 'Generar carta',
      generateButton: 'Generar Carta',
      saveButton: 'Guardar Carta',
      save: 'Guardar',
      clear: 'Limpiar',
      registerApiKey: 'Registrar API key',
      placeholder: 'Escribe aquí el texto de la carta...',
      missingApiKey: 'Falta la clave de API de Gemini. Abre la configuración para registrarla.',
        changeApiKey: 'Cambiar API key',
        copyText: 'Copiar texto',
        saved: 'Guardado',
        cleared: 'Texto limpiado',
        copySuccess: 'Texto copiado',
        copySuccessText: 'El texto de la carta fue copiado al portapapeles',
        copyError: 'Error al copiar',
        copyErrorText: 'No se pudo copiar el texto al portapapeles',
      description: 'Elige si quieres trabajar con tu Hoja de Vida o generar una Carta de Presentación basada en ella. La carta usa los datos de tu CV para crear un texto personalizado.',
      missingCvWarning: 'Para generar una carta debes crear primero la hoja de vida con al menos tu nombre o experiencia.'
    },
    
    gemini: {
      setupTitle: 'Configurar Gemini',
      apiKeyPlaceholder: 'Pega tu API key aquí',
      validateButton: 'Validar y Guardar',
      validMessage: 'API key válida',
      invalidMessage: 'API key inválida'
    },
    dataManager: {
      title: 'Gestión de Datos',
      statusSaved: 'Datos guardados automáticamente',
      statusNone: 'Sin datos guardados',
      viewInstructions: 'Ver Instrucciones',
      exportBackup: 'Exportar Respaldo JSON',
      importBackup: 'Importar Respaldo JSON',
      loadTestData: 'Cargar Datos de Prueba',
      newCV: 'Crear Nuevo CV',
      infoTitle: 'Información:',
      bullets: [
        'Los datos se guardan automáticamente en tu navegador',
        '"Ver Instrucciones" muestra ayuda detallada sobre todas las funciones',
        '"Exportar" crea un archivo JSON con todos los datos y foto',
        '"Importar" acepta archivos JSON y los guarda automáticamente',
        '"Cargar Datos de Prueba" llena el formulario con información de ejemplo',
        '"Crear Nuevo CV" limpia todos los datos para empezar de cero'
      ],
      readme: {
        title: 'Instrucciones',
        guideTitle: '🎯 Guía Completa de Uso',
        exportImportTitle: 'Exportar e Importar Datos'
      }
    },
    templateSelector: {
      title: 'Selecciona una plantilla',
      currentTemplate: 'Plantilla actual: {name}',
      activeLabel: 'Plantilla Activa',
      info: {
        title: 'Información:',
        bullets: [
          'Puedes cambiar de plantilla en cualquier momento',
          'Todos tus datos se mantendrán intactos',
          'Cada plantilla tiene un diseño único y profesional',
          'La selección se aplica inmediatamente'
        ],
        pickHint: '🎨 Escoge la que mejor represente tu estilo'
      },
      templates: {
        modern: { name: 'Moderno', description: 'Diseño limpio con barra lateral azul y elementos visuales modernos' },
        classic: { name: 'Clásico', description: 'Formato tradicional y profesional, ideal para sectores conservadores' }
      }
    },
    dataPolicy: {
      title: 'Política de Datos',
      paragraph1: 'Esta aplicación no almacena tus datos en bases de datos ni en servidores externos para mantenerla gratuita y proteger tu privacidad. Todos los datos se gestionan localmente en tu navegador (por ejemplo en localStorage) y existen únicamente en el dispositivo donde los creas.',
      paragraph2: 'Por ello es importante exportar un respaldo en formato JSON desde el apartado "Gestión de Datos" antes de cambiar de dispositivo o limpiar los datos del navegador. Ese archivo te permite restaurar y seguir editando tu Hoja de Vida en otro equipo. También recomendamos descargar los PDF generados cuando necesites conservar versiones finales.',
      paragraph3: 'Guarda copias seguras y ten precaución al compartir archivos de respaldo: la aplicación no comparte ni sincroniza tus datos automáticamente con terceros.',
      paragraph4: 'Puedes acceder, rectificar o eliminar tus datos en cualquier momento desde el panel de gestión.',
      lastUpdated: 'Última actualización: 2025-12-27'
    },
    donation: {
      title: 'Aporte voluntario',
      description: 'Esta aplicación se mantiene gracias a aportes voluntarios. Puedes realizar un aporte voluntario con PayPal.',
      currencyLabel: 'USD',
      paypalNotConfigured: 'PayPal no configurado en el entorno. Puedes realizar un aporte voluntario enviando un email a soporte o usar un enlace externo.',
      donateHint: 'Puedes disminuir o aumentar el monto de tu aporte voluntario según consideres. Recuerda que en PayPal puedes ingresar tu tarjeta de crédito de forma segura.'
    }
    ,
    ui: {
      moreSections: 'Más Secciones',
      sectionsTitle: 'Secciones del CV',
      sectionDisabled: 'Esta sección está deshabilitada. Actívala para comenzar a editarla.',
      hideSections: 'Ocultar secciones',
      showSections: 'Mostrar secciones',
      toggleReorderOn: 'Desactivar reordenamiento',
      toggleReorderOff: 'Activar reordenamiento',
      logout: 'Cerrar sesión',
      donate: 'Aportar',
      dataPolicy: 'Política de datos'
    }
    ,
    forms: {
      personal: {
        photoHint: 'Haz clic en el ícono para subir tu foto',
        photoHintWithPhoto: 'Haz clic en el icono de la izquierda para subir otra foto o en el de la derecha para eliminarlo',
        firstName: 'Nombre *',
        lastName: 'Apellido *',
        firstNamePlaceholder: 'Tu nombre',
        lastNamePlaceholder: 'Tu apellido',
        email: 'Email *',
        emailPlaceholder: 'tu@email.com',
        phone: 'Teléfono *',
        phonePlaceholder: '+1 234 567 8900',
        address: 'Dirección',
        addressPlaceholder: 'Tu dirección',
        city: 'Ciudad',
        cityPlaceholder: 'Tu ciudad',
        country: 'País',
        countryPlaceholder: 'Tu país',
        linkedIn: 'LinkedIn',
        linkedInPlaceholder: 'https://linkedin.com/in/tu-perfil',
        website: 'Sitio Web',
        websitePlaceholder: 'https://tu-sitio-web.com'
      },
      profile: {
        title: 'Resumen Profesional',
        placeholder: 'Describe tu experiencia, habilidades y objetivos profesionales. Este es el primer texto que leerán los reclutadores, así que haz que sea impactante y conciso.',
        tipsTitle: 'Consejos para un buen perfil',
        tips: [
          'Menciona tu especialidad y años de experiencia',
          'Incluye tus principales fortalezas técnicas',
          'Destaca logros cuantificables',
          'Evita clichés como "proactivo" o "responsable"',
          'Personaliza según el tipo de trabajo que buscas'
        ]
      },
      education: {
        add: 'Agregar Formación',
        new: 'Nueva Formación',
        edit: 'Editar Formación',
        institution: 'Institución *',
        institutionPlaceholder: 'Universidad, colegio, instituto...',
        degree: 'Título *',
        degreePlaceholder: 'Licenciatura, Maestría, etc.',
        field: 'Campo de estudio',
        fieldPlaceholder: 'Ingeniería, Medicina, etc.',
        location: 'Localidad',
        startDate: 'Fecha de inicio',
        endDate: 'Fecha de graduación',
        studying: 'Estudiando actualmente',
        submitAdd: 'Agregar',
        submitUpdate: 'Actualizar',
        cancel: 'Cancelar'
      },
      experience: {
        add: 'Agregar Experiencia',
        new: 'Nueva Experiencia',
        edit: 'Editar Experiencia',
        company: 'Empresa *',
        position: 'Cargo *',
        location: 'Localidad',
        startDate: 'Fecha de inicio *',
        endDate: 'Fecha de fin',
        currentJob: 'Trabajo actual',
        description: 'Descripción',
        submitAdd: 'Agregar',
        submitUpdate: 'Actualizar',
        cancel: 'Cancelar',
        emptyTitle: 'No has agregado experiencia laboral aún',
        emptyHint: 'Haz clic en "Agregar Experiencia" para comenzar'
      },
      skills: {
        addNew: 'Agregar nueva competencia',
        namePlaceholder: 'Nombre de la competencia',
        categories: {
          technical: 'Técnica',
          soft: 'Blanda',
          language: 'Idioma'
        },
        add: 'Agregar',
        noSkills: 'No has agregado competencias aún',
        noSkillsHint: 'Agrega tus habilidades técnicas y blandas',
        categoriesTitles: {
          technical: 'Competencias Técnicas',
          soft: 'Habilidades Blandas',
          language: 'Idiomas'
        }
        ,
      }
      ,
      languages: {
        add: 'Agregar Idioma',
        namePlaceholder: 'Nombre del idioma',
        levels: {
          basic: 'Básico',
          intermediate: 'Intermedio',
          advanced: 'Avanzado',
          native: 'Nativo'
        },
        emptyTitle: 'No hay idiomas agregados',
        emptyHint: 'Agrega los idiomas que dominas para enriquecer tu CV'
      }
      ,
      courses: {
        title: 'Cursos y Certificaciones',
        add: 'Agregar Curso',
        namePlaceholder: 'Nombre del curso',
        institutionPlaceholder: 'Institución',
        durationPlaceholder: 'Duración (ej. 40 horas)',
        datePlaceholder: 'Año',
        urlPlaceholder: 'URL del certificado',
        addButton: 'Agregar',
        cancel: 'Cancelar',
        delete: 'Eliminar',
        emptyTitle: 'No has agregado cursos aún',
        emptyHint: 'Agrega cursos y certificaciones relevantes'
      },
      certificates: {
        add: 'Agregar Certificado',
        namePlaceholder: 'Nombre del certificado',
        issuerPlaceholder: 'Entidad emisora',
        datePlaceholder: 'Fecha de obtención',
        urlPlaceholder: 'URL de verificación',
        save: 'Guardar',
        cancel: 'Cancelar',
        emptyTitle: 'No has agregado certificados aún',
        emptyHint: 'Agrega tus certificaciones y credenciales'
      },
      hobbies: {
        addPlaceholder: 'Agregar pasatiempo...',
        addButton: 'Agregar',
        emptyTitle: 'No has agregado pasatiempos aún',
        emptyHint: 'Agrega tus intereses y actividades favoritas'
      },
      projects: {
        add: 'Agregar Proyecto',
        namePlaceholder: 'Nombre del proyecto',
        descriptionPlaceholder: 'Descripción del proyecto',
        technologiesPlaceholder: 'Tecnologías (separadas por comas)',
        urlPlaceholder: 'URL del proyecto',
        save: 'Guardar',
        cancel: 'Cancelar',
        viewProject: 'Ver proyecto',
        emptyTitle: 'No has agregado proyectos aún',
        emptyHint: 'Muestra tus trabajos y proyectos destacados'
      },
      volunteers: {
        add: 'Agregar Voluntariado',
        organizationPlaceholder: 'Organización',
        rolePlaceholder: 'Rol/Posición',
        startDatePlaceholder: 'Fecha de inicio',
        endDatePlaceholder: 'Fecha de finalización',
        save: 'Guardar',
        cancel: 'Cancelar',
        emptyTitle: 'No has agregado experiencias de voluntariado aún',
        emptyHint: 'Comparte tu compromiso social y comunitario'
      }
    }
  },
    dataManager: {
      title: 'Gestión de Datos',
      statusSaved: 'Datos guardados automáticamente',
      statusNone: 'Sin datos guardados',
      viewInstructions: 'Ver Instrucciones',
      exportBackup: 'Exportar Respaldo JSON',
      importBackup: 'Importar Respaldo JSON',
      loadTestData: 'Cargar Datos de Prueba',
      newCV: 'Crear Nuevo CV',
      infoTitle: 'Información:',
      bullets: [
        'Los datos se guardan automáticamente en tu navegador',
        '"Ver Instrucciones" muestra ayuda detallada sobre todas las funciones',
        '"Exportar" crea un archivo JSON con todos los datos y foto',
        '"Importar" acepta archivos JSON y los guarda automáticamente',
        '"Cargar Datos de Prueba" llena el formulario con información de ejemplo',
        '"Crear Nuevo CV" limpia todos los datos para empezar de cero'
      ],
      readme: {
        title: 'Instrucciones',
        guideTitle: '🎯 Guía Completa de Uso',
        exportImportTitle: 'Exportar e Importar Datos'
      }
    },
    templateSelector: {
      title: 'Selecciona una plantilla',
      currentTemplate: 'Plantilla actual: {name}',
      activeLabel: 'Plantilla Activa',
      info: {
        title: 'Información:',
        bullets: [
          'Puedes cambiar de plantilla en cualquier momento',
          'Todos tus datos se mantendrán intactos',
          'Cada plantilla tiene un diseño único y profesional',
          'La selección se aplica inmediatamente'
        ],
        pickHint: '🎨 Escoge la que mejor represente tu estilo'
      },
      templates: {
        modern: { name: 'Moderno', description: 'Diseño limpio con barra lateral azul y elementos visuales modernos' },
        classic: { name: 'Clásico', description: 'Formato tradicional y profesional, ideal para sectores conservadores' }
      }
    },
    dataPolicy: {
      title: 'Política de Datos',
      paragraph1: 'Esta aplicación no almacena tus datos en bases de datos ni en servidores externos para poder ofrecer el servicio de forma gratuita y proteger tu privacidad. Toda la información se gestiona localmente en tu navegador (por ejemplo en localStorage) y permanece únicamente en el dispositivo donde se creó.',
      paragraph2: 'Por ese motivo recomendamos exportar un respaldo en formato JSON desde el apartado "Gestión de Datos" antes de cambiar de dispositivo, reinstalar el navegador o realizar modificaciones importantes. El archivo JSON permite restaurar y continuar editando tu Hoja de Vida en otro equipo si fuese necesario.',
      paragraph3: 'La copia de seguridad también protege frente a pérdidas locales fortuitas (por ejemplo limpieza accidental de datos del navegador). Adicionalmente, sugerimos descargar los PDFs generados cuando necesites conservar versiones finales.',
      paragraph4: 'Guarda las copias de seguridad en un lugar seguro y ten precaución al compartir estos archivos, ya que contienen tus datos personales. Puedes acceder, rectificar o eliminar tus datos en cualquier momento desde el panel de gestión.',
      lastUpdated: 'Última actualización: 2025-12-27'
    },
    donation: {
      title: 'Donar',
      description: 'Esta aplicación se mantiene gracias a aportes voluntarios. Puedes donar con PayPal.',
      currencyLabel: 'USD',
      paypalNotConfigured: 'PayPal no configurado en el entorno. Puedes donar enviando un email a soporte o usar un enlace externo.',
      donateHint: 'Puedes disminuir o aumentar tu aportación según consideres. Recuerda que en Paypal puedes ingresar tu tarjeta de crédito de forma segura.'
    },
  en: {
    // Navigation and controls
    navigation: {
      mode: 'Mode',
      templates: 'Templates',
      export: 'Export',
      data: 'Data',
      language: 'Language'
    },
    // CV sections
    sections: {
      personalData: 'Personal Data',
      profile: 'Professional Profile',
      education: 'Education',
      experience: 'Experience',
      skills: 'Skills',
      languages: 'Languages',
      hobbies: 'Hobbies',
      certificates: 'Certifications',
      courses: 'Courses',
      projects: 'Projects',
      volunteers: 'Volunteer Work'
    },
    // Messages
    messages: {
      translating: 'Translating...',
      generating: 'Generating...',
      reloadPreview: 'Reload preview',
      dataLoaded: 'Data loaded',
      exporting: 'Exporting...'
    }
    ,
    coverLetter: {
      title: 'Cover Letter',
      cv: 'Resume',
      editableLabel: 'Editable cover letter text',
      company: 'Company',
      companyPlaceholder: 'Company name',
      url: 'URL (optional)',
      position: 'Position',
      style: 'Style',
      maxWords: 'Max. words',
      generate: 'Generate cover letter',
      generateButton: 'Generate Cover Letter',
      saveButton: 'Save Cover Letter',
      save: 'Save',
      clear: 'Clear',
      registerApiKey: 'Register API key',
      placeholder: 'Write the cover letter text here...',
      missingApiKey: 'Missing Gemini API key. Open settings to register it.',
        changeApiKey: 'Change API key',
        copyText: 'Copy text',
        saved: 'Saved',
        cleared: 'Text cleared',
        copySuccess: 'Text copied',
        copySuccessText: 'The cover letter text was copied to the clipboard',
        copyError: 'Copy error',
        copyErrorText: 'Could not copy text to clipboard',
      description: 'Choose whether to work from your Resume or generate a Cover Letter based on it. The letter will use your CV data to create personalized text.',
      missingCvWarning: 'To generate a cover letter you must first create your Resume with at least your name or experience.'
    },
    gemini: {
      setupTitle: 'Configure Gemini',
      apiKeyPlaceholder: 'Paste your API key here',
      validateButton: 'Validate and Save',
      validMessage: 'API key valid',
      invalidMessage: 'API key invalid'
    },
    ui: {
      moreSections: 'More Sections',
      sectionsTitle: 'CV Sections',
      sectionDisabled: 'This section is disabled. Activate it to start editing.',
      hideSections: 'Hide sections',
      showSections: 'Show sections',
      toggleReorderOn: 'Disable reordering',
      toggleReorderOff: 'Enable reordering',
      logout: 'Log out',
      donate: 'Donate',
      dataPolicy: 'Data Policy'
    }
    ,
    forms: {
      personal: {
        photoHint: 'Click the icon to upload your photo',
        photoHintWithPhoto: 'Click the left icon to upload another photo or the right one to delete it',
        firstName: 'First name *',
        lastName: 'Last name *',
        firstNamePlaceholder: 'Your first name',
        lastNamePlaceholder: 'Your last name',
        email: 'Email *',
        emailPlaceholder: 'you@email.com',
        phone: 'Phone *',
        phonePlaceholder: '+1 234 567 8900',
        address: 'Address',
        addressPlaceholder: 'Your address',
        city: 'City',
        cityPlaceholder: 'Your city',
        country: 'Country',
        countryPlaceholder: 'Your country',
        linkedIn: 'LinkedIn',
        linkedInPlaceholder: 'https://linkedin.com/in/your-profile',
        website: 'Website',
        websitePlaceholder: 'https://your-website.com'
      },
      profile: {
        title: 'Professional Summary',
        placeholder: 'Describe your experience, skills and career goals. This is the first text recruiters will read, so make it impactful and concise.',
        tipsTitle: 'Tips for a good profile',
        tips: [
          'Mention your specialty and years of experience',
          'Include your main technical strengths',
          'Highlight quantifiable achievements',
          'Avoid clichés like "proactive" or "responsible"',
          'Customize according to the job you seek'
        ]
      },
      education: {
        add: 'Add Education',
        new: 'New Education',
        edit: 'Edit Education',
        institution: 'Institution *',
        institutionPlaceholder: 'University, college, institute...',
        degree: 'Degree *',
        degreePlaceholder: 'Bachelor, Master, etc.',
        field: 'Field of study',
        fieldPlaceholder: 'Engineering, Medicine, etc.',
        location: 'Location',
        startDate: 'Start date',
        endDate: 'Graduation date',
        studying: 'Currently studying',
        submitAdd: 'Add',
        submitUpdate: 'Update',
        cancel: 'Cancel'
      },
      experience: {
        add: 'Add Experience',
        new: 'New Experience',
        edit: 'Edit Experience',
        company: 'Company *',
        position: 'Position *',
        location: 'Location',
        startDate: 'Start date *',
        endDate: 'End date',
        currentJob: 'Current job',
        description: 'Description',
        submitAdd: 'Add',
        submitUpdate: 'Update',
        cancel: 'Cancel',
        emptyTitle: 'You haven\'t added any work experience yet',
        emptyHint: 'Click "Add Experience" to get started'
      },
      skills: {
        addNew: 'Add new skill',
        namePlaceholder: 'Skill name',
        categories: {
          technical: 'Technical',
          soft: 'Soft',
          language: 'Language'
        },
        add: 'Add',
        noSkills: 'You haven\'t added skills yet',
        noSkillsHint: 'Add your technical and soft skills',
        categoriesTitles: {
          technical: 'Technical Skills',
          soft: 'Soft Skills',
          language: 'Languages'
        }
      }
      ,
      languages: {
        add: 'Add Language',
        namePlaceholder: 'Language name',
        levels: {
          basic: 'Basic',
          intermediate: 'Intermediate',
          advanced: 'Advanced',
          native: 'Native'
        },
        emptyTitle: 'No languages added',
        emptyHint: 'Add the languages you speak to enrich your CV'
      }
      ,
      courses: {
        title: 'Courses & Certifications',
        add: 'Add Course',
        namePlaceholder: 'Course name',
        institutionPlaceholder: 'Institution',
        durationPlaceholder: 'Duration (e.g. 40 hours)',
        datePlaceholder: 'Year',
        urlPlaceholder: 'Certificate URL',
        addButton: 'Add',
        cancel: 'Cancel',
        delete: 'Delete',
        emptyTitle: 'No courses added yet',
        emptyHint: 'Add relevant courses and certifications'
      },
      certificates: {
        add: 'Add Certificate',
        namePlaceholder: 'Certificate name',
        issuerPlaceholder: 'Issuer',
        datePlaceholder: 'Obtained date',
        urlPlaceholder: 'Verification URL',
        save: 'Save',
        cancel: 'Cancel',
        emptyTitle: 'No certificates added',
        emptyHint: 'Add your certifications and credentials'
      },
      hobbies: {
        addPlaceholder: 'Add hobby...',
        addButton: 'Add',
        emptyTitle: 'No hobbies added yet',
        emptyHint: 'Add your interests and favorite activities'
      },
      projects: {
        add: 'Add Project',
        namePlaceholder: 'Project name',
        descriptionPlaceholder: 'Project description',
        technologiesPlaceholder: 'Technologies (comma separated)',
        urlPlaceholder: 'Project URL',
        save: 'Save',
        cancel: 'Cancel',
        viewProject: 'View project',
        emptyTitle: 'No projects added yet',
        emptyHint: 'Showcase your notable works and projects'
      },
      volunteers: {
        add: 'Add Volunteer Work',
        organizationPlaceholder: 'Organization',
        rolePlaceholder: 'Role/Position',
        startDatePlaceholder: 'Start date',
        endDatePlaceholder: 'End date',
        save: 'Save',
        cancel: 'Cancel',
        emptyTitle: 'No volunteer experiences added yet',
        emptyHint: 'Share your social and community commitment'
      }
    },
    dataManager: {
      title: 'Data Manager',
      statusSaved: 'Data saved automatically',
      statusNone: 'No saved data',
      viewInstructions: 'View Instructions',
      exportBackup: 'Export JSON Backup',
      importBackup: 'Import JSON Backup',
      loadTestData: 'Load Test Data',
      newCV: 'Create New CV',
      infoTitle: 'Information:',
      bullets: [
        'Data is saved automatically in your browser',
        '"View Instructions" shows detailed help about all features',
        '"Export" creates a JSON file with all data and photo',
        '"Import" accepts JSON files and saves them automatically',
        '"Load Test Data" fills the form with sample information',
        '"Create New CV" clears all data to start from scratch'
      ],
      readme: {
        title: 'Instructions',
        guideTitle: '🎯 Complete Usage Guide',
        exportImportTitle: 'Export & Import Data'
      }
    },
    templateSelector: {
      title: 'Select a template',
      currentTemplate: 'Current template: {name}',
      activeLabel: 'Active Template',
      info: {
        title: 'Information:',
        bullets: [
          'You can change the template at any time',
          'All your data will remain intact',
          'Each template has a unique and professional layout',
          'Selection applies immediately'
        ],
        pickHint: '🎨 Choose the one that best represents your style'
      },
      templates: {
        modern: { name: 'Modern', description: 'Clean design with blue sidebar and modern visual elements' },
        classic: { name: 'Classic', description: 'Traditional professional format, ideal for conservative sectors' }
      }
    },
    dataPolicy: {
      title: 'Data Policy',
      paragraph1: 'This application does not store your data in databases or external servers in order to keep the service free and protect your privacy. All information is handled locally in your browser (for example in localStorage) and exists only on the device where it was created.',
      paragraph2: 'Therefore, it is important to export a JSON backup from the "Data Manager" before changing devices or clearing browser data. That file allows you to restore and continue editing your Resume on another device. We also recommend downloading generated PDFs when you need to keep final versions.',
      paragraph3: 'Keep secure copies and be careful when sharing backup files: the app does not share or automatically synchronize your data with third parties.',
      paragraph4: 'You can access, rectify, or delete your data at any time from the Data Manager panel.',
      lastUpdated: 'Last updated: 2025-12-27'
    },
    donation: {
      title: 'Voluntary contribution',
      description: 'This app is maintained thanks to voluntary contributions. You can make a voluntary contribution via PayPal.',
      currencyLabel: 'USD',
      paypalNotConfigured: 'PayPal not configured in the environment. You can make a voluntary contribution by sending an email to support or using an external link.',
      donateHint: 'You can decrease or increase the amount of your voluntary contribution as you see fit. Remember that on PayPal you can securely enter your credit card.'
    }
  }
};
