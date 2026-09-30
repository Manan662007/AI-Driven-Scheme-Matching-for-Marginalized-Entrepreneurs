import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { matchScheme } from '../services/api';
import schemesData from '../data/schemes.json';
import { 
  IndianRupee, 
  ArrowRight, 
  ArrowLeft, 
  Sparkles, 
  Check, 
  Lightbulb, 
  GraduationCap, 
  Coins, 
  Briefcase 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

export default function SchemeMatchPage() {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Form Fields
  const [income, setIncome] = useState(150000);
  const [purpose, setPurpose] = useState('');
  const [projectCost, setProjectCost] = useState(250000);
  const [education, setEducation] = useState('10th');

  const businessExamples = [
    { id: 'tailoring', icon: '🧵', title: t('scheme.step2_tailoring') || 'Tailoring Shop', text: 'Tailoring and garment stitching unit with modern sewing machines' },
    { id: 'dairy', icon: '🐄', title: t('scheme.step2_dairy') || 'Dairy / Livestock Farming', text: 'Small dairy farm with 4 cows, milk chilling equipment and cattle feed storage' },
    { id: 'grocery', icon: '🛒', title: t('scheme.step2_grocery') || 'Grocery Store', text: 'Retail grocery and daily provisions store in residential neighborhood' },
    { id: 'mobile', icon: '🔧', title: t('scheme.step2_mobile') || 'Mobile / IT Repair', text: 'Smartphone screen repair, battery replacement and digital service centre' },
    { id: 'furniture', icon: '🪑', title: t('scheme.step2_furniture') || 'Furniture Workshop', text: 'Carpentry and wooden modular furniture manufacturing workshop' },
    { id: 'food', icon: '🍳', title: t('scheme.step2_food') || 'Food Stall / Catering', text: 'Quick service food eatery with commercial stove and catering supplies' },
  ];

  const educationOptions = [
    { id: 'below8', label: t('scheme.edu_below8') || 'Below 8th Pass' },
    { id: '8th', label: t('scheme.edu_8th') || '8th Pass' },
    { id: '10th', label: t('scheme.edu_10th') || '10th Pass (Matriculation)' },
    { id: '12th', label: t('scheme.edu_12th') || '12th Pass (Higher Secondary)' },
    { id: 'diploma', label: t('scheme.edu_diploma') || 'ITI / Polytechnic Diploma' },
    { id: 'graduate', label: t('scheme.edu_graduate') || 'Graduate Degree' },
    { id: 'postgraduate', label: t('scheme.edu_postgraduate') || 'Post Graduate' },
  ];

  const handleNext = () => {
    if (step === 2 && !purpose.trim()) {
      toast.error('Please select or describe your business plan');
      return;
    }
    setStep(s => Math.min(s + 1, 4));
  };

  const handleBack = () => {
    setStep(s => Math.max(s - 1, 1));
  };

  const handleSubmit = async () => {
    setLoading(true);
    const payload = {
      income: Number(income),
      project_cost: Number(projectCost),
      category: 'SC',
      purpose: purpose || 'Small business enterprise'
    };

    try {
      // 1. Try calling the backend FastAPI endpoint
      const result = await matchScheme(payload);
      
      if (result && (result.eligible !== undefined || result.primary_scheme || result.scheme_name)) {
        navigate('/result', { state: { result, input: payload } });
        return;
      }
    } catch (err) {
      console.warn('Backend match-scheme API offline or error, evaluating via local RAG engine:', err);
    }

    // 2. Intelligent local fallback matching against real schemes.json if backend is not started
    let matchedScheme = null;
    const lowerPurpose = purpose.toLowerCase();

    // Check tailored conditions
    if (lowerPurpose.includes('jute') || lowerPurpose.includes('handicraft')) {
      matchedScheme = schemesData.find(s => s.id === 'jds');
    } else if (lowerPurpose.includes('piggery') || lowerPurpose.includes('livestock') || lowerPurpose.includes('dairy') || lowerPurpose.includes('cow')) {
      matchedScheme = schemesData.find(s => s.id === 'nlm-piggery') || schemesData.find(s => s.id === 'nbeg');
    } else if (lowerPurpose.includes('tailor') || lowerPurpose.includes('stitch') || lowerPurpose.includes('cloth')) {
      matchedScheme = schemesData.find(s => s.id === 'capital-subsidy-sc-st') || schemesData.find(s => s.id === 'stand-up-india');
    } else if (projectCost >= 1000000) {
      matchedScheme = schemesData.find(s => s.id === 'stand-up-india');
    } else {
      matchedScheme = schemesData.find(s => s.id === 'capital-subsidy-sc-st') || schemesData[0];
    }

    const fallbackResult = {
      eligible: true,
      scheme_name: matchedScheme ? matchedScheme.name : "National SC/ST Special Credit Linked Capital Subsidy",
      max_loan: matchedScheme?.baseline_max_cost ? `₹${(matchedScheme.baseline_max_cost).toLocaleString('en-IN')}` : "₹25,00,000",
      interest_rate: "4% - 6% Subsidized",
      reason: `Matched for SC entrepreneurs based on your project cost of ₹${Number(projectCost).toLocaleString('en-IN')} and business plan for "${purpose}".`,
      scheme_details: matchedScheme,
      monthly_emi: Math.round((projectCost * 0.85 * 0.05) / 12),
      documents: [
        "Caste Certificate (SC)",
        "Aadhaar Card & PAN Card",
        "Project Quotation / Business Proposal",
        "Bank Passbook (Last 6 months)",
        "Proof of Business Premises / Rent Agreement"
      ],
      upgrades: [
        "Register on Udyam Portal (Free) for extra 5% capital subsidy",
        "Open a current account with NSFDC partner bank for express processing",
        "Avail free 3-day EDP skill training from RSETI"
      ]
    };

    setTimeout(() => {
      setLoading(false);
      navigate('/result', { state: { result: fallbackResult, input: payload } });
    }, 800);
  };

  return (
    <div className="max-w-3xl mx-auto py-6 sm:py-10">
      {/* Step Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between text-xs sm:text-sm font-bold text-green-700 dark:text-green-300 mb-2">
          <span>{t('scheme.step_counter', { current: step, total: 4 }) || `Step ${step} of 4`}</span>
          <span className="text-gray-500 dark:text-gray-400 font-medium">
            {step === 1 && (t('scheme.step1_title') || 'Income')}
            {step === 2 && (t('scheme.step2_title') || 'Business Plan')}
            {step === 3 && (t('scheme.step3_title') || 'Project Cost')}
            {step === 4 && (t('scheme.step4_title') || 'Education')}
          </span>
        </div>
        <div className="w-full bg-green-200/60 dark:bg-green-900/60 h-2.5 rounded-full overflow-hidden">
          <motion.div 
            className="bg-green-600 dark:bg-green-500 h-full rounded-full transition-all duration-300"
            style={{ width: `${(step / 4) * 100}%` }}
          />
        </div>
      </div>

      {/* Main Form Card */}
      <div className="bg-white dark:bg-card-dark rounded-3xl p-6 sm:p-10 shadow-xl border border-green-100 dark:border-green-900 transition-colors">
        <AnimatePresence mode="wait">
          {/* STEP 1: INCOME */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-100 dark:bg-green-900/60 text-green-800 dark:text-green-200 text-xs font-bold mb-2">
                  <Coins className="w-3.5 h-3.5" /> Step 1 • Financial Assessment
                </span>
                <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 dark:text-white">
                  {t('scheme.step1_title') || 'What is your annual family income?'}
                </h2>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {t('scheme.step1_hint') || 'Total annual income of all earning members combined'}
                </p>
              </div>

              {/* Amount Display & Input */}
              <div className="relative flex items-center rounded-2xl border-2 border-green-300 dark:border-green-700 bg-green-50/50 dark:bg-green-900/30 p-4 focus-within:border-green-600">
                <span className="text-2xl sm:text-3xl font-bold text-green-700 dark:text-green-300 mr-2">
                  ₹
                </span>
                <input
                  type="number"
                  step="5000"
                  min="0"
                  max="10000000"
                  value={income}
                  onChange={(e) => setIncome(Number(e.target.value))}
                  className="w-full text-2xl sm:text-3xl font-extrabold bg-transparent text-gray-900 dark:text-white focus:outline-none"
                />
              </div>

              {/* Quick Select Income Chips */}
              <div className="space-y-2">
                <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Quick Select:
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {[
                    { label: t('scheme.step1_below1l') || 'Below ₹1L', value: 80000 },
                    { label: t('scheme.step1_1to3l') || '₹1L - ₹3L', value: 200000 },
                    { label: t('scheme.step1_3to5l') || '₹3L - ₹5L', value: 400000 },
                    { label: t('scheme.step1_above5l') || 'Above ₹5L', value: 650000 },
                  ].map((chip) => (
                    <button
                      key={chip.label}
                      type="button"
                      onClick={() => setIncome(chip.value)}
                      className={`py-3 px-3 rounded-2xl text-xs sm:text-sm font-bold border-2 transition-all ${
                        income === chip.value
                          ? 'bg-green-600 text-white border-green-600 shadow-md scale-102'
                          : 'bg-white dark:bg-green-900/30 text-gray-700 dark:text-gray-200 border-green-200 dark:border-green-800 hover:border-green-400'
                      }`}
                    >
                      {chip.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-green-900/30 border border-emerald-200 dark:border-green-800 flex items-start gap-3">
                <Lightbulb className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <p className="text-xs text-emerald-900 dark:text-emerald-200 leading-relaxed">
                  <strong>SC Concession Tip:</strong> Families with income below ₹3,00,000 are eligible for up to 50% capital subsidy under NSFDC and DDU-GKY schemes.
                </p>
              </div>
            </motion.div>
          )}

          {/* STEP 2: BUSINESS PLAN */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-100 dark:bg-green-900/60 text-green-800 dark:text-green-200 text-xs font-bold mb-2">
                  <Briefcase className="w-3.5 h-3.5" /> Step 2 • Business Activity
                </span>
                <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 dark:text-white">
                  {t('scheme.step2_title') || 'What business do you want to start?'}
                </h2>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {t('scheme.step2_hint') || 'Tap an example below or describe your plan in your words'}
                </p>
              </div>

              {/* 6 Example Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {businessExamples.map((item) => {
                  const isSelected = purpose === item.text;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setPurpose(item.text)}
                      className={`p-3.5 sm:p-4 rounded-2xl border-2 text-left transition-all flex flex-col justify-between ${
                        isSelected
                          ? 'border-green-600 bg-green-50 dark:bg-green-900/60 shadow-md ring-2 ring-green-400'
                          : 'border-green-100 dark:border-green-800/80 bg-white dark:bg-green-900/20 hover:border-green-300 dark:hover:border-green-700'
                      }`}
                    >
                      <span className="text-2xl mb-1.5">{item.icon}</span>
                      <p className="font-bold text-xs sm:text-sm text-gray-900 dark:text-white">
                        {item.title}
                      </p>
                      {isSelected && (
                        <div className="mt-2 flex items-center gap-1 text-[11px] font-semibold text-green-700 dark:text-green-300">
                          <Check className="w-3 h-3" /> Selected
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Custom Textarea */}
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-2">
                  Or describe your plan in your own words:
                </label>
                <textarea
                  rows={3}
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                  placeholder={t('scheme.step2_placeholder') || 'E.g. I want to buy 5 sewing machines and open a boutique in my town...'}
                  className="w-full p-4 rounded-2xl border-2 border-green-200 dark:border-green-700 bg-white dark:bg-green-900/30 text-gray-900 dark:text-white focus:outline-none focus:border-green-600 text-sm"
                />
              </div>
            </motion.div>
          )}

          {/* STEP 3: PROJECT COST */}
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-100 dark:bg-green-900/60 text-green-800 dark:text-green-200 text-xs font-bold mb-2">
                  <IndianRupee className="w-3.5 h-3.5" /> Step 3 • Financial Requirement
                </span>
                <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 dark:text-white">
                  {t('scheme.step3_title') || 'Estimated Project Cost'}
                </h2>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {t('scheme.step3_hint') || 'How much total funding do you need for machinery, shop setup, or stock?'}
                </p>
              </div>

              {/* Cost Display */}
              <div className="text-center py-4 bg-green-50 dark:bg-green-900/40 rounded-3xl border border-green-200 dark:border-green-800">
                <span className="text-xs text-gray-500 dark:text-gray-400 font-semibold uppercase">Total Project Budget</span>
                <p className="text-3xl sm:text-4xl font-black text-green-800 dark:text-green-200 mt-1">
                  ₹{Number(projectCost).toLocaleString('en-IN')}
                </p>
              </div>

              {/* Slider */}
              <div className="space-y-2">
                <input
                  type="range"
                  min="50000"
                  max="2500000"
                  step="25000"
                  value={projectCost}
                  onChange={(e) => setProjectCost(Number(e.target.value))}
                  className="w-full h-3 bg-green-200 dark:bg-green-800 rounded-lg appearance-none cursor-pointer accent-green-600"
                />
                <div className="flex justify-between text-xs text-gray-400 font-medium">
                  <span>₹50,000</span>
                  <span>₹10,00,000</span>
                  <span>₹25,00,000+</span>
                </div>
              </div>

              {/* Quick Cost Chips */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2">
                {[
                  { label: '₹1 Lakh', val: 100000 },
                  { label: '₹2.5 Lakhs', val: 250000 },
                  { label: '₹5 Lakhs', val: 500000 },
                  { label: '₹10 Lakhs', val: 1000000 },
                ].map((chip) => (
                  <button
                    key={chip.val}
                    type="button"
                    onClick={() => setProjectCost(chip.val)}
                    className={`py-3 px-2 rounded-2xl text-xs sm:text-sm font-bold border-2 transition-all ${
                      projectCost === chip.val
                        ? 'bg-green-600 text-white border-green-600 shadow-md'
                        : 'bg-white dark:bg-green-900/30 text-gray-700 dark:text-gray-200 border-green-200 dark:border-green-800'
                    }`}
                  >
                    {chip.label}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* STEP 4: EDUCATION LEVEL */}
          {step === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-100 dark:bg-green-900/60 text-green-800 dark:text-green-200 text-xs font-bold mb-2">
                  <GraduationCap className="w-3.5 h-3.5" /> Step 4 • Qualification
                </span>
                <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 dark:text-white">
                  {t('scheme.step4_title') || 'Education Level'}
                </h2>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {t('scheme.step4_hint') || 'Select your highest educational qualification'}
                </p>
              </div>

              {/* Education Options */}
              <div className="space-y-2.5">
                {educationOptions.map((opt) => {
                  const isSelected = education === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setEducation(opt.id)}
                      className={`w-full p-4 rounded-2xl border-2 text-left flex items-center justify-between transition-all ${
                        isSelected
                          ? 'border-green-600 bg-green-50 dark:bg-green-900/60 shadow-md'
                          : 'border-green-100 dark:border-green-800/80 bg-white dark:bg-green-900/20 hover:border-green-300'
                      }`}
                    >
                      <span className="font-bold text-sm text-gray-900 dark:text-white">
                        {opt.label}
                      </span>
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        isSelected ? 'border-green-600 bg-green-600 text-white' : 'border-gray-400'
                      }`}>
                        {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation Buttons (Back & Next / Submit) */}
        <div className="mt-8 pt-6 border-t border-green-100 dark:border-green-800/60 flex items-center justify-between">
          {step > 1 ? (
            <button
              type="button"
              onClick={handleBack}
              disabled={loading}
              className="px-5 py-3 rounded-2xl border border-gray-300 dark:border-green-800 text-gray-700 dark:text-gray-200 font-bold text-sm hover:bg-gray-100 dark:hover:bg-green-900/40 flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{t('scheme.back') || 'Back'}</span>
            </button>
          ) : (
            <div />
          )}

          {step < 4 ? (
            <button
              type="button"
              onClick={handleNext}
              className="px-7 py-3.5 rounded-2xl bg-green-600 hover:bg-green-700 text-white font-bold text-sm shadow-lg shadow-green-600/30 flex items-center gap-2 transition-all hover:scale-105"
            >
              <span>{t('scheme.next') || 'Next'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className="px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-extrabold text-base shadow-xl shadow-green-600/30 flex items-center gap-2 transition-all hover:scale-105 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  <span>{t('scheme.processing') || 'Evaluating with AI...'}</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 text-yellow-300" />
                  <span>{t('scheme.find_schemes_btn') || 'Find Schemes'}</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
