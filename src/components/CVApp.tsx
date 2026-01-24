import { useState, useEffect, useRef } from 'react';
import { CVProvider } from '../context/CVContext';
import { LanguageProvider } from '../context/LanguageContext';
import { Sidebar } from './Sidebar';
import ReactPdfViewer from './ReactPdfViewer';
import CoverLetterForm from './CoverLetterForm';
import CoverLetterPdfViewer from './CoverLetterPdfViewer';
import ErrorBoundary from './ErrorBoundary';
import Swal from 'sweetalert2';

import { TemplateSelector } from './TemplateSelector';
import { useCV } from '../hooks/useCV';
import DataPolicyPanel from './DataPolicyPanel';
import DonationPanel from './DonationPanel';
import premiumIcon from '../assets/premium.png';
import { DataManager } from './DataManager';
import { FileText, Settings, Database } from 'lucide-react';
import GeminiSetupModal from './GeminiSetupModal';
import LanguageSelector from './LanguageSelector';
import useTranslation from '../i18n/useTranslation2';
import swasLogo from '../assets/swas-apps.png';

function CVApp({ onLogout }: { onLogout?: () => void }) {
  const [showTemplateSelector, setShowTemplateSelector] = useState(false);
  const [isTemplateSelectorVisible, setIsTemplateSelectorVisible] = useState(false);
  const [showModeSelector, setShowModeSelector] = useState(false);
  const [isModeSelectorVisible, setIsModeSelectorVisible] = useState(false);
  const [showDataManager, setShowDataManager] = useState(false);
  const [showDataPolicy, setShowDataPolicy] = useState(false);
  const [showDonationModal, setShowDonationModal] = useState(false);
  const [documentMode, setDocumentMode] = useState<'cv' | 'cover'>(() => {
    try {
      if (typeof window === 'undefined') return 'cv';
      const v = window.localStorage.getItem('documentMode');
      return v === 'cover' ? 'cover' : 'cv';
    } catch (err) {
      return 'cv';
    }
  });

  useEffect(() => {
    try {
      if (typeof window !== 'undefined') window.localStorage.setItem('documentMode', documentMode);
    } catch (err) {
      // ignore
    }
  }, [documentMode]);
  const [coverLetterText, setCoverLetterText] = useState<string>(() => {
    try {
      return (typeof window !== 'undefined' && window.localStorage.getItem('coverLetterText')) || '';
    } catch (e) {
      return '';
    }
  });
  const [serverHasApiKey, setServerHasApiKey] = useState<boolean | null>(null);
  const [showSetupModal, setShowSetupModal] = useState(false);
  const [userName, setUserName] = useState<string>('');
  // Helper component that resolves translations inside LanguageProvider
  function Translate({ path, fallback }: { path: string; fallback?: string }) {
    const { t } = useTranslation();
    return <>{t(path, fallback)}</>;
  }

  // Actions component for cover letter save/clear/copy (uses useTranslation inside provider)
  function CoverLetterActions({ text, setText }: { text: string; setText: (s: string) => void }) {
    const { t } = useTranslation();
    const handleSave = () => {
      try {
        if (typeof window !== 'undefined') window.localStorage.setItem('coverLetterText', text || '');
      } catch (err) {}
      Swal.fire({ icon: 'success', title: t('coverLetter.saved', 'Guardado'), timer: 1400, showConfirmButton: false });
    };
    const handleClear = () => {
      setText('');
      try {
        if (typeof window !== 'undefined') window.localStorage.removeItem('coverLetterText');
      } catch (err) {}
      Swal.fire({ icon: 'info', title: t('coverLetter.cleared', 'Texto limpiado'), timer: 1400, showConfirmButton: false });
    };
    const handleCopy = async () => {
      try {
        await navigator.clipboard.writeText(text || '');
        Swal.fire({ icon: 'success', title: t('coverLetter.copySuccess', 'Texto copiado'), text: t('coverLetter.copySuccessText', 'El texto de la carta fue copiado al portapapeles'), timer: 1400, showConfirmButton: false });
      } catch (err) {
        Swal.fire({ icon: 'error', title: t('coverLetter.copyError', 'Error al copiar'), text: t('coverLetter.copyErrorText', 'No se pudo copiar el texto al portapapeles') });
      }
    };

    return (
      <div className="flex justify-end mt-2 space-x-2">
        <button type="button" onClick={handleSave} className="px-3 py-1.5 bg-indigo-600 text-white rounded text-sm">
          <Translate path="coverLetter.save" fallback="Guardar" />
        </button>
        <button type="button" onClick={handleClear} className="px-3 py-1.5 border rounded text-sm">
          {t('coverLetter.clear', 'Limpiar')}
        </button>
        <button type="button" onClick={handleCopy} className="px-3 py-1.5 border rounded text-sm">
          {t('coverLetter.copyText', 'Copiar texto')}
        </button>
      </div>
    );
  }

  // Central panel opener: cierra los paneles abiertos y abre el solicitado
  const openPanel = (panel: 'template' | 'data' | 'mode' | 'policy' | 'donation') => {
    // Helper para cerrar template/mode con su animación
    const closeTemplate = () => {
      setIsTemplateSelectorVisible(false);
      setTimeout(() => setShowTemplateSelector(false), 300);
    };
    const closeMode = () => {
      setIsModeSelectorVisible(false);
      setTimeout(() => setShowModeSelector(false), 300);
    };

    // Si ya está abierto, lo cerramos (toggle)
    if (panel === 'template' && showTemplateSelector) {
      closeTemplate();
      return;
    }
    if (panel === 'data' && showDataManager) { setShowDataManager(false); return; }
    if (panel === 'mode' && showModeSelector) { closeMode(); return; }
    if (panel === 'policy' && showDataPolicy) { setShowDataPolicy(false); return; }
    if (panel === 'donation' && showDonationModal) { setShowDonationModal(false); return; }

    // Cerrar todos los paneles antes de abrir el solicitado
    // Cerrar data manager
    if (showDataManager) setShowDataManager(false);
    // Cerrar data policy
    if (showDataPolicy) setShowDataPolicy(false);
    // Cerrar donation
    if (showDonationModal) setShowDonationModal(false);
    // Cerrar template/mode con su animación
    if (showTemplateSelector) closeTemplate();
    if (showModeSelector) closeMode();

    // Abrir el panel solicitado con pequeños delays para mantener transiciones
    if (panel === 'template') {
      setShowTemplateSelector(true);
      setTimeout(() => setIsTemplateSelectorVisible(true), 10);
    } else if (panel === 'data') {
      // abrir directamente
      setShowDataManager(true);
    } else if (panel === 'mode') {
      setShowModeSelector(true);
      setTimeout(() => setIsModeSelectorVisible(true), 10);
    } else if (panel === 'policy') {
      // dar tiempo si cerramos algo grande previamente
      setTimeout(() => setShowDataPolicy(true), 150);
    } else if (panel === 'donation') {
      setTimeout(() => setShowDonationModal(true), 150);
    }
  };

  // Wrappers legacy names used across the component
  const handleToggleTemplateSelector = () => openPanel('template');
  const handleToggleDataManager = () => openPanel('data');
  const handleToggleModeSelector = () => openPanel('mode');
  const handleToggleDataPolicy = () => openPanel('policy');

  const handleCloseTemplateSelector = () => {
    setIsTemplateSelectorVisible(false);
    setTimeout(() => setShowTemplateSelector(false), 300);
  };

  const handleCloseModeSelector = () => {
    setIsModeSelectorVisible(false);
    setTimeout(() => setShowModeSelector(false), 300);
  };


  // Check if backend has an apiKey saved for the current user
  async function checkServerHasApiKey(): Promise<boolean> {
    try {
      const token = (typeof globalThis !== 'undefined' && (globalThis as unknown as Window).localStorage.getItem('token')) || '';
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (token) headers.Authorization = `Bearer ${token}`;
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

  useEffect(() => {
    (async () => {
      try {
        const has = await checkServerHasApiKey();
        setServerHasApiKey(has);
      } catch (e) {
        setServerHasApiKey(false);
      }
    })();
  }, []);

  // Try to read user name from JWT token stored in localStorage (safe best-effort)
  useEffect(() => {
    try {
      if (typeof window === 'undefined') return;
      const stored = window.localStorage.getItem('userName');
      if (stored) {
        setUserName(stored);
        return;
      }
      const token = window.localStorage.getItem('token');
      if (!token) return;
      const parts = token.split('.');
      if (parts.length < 2) return;
      const payload = parts[1];
      // base64url -> base64
      const b64 = payload.replace(/-/g, '+').replace(/_/g, '/');
      const decoded = atob(b64.replace(/=+$/, ''));
      // Decode UTF-8 safely
      const jsonString = decodeURIComponent(Array.prototype.map.call(decoded, function(c: string) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      const obj = JSON.parse(jsonString || '{}');
      const name = (obj.fullName || obj.name || `${obj.firstName || ''} ${obj.lastName || ''}` || '').trim();
      if (name) setUserName(name);
    } catch (err) {
      // ignore parsing errors
    }
  }, []);

  function ModePanel({ onSelect }: { onSelect?: (mode: 'cv' | 'cover') => void }) {
    const cv = useCV();
    const { t } = useTranslation();
    const hasContent = Boolean(
      cv.state.cvData.personalData.firstName ||
      cv.state.cvData.personalData.lastName ||
      cv.state.cvData.personalData.email ||
      cv.state.cvData.profile.summary ||
      (cv.state.cvData.experience && cv.state.cvData.experience.length > 0) ||
      (cv.state.cvData.education && cv.state.cvData.education.length > 0)
    );

    return (
      <div className="space-y-3">
        <p className="text-sm text-gray-600">{t('coverLetter.description', 'Elige si quieres trabajar con tu Hoja de Vida o generar una Carta de Presentación basada en ella. La carta usa los datos de tu CV para crear un texto personalizado.')}</p>
        <div className="flex flex-col space-y-2">
          <button
            onClick={() => { setDocumentMode('cv'); handleCloseModeSelector(); if (onSelect) onSelect('cv'); }}
            className={`w-full text-left px-4 py-3 rounded-lg border ${documentMode === 'cv' ? 'border-indigo-500 bg-indigo-50 font-semibold' : 'border-gray-200 hover:bg-gray-50'}`}
          >
            {t('coverLetter.cv', 'Hoja de Vida')}
          </button>
          <div>
            <button
              onClick={() => { if (hasContent) { setDocumentMode('cover'); handleCloseModeSelector(); if (onSelect) onSelect('cover'); } }}
              className={`w-full text-left px-4 py-3 rounded-lg border ${documentMode === 'cover' ? 'border-indigo-500 bg-indigo-50 font-semibold' : 'border-gray-200'} ${!hasContent ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'}`}
              disabled={!hasContent}
            >
              {t('coverLetter.title', 'Carta de Presentación')}
            </button>
            {!hasContent && (
              <p className="text-xs text-red-600 mt-2">{t('coverLetter.missingCvWarning', 'Para generar una carta debes crear primero la hoja de vida con al menos tu nombre o experiencia.')}</p>
            )}
          </div>
        </div>
      </div>
    );
  }

  function HeaderControls() {
    const { t, currentLanguage, setLanguage } = useTranslation();
    // Desktop controls (visible on sm and up)
    const desktop = (
      <div className="hidden sm:flex items-center space-x-2 md:space-x-4">
        {documentMode === 'cv' && (
          <>
            <button
              onClick={handleToggleTemplateSelector}
              className="flex items-center space-x-1 md:space-x-2 px-2 md:px-3 py-1.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg shadow-blue-600/25 hover:shadow-blue-700/30 hover:scale-105 text-xs md:text-sm font-medium backdrop-blur-sm"
            >
              <Settings className="h-4 w-4" />
              <span className="hidden sm:inline">{t('navigation.templates')}</span>
            </button>
            <button
              onClick={handleToggleDataManager}
              className="flex items-center space-x-1 md:space-x-2 px-2 md:px-3 py-1.5 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg hover:from-purple-700 hover:to-purple-800 transition-all duration-200 shadow-lg shadow-purple-600/25 hover:shadow-purple-700/30 hover:scale-105 text-xs md:text-sm font-medium backdrop-blur-sm"
            >
              <Database className="h-4 w-4" />
              <span className="hidden sm:inline">{t('navigation.data')}</span>
            </button>
          </>
        )}
        <button
          onClick={handleToggleModeSelector}
          className="flex items-center space-x-1 md:space-x-2 px-2 md:px-3 py-1.5 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-lg hover:from-indigo-700 hover:to-indigo-800 transition-all duration-200 shadow-lg shadow-indigo-600/25 hover:shadow-indigo-700/30 hover:scale-105 text-xs md:text-sm font-medium backdrop-blur-sm"
          title={t('navigation.mode', 'Modo')}
        >
          <FileText className="h-4 w-4" />
          <span className="hidden sm:inline">{t('navigation.mode', 'Modo')}</span>
          <span className="ml-1 text-sm text-white/80 hidden sm:inline">({documentMode === 'cv' ? t('coverLetter.cv', 'Hoja de Vida') : t('coverLetter.title', 'Carta')})</span>
        </button>
        <button
          onClick={handleToggleDataPolicy}
          className="flex items-center space-x-1 md:space-x-2 px-2 md:px-3 py-1.5 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 transition-all duration-200 shadow-lg shadow-green-600/25 hover:shadow-green-700/30 hover:scale-105 text-xs md:text-sm font-medium backdrop-blur-sm"
          title={t('ui.dataPolicy')}
        >
          <FileText className="h-4 w-4 text-white" />
          <span className="hidden sm:inline">{t('ui.dataPolicy')}</span>
        </button>
        <button
          onClick={() => window.open('https://sw-as.online/contribution', '_blank', 'noopener,noreferrer')}
          className="flex items-center space-x-1 md:space-x-2 px-2 md:px-3 py-1.5 bg-yellow-50 text-yellow-700 rounded-lg hover:bg-yellow-100 transition-all duration-200 shadow-lg shadow-yellow-400/25 hover:shadow-yellow-500/30 hover:scale-105 text-xs md:text-sm font-medium"
          title={t('ui.donate')}
        >
          <img src={premiumIcon} alt="Premium" className="h-4 w-4" />
          <span className="hidden sm:inline">{t('ui.donate')}</span>
        </button>

        <div className="hidden sm:block">
          <LanguageSelector />
        </div>

        <button
          onClick={onLogout}
          className="flex items-center space-x-1 md:space-x-2 px-2 md:px-3 py-1.5 bg-gradient-to-r from-gray-400 to-gray-600 text-white rounded-lg hover:from-gray-500 hover:to-gray-700 transition-all duration-200 shadow-lg shadow-gray-400/25 hover:shadow-gray-700/30 hover:scale-105 text-xs md:text-sm font-medium backdrop-blur-sm"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H7a2 2 0 01-2-2V7a2 2 0 012-2h4a2 2 0 012 2v1" /></svg>
          <span className="hidden sm:inline">{t('ui.logout')}</span>
        </button>
      </div>
    );

    // Mobile controls (visible below sm)
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
      function onDocClick(e: MouseEvent) {
        if (!ref.current) return;
        if (!(e.target instanceof Node)) return;
        if (!ref.current.contains(e.target)) setOpen(false);
      }
      document.addEventListener('click', onDocClick);
      return () => document.removeEventListener('click', onDocClick);
    }, []);

    const mobile = (
      <div className="flex sm:hidden items-center" ref={ref}>
        <button
          aria-haspopup="true"
          aria-expanded={open}
          onClick={() => setOpen(v => !v)}
          className="p-2 rounded-md hover:bg-gray-100 focus:outline-none focus:ring"
          title="Menu"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        {open && (
          <div className="absolute right-4 top-14 w-56 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
            <div className="py-2 px-3">
              {/* SWAS logo and user info for mobile menu */}
              <div className="mb-3 flex flex-col items-center">
                <a href="https://sw-as.online/" target="_blank" rel="noopener noreferrer" title="SWAS" className="mb-2">
                  <img src={swasLogo} alt="SWAS Apps" className="h-8 w-auto rounded" style={{ background: '#fff' }} />
                </a>
                {userName && (
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm">{userName}</span>
                  </div>
                )}
              </div>
              {documentMode === 'cv' && (
                <button onClick={() => { handleToggleTemplateSelector(); setOpen(false); }} className="w-full flex items-center space-x-2 px-3 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg text-sm font-medium">
                  <Settings className="h-4 w-4" />
                  <span className="text-left">{t('navigation.templates')}</span>
                </button>
              )}
              {documentMode === 'cv' && (
                <button onClick={() => { handleToggleDataManager(); setOpen(false); }} className="w-full flex items-center space-x-2 px-3 py-2 mt-2 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg hover:from-purple-700 hover:to-purple-800 transition-all duration-200 shadow-lg text-sm font-medium">
                  <Database className="h-4 w-4" />
                  <span className="text-left">{t('navigation.data')}</span>
                </button>
              )}
              <button onClick={() => { handleToggleModeSelector(); setOpen(false); }} className="w-full flex items-center justify-between px-3 py-2 mt-2 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-lg hover:from-indigo-700 hover:to-indigo-800 transition-all duration-200 shadow-lg text-sm font-medium">
                <div className="flex items-center space-x-2">
                  <FileText className="h-4 w-4" />
                  <span className="text-left">{t('navigation.mode')}</span>
                </div>
                <span className="text-sm text-white/90">{documentMode === 'cv' ? t('coverLetter.cv') : t('coverLetter.title')}</span>
              </button>
              <button onClick={() => { handleToggleDataPolicy(); setOpen(false); }} className="w-full flex items-center space-x-2 px-3 py-2 mt-2 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 transition-all duration-200 shadow-lg text-sm font-medium">
                <FileText className="h-4 w-4 text-white" />
                <span className="text-left">{t('ui.dataPolicy')}</span>
              </button>
              <button onClick={() => { window.open('https://sw-as.online/contribution', '_blank', 'noopener,noreferrer'); setOpen(false); }} className="w-full flex items-center space-x-2 px-3 py-2 mt-2 bg-yellow-50 text-yellow-700 rounded-lg hover:bg-yellow-100 transition-all duration-200 shadow-lg text-sm font-medium">
                <img src={premiumIcon} alt="Premium" className="h-4 w-4" />
                <span className="text-left">{t('ui.donate')}</span>
              </button>
              <div className="w-full">
                <div className="flex flex-col">
                  <button onClick={() => { setLanguage('es'); setOpen(false); }} className={`w-full text-left px-3 py-2 rounded hover:bg-gray-50 ${currentLanguage === 'es' ? 'font-semibold' : ''}`}>Español (ES)</button>
                  <button onClick={() => { setLanguage('en'); setOpen(false); }} className={`w-full text-left px-3 py-2 rounded hover:bg-gray-50 ${currentLanguage === 'en' ? 'font-semibold' : ''}`}>English (EN)</button>
                </div>
              </div>
              <button onClick={() => { setOpen(false); if (onLogout) onLogout(); }} className="w-full flex items-center gap-2 px-3 py-2 mt-2 bg-gradient-to-r from-gray-400 to-gray-600 text-white rounded-lg hover:from-gray-500 hover:to-gray-700 transition-all duration-200 shadow-lg text-sm font-medium">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H7a2 2 0 01-2-2V7a2 2 0 012-2h4a2 2 0 012 2v1" /></svg>
                <span className="text-left">{t('ui.logout')}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    );

    return (
      <>
        {desktop}
        {mobile}
      </>
    );
  }

  return (
    <LanguageProvider>
      <CVProvider>
      <div className="min-h-screen w-full bg-gradient-to-br from-slate-200 via-blue-100 to-indigo-200 overflow-x-hidden cv-app-container pt-[104px]">
        {/* Header (fixed) */}
        <header className="fixed top-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md shadow-xl border-b border-gray-200/50 px-4 md:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 md:space-x-3">
              {/* Bloque vertical: icono Info-Vitae arriba, SWAS logo debajo */}
              <div className="flex flex-col items-center justify-center mr-2">
                <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-lg mb-1">
                  <FileText className="h-6 w-6 md:h-8 md:w-8 text-white" />
                </div>
              </div>
              {/* Bloque de texto a la derecha del bloque vertical */}
              <div className="flex flex-col justify-center">
                <div className="flex items-center">
                  <h1 className="text-lg md:text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                    CV-Letter
                  </h1>
                  <a href="https://sw-as.online/" target="_blank" rel="noopener noreferrer" title="SWAS" className="ml-4 md:ml-6 hidden md:inline-flex items-center self-center">
                    <img src={swasLogo} alt="SWAS" className="h-6 md:h-8 w-auto rounded bg-white p-0.5" />
                  </a>
                </div>
                {/* User name moved to mobile menu */}
              </div>
              {/* SWAS logo removed from main header (moved into mobile menu) */}
            </div>
            <HeaderControls />
          </div>
        </header>

        {/* Template Selector Modal */}
        {showTemplateSelector && (
          <div className={`fixed top-0 right-0 w-full sm:w-80 bg-gradient-to-b from-white via-gray-50 to-gray-100 backdrop-blur-md border-l border-gray-200/50 h-screen overflow-y-auto transform transition-transform duration-300 z-10 shadow-2xl ${
            isTemplateSelectorVisible ? 'translate-x-0' : 'translate-x-full'
          }`} style={{ top: '104px' }}>
            <div className="p-4 bg-gradient-to-b from-white/80 to-gray-50/80 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">Selector de Plantillas</h2>
                <button
                  onClick={handleCloseTemplateSelector}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <TemplateSelector onTemplateSelect={handleCloseTemplateSelector} />
            </div>
          </div>
        )}

        {/* If server reports no apiKey, show a small notice with option to register */}
        {serverHasApiKey === false && (
          <div className="fixed top-[72px] left-1/2 transform -translate-x-1/2 z-50 w-full max-w-3xl px-4">
                        <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 rounded-lg p-3 shadow-md flex items-center justify-between">
                      <div className="text-sm"><Translate path="coverLetter.missingCvWarning" fallback="No se encontró una API key de Gemini registrada para tu cuenta. Para usar la generación de cartas registra tu clave." /></div>
                      <div className="flex items-center gap-2">
                        <button onClick={() => setShowSetupModal(true)} className="px-3 py-1.5 bg-yellow-600 text-white rounded"><Translate path="coverLetter.registerApiKey" fallback="Registrar API key" /></button>
                      </div>
                    </div>
          </div>
        )}

        {/* Mode Selector Panel */}
        {showModeSelector && (
          <div className={`fixed top-0 right-0 w-full sm:w-80 bg-gradient-to-b from-white via-gray-50 to-gray-100 backdrop-blur-md border-l border-gray-200/50 h-screen overflow-y-auto transform transition-transform duration-300 z-10 shadow-2xl ${
            isModeSelectorVisible ? 'translate-x-0' : 'translate-x-full'
          }`} style={{ top: '104px' }}>
            <div className="p-4 bg-gradient-to-b from-white/80 to-gray-50/80 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">Modo de Documento</h2>
                <button
                  onClick={handleCloseModeSelector}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <ModePanel />
            </div>
          </div>
        )}

        {/* Overlay for mode selector */}
        {showModeSelector && (
          <button
            className="fixed inset-0 bg-gradient-to-br from-black/40 via-slate-900/30 to-black/40 backdrop-blur-sm z-[9] cursor-pointer border-0 p-0"
            style={{ top: '104px' }}
            onClick={handleCloseModeSelector}
            onKeyDown={(e) => {
              if (e.key === 'Escape') {
                handleCloseModeSelector();
              }
            }}
            aria-label="Cerrar selector de modo"
          />
        )}

        {/* Overlay for template selector */}
        {showTemplateSelector && (
          <button
            className="fixed inset-0 bg-gradient-to-br from-black/40 via-slate-900/30 to-black/40 backdrop-blur-sm z-[9] cursor-pointer border-0 p-0"
            style={{ top: '104px' }}
            onClick={handleCloseTemplateSelector}
            onKeyDown={(e) => {
              if (e.key === 'Escape') {
                handleCloseTemplateSelector();
              }
            }}
            aria-label="Cerrar selector de plantillas"
          />
        )}

        {/* Main Content */}
        <div className="flex flex-col lg:flex-row relative min-h-[calc(100vh-104px)]">
          {/* Left Sidebar - Form (Mobile: Stack above, Desktop: Side panel) */}
          <div className="w-full lg:w-1/3 bg-gradient-to-b from-white via-gray-50 to-gray-100 backdrop-blur-sm border-r border-gray-200/50 lg:h-[calc(100vh-104px)] overflow-y-auto shadow-lg">
            {documentMode === 'cover' ? (
              <div className="p-4">
                <h2 className="text-lg font-semibold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-3"><Translate path="coverLetter.title" fallback="Carta de Presentación" /></h2>
                <div className="bg-white/60 backdrop-blur-sm rounded-lg p-4 shadow-sm border border-gray-200/50 space-y-3">
                  <CoverLetterForm onGenerate={(text) => {
                    try {
                      if (typeof window !== 'undefined') window.localStorage.setItem('coverLetterText', text || '');
                    } catch (e) {
                      // ignore localStorage errors
                    }
                    setCoverLetterText(text);
                  }} serverHasApiKey={serverHasApiKey ?? undefined} />

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1"><Translate path="coverLetter.editableLabel" fallback="Texto editable de la carta" /></label>
                    <textarea
                      value={coverLetterText}
                      onChange={(e) => {
                        const v = e.target.value;
                        try {
                          if (typeof window !== 'undefined') window.localStorage.setItem('coverLetterText', v || '');
                        } catch (err) {
                          // ignore
                        }
                        setCoverLetterText(v);
                      }}
                      rows={12}
                      className="w-full border rounded px-2 py-2 resize-y"
                    />
                      <CoverLetterActions text={coverLetterText} setText={setCoverLetterText} />
                  </div>
                </div>
              </div>
            ) : (
              <Sidebar />
            )}
          </div>

          {/* Center Panel - Preview (Mobile: Full width, Desktop: Flex-1) */}
          <div className={`flex-1 bg-gradient-to-br from-slate-100 via-gray-200 to-slate-300 lg:h-[calc(100vh-104px)] overflow-y-auto transition-all duration-300 ${(showDataManager || showTemplateSelector || showDataPolicy || showDonationModal) ? 'lg:mr-80' : 'lg:mr-0'}`}>
            {/* Offscreen HTML preview used for PDF capture (kept in DOM) */}
            

            <div style={{ minHeight: '100%', height: '100%' }}>
              <ErrorBoundary>
                {documentMode === 'cover' ? (
                  <CoverLetterPdfViewer text={coverLetterText} />
                ) : (
                  <ReactPdfViewer embedded />
                )}
              </ErrorBoundary>
            </div>
          </div>

          {/* Right Panel - Data Management (Collapsible) */}
          <div className={`fixed top-0 right-0 w-full sm:w-80 bg-gradient-to-b from-white via-gray-50 to-gray-100 backdrop-blur-md border-l border-gray-200/50 h-[calc(100vh-104px)] overflow-y-auto transform transition-transform duration-300 z-10 shadow-2xl ${
            showDataManager ? 'translate-x-0' : 'translate-x-full'
          }`} style={{ top: '104px' }}>
            <div className="p-4 bg-gradient-to-b from-white/80 to-gray-50/80 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">Panel de Gestión</h2>
                <button
                  onClick={() => setShowDataManager(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <DataManager />
            </div>
          </div>

          {/* Overlay when data manager is open */}
          {showDataManager && (
            <button
              className="fixed inset-0 bg-gradient-to-br from-black/40 via-slate-900/30 to-black/40 backdrop-blur-sm z-[9] cursor-pointer border-0 p-0"
              style={{ top: '104px' }}
              onClick={() => setShowDataManager(false)}
              onKeyDown={(e) => {
                if (e.key === 'Escape') {
                  setShowDataManager(false);
                }
              }}
              aria-label="Cerrar panel de gestión de datos"
            />
          )}
        </div>
        {/* Side panels: Data Policy & Donation (slide from right) */}
        <DataPolicyPanel open={showDataPolicy} onClose={() => setShowDataPolicy(false)} />
        <DonationPanel open={showDonationModal} onClose={() => setShowDonationModal(false)} />
        {/* Gemini Setup Modal (shared) */}
        <GeminiSetupModal open={showSetupModal} onClose={() => { setShowSetupModal(false); setServerHasApiKey(true); }} />
      </div>
    </CVProvider>
    </LanguageProvider>
  );
}

export default CVApp;
