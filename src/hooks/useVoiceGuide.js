import { useState, useCallback, useEffect, useRef } from 'react';

const langCodeMap = {
  'en': 'en-IN',
  'hi': 'hi-IN',
  'mr': 'mr-IN',
  'te': 'te-IN',
  'ta': 'ta-IN'
};

export const useVoiceGuide = () => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [currentText, setCurrentText] = useState('');
  const voicesRef = useRef([]);

  useEffect(() => {
    if (!('speechSynthesis' in window)) return;

    const updateVoices = () => {
      voicesRef.current = window.speechSynthesis.getVoices();
    };

    updateVoices();
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = updateVoices;
    }

    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const stop = useCallback(() => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      setCurrentText('');
    }
  }, []);

  const speak = useCallback((text, langCode = 'hi') => {
    if (!('speechSynthesis' in window) || !text) {
      console.warn('Text-to-speech not supported or empty text.');
      return;
    }

    window.speechSynthesis.cancel();
    setIsSpeaking(false);

    const targetLang = langCodeMap[langCode] || `${langCode}-IN`;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = targetLang;
    utterance.rate = 0.95;
    utterance.pitch = 1.0;

    const availableVoices = voicesRef.current.length > 0 
      ? voicesRef.current 
      : window.speechSynthesis.getVoices();
    
    const matchedVoice = availableVoices.find(v => 
      v.lang.toLowerCase() === targetLang.toLowerCase() ||
      v.lang.toLowerCase().startsWith(langCode.toLowerCase())
    );

    if (matchedVoice) {
      utterance.voice = matchedVoice;
    }

    utterance.onstart = () => {
      setIsSpeaking(true);
      setCurrentText(text);
    };

    utterance.onend = () => {
      setIsSpeaking(false);
      setCurrentText('');
    };

    utterance.onerror = (e) => {
      console.warn('SpeechSynthesis error:', e);
      setIsSpeaking(false);
      setCurrentText('');
    };

    setTimeout(() => {
      window.speechSynthesis.speak(utterance);
    }, 50);
  }, []);

  return { speak, stop, isSpeaking, currentText };
};
