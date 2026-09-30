import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, FileSearch, BookOpen, MessageCircle, Building2 } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export default function BottomNav() {
  const { t } = useLanguage();

  const tabs = [
    { to: '/', icon: Home, label: t('nav.home') || 'Home' },
    { to: '/schemes', icon: FileSearch, label: t('nav.schemes') || 'Match' },
    { to: '/explore', icon: BookOpen, label: t('nav.explore') || 'All' },
    { to: '/whatsapp', icon: MessageCircle, label: t('nav.whatsapp') || 'WhatsApp' },
    { to: '/banks', icon: Building2, label: t('nav.banks') || 'Banks' }
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 h-16 bg-white/95 dark:bg-green-950/95 backdrop-blur-md border-t border-green-100 dark:border-green-900 flex items-center justify-around pb-safe shadow-lg">
      {tabs.map((tab) => (
        <NavLink 
          key={tab.to} 
          to={tab.to}
          className={({isActive}) => `flex flex-col items-center justify-center w-full h-full space-y-1 ${
            isActive ? 'text-green-600 dark:text-green-400 font-bold' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
          }`}
        >
          <tab.icon className="w-5 h-5" />
          <span className="text-[10px] tracking-tight">{tab.label}</span>
        </NavLink>
      ))}
    </div>
  );
}
