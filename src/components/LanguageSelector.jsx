import React, { useState, useRef, useEffect } from 'react';
import { useLanguage, SUPPORTED_LANGUAGES } from '../context/LanguageContext';
import { ChevronDown, Globe } from 'lucide-react';

export default function LanguageSelector({ variant = 'dropdown', onSelect }) {
  const { currentLang, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const currentLangObj = SUPPORTED_LANGUAGES.find(l => l.code === currentLang) || SUPPORTED_LANGUAGES[0];

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (variant === 'pills') {
    return (
      <div className="flex flex-wrap gap-2 justify-center">
        {SUPPORTED_LANGUAGES.map(lang => (
          <button
            key={lang.code}
            type="button"
            onClick={() => {
              setLanguage(lang.code);
              if (onSelect) onSelect(lang.code);
            }}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all shadow-sm border ${
              currentLang === lang.code 
                ? 'bg-green-600 text-white border-green-600 ring-2 ring-green-300' 
                : 'bg-white dark:bg-green-950 text-gray-700 dark:text-gray-200 border-gray-300 dark:border-green-800 hover:bg-green-50 dark:hover:bg-green-900'
            }`}
          >
            <span className="mr-1.5">{lang.flag}</span>
            <span>{lang.name}</span>
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold bg-green-50 dark:bg-green-900/60 text-green-800 dark:text-green-200 border border-green-200 dark:border-green-700 hover:bg-green-100 dark:hover:bg-green-800 transition-colors shadow-sm"
        aria-label="Select Language"
      >
        <Globe className="w-4 h-4 text-green-600 dark:text-green-400" />
        <span>{currentLangObj.flag}</span>
        <span className="font-bold">{currentLangObj.name}</span>
        <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      
      {isOpen && (
        <div className="absolute right-0 mt-2 w-44 bg-white dark:bg-green-950 rounded-2xl shadow-xl border border-green-100 dark:border-green-800 overflow-hidden z-50 py-1 backdrop-blur-md">
          <div className="px-3 py-1.5 text-xs font-semibold text-gray-400 border-b border-gray-100 dark:border-green-900">
            Select Language
          </div>
          {SUPPORTED_LANGUAGES.map(lang => (
            <button
              key={lang.code}
              type="button"
              onClick={() => { 
                setLanguage(lang.code); 
                setIsOpen(false);
                if (onSelect) onSelect(lang.code);
              }}
              className={`w-full text-left px-3.5 py-2.5 text-sm flex items-center justify-between transition-colors ${
                currentLang === lang.code 
                  ? 'bg-green-50 dark:bg-green-900/80 text-green-700 dark:text-green-300 font-bold border-l-4 border-green-600' 
                  : 'text-gray-700 dark:text-gray-300 hover:bg-green-50/50 dark:hover:bg-green-900/40'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="text-base">{lang.flag}</span>
                <span>{lang.name}</span>
              </div>
              <span className="text-xs text-gray-400 dark:text-gray-500">{lang.englishName}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
