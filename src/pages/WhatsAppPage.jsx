import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { useLanguage } from '../context/LanguageContext';
import { MessageCircle, ExternalLink, Sparkles, Smartphone, CheckCircle, Volume2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function WhatsAppPage() {
  const { t } = useLanguage();

  // WhatsApp wa.me link with prefilled helpful prompt
  const whatsappUrl = "https://wa.me/919876543210?text=Namaste%20Sahayak,%20I%20want%20to%20know%20about%20government%20loan%20schemes%20for%20SC%20entrepreneurs";

  return (
    <div className="max-w-2xl mx-auto py-6 sm:py-10 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex p-3 rounded-2xl bg-green-100 dark:bg-green-900/60 text-green-700 dark:text-green-300 shadow-sm mb-1">
          <MessageCircle className="w-8 h-8" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white">
          {t('whatsapp.title') || 'WhatsApp Sahayak Assistant'}
        </h1>
        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 max-w-md mx-auto">
          {t('whatsapp.subtitle') || 'Scan the QR code below or tap to open directly in WhatsApp on your mobile phone.'}
        </p>
      </div>

      {/* QR Code & Tap Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white dark:bg-card-dark rounded-3xl p-6 sm:p-10 shadow-xl border border-green-200 dark:border-green-800 text-center space-y-6"
      >
        <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold uppercase tracking-wider">
          {t('whatsapp.scan_instructions') || 'Point your phone camera at this QR code to start chatting with Sahayak AI on WhatsApp.'}
        </p>

        {/* Live SVG QR Code */}
        <div className="inline-block p-4 sm:p-5 rounded-3xl bg-white shadow-lg border-2 border-green-300 dark:border-green-700">
          <QRCodeSVG
            value={whatsappUrl}
            size={220}
            level="H"
            includeMargin={true}
            fgColor="#15803D"
            imageSettings={{
              src: "https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg",
              x: undefined,
              y: undefined,
              height: 40,
              width: 40,
              excavate: true,
            }}
          />
        </div>

        <div className="relative flex py-1 items-center">
          <div className="flex-grow border-t border-gray-200 dark:border-green-900"></div>
          <span className="flex-shrink mx-4 text-xs font-bold text-gray-400 dark:text-gray-500 uppercase">
            {t('whatsapp.or_tap') || 'or tap below on your mobile'}
          </span>
          <div className="flex-grow border-t border-gray-200 dark:border-green-900"></div>
        </div>

        {/* Big Tap to Open WhatsApp Button */}
        <div>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-4 px-6 rounded-2xl bg-[#25D366] hover:bg-[#20ba5a] text-white font-extrabold text-base shadow-lg shadow-[#25D366]/30 flex items-center justify-center gap-2.5 transition-all hover:scale-[1.01]"
          >
            <MessageCircle className="w-6 h-6 fill-current" />
            <span>{t('whatsapp.open_btn') || 'Open in WhatsApp'}</span>
            <ExternalLink className="w-4 h-4 ml-1" />
          </a>
        </div>
      </motion.div>

      {/* Multi-lingual Voice Notes Capability */}
      <div className="rounded-3xl bg-emerald-50 dark:bg-green-900/30 border border-emerald-200 dark:border-green-800 p-5 sm:p-6 space-y-3">
        <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 font-bold text-sm">
          <Volume2 className="w-5 h-5 text-emerald-600" />
          <span>{t('whatsapp.lang_support_title') || 'Multi-Lingual Voice & Text Support'}</span>
        </div>
        <p className="text-xs text-emerald-900 dark:text-emerald-200 leading-relaxed">
          {t('whatsapp.lang_support_desc') || 'You can send voice notes or text in Hindi, Marathi, Telugu, Tamil, and English.'}
        </p>

        {/* Examples of questions */}
        <div className="pt-2">
          <span className="text-[11px] font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider block mb-2">
            {t('whatsapp.examples_title') || 'Try asking questions like:'}
          </span>
          <div className="space-y-1.5 text-xs text-gray-700 dark:text-gray-300">
            <div className="p-2.5 rounded-xl bg-white/70 dark:bg-green-950/60 border border-emerald-100 dark:border-green-800">
              💬 {t('whatsapp.example1') || '"I want ₹2 Lakhs loan for tailoring shop"'}
            </div>
            <div className="p-2.5 rounded-xl bg-white/70 dark:bg-green-950/60 border border-emerald-100 dark:border-green-800">
              💬 {t('whatsapp.example2') || '"What documents are needed for Stand-Up India scheme?"'}
            </div>
            <div className="p-2.5 rounded-xl bg-white/70 dark:bg-green-950/60 border border-emerald-100 dark:border-green-800">
              💬 {t('whatsapp.example3') || '"मला दुग्ध व्यवसायासाठी कर्ज पाहिजे"'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
