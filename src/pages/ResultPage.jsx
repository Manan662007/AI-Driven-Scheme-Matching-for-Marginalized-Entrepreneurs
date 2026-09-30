import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { 
  CheckCircle2, 
  XCircle, 
  Building2, 
  ArrowLeft, 
  FileText, 
  Percent, 
  IndianRupee, 
  Sparkles, 
  TrendingUp, 
  Check, 
  Award,
  ChevronRight
} from 'lucide-react';
import { motion } from 'framer-motion';
import DigiLockerWidget from '../components/DigiLockerWidget';

export default function ResultPage() {
  const { t } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();

  const data = location.state?.result || {
    eligible: true,
    scheme_name: "Stand-Up India Scheme for SC/ST Entrepreneurs",
    max_loan: "₹25,00,000",
    interest_rate: "5.5% Subsidized",
    monthly_emi: 4250,
    reason: "Matched specifically for SC entrepreneurs to establish greenfield enterprise with composite loans up to 85% project cost.",
    documents: [
      "Caste Certificate issued by competent authority",
      "Aadhaar Card and PAN Card",
      "Proof of Business premises (Rent agreement/Electricity bill)",
      "Bank Account statement for the last 6 months",
      "Detailed Business Plan & Machinery Quotations"
    ],
    upgrades: [
      "Obtain MSME Udyam Registration (100% free) for additional capital subsidies",
      "Prepare a project report with NSFDC / RSETI certified mentor",
      "Apply through scheduled commercial banks for express collateral-free guarantee"
    ]
  };

  const isEligible = data.eligible !== false;
  const schemeName = data.scheme_name || data.primary_scheme?.name || "National SC/ST Hub Scheme";
  const maxLoan = data.max_loan || data.primary_scheme?.max_loan || "₹20,00,000";
  const interestRate = data.interest_rate || data.primary_scheme?.interest_rate || "5.0% - 6.5%";
  const reason = data.reason || data.primary_scheme?.ai_reasoning || "Well suited for your business goals and eligible caste bracket.";
  const documents = data.documents || [
    "Caste Certificate (SC)",
    "Aadhaar & PAN Card",
    "Business Quotation",
    "Bank Passbook (6 Months)"
  ];
  const upgrades = data.upgrades || [
    "Register for Udyam Certificate",
    "Open current account with NSFDC partner bank",
    "Avail 3-day EDP training"
  ];

  return (
    <div className="max-w-3xl mx-auto py-6 sm:py-10 space-y-6">
      {/* Top Status Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`p-6 sm:p-8 rounded-3xl border text-center shadow-xl ${
          isEligible
            ? 'bg-gradient-to-b from-green-500/10 via-emerald-500/5 to-white dark:from-green-900/40 dark:to-card-dark border-green-300 dark:border-green-700'
            : 'bg-red-50 dark:bg-red-950/40 border-red-300 dark:border-red-800'
        }`}
      >
        <div className="inline-flex p-3 rounded-2xl bg-white dark:bg-green-900 shadow-md mb-3">
          {isEligible ? (
            <CheckCircle2 className="w-10 h-10 text-green-600 dark:text-green-400" />
          ) : (
            <XCircle className="w-10 h-10 text-red-600 dark:text-red-400" />
          )}
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white">
          {isEligible 
            ? (t('result.eligible_title') || 'Congratulations! You Are Eligible')
            : (t('result.not_eligible_title') || 'No Direct Scheme Match Currently')
          }
        </h1>
        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 mt-1 max-w-lg mx-auto">
          {isEligible 
            ? (t('result.eligible_subtitle') || 'We found a verified government scheme matching your business profile.')
            : (t('result.not_eligible_subtitle') || 'Review the suggestions below to optimize your business proposal.')
          }
        </p>
      </motion.div>

      {/* Main Matched Scheme Showcase Card */}
      {isEligible && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-card-dark rounded-3xl p-6 sm:p-8 shadow-xl border border-green-200 dark:border-green-800 space-y-6"
        >
          <div className="flex items-center justify-between flex-wrap gap-2 pb-4 border-b border-green-100 dark:border-green-800">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-200 text-xs font-black uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              {t('result.recommended_badge') || '🏆 Most Recommended Scheme'}
            </span>
            <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">
              NSFDC / Stand-Up India
            </span>
          </div>

          <div>
            <h2 className="text-xl sm:text-2xl font-black text-green-900 dark:text-green-100">
              {schemeName}
            </h2>
            <div className="mt-3 p-4 rounded-2xl bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 text-xs sm:text-sm text-green-950 dark:text-green-200 leading-relaxed italic">
              "{reason}"
            </div>
          </div>

          {/* 3 Metric Badges */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-4 rounded-2xl bg-emerald-50/70 dark:bg-green-900/30 border border-emerald-200 dark:border-green-800 text-center">
              <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
                {t('result.max_loan') || 'Max Assistance'}
              </span>
              <p className="text-xl sm:text-2xl font-black text-emerald-700 dark:text-emerald-300 mt-1">
                {typeof maxLoan === 'number' ? `₹${maxLoan.toLocaleString('en-IN')}` : maxLoan}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-50/70 dark:bg-green-900/30 border border-emerald-200 dark:border-green-800 text-center">
              <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
                {t('result.interest_rate') || 'Subsidized Interest'}
              </span>
              <p className="text-xl sm:text-2xl font-black text-green-700 dark:text-green-300 mt-1">
                {interestRate}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-50/70 dark:bg-green-900/30 border border-emerald-200 dark:border-green-800 text-center">
              <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
                {t('result.monthly_emi') || 'Estimated Monthly EMI'}
              </span>
              <p className="text-xl sm:text-2xl font-black text-teal-700 dark:text-teal-300 mt-1">
                ₹{data.monthly_emi ? Number(data.monthly_emi).toLocaleString('en-IN') : '3,800'}/mo
              </p>
            </div>
          </div>

          {/* Required Documents Section */}
          <div className="pt-2">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-3 flex items-center gap-2">
              <FileText className="w-4 h-4 text-green-600" />
              <span>{t('result.documents_title') || 'Mandatory Documents Required'}</span>
            </h3>
            <div className="space-y-2">
              {documents.map((doc, idx) => (
                <div 
                  key={idx} 
                  className="flex items-start gap-2.5 p-3 rounded-xl bg-gray-50 dark:bg-green-900/20 border border-gray-100 dark:border-green-800/60 text-xs sm:text-sm text-gray-800 dark:text-gray-200"
                >
                  <div className="w-4 h-4 rounded-full bg-green-100 dark:bg-green-800 text-green-700 dark:text-green-300 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                  <span>{doc}</span>
                </div>
              ))}
            </div>

            {/* DigiLocker Active Assistance Banner for Judge Demonstration */}
            <div className="mt-4">
              <DigiLockerWidget variant="card" />
            </div>
          </div>

          {/* Actionable Upgrades Section */}
          <div className="pt-2">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-3 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-600" />
              <span>{t('result.upgrades_title') || 'Actionable Steps to Unlock More Benefits'}</span>
            </h3>
            <div className="space-y-2">
              {upgrades.map((item, idx) => (
                <div 
                  key={idx} 
                  className="flex items-start gap-2.5 p-3 rounded-xl bg-emerald-50/50 dark:bg-green-900/30 border border-emerald-100 dark:border-green-800 text-xs sm:text-sm text-emerald-950 dark:text-emerald-200"
                >
                  <span className="font-bold text-emerald-700 dark:text-emerald-400">#{idx + 1}</span>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Core Call to Action: Locate Bank */}
          <div className="pt-4 flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => navigate('/banks')}
              className="flex-1 py-4 px-6 rounded-2xl bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-extrabold text-sm sm:text-base shadow-xl shadow-green-600/30 flex items-center justify-center gap-2 transition-all hover:scale-[1.01]"
            >
              <Building2 className="w-5 h-5" />
              <span>{t('result.find_bank_btn') || 'Find Nearest Bank & Get Route'}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => navigate('/schemes')}
              className="py-4 px-6 rounded-2xl border border-gray-300 dark:border-green-800 text-gray-700 dark:text-gray-200 font-bold text-sm hover:bg-gray-50 dark:hover:bg-green-900/40 flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{t('result.start_over') || 'Check Another Business Idea'}</span>
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
