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

  const handleLogout = () => {
    localStorage.removeItem('token');
    try { localStorage.removeItem('apiKey'); } catch { }
    setToken(null);
  };

  if (!token) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div>
      <CVApp onLogout={handleLogout} />
    </div>
  );
};

export default App;
