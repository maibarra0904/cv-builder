import { useState } from 'react';
import { useCV } from '../../hooks/useCV';
import { Plus, X, Award, Calendar } from 'lucide-react';

export function CertificatesForm() {
  const { state, updateCertificates } = useCV();
  const { certificates } = state.cvData;
  const [isAdding, setIsAdding] = useState(false);
  const [newCertificate, setNewCertificate] = useState({
    name: '',
    issuer: '',
    date: '',
    url: ''
  });

  const addCertificate = () => {
    if (newCertificate.name.trim() && newCertificate.issuer.trim()) {
      const newCert = { 
        id: Date.now().toString(), 
        ...newCertificate
      };
      const updatedCertificates = [...certificates, newCert];
      updateCertificates(updatedCertificates);
      setNewCertificate({
        name: '',
        issuer: '',
        date: '',
        url: ''
      });
      setIsAdding(false);
    }
  };

  const removeCertificate = (id: string) => {
    const filteredCertificates = certificates.filter(cert => cert.id !== id);
    updateCertificates(filteredCertificates);
  };

  return (
    <div className="space-y-4">
      {/* Add certificate button */}
      {!isAdding && (
        <button
          onClick={() => setIsAdding(true)}
          className="w-full flex items-center justify-center space-x-2 bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-5 w-5" />
          <span>Agregar Certificado</span>
        </button>
      )}

      {/* Add certificate form */}
      {isAdding && (
        <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre del Certificado *
              </label>
              <input
                type="text"
                value={newCertificate.name}
                onChange={(e) => setNewCertificate({ ...newCertificate, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="ej. AWS Certified Developer"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Entidad Emisora *
              </label>
              <input
                type="text"
                value={newCertificate.issuer}
                onChange={(e) => setNewCertificate({ ...newCertificate, issuer: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="ej. Amazon Web Services"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fecha de Obtención
              </label>
              <input
                type="date"
                value={newCertificate.date}
                onChange={(e) => setNewCertificate({ ...newCertificate, date: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                URL de Verificación
              </label>
              <input
                type="url"
                value={newCertificate.url}
                onChange={(e) => setNewCertificate({ ...newCertificate, url: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="https://..."
              />
            </div>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={addCertificate}
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

      {/* Certificates list */}
      <div className="space-y-3">
        {certificates.map((certificate) => (
          <div key={certificate.id} className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3">
                <Award className="h-6 w-6 text-yellow-500 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-900">{certificate.name}</h3>
                  <p className="text-sm text-gray-600">{certificate.issuer}</p>
                  {certificate.date && (
                    <div className="flex items-center space-x-1 text-sm text-gray-500 mt-1">
                      <Calendar className="h-4 w-4" />
                      <span>{new Date(certificate.date).toLocaleDateString()}</span>
                    </div>
                  )}
                  {certificate.url && (
                    <a
                      href={certificate.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:text-blue-800 mt-1 inline-block"
                    >
                      Ver certificado
                    </a>
                  )}
                </div>
              </div>
              <button
                onClick={() => removeCertificate(certificate.id)}
                className="text-gray-400 hover:text-red-600 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {certificates.length === 0 && !isAdding && (
        <div className="text-center py-8 text-gray-500">
          <Award className="h-12 w-12 mx-auto mb-3 text-gray-300" />
          <p>No has agregado certificados aún</p>
          <p className="text-sm">Agrega tus certificaciones y credenciales</p>
        </div>
      )}
    </div>
  );
}
