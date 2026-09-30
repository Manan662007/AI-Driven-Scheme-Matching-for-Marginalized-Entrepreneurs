import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { 
  FileSearch, 
  MessageSquare, 
  MessageCircle, 
  Building2, 
  BookOpen, 
  ArrowRight, 
  CheckCircle, 
  TrendingUp, 
  Sparkles,
  Award
} from 'lucide-react';
import { motion } from 'framer-motion';
import DigiLockerWidget from '../components/DigiLockerWidget';

export default function HomePage() {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const cards = [
    {
      title: t('home.find_schemes') || 'Find Schemes',
      desc: t('home.find_schemes_desc') || '4-step easy eligibility check with subsidy recommendations.',
      icon: FileSearch,
      color: 'from-emerald-500 to-green-600',
      tag: '⭐ AI Powered',
      action: () => navigate('/schemes')
    },
    {
      title: t('home.explore_schemes') || 'Browse All Schemes',
      desc: t('home.explore_schemes_desc') || 'Search 15+ verified Central & State government schemes for SC business.',
      icon: BookOpen,
      color: 'from-teal-500 to-emerald-600',
      tag: '📚 15+ Schemes',
      action: () => navigate('/explore')
    },
    {
      title: t('home.whatsapp_bot') || 'WhatsApp Bot',
      desc: t('home.whatsapp_bot_desc') || 'Scan QR to get instant guidance on your mobile WhatsApp.',
      icon: MessageCircle,
      color: 'from-green-600 to-emerald-700',
      tag: '📱 24/7 Mobile',
      action: () => navigate('/whatsapp')
    },
    {
      title: t('home.nearby_banks') || 'Nearby Banks & Map',
      desc: t('home.nearby_banks_desc') || 'Find healthy partner banks and get live navigation routes.',
      icon: Building2,
      color: 'from-emerald-600 to-teal-700',
      tag: '🗺️ Live GPS',
      action: () => navigate('/banks')
    }
  ];

  return (
    <div className="py-6 space-y-8">
      {/* Welcome Hero Banner */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-green-700 via-emerald-800 to-green-900 text-white p-6 sm:p-10 shadow-xl"
      >
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-semibold text-green-100 border border-white/20">
            <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
            <span>National SC/ST Hub & NSFDC Partner</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            {t('home.greeting') || 'Namaste, Entrepreneur 🙏'}
          </h1>

          <p className="text-sm sm:text-base text-green-100 leading-relaxed font-normal">
            {t('home.tagline') || 'Empowering SC entrepreneurs with verified government welfare loans, subsidies, and schemes.'}
          </p>

          <div className="pt-2 flex flex-wrap gap-3">
            <button
              onClick={() => navigate('/schemes')}
              className="px-5 py-3 rounded-2xl bg-white text-green-800 hover:bg-green-50 font-bold text-sm shadow-md flex items-center gap-2 transition-all hover:scale-105"
            >
              <span>{t('home.find_schemes') || 'Check Eligibility'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => navigate('/explore')}
              className="px-5 py-3 rounded-2xl bg-green-600/50 hover:bg-green-600/70 border border-white/20 text-white font-semibold text-sm backdrop-blur-md transition-all"
            >
              <span>{t('home.explore_schemes') || 'Explore Directory'}</span>
            </button>
          </div>
        </div>

        {/* Decorative background glow */}
        <div className="absolute -right-10 -bottom-10 w-64 h-64 rounded-full bg-green-500/20 blur-3xl pointer-events-none" />
        <div className="absolute right-10 top-1/2 -translate-y-1/2 hidden lg:block opacity-20">
          <Award className="w-60 h-60 text-white" />
        </div>
      </motion.div>

      {/* 4 Core Action Cards */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <span>⚡ Quick Actions</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {cards.map((card, idx) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.08 }}
              whileHover={{ scale: 1.02, translateY: -3 }}
              whileTap={{ scale: 0.98 }}
              onClick={card.action}
              className="group cursor-pointer p-6 rounded-3xl bg-white dark:bg-card-dark border border-green-100 dark:border-green-900 shadow-md hover:shadow-xl transition-all relative overflow-hidden"
            >
              <div className="flex items-start justify-between">
                <div className={`p-4 rounded-2xl bg-gradient-to-br ${card.color} text-white shadow-md`}>
                  <card.icon className="w-7 h-7" />
                </div>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-green-50 dark:bg-green-900/60 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-800">
                  {card.tag}
                </span>
              </div>

              <div className="mt-4 space-y-1.5">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors flex items-center justify-between">
                  <span>{card.title}</span>
                  <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all text-green-600" />
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                  {card.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* DigiLocker Document Verification & Active Assistance Banner */}
      <DigiLockerWidget variant="card" />

      {/* Welfare Impact Stats Banner */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="rounded-3xl bg-emerald-50 dark:bg-green-950/60 border border-emerald-200 dark:border-green-800/80 p-6 sm:p-8"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-xl bg-green-600 text-white">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-base sm:text-lg text-green-950 dark:text-green-100">
              {t('home.banner_title') || 'National SC/ST Hub & Stand-Up India Support'}
            </h3>
            <p className="text-xs sm:text-sm text-green-800 dark:text-green-300">
              {t('home.banner_desc') || 'Special government provisions offer up to 90% project cost loans with capital subsidies and 4-6% interest rates for SC business owners.'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-emerald-200/60 dark:border-green-800/60">
          <div className="text-center p-3 rounded-2xl bg-white/60 dark:bg-green-900/30">
            <span className="text-2xl font-black text-green-700 dark:text-green-300">₹10L - ₹1Cr</span>
            <p className="text-[11px] text-gray-600 dark:text-gray-400 font-medium mt-0.5">Stand-Up India Loans</p>
          </div>
          <div className="text-center p-3 rounded-2xl bg-white/60 dark:bg-green-900/30">
            <span className="text-2xl font-black text-emerald-700 dark:text-emerald-300">4% - 6%</span>
            <p className="text-[11px] text-gray-600 dark:text-gray-400 font-medium mt-0.5">Concessional Interest</p>
          </div>
          <div className="text-center p-3 rounded-2xl bg-white/60 dark:bg-green-900/30">
            <span className="text-2xl font-black text-teal-700 dark:text-teal-300">Up to 50%</span>
            <p className="text-[11px] text-gray-600 dark:text-gray-400 font-medium mt-0.5">Capital Machinery Subsidy</p>
          </div>
          <div className="text-center p-3 rounded-2xl bg-white/60 dark:bg-green-900/30">
            <span className="text-2xl font-black text-green-800 dark:text-green-200">100% Free</span>
            <p className="text-[11px] text-gray-600 dark:text-gray-400 font-medium mt-0.5">Application & Mentorship</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
