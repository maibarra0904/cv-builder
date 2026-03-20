import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// polyfill Buffer for libraries that expect Node Buffer (used by react-pdf internals)
import { Buffer } from 'buffer';
const g = globalThis as unknown as { Buffer?: typeof Buffer };
g.Buffer = g.Buffer ?? Buffer;
import './index.css'
import './i18n/index' // Importar configuración i18n
import App from './App.tsx'
import { GoogleOAuthProvider } from '@react-oauth/google';

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={googleClientId}>
      <App />
    </GoogleOAuthProvider>
  </StrictMode>,
)
