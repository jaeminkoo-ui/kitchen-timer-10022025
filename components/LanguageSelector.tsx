import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Language } from '../i18n';

const LanguageSelector: React.FC = () => {
  const { language, setLanguage } = useLanguage();

  const languages: { code: Language; name: string }[] = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Español' },
    { code: 'ko', name: '한국어' },
  ];

  return (
    <div className="flex items-center bg-gray-800 rounded-lg p-1">
      {languages.map(lang => (
        <button
          key={lang.code}
          onClick={() => setLanguage(lang.code)}
          className={`px-3 py-1 text-sm font-semibold rounded-md transition-colors ${
            language === lang.code
              ? 'bg-blue-600 text-white'
              : 'bg-transparent text-gray-300 hover:bg-gray-700'
          }`}
        >
          {lang.name}
        </button>
      ))}
    </div>
  );
};

export default LanguageSelector;
