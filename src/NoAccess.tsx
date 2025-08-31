import React from 'react';

const NoAccess: React.FC = () => (
  <div className="flex items-center justify-center min-h-screen bg-gray-100">
    <div className="bg-white p-8 rounded shadow-md w-full max-w-md text-center">
      <h2 className="text-2xl font-bold mb-4 text-red-600">Acceso denegado</h2>
      <p className="mb-6 text-gray-700">No tienes permisos para acceder a esta aplicación.<br />Por favor, contacta al administrador si crees que esto es un error.</p>
      <a href="/" className="text-blue-600 hover:underline">Volver al inicio</a>
    </div>
  </div>
);

export default NoAccess;
