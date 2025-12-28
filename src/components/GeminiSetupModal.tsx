import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { generateWithGemini } from '../services/geminiService';
import useTranslation from '../i18n/useTranslation2';

const GEMINI_KEY_STORAGE = 'GEMINI_API_KEY';
const BACKEND_URL = (((import.meta as unknown) as { env?: Record<string, string> }).env?.VITE_BACKEND_URL) || '';

export default function GeminiSetupModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { t } = useTranslation();
  const safeGetLocal = (k: string) => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) return window.localStorage.getItem(k) || '';
    } catch { }
    return '';
  };
  const maskKey = (k: string) => {
    if (!k) return '';
    if (k.length <= 8) return `${k.slice(0, 2)}...${k.slice(-2)}`;
    return `${k.slice(0, 4)}...${k.slice(-4)}`;
  };

  const initialKey = safeGetLocal(GEMINI_KEY_STORAGE);
  const [key, setKey] = useState<string>(initialKey || '');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) return;
    setKey(safeGetLocal(GEMINI_KEY_STORAGE) || '');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const saveKey = async () => {
    const trimmed = (key || '').trim();
    if (!trimmed) {
      await Swal.fire({ icon: 'error', title: t('error') || 'Error', text: t('gemini.noKeyProvided') || 'Debes pegar la API key', confirmButtonText: t('ok') || 'Aceptar' });
      return;
    }

    setLoading(true);
    try {
      const probePrompt = t('gemini.probePrompt') || 'Por favor responde brevemente para confirmar que puedes atender peticiones. Responde SOLO la palabra OK si estás funcionando.';
      const result = await generateWithGemini(probePrompt, { apiKey: trimmed, maxOutputTokens: 16 });
      const got = result?.text || '';
      if (!got || String(got).trim().length === 0) {
        await Swal.fire({ icon: 'error', title: t('error') || 'Error', text: t('gemini.invalidKeyTest') || 'La clave no devolvió una respuesta válida desde Gemini.', confirmButtonText: t('ok') || 'Aceptar' });
        setLoading(false);
        return;
      }
    } catch (err: unknown) {
      console.error('Front-end Gemini validation failed', err);
      const msg = err instanceof Error ? (err.message || String(err)) : String(err);
      await Swal.fire({ icon: 'error', title: t('error') || 'Error', text: t('gemini.invalidKeyTest') || `La validación con Gemini falló: ${msg}`, confirmButtonText: t('ok') || 'Aceptar' });
      setLoading(false);
      return;
    }

    // Save to server
    try {
      const token = safeGetLocal('token');
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;
      const url = BACKEND_URL ? `${BACKEND_URL.replace(/\/$/, '')}/user` : '/api/user';
      const res = await fetch(url, { method: 'PATCH', headers, body: JSON.stringify({ apiKey: trimmed }) });
      const raw = await res.text().catch(() => '');
      let parsed: unknown = null;
      try { parsed = raw ? JSON.parse(raw) : null; } catch { parsed = raw; }
      if (!res.ok) {
        const parsedObj = parsed as Record<string, unknown> | null;
        const serverMsg = (parsedObj?.['message'] as string) || (parsedObj?.['error'] as string) || raw || String(res.status);
        console.error('Save key failed', { status: res.status, body: parsed });
        await Swal.fire({ icon: 'error', title: t('error') || 'Error', text: t('gemini.saveFailedServer') || `No se pudo guardar la clave en el servidor: ${serverMsg}`, confirmButtonText: t('ok') || 'Aceptar' });
        setLoading(false);
        return;
      }
      await Swal.fire({ icon: 'success', title: t('gemini.keySavedTitle') || 'Clave registrada', text: t('gemini.keySavedServerText') || 'La API key se registró en el servidor correctamente.', confirmButtonText: t('ok') || 'Aceptar' });
      try { localStorage.setItem(GEMINI_KEY_STORAGE, trimmed); } catch { }
      setLoading(false);
      onClose();
    } catch (err) {
      console.error('Save to server failed', err);
      await Swal.fire({ icon: 'error', title: t('error') || 'Error', text: t('gemini.saveFailedServer') || 'No se pudo contactar con el servidor para registrar la clave.', confirmButtonText: t('ok') || 'Aceptar' });
      setLoading(false);
      return;
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative w-full max-w-xl bg-white rounded shadow-lg p-6 z-50">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">{t('gemini.title') || 'Configurar API de Gemini'}</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">✕</button>
        </div>
        <p className="text-sm text-gray-600 mb-4">{t('gemini.instructions') || 'Pega aquí tu API key de Gemini. Validaremos la clave y la guardaremos cifrada en el servidor para uso futuro.'}</p>
        <label className="block text-sm font-medium text-gray-700">Pegar API key</label>
        <input className="mt-2 w-full border rounded px-2 py-2" placeholder={t('gemini.placeholder') || 'Pega tu API key aquí'} value={key} onChange={e => setKey(e.target.value)} />
        <div className="flex gap-2 mt-4">
          <button className="bg-blue-600 text-white px-4 py-2 rounded" onClick={saveKey} disabled={loading}>{loading ? (t('loading') || 'Validando...') : (t('save') || 'Guardar')}</button>
          <button className="bg-gray-200 text-gray-800 px-4 py-2 rounded" onClick={() => {
            const url = 'https://aistudio.google.com/app/api-keys';
            const w = window.open(url, '_blank');
            if (w) try { w.opener = null; } catch { }
          }}>{t('gemini.getKey') || 'Obtener clave'}</button>
          <button className="ml-auto text-sm text-gray-500" onClick={onClose}>{t('skip') || 'Omitir por ahora'}</button>
        </div>
      </div>
    </div>
  );
}
