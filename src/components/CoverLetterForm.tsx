import React, { useState } from 'react';
import Swal from 'sweetalert2';
import { generateCoverLetter } from '../services/coverLetterService';
import type { CoverLetterInputs } from '../services/coverLetterService';
import { useCV } from '../hooks/useCV';
import GeminiSetupModal from './GeminiSetupModal';
import useTranslation from '../i18n/useTranslation2';

const CoverLetterForm: React.FC<{ onGenerate: (text: string) => void, serverHasApiKey?: boolean }> = ({ onGenerate, serverHasApiKey }) => {
  const { state } = useCV();
  const { t, currentLanguage } = useTranslation();

  const defaultStyle = currentLanguage === 'en' ? 'Professional and concise' : 'Profesional y conciso';

  const initial: CoverLetterInputs = { companyName: '', companyUrl: '', position: '', style: defaultStyle, maxWords: 250 };

  const [form, setForm] = useState<CoverLetterInputs>(() => {
    try {
      if (typeof window === 'undefined') return initial;
      const raw = window.localStorage.getItem('coverLetterForm');
      if (!raw) return initial;
      const parsed = JSON.parse(raw) as Partial<CoverLetterInputs>;
      return {
        companyName: parsed.companyName ?? initial.companyName,
        companyUrl: parsed.companyUrl ?? initial.companyUrl,
        position: parsed.position ?? initial.position,
        style: parsed.style ?? initial.style,
        maxWords: typeof parsed.maxWords === 'number' ? parsed.maxWords : initial.maxWords,
      };
    } catch (e) {
      return initial;
    }
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSetup, setShowSetup] = useState(false);

  const handleChange = (k: keyof CoverLetterInputs) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const value = k === 'maxWords' ? Number((e.target as HTMLInputElement).value) : e.target.value;
    setForm(s => {
      const next = { ...s, [k]: value } as CoverLetterInputs;
      try {
        if (typeof window !== 'undefined') window.localStorage.setItem('coverLetterForm', JSON.stringify(next));
      } catch (err) {
        // ignore
      }
      return next;
    });
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const pd = state.cvData?.personalData ?? { firstName: '', lastName: '' };
      const cvData = {
        fullName: `${(pd.firstName || '').trim()} ${(pd.lastName || '').trim()}`.trim(),
        summary: state.cvData?.profile?.summary || '',
        experiences: state.cvData?.experience || [],
        education: state.cvData?.education || [],
        rawText: ''
      };
      const res = await generateCoverLetter(cvData, form as CoverLetterInputs, { language: currentLanguage });
      onGenerate(res.text || '');
    } catch (err: any) {
      console.error('CoverLetterForm generate error', err);
      const msg = err?.message || String(err);
      setError(msg);
      // If the gemini service indicated missing key, offer setup
      if (err && (err.code === 'GEMINI_KEY_MISSING' || String(msg).includes('GEMINI_KEY_MISSING'))) {
        const result = await Swal.fire({
          icon: 'warning',
          title: t('coverLetterMessages.apiKeyMissingTitle', 'Clave de API no encontrada'),
          text: t('coverLetterMessages.apiKeyMissingText', 'No se encontró una API key registrada. ¿Deseas registrarla ahora?'),
          showCancelButton: true,
          confirmButtonText: t('coverLetterMessages.apiKeyConfirm', 'Registrar'),
          cancelButtonText: t('coverLetterMessages.cancel', 'Cancelar')
        });
        if (result.isConfirmed) setShowSetup(true);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div>
        <label className="block text-sm font-medium text-gray-700">{t('coverLetter.company', 'Empresa')}</label>
        <input value={form.companyName} onChange={handleChange('companyName')} className="mt-1 block w-full border rounded px-2 py-1" placeholder={t('coverLetter.companyPlaceholder', '')} />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">{t('coverLetter.url', 'URL (opcional)')}</label>
        <input value={form.companyUrl} onChange={handleChange('companyUrl')} className="mt-1 block w-full border rounded px-2 py-1" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">{t('coverLetter.position', 'Puesto')}</label>
        <input value={form.position} onChange={handleChange('position')} className="mt-1 block w-full border rounded px-2 py-1" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">{t('coverLetter.style', 'Estilo')}</label>
        <input value={form.style} onChange={handleChange('style')} className="mt-1 block w-full border rounded px-2 py-1" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">{t('coverLetter.maxWords', 'Máx. palabras')}</label>
        <input type="number" value={form.maxWords} onChange={handleChange('maxWords')} className="mt-1 block w-32 border rounded px-2 py-1" />
      </div>
      {error && <div className="text-sm text-red-600">{error}</div>}
      <div className="flex gap-2">
        <button type="submit" disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded">
          {loading ? t('messages.generating', 'Generando...') : t('coverLetter.generate', 'Generar carta')}
        </button>
        <button type="button" onClick={() => setShowSetup(true)} className="px-3 py-2 border rounded">{serverHasApiKey ? t('coverLetter.changeApiKey', 'Cambiar API key') : t('coverLetter.registerApiKey', 'Registrar API key')}</button>
      </div>
      <GeminiSetupModal open={showSetup} onClose={() => setShowSetup(false)} />
    </form>
  );
};

export default CoverLetterForm;
