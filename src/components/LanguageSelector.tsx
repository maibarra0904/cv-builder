import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import useTranslation from '../i18n/useTranslation2';

export default function LanguageSelector() {
  const { currentLanguage, setLanguage} = useTranslation();
  const [open, setOpen] = useState(false);

  const toggle = () => setOpen(s => !s);
  const choose = (lang: 'es' | 'en') => {
    setLanguage(lang);
    setOpen(false);
  };

  return (
    <div className="relative">
      <button onClick={toggle} className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition">
        <span className="text-sm font-medium text-gray-700">{currentLanguage === 'es' ? 'ES' : 'EN'}</span>
        <ChevronDown className="h-4 w-4 text-gray-500" />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-36 bg-white border rounded shadow-lg z-50">
          <button onClick={() => choose('es')} className={`w-full text-left px-3 py-2 hover:bg-gray-50 ${currentLanguage === 'es' ? 'font-semibold' : ''}`}>Español (ES)</button>
          <button onClick={() => choose('en')} className={`w-full text-left px-3 py-2 hover:bg-gray-50 ${currentLanguage === 'en' ? 'font-semibold' : ''}`}>English (EN)</button>
        </div>
      )}
    </div>
  );
}
