import React, { useState } from 'react';
import CVApp from './components/CVApp';
import Login from './Login';
import NoAccess from './NoAccess';
import './App.css';


const App: React.FC = () => {
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));

  const handleLogin = (newToken: string) => {
    setToken(newToken);
    localStorage.setItem('token', newToken);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
  };

  const [noAccess, setNoAccess] = useState(false);

  // Detectar si estamos en la página de no acceso
  React.useEffect(() => {
    if (window.location.pathname === '/no-access') {
      setNoAccess(true);
    }
  }, []);

  if (noAccess) {
    return <NoAccess />;
  }

  if (!token) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div>
      <CVApp onLogout={handleLogout} />
      {/* Aquí va el contenido de la app para usuarios autenticados */}
      <h1 className="text-2xl font-bold">Bienvenido a Info-Vitae</h1>
      {/* ...resto de la app 2. */}
    </div>
  );
};

export default App;
