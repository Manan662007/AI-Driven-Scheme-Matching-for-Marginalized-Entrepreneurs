import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { Sun, Moon, LogOut } from 'lucide-react';
import LanguageSelector from '../LanguageSelector';
import DigiLockerWidget from '../DigiLockerWidget';

export default function Navbar() {
  const { t } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('sahayak_logged_in');
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('sahayak_lang_selected');
    navigate('/login');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 h-16 backdrop-blur-md bg-white/85 dark:bg-green-950/85 border-b border-green-100 dark:border-green-900 flex items-center justify-between px-4 md:px-8 transition-colors">
      <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
        <span className="text-2xl">🌿</span>
        <span className="font-extrabold text-xl text-green-800 dark:text-green-300 tracking-tight">
          Scheme Saathi
        </span>
      </div>
      
      {/* Desktop Navigation Links */}
      <div className="hidden md:flex space-x-6 items-center">
        <NavLink 
          to="/" 
          className={({isActive}) => `text-sm font-bold transition-colors pb-1 ${
            isActive 
              ? 'text-green-700 dark:text-green-300 border-b-2 border-green-600 dark:border-green-400' 
              : 'text-gray-600 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-300'
          }`}
        >
          {t('nav.home')}
        </NavLink>
        <NavLink 
          to="/schemes" 
          className={({isActive}) => `text-sm font-bold transition-colors pb-1 ${
            isActive 
              ? 'text-green-700 dark:text-green-300 border-b-2 border-green-600 dark:border-green-400' 
              : 'text-gray-600 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-300'
          }`}
        >
          {t('nav.schemes')}
        </NavLink>
        <NavLink 
          to="/explore" 
          className={({isActive}) => `text-sm font-bold transition-colors pb-1 ${
            isActive 
              ? 'text-green-700 dark:text-green-300 border-b-2 border-green-600 dark:border-green-400' 
              : 'text-gray-600 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-300'
          }`}
        >
          {t('nav.explore')}
        </NavLink>
        <NavLink 
          to="/whatsapp" 
          className={({isActive}) => `text-sm font-bold transition-colors pb-1 ${
            isActive 
              ? 'text-green-700 dark:text-green-300 border-b-2 border-green-600 dark:border-green-400' 
              : 'text-gray-600 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-300'
          }`}
        >
          {t('nav.whatsapp')}
        </NavLink>
        <NavLink 
          to="/banks" 
          className={({isActive}) => `text-sm font-bold transition-colors pb-1 ${
            isActive 
              ? 'text-green-700 dark:text-green-300 border-b-2 border-green-600 dark:border-green-400' 
              : 'text-gray-600 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-300'
          }`}
        >
          {t('nav.banks')}
        </NavLink>
      </div>

      {/* Right Controls: DigiLocker Badge, Language Selector, Theme Toggle & Logout */}
      <div className="flex items-center space-x-2.5">
        <DigiLockerWidget variant="button-only" />
        <LanguageSelector variant="dropdown" />
        
        <button 
          type="button"
          onClick={toggleTheme} 
          className="p-2 rounded-full hover:bg-green-100/60 dark:hover:bg-green-900 text-green-800 dark:text-green-200 transition-colors shadow-sm" 
          aria-label="Toggle Theme"
        >
          {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>

        <button
          type="button"
          onClick={handleLogout}
          className="p-2 rounded-full hover:bg-red-50 dark:hover:bg-red-950/40 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 transition-colors"
          title="Logout"
          aria-label="Logout"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </nav>
  );
}
