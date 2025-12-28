import React from 'react';
import useTranslation from '../i18n/useTranslation2';

type Props = { open: boolean; onClose: () => void };

const DataPolicyPanel: React.FC<Props> = ({ open, onClose }) => {
  const { t } = useTranslation();
  return (
    <>
      <div className={`fixed top-0 right-0 w-full sm:w-80 bg-gradient-to-b from-white via-gray-50 to-gray-100 backdrop-blur-md border-l border-gray-200/50 h-[calc(100vh-104px)] overflow-y-auto transform transition-transform duration-300 z-20 shadow-2xl ${open ? 'translate-x-0' : 'translate-x-full'}`} style={{ top: '104px' }}>
        <div className="p-4 bg-gradient-to-b from-white/80 to-gray-50/80 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">{t('dataPolicy.title', 'Política de Datos')}</h2>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="text-sm text-gray-700 space-y-3">
            <p>{t('dataPolicy.paragraph1', 'Esta aplicación no almacena tus datos en bases de datos ni en servidores externos para poder ofrecer el servicio de forma gratuita y proteger tu privacidad. Toda la información se gestiona localmente en tu navegador (por ejemplo en localStorage) y permanece únicamente en el dispositivo donde se creó.')}</p>
            <p>{t('dataPolicy.paragraph2', 'Por ese motivo recomendamos exportar un respaldo en formato JSON desde el apartado "Gestión de Datos" antes de cambiar de dispositivo, reinstalar el navegador o realizar modificaciones importantes. El archivo JSON permite restaurar y continuar editando tu Hoja de Vida en otro equipo si fuese necesario.')}</p>
            <p>{t('dataPolicy.paragraph3', 'La copia de seguridad también protege frente a pérdidas locales fortuitas (por ejemplo limpieza accidental de datos del navegador). Adicionalmente, sugerimos descargar los PDFs generados cuando necesites conservar versiones finales.')}</p>
            <p>{t('dataPolicy.paragraph4', 'Guarda las copias de seguridad en un lugar seguro y ten precaución al compartir estos archivos, ya que contienen tus datos personales. Puedes acceder, rectificar o eliminar tus datos en cualquier momento desde el panel de gestión.')}</p>
            <p className="text-xs text-gray-500">{t('dataPolicy.lastUpdated', 'Última actualización: 2025-12-27')}</p>
          </div>
        </div>
      </div>
      {open && (
        <button
          className="fixed inset-0 bg-gradient-to-br from-black/40 via-slate-900/30 to-black/40 backdrop-blur-sm z-10 cursor-pointer border-0 p-0"
          style={{ top: '104px' }}
          onClick={onClose}
          aria-label={t('dataPolicy.title', 'Política de Datos')}
        />
      )}
    </>
  );
};

export default DataPolicyPanel;
