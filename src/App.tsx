import React, { useState, useEffect } from 'react';
import CVApp from './components/CVApp';
import Login from './Login';
import './App.css';
import GeminiSetupModal from './components/GeminiSetupModal';


const App: React.FC = () => {
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));

  const handleLogin = (newToken: string) => {
    setToken(newToken);
    localStorage.setItem('token', newToken);
    // After login, check if server has apiKey and show setup if missing
    (async () => {
      const has = await checkServerHasApiKey();
      if (!has) setShowSetup(true);
    })();
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
  };

  
  const [showSetup, setShowSetup] = useState(false);

  async function checkServerHasApiKey(): Promise<boolean> {
    try {
      const tokenLocal = (typeof window !== 'undefined' && window.localStorage) ? (window.localStorage.getItem('token') || '') : '';
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (tokenLocal) headers.Authorization = `Bearer ${tokenLocal}`;
      const backend = (((import.meta as unknown) as { env?: Record<string, string> }).env?.VITE_BACKEND_URL) || '';
      const url = backend ? `${backend.replace(/\/$/, '')}/user/apikey` : '/api/user/apikey';
      const res = await fetch(url, { method: 'GET', headers });
      if (!res.ok) return false;
      const data = await res.json().catch(() => null);
      if (!data) return false;
      if (typeof data === 'string') return !!data;
      if (typeof data === 'object') {
        const d = data as Record<string, unknown> | null;
        if (d?.['apikey']) return !!d['apikey'];
        if (d?.['apiKey']) return !!d['apiKey'];
        if (typeof d?.['hasApiKey'] === 'boolean') return d?.['hasApiKey'] as boolean;
      }
      return false;
    } catch (err) {
      console.warn('checkServerHasApiKey failed', err);
      return false;
    }
  }

  // NoAccess view removed — registered users can access the app.

  useEffect(() => {
    // On mount, if there is a token (registered user) check apiKey presence
    (async () => {
      try {
        const tokenLocal = localStorage.getItem('token');
        if (tokenLocal) {
          const has = await checkServerHasApiKey();
          if (!has) setShowSetup(true);
        }
      } catch (e) {
        // ignore
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  

  if (!token) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div>
      <CVApp onLogout={handleLogout} />
      <GeminiSetupModal open={showSetup} onClose={() => setShowSetup(false)} />
      
    </div>
  );
};

export default App;
