import React, { useState } from 'react';
import swasLogo from './assets/swas-logo.png';



const Login: React.FC<{ onLogin: (token: string) => void }> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    const API_URL = import.meta.env.VITE_BACKEND_URL;
    const PROJECT_ID = import.meta.env.VITE_PROJECT_ID;
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      if (!response.ok) {
        throw new Error('Credenciales incorrectas');
      }
      const data = await response.json();
      // Guardar purchasedProjects en localStorage
      if (data.user && Array.isArray(data.user.purchasedProjects)) {
        localStorage.setItem('purchasedProjects', JSON.stringify(data.user.purchasedProjects));
        // Validar acceso
        if (!PROJECT_ID || !data.user.purchasedProjects.includes(PROJECT_ID)) {
          window.location.href = '/no-access';
          return;
        }
      }
      onLogin(data.token);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message || 'Error de conexión');
      } else {
        setError('Error de conexión');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-full max-w-sm">
        <div className="flex justify-center mb-6">
          <img src={swasLogo} alt="Logo SWAS" className="h-16 w-auto" />
        </div>
        <h2 className="text-2xl font-bold mb-6 text-center">Iniciar sesión</h2>
        {error && <div className="mb-4 text-red-600 text-sm text-center">{error}</div>}
        <div className="mb-4">
          <label htmlFor="login-email" className="block mb-1 text-gray-700">Correo electrónico</label>
          <input
            id="login-email"
            type="email"
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="mb-6">
          <label htmlFor="login-password" className="block mb-1 text-gray-700">Contraseña</label>
          <input
            id="login-password"
            type="password"
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors font-semibold"
          disabled={loading}
        >
          {loading ? 'Ingresando...' : 'Ingresar'}
        </button>
      </form>
    </div>
  );
};

export default Login;
