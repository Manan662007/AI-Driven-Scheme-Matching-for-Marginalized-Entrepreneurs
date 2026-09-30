import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage, SUPPORTED_LANGUAGES } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import LanguageSelector from '../components/LanguageSelector';
import { Sun, Moon, Phone, ArrowRight, ShieldCheck, CheckCircle2, Sparkles, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const { currentLang, setLanguage, t } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  // If user has chosen language at least once, hasSelectedLang is true
  const [hasSelectedLang, setHasSelectedLang] = useState(() => {
    return Boolean(localStorage.getItem('sahayak_lang_selected'));
  });

  const [phoneNumber, setPhoneNumber] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);

  const handleSelectLanguageCard = (langCode) => {
    setLanguage(langCode);
    setHasSelectedLang(true);
    localStorage.setItem('sahayak_lang_selected', 'true');
    toast.success(`Language selected: ${SUPPORTED_LANGUAGES.find(l => l.code === langCode)?.name}`);
  };

  const handleSendOtp = (e) => {
    e?.preventDefault();
    if (phoneNumber.length < 10) {
      toast.error('Please enter a valid 10-digit mobile number');
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setOtpSent(true);
      toast.success('OTP sent successfully (Demo: use 123456 or any 6 digits)');
    }, 600);
  };

  const handleOtpChange = (val, index) => {
    if (val.length > 1) val = val[0];
    const newOtp = [...otp];
    newOtp[index] = val;
    setOtp(newOtp);

    // auto focus next box
    if (val && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleVerifyOtp = (e) => {
    e?.preventDefault();
    const fullOtp = otp.join('');
    if (fullOtp.length < 6) {
      toast.error('Please enter all 6 digits');
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      localStorage.setItem('sahayak_logged_in', 'true');
      localStorage.setItem('sahayak_user_phone', phoneNumber);
      toast.success('Welcome to Sahayak!');
      navigate('/');
    }, 500);
  };

  const handleQuickDemoLogin = () => {
    localStorage.setItem('sahayak_logged_in', 'true');
    localStorage.setItem('sahayak_user_phone', '9876543210');
    toast.success('Instant Demo Access Granted!');
    navigate('/');
  };

  return (
    <div className="min-h-screen relative flex flex-col justify-center items-center p-4 bg-gradient-to-br from-green-50 via-emerald-50 to-green-100 dark:from-green-950 dark:via-[#062c19] dark:to-green-900 transition-colors">
      {/* Top Bar with Dropdown (visible only after selecting language) & Theme Toggle */}
      <div className="absolute top-4 right-4 md:top-6 md:right-8 flex items-center gap-3 z-50">
        {hasSelectedLang && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="flex items-center gap-2"
          >
            <LanguageSelector variant="dropdown" />
            <button
              onClick={() => {
                setHasSelectedLang(false);
                localStorage.removeItem('sahayak_lang_selected');
              }}
              className="text-xs text-green-700 dark:text-green-300 hover:underline flex items-center gap-1 bg-white/70 dark:bg-green-900/70 px-2.5 py-1.5 rounded-full border border-green-200 dark:border-green-800 shadow-sm"
              title="Show language cards again"
            >
              <RefreshCw className="w-3 h-3" />
              <span>{t('login.change_language') || 'Languages'}</span>
            </button>
          </motion.div>
        )}

        <button
          onClick={toggleTheme}
          className="p-2.5 rounded-full bg-white/80 dark:bg-green-900/80 text-green-800 dark:text-green-200 border border-green-200 dark:border-green-700 shadow-sm hover:scale-105 transition-all"
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-emerald-700" />}
        </button>
      </div>

      <div className="w-full max-w-xl my-8">
        {/* App Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-6"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-green-600 dark:bg-green-500 text-white shadow-xl shadow-green-600/20 mb-3">
            <span className="text-3xl">🌿</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-green-900 dark:text-green-100 tracking-tight">
            {t('login.title') || 'Sahayak'}
          </h1>
          <p className="text-sm sm:text-base text-green-700 dark:text-green-300 font-medium mt-1">
            {t('login.subtitle') || 'Your Path to Enterprise'}
          </p>
          <div className="inline-block mt-2 px-3 py-1 bg-green-100 dark:bg-green-900/60 rounded-full text-xs font-semibold text-green-800 dark:text-green-200 border border-green-200 dark:border-green-800">
            🏛️ National Portal for Marginalized Entrepreneurs (SC)
          </div>
        </motion.div>

        {/* STEP 1: INITIAL INTERACTIVE LANGUAGE CARDS (Visible when not yet selected) */}
        <AnimatePresence mode="wait">
          {!hasSelectedLang ? (
            <motion.div
              key="lang-cards"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white/90 dark:bg-green-950/80 backdrop-blur-md rounded-3xl p-6 sm:p-8 shadow-2xl border border-green-200 dark:border-green-800"
            >
              <div className="text-center mb-6">
                <span className="text-xs uppercase tracking-wider text-green-600 dark:text-green-400 font-bold">
                  Step 1 • चरण 1
                </span>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mt-1">
                  {t('login.select_language_title') || 'Choose Your Language / अपनी भाषा चुनें'}
                </h2>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 mt-1">
                  {t('login.select_language_subtitle') || 'Select a language to get personalized voice assistance and scheme guidance'}
                </p>
              </div>

              {/* Grid of Language Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {SUPPORTED_LANGUAGES.map((lang) => {
                  const isCurrent = currentLang === lang.code;
                  return (
                    <motion.button
                      key={lang.code}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleSelectLanguageCard(lang.code)}
                      className={`relative flex items-center justify-between p-4 rounded-2xl border-2 text-left transition-all shadow-sm ${
                        isCurrent
                          ? 'border-green-600 bg-green-50 dark:bg-green-900/60 ring-2 ring-green-400'
                          : 'border-green-100 dark:border-green-800/80 bg-white dark:bg-green-900/30 hover:border-green-400 dark:hover:border-green-600 hover:bg-green-50/50'
                      }`}
                    >
                      <div className="flex items-center gap-3.5">
                        <span className="text-3xl">{lang.flag}</span>
                        <div>
                          <p className="font-extrabold text-base text-gray-900 dark:text-white">
                            {lang.name}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                            {lang.englishName} • <span className="text-green-600 dark:text-green-400 font-semibold">{lang.script}</span>
                          </p>
                        </div>
                      </div>

                      <div className={`w-6 h-6 rounded-full flex items-center justify-center border ${
                        isCurrent 
                          ? 'bg-green-600 border-green-600 text-white' 
                          : 'border-gray-300 dark:border-gray-600'
                      }`}>
                        {isCurrent ? <CheckCircle2 className="w-4 h-4" /> : <div className="w-2 h-2 rounded-full bg-gray-300 dark:bg-gray-600" />}
                      </div>
                    </motion.button>
                  );
                })}
              </div>

              <div className="mt-6 pt-4 border-t border-green-100 dark:border-green-800/60 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                <span className="flex items-center gap-1.5 text-green-700 dark:text-green-300 font-medium">
                  <Sparkles className="w-4 h-4 text-green-600" /> Powered by Bhashini AI Translation
                </span>
                <span>You can switch anytime</span>
              </div>
            </motion.div>
          ) : (
            /* STEP 2: PHONE / OTP LOGIN FORM (Shown once language is selected) */
            <motion.div
              key="auth-form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white/95 dark:bg-green-950/90 backdrop-blur-md rounded-3xl p-6 sm:p-8 shadow-2xl border border-green-200 dark:border-green-800"
            >
              {!otpSent ? (
                <form onSubmit={handleSendOtp} className="space-y-5">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
                      {t('login.phone_label') || 'Mobile Number'}
                    </label>
                    <div className="relative flex rounded-2xl shadow-sm border-2 border-green-200 dark:border-green-700 focus-within:border-green-600 dark:focus-within:border-green-400 overflow-hidden bg-white dark:bg-green-900/40">
                      <span className="inline-flex items-center px-4 bg-green-50 dark:bg-green-900/60 border-r border-green-200 dark:border-green-700 text-sm font-bold text-green-900 dark:text-green-200">
                        🇮🇳 +91
                      </span>
                      <input
                        type="tel"
                        maxLength={10}
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                        placeholder={t('login.phone_placeholder') || 'Enter 10-digit mobile number'}
                        className="w-full px-4 py-3.5 bg-transparent text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none text-base font-medium tracking-wide"
                        autoFocus
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading || phoneNumber.length < 10}
                    className="w-full py-4 px-6 rounded-2xl bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white font-bold text-base shadow-lg shadow-green-600/30 flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-[0.99]"
                  >
                    {isLoading ? (
                      <span className="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    ) : (
                      <>
                        <span>{t('login.send_otp') || 'Send OTP'}</span>
                        <ArrowRight className="w-5 h-5" />
                      </>
                    )}
                  </button>
                </form>
              ) : (
                <form onSubmit={handleVerifyOtp} className="space-y-5">
                  <div className="text-center">
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {t('login.enter_otp') || 'Enter 6-digit OTP sent to'}
                    </p>
                    <p className="font-bold text-green-700 dark:text-green-300 text-sm">
                      +91 {phoneNumber}
                    </p>
                  </div>

                  <div className="flex justify-center gap-2 sm:gap-3 my-4">
                    {otp.map((digit, idx) => (
                      <input
                        key={idx}
                        id={`otp-${idx}`}
                        type="text"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpChange(e.target.value, idx)}
                        className="w-11 h-13 sm:w-12 sm:h-14 text-center text-xl font-extrabold rounded-xl border-2 border-green-200 dark:border-green-700 bg-white dark:bg-green-900/50 text-green-900 dark:text-green-100 focus:border-green-600 focus:outline-none focus:ring-2 focus:ring-green-400"
                        autoFocus={idx === 0}
                      />
                    ))}
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-4 px-6 rounded-2xl bg-green-600 hover:bg-green-700 text-white font-bold text-base shadow-lg shadow-green-600/30 flex items-center justify-center gap-2 transition-all hover:scale-[1.01]"
                  >
                    {isLoading ? (
                      <span className="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    ) : (
                      <>
                        <ShieldCheck className="w-5 h-5" />
                        <span>{t('login.verify_login') || 'Verify & Login'}</span>
                      </>
                    )}
                  </button>

                  <div className="text-center">
                    <button
                      type="button"
                      onClick={() => setOtpSent(false)}
                      className="text-xs text-green-700 dark:text-green-400 hover:underline font-semibold"
                    >
                      {t('login.change_phone') || 'Change Phone Number'}
                    </button>
                  </div>
                </form>
              )}

              {/* Quick Demo Access Button */}
              <div className="mt-6 pt-5 border-t border-green-100 dark:border-green-800">
                <button
                  type="button"
                  onClick={handleQuickDemoLogin}
                  className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-bold text-sm shadow-md flex items-center justify-center gap-2 transition-transform hover:scale-[1.01]"
                >
                  <Sparkles className="w-4 h-4 text-yellow-200" />
                  <span>{t('login.quick_demo') || '🚀 Quick Demo Login / Instant Access'}</span>
                </button>
                <p className="text-[11px] text-center text-gray-500 dark:text-gray-400 mt-2">
                  Zero setup required for pitch presentation & evaluation
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer Info */}
      <div className="text-center text-xs text-gray-500 dark:text-gray-400 max-w-md">
        Government of India Welfare Initiative • Stand-Up India & NSFDC Linked Portal
      </div>
    </div>
  );
}
