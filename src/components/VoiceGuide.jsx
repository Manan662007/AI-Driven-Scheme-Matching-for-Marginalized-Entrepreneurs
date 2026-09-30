import React, { useEffect, useState } from 'react';
import { Volume2, VolumeX, Sparkles, X } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useVoiceGuide } from '../hooks/useVoiceGuide';
import { motion, AnimatePresence } from 'framer-motion';

export default function VoiceGuide() {
  const { t, currentLang } = useLanguage();
  const location = useLocation();
  const { isSpeaking, speak, stop, currentText } = useVoiceGuide();
  const [showSpeechBubble, setShowSpeechBubble] = useState(false);

  useEffect(() => {
    stop();
    setShowSpeechBubble(false);
  }, [location.pathname, stop]);

  const getActiveTabScript = () => {
    const path = location.pathname.toLowerCase();
    if (path === '/' || path === '') {
      return t('voice.home');
    } else if (path.startsWith('/schemes')) {
      return t('voice.scheme');
    } else if (path.startsWith('/explore')) {
      return t('voice.explore');
    } else if (path.startsWith('/result')) {
      return t('voice.result');
    } else if (path.startsWith('/whatsapp')) {
      return t('voice.whatsapp');
    } else if (path.startsWith('/banks')) {
      return t('voice.banks');
    } else if (path.startsWith('/login')) {
      return t('voice.login');
    }
    return t('voice.home');
  };

  const handleToggle = () => {
    if (isSpeaking) {
      stop();
      setShowSpeechBubble(false);
    } else {
      const script = getActiveTabScript();
      speak(script, currentLang);
      setShowSpeechBubble(true);
    }
  };

  return (
    <>
      <AnimatePresence>
        {isSpeaking && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="fixed bottom-28 left-6 md:bottom-24 max-w-sm z-50 bg-white/95 dark:bg-green-950/95 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-green-300 dark:border-green-700 text-xs md:text-sm text-green-950 dark:text-green-50 flex items-start gap-3"
          >
            <div className="p-1.5 rounded-full bg-green-100 dark:bg-green-800 text-green-700 dark:text-green-300 shrink-0 animate-pulse">
              <Sparkles size={16} />
            </div>
            <div className="flex-1 pr-2 leading-relaxed">
              <span className="font-bold block text-green-700 dark:text-green-400 mb-0.5">
                🎙️ Scheme Saathi Voice Guide:
              </span>
              {currentText || getActiveTabScript()}
            </div>
            <button
              onClick={() => { stop(); setShowSpeechBubble(false); }}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-1"
              aria-label="Close voice guide"
            >
              <X size={16} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={handleToggle}
        className={`fixed bottom-24 left-6 md:bottom-6 z-50 w-14 h-14 rounded-full shadow-2xl flex items-center justify-center transition-all hover:scale-110 active:scale-95 ${
          isSpeaking 
            ? 'bg-amber-500 hover:bg-amber-600 text-white ring-4 ring-amber-300 animate-pulse' 
            : 'bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-400 text-white ring-2 ring-white/50'
        }`}
        aria-label={isSpeaking ? "Stop voice audio" : "Play voice guide for current tab"}
        title={isSpeaking ? "Stop Voice Guide" : "Listen to current page content"}
      >
        {isSpeaking ? (
          <VolumeX className="w-7 h-7" />
        ) : (
          <Volume2 className="w-7 h-7" />
        )}
      </button>
    </>
  );
}
