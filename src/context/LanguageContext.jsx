import React, { createContext, useContext, useState } from 'react';
import en from '../i18n/en.json';
import hi from '../i18n/hi.json';
import mr from '../i18n/mr.json';
import te from '../i18n/te.json';
import ta from '../i18n/ta.json';

const translations = {
  en,
  hi,
  mr,
  te,
  ta
};

export const SUPPORTED_LANGUAGES = [
  { code: 'hi', name: 'हिंदी', englishName: 'Hindi', script: 'नमस्ते', flag: '🇮🇳' },
  { code: 'en', name: 'English', englishName: 'English', script: 'Welcome', flag: '🌐' },
  { code: 'mr', name: 'मराठी', englishName: 'Marathi', script: 'नमस्कार', flag: '🚩' },
  { code: 'te', name: 'తెలుగు', englishName: 'Telugu', script: 'నమస్కారం', flag: '🌾' },
  { code: 'ta', name: 'தமிழ்', englishName: 'Tamil', script: 'வணக்கம்', flag: '🏛️' }
];

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [currentLang, setCurrentLang] = useState(() => {
    return localStorage.getItem('sahayak_language') || localStorage.getItem('language') || 'hi';
  });

  const setLanguage = (langCode) => {
    if (translations[langCode]) {
      setCurrentLang(langCode);
      localStorage.setItem('sahayak_language', langCode);
      localStorage.setItem('language', langCode);
    }
  };

  const t = (key, params = {}) => {
    if (!key) return '';
    const keys = key.split('.');
    
    // Check current language
    let result = translations[currentLang];
    for (const k of keys) {
      if (result && typeof result === 'object' && k in result) {
        result = result[k];
      } else {
        result = null;
        break;
      }
    }

    // Fallback to English
    if (!result && result !== '') {
      let fallback = translations['en'];
      for (const k of keys) {
        if (fallback && typeof fallback === 'object' && k in fallback) {
          fallback = fallback[k];
        } else {
          fallback = null;
          break;
        }
      }
      result = fallback !== null ? fallback : key;
    }

    // Interpolate {param} if any
    if (typeof result === 'string' && params && typeof params === 'object') {
      Object.keys(params).forEach(pKey => {
        result = result.replace(new RegExp(`\\{${pKey}\\}`, 'g'), params[pKey]);
      });
    }

    return result || key;
  };

  return (
    <LanguageContext.Provider value={{ 
      currentLang, 
      language: currentLang, 
      setLanguage, 
      t, 
      languages: SUPPORTED_LANGUAGES 
    }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
