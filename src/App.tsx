import React, { useState } from 'react';
import CVApp from './components/CVApp';
import Login from './Login';
import './App.css';

const App: React.FC = () => {
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));

  const handleLogin = (newToken: string) => {
    setToken(newToken);
    localStorage.setItem('token', newToken);
  };

  if (!token) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div>
      <CVApp />
      {/* Aquí va el contenido de la app para usuarios autenticados */}
              <h1 className="text-2xl font-bold">Bienvenido a Info-Vitae</h1>
      {/* ...resto de la app... */}
    </div>
  );
};

export default App;
