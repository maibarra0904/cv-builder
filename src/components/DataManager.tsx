import React, { useRef, useState } from 'react';
import { useCV } from '../hooks/useCV';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { Save, Download, Upload, HelpCircle, X, PlusCircle } from 'lucide-react';
import Swal from 'sweetalert2';

export function DataManager() {
  const { state, loadCVData, updateSectionConfig, setTemplate, resetAll } = useCV();
  const { clearSavedData, hasSavedData } = useLocalStorage();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showReadme, setShowReadme] = useState(false);

  const handleLoadTestData = async () => {
    try {
      const response = await fetch('/test-data.json');
      const testData = await response.json();
      
      if (testData.cvData) {
        console.log('Cargando datos de prueba:', testData);
        loadCVData(testData.cvData);
        
        if (testData.sectionConfig) {
          updateSectionConfig(testData.sectionConfig);
        }
        
        if (testData.currentTemplate) {
          setTemplate(testData.currentTemplate);
        }
        
        Swal.fire({
          icon: 'success',
          title: '¡Datos cargados!',
          text: 'Los datos de prueba se han cargado exitosamente',
          confirmButtonColor: '#7c3aed',
          timer: 2000,
          showConfirmButton: false
        });
      } else {
        throw new Error('Formato de datos inválido');
      }
    } catch (error) {
      console.error('Error al cargar datos de prueba:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error al cargar datos',
        text: 'Verifica que el archivo test-data.json esté disponible',
        confirmButtonColor: '#7c3aed'
      });
    }
  };

  const handleNewCV = async () => {
    const result = await Swal.fire({
      title: '¿Crear nuevo CV?',
      text: 'Esto borrará todos los datos actuales y comenzarás desde cero',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#7c3aed',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Sí, crear nuevo',
      cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
      console.log('Creando nuevo CV - Limpiando todos los datos...');
      
      // 1. Resetear completamente el estado del contexto
      resetAll();
      
      // 2. Limpiar localStorage con todas las claves posibles
      clearSavedData(); // Limpia 'cv-builder-data' y 'cv-builder-photo'
      
      // 3. Limpiar claves adicionales del contexto
      try {
        localStorage.removeItem('cvData');
        localStorage.removeItem('sectionConfig');
        localStorage.removeItem('currentTemplate');
        // Limpiar cualquier otro dato relacionado que pueda existir
        const keys = Object.keys(localStorage);
        keys.forEach(key => {
          if (key.includes('cv') || key.includes('CV') || key.includes('resume') || key.includes('builder')) {
            localStorage.removeItem(key);
            console.log(`Eliminada clave de localStorage: ${key}`);
          }
        });
      } catch (error) {
        console.warn('Error al limpiar localStorage adicional:', error);
      }
      
      console.log('Nuevo CV creado - todos los datos han sido eliminados');
      
      // 4. Recargar la página para reiniciar completamente
      window.location.reload();
    }
  };

  const handleExportData = async () => {
    try {
      console.log('Iniciando exportación de datos JSON...');
      
      // Crear el objeto de datos completo para exportar (simplificado)
      const dataToExport = {
        cvData: state.cvData,
        sectionConfig: state.sectionConfig,
        currentTemplate: state.currentTemplate,
        exportDate: new Date().toISOString(),
        version: '2.0'
      };
      
      console.log('Datos a exportar:', dataToExport);
      
      // Convertir a JSON con formato legible
      const dataStr = JSON.stringify(dataToExport, null, 2);
      console.log('JSON generado, tamaño:', dataStr.length, 'caracteres');
      
      // Crear el nombre del archivo con fecha
      const now = new Date();
      const dateStr = now.toISOString().split('T')[0]; // YYYY-MM-DD
      const timeStr = now.toTimeString().split(' ')[0].replace(/:/g, '-'); // HH-MM-SS
      const fileName = `cv-data-${dateStr}_${timeStr}.json`;
      
      console.log('Nombre del archivo:', fileName);
      
      // Crear blob y descargar
      const blob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      console.log('Respaldo JSON bilingüe descargado exitosamente');
      Swal.fire({
        icon: 'success',
        title: '¡Respaldo creado!',
        html: '<strong>📄 Archivo completo con datos en español e inglés</strong><br><br>📖 Usa el botón "Ver Instrucciones" para conocer el proceso de importación',
        confirmButtonColor: '#7c3aed',
        timer: 3000,
        showConfirmButton: true
      });
    } catch (error) {
      console.error('Error al crear el respaldo:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error al crear respaldo',
        text: 'No se pudo crear el respaldo. Por favor, intenta nuevamente',
        confirmButtonColor: '#7c3aed'
      });
    }
  };

  const handleImportData = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    console.log('Archivo seleccionado:', file.name, 'Tipo:', file.type, 'Tamaño:', file.size);

    try {
      // Verificar que sea un archivo JSON
      if (file.type === 'application/json' || file.name.endsWith('.json')) {
        console.log('Detectado como archivo JSON, procesando...');
        await handleJsonImport(file);
      } else {
        console.error('Tipo de archivo no soportado:', file.type, file.name);
        Swal.fire({
          icon: 'error',
          title: 'Archivo no válido',
          html: '<strong>Solo se permiten archivos JSON</strong><br><br>📖 Para importar tu respaldo:<br>1. Extrae el archivo ZIP descargado<br>2. Selecciona ÚNICAMENTE el archivo "cv-data.json"<br>3. La foto debe subirse manualmente después',
          confirmButtonColor: '#7c3aed'
        });
        return;
      }
    } catch (error) {
      console.error('Error al importar:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error al importar',
        html: `<strong>Error:</strong> ${error instanceof Error ? error.message : 'Error desconocido'}<br><br>💡 Verifica que el archivo JSON sea válido y esté en el formato correcto`,
        confirmButtonColor: '#7c3aed'
      });
    }
    
    // Limpiar el input
    event.target.value = '';
  };

  const handleJsonImport = async (file: File) => {
    const reader = new FileReader();
    return new Promise<void>((resolve, reject) => {
      reader.onload = (e) => {
        try {
          const imported = JSON.parse(e.target?.result as string);
          
          if (imported.cvData) {
            // Cargar los datos usando las funciones del contexto
            loadCVData(imported.cvData);
            
            // Aplicar configuración de secciones si existe
            if (imported.sectionConfig) {
              updateSectionConfig(imported.sectionConfig);
            }
            
            // Aplicar configuración de template si existe
            if (imported.currentTemplate) {
              setTemplate(imported.currentTemplate);
            }
            
            // Guardar automáticamente en localStorage después de cargar
            setTimeout(() => {
              try {
                localStorage.setItem('cvData', JSON.stringify(imported.cvData));
                if (imported.sectionConfig) {
                  localStorage.setItem('sectionConfig', JSON.stringify(imported.sectionConfig));
                }
                if (imported.currentTemplate) {
                  localStorage.setItem('currentTemplate', JSON.stringify(imported.currentTemplate));
                }
                console.log('Datos guardados automáticamente en localStorage');
              } catch (error) {
                console.warn('Error al guardar en localStorage:', error);
              }
            }, 100); // Pequeño delay para asegurar que el contexto se actualice primero
            
            Swal.fire({
              icon: 'success',
              title: '¡Datos importados!',
              html: '<strong>📄 Se han cargado y guardado los datos del CV</strong><br><br>📷 <em>Recordatorio:</em> Si tenías una foto, debes subirla manualmente',
              confirmButtonColor: '#7c3aed',
              timer: 3000,
              showConfirmButton: true
            });
            
            resolve();
          } else {
            throw new Error('Formato de archivo inválido');
          }
        } catch (error) {
          reject(new Error(error instanceof Error ? error.message : 'Error desconocido'));
        }
      };
      reader.readAsText(file);
    });
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
        <Save className="h-5 w-5 mr-2" />
        Gestión de Datos
      </h3>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-green-800">
              {hasSavedData() ? 'Datos guardados automáticamente' : 'Sin datos guardados'}
            </span>
          </div>
        </div>

        <div className="space-y-6">
          {/* Ver Instrucciones */}
          <button
            onClick={() => setShowReadme(true)}
            className="w-full flex items-center justify-center space-x-2 bg-purple-600 text-white px-4 py-3 rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium"
          >
            <HelpCircle className="h-4 w-4" />
            <span>Ver Instrucciones</span>
          </button>

          {/* Subsección: Exportar e Importar */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2 text-sm font-semibold text-gray-700 border-b border-gray-200 pb-2">
              <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs">📦</span>
              </div>
              <span>Exportar e Importar Datos</span>
            </div>

            {/* Exportar datos */}
            <button
              onClick={handleExportData}
              className="w-full flex items-center justify-center space-x-2 bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
            >
              <Download className="h-4 w-4" />
              <span>Exportar Respaldo JSON</span>
            </button>

            {/* Importar datos */}
            <label className="w-full flex items-center justify-center space-x-2 bg-green-600 text-white px-4 py-3 rounded-lg hover:bg-green-700 transition-colors cursor-pointer text-sm font-medium">
              <Upload className="h-4 w-4" />
              <span>Importar Respaldo JSON</span>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json,application/json"
                onChange={handleImportData}
                className="hidden"
              />
            </label>
          </div>

          {/* Subsección: Gestión de Contenido */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2 text-sm font-semibold text-gray-700 border-b border-gray-200 pb-2">
              <div className="w-4 h-4 bg-yellow-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs">🚀</span>
              </div>
              <span>Gestión de Contenido</span>
            </div>

            {/* Cargar datos de prueba */}
            <button
              onClick={handleLoadTestData}
              className="w-full flex items-center justify-center space-x-2 bg-yellow-600 text-white px-4 py-3 rounded-lg hover:bg-yellow-700 transition-colors text-sm font-medium"
            >
              <PlusCircle className="h-4 w-4" />
              <span>Cargar Datos de Prueba</span>
            </button>

            {/* Nuevo CV */}
            <button
              onClick={handleNewCV}
              className="w-full flex items-center justify-center space-x-2 bg-orange-600 text-white px-4 py-3 rounded-lg hover:bg-orange-700 transition-colors text-sm font-medium"
            >
              <PlusCircle className="h-4 w-4" />
              <span>Crear Nuevo CV</span>
            </button>
          </div>
        </div>

        <div className="text-xs text-gray-500 space-y-2 mt-6 pt-4 border-t border-gray-200">
          <div className="space-y-1">
            <p className="font-medium text-gray-700">Información:</p>
            <p>• Los datos se guardan automáticamente en tu navegador</p>
            <p>• "Ver Instrucciones" muestra ayuda detallada sobre todas las funciones</p>
            <p>• "Exportar" crea un archivo JSON con todos los datos y foto</p>
            <p>• "Importar" acepta archivos JSON y los guarda automáticamente</p>
            <p>• "Cargar Datos de Prueba" llena el formulario con información de ejemplo</p>
            <p>• "Crear Nuevo CV" limpia todos los datos para empezar de cero</p>
            <p className="text-purple-600 font-medium">📖 Usa "Ver Instrucciones" para ayuda detallada</p>
          </div>
        </div>
      </div>

      {/* Modal de README */}
      {showReadme && (
        <>
          {/* Overlay */}
          <button 
            className="fixed inset-0 bg-black bg-opacity-50 z-50 cursor-pointer border-0 p-0"
            onClick={() => setShowReadme(false)}
            onKeyDown={(e) => {
              if (e.key === 'Escape') {
                setShowReadme(false);
              }
            }}
            aria-label="Cerrar instrucciones"
          />
          
          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-hidden mx-4">
              {/* Header */}
              <div className="flex items-center justify-between p-3 md:p-4 border-b border-gray-200">
                <h2 className="text-lg md:text-xl font-semibold text-gray-900">📖 Instrucciones</h2>
                <button
                  onClick={() => setShowReadme(false)}
                  className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="h-5 w-5 md:h-6 md:w-6" />
                </button>
              </div>
              
              {/* Content */}
              <div className="p-4 md:p-6 overflow-y-auto max-h-[60vh]">
                <div className="prose prose-sm max-w-none space-y-4">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 md:p-4">
                    <h3 className="text-base md:text-lg font-semibold text-blue-900 mb-2">🎯 Guía Completa de Uso</h3>
                    <p className="text-sm md:text-base text-blue-800">
                      Aprende a usar todas las funciones disponibles en la gestión de datos de tu CV.
                    </p>
                  </div>

                  <div className="space-y-6">
                    {/* Sección Exportar e Importar */}
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <h3 className="text-base md:text-lg font-semibold text-green-900 mb-3">� Exportar e Importar Datos</h3>
                      
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-semibold text-green-800 mb-2">📥 Exportar Respaldo JSON:</h4>
                          <ol className="list-decimal list-inside space-y-1 text-sm md:text-base text-green-700">
                            <li>Haz clic en <strong>"Exportar Respaldo JSON"</strong></li>
                            <li>Se descargará un archivo <code className="text-xs md:text-sm">cv-data-YYYY-MM-DD_HH-MM-SS.json</code></li>
                            <li>Este archivo contiene <strong>TODOS</strong> tus datos incluyendo la foto</li>
                            <li>Guarda este archivo en un lugar seguro</li>
                          </ol>
                        </div>

                        <div>
                          <h4 className="font-semibold text-green-800 mb-2">📤 Importar Respaldo JSON:</h4>
                          <ol className="list-decimal list-inside space-y-1 text-sm md:text-base text-green-700">
                            <li>Haz clic en <strong>"Importar Respaldo JSON"</strong></li>
                            <li>Selecciona tu archivo JSON guardado</li>
                            <li><strong>¡Todos los datos se restaurarán automáticamente!</strong></li>
                            <li>Incluyendo: formularios, configuraciones, plantilla y foto</li>
                          </ol>
                        </div>
                      </div>
                    </div>

                    {/* Sección Datos de Prueba y Nuevo CV */}
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <h3 className="text-base md:text-lg font-semibold text-yellow-900 mb-3">🚀 Gestión de Contenido</h3>
                      
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-semibold text-yellow-800 mb-2">🎯 Cargar Datos de Prueba:</h4>
                          <ul className="list-disc list-inside space-y-1 text-sm md:text-base text-yellow-700">
                            <li>Llena automáticamente todos los formularios con información de ejemplo</li>
                            <li>Perfecto para probar las plantillas y explorar funciones</li>
                            <li>Incluye foto de muestra y datos completos</li>
                            <li>Útil para ver cómo se ve un CV completo</li>
                          </ul>
                        </div>

                        <div>
                          <h4 className="font-semibold text-yellow-800 mb-2">🆕 Crear Nuevo CV:</h4>
                          <ul className="list-disc list-inside space-y-1 text-sm md:text-base text-yellow-700">
                            <li>Borra <strong>TODOS</strong> los datos actuales</li>
                            <li>Limpia formularios, foto y configuraciones</li>
                            <li>Te permite empezar completamente desde cero</li>
                            <li>Confirma antes de ejecutar la acción</li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    {/* Sección de Ventajas */}
                    <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                      <h3 className="text-base md:text-lg font-semibold text-purple-900 mb-2">✅ Ventajas del Sistema:</h3>
                      <ul className="list-disc list-inside space-y-1 text-sm md:text-base text-purple-800">
                        <li><strong>Guardado automático:</strong> Los datos se guardan mientras trabajas</li>
                        <li><strong>Un solo archivo:</strong> Todo incluido en el JSON</li>
                        <li><strong>Proceso automático:</strong> Sin pasos manuales complicados</li>
                        <li><strong>Foto incluida:</strong> Se restaura automáticamente</li>
                        <li><strong>Configuración completa:</strong> Plantillas y secciones</li>
                        <li><strong>100% local:</strong> Tus datos no salen de tu dispositivo</li>
                      </ul>
                    </div>

                    {/* Sección de Consejos */}
                    <div className="bg-cyan-50 border border-cyan-200 rounded-lg p-4">
                      <h3 className="text-base md:text-lg font-semibold text-cyan-900 mb-2">� Consejos Útiles:</h3>
                      <ul className="list-disc list-inside space-y-1 text-sm md:text-base text-cyan-800">
                        <li>Realiza respaldos periódicos de tus datos importantes</li>
                        <li>Guarda los archivos JSON en la nube (Google Drive, Dropbox, etc.)</li>
                        <li>El archivo JSON es compatible entre diferentes dispositivos</li>
                        <li>Puedes tener múltiples versiones de tu CV guardadas</li>
                        <li>Usa los datos de prueba para experimentar sin perder tu contenido</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Footer */}
              <div className="p-3 md:p-4 border-t border-gray-200 bg-gray-50">
                <div className="flex justify-end">
                  <button
                    onClick={() => setShowReadme(false)}
                    className="px-3 md:px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm md:text-base"
                  >
                    ¡Entendido!
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
