import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import schemesData from '../data/schemes.json';
import { 
  BookOpen, 
  Search, 
  Filter, 
  Sparkles, 
  FileText, 
  ChevronRight, 
  X, 
  Building, 
  Award, 
  IndianRupee,
  CheckCircle,
  ExternalLink
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ExploreSchemesPage() {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [levelFilter, setLevelFilter] = useState('ALL'); // ALL | Central | State
  const [selectedScheme, setSelectedScheme] = useState(null);

  const filteredSchemes = useMemo(() => {
    return schemesData.filter((scheme) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = 
        !q ||
        scheme.name.toLowerCase().includes(q) ||
        scheme.brief_description?.toLowerCase().includes(q) ||
        scheme.ministry?.toLowerCase().includes(q) ||
        scheme.tags?.some(tag => tag.toLowerCase().includes(q));

      const matchesLevel = 
        levelFilter === 'ALL' ||
        (levelFilter === 'Central' && scheme.level === 'Central') ||
        (levelFilter === 'State' && scheme.level !== 'Central');

      return matchesSearch && matchesLevel;
    });
  }, [searchQuery, levelFilter]);

  return (
    <div className="py-6 sm:py-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white flex items-center gap-2.5">
          <BookOpen className="w-8 h-8 text-green-600 dark:text-green-400" />
          <span>{t('explore.title') || 'Explore Government Schemes'}</span>
        </h1>
        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 mt-1">
          {t('explore.subtitle') || 'Comprehensive repository of Central & State schemes for marginalized entrepreneurs.'}
        </p>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t('explore.search_placeholder') || 'Search schemes by name, keyword, or trade (e.g. livestock, women, subsidy, tailoring)...'}
            className="w-full pl-11 pr-4 py-3.5 rounded-2xl border-2 border-green-200 dark:border-green-800 bg-white dark:bg-card-dark text-gray-900 dark:text-white text-sm focus:outline-none focus:border-green-600"
          />
        </div>

        <div className="flex gap-2 shrink-0">
          {[
            { id: 'ALL', label: t('explore.all_levels') || 'All Schemes' },
            { id: 'Central', label: t('explore.central_only') || 'Central' },
            { id: 'State', label: t('explore.state_only') || 'State' }
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setLevelFilter(f.id)}
              className={`px-4 py-3 rounded-2xl text-xs sm:text-sm font-bold border-2 transition-all ${
                levelFilter === f.id
                  ? 'bg-green-600 text-white border-green-600 shadow-sm'
                  : 'bg-white dark:bg-card-dark text-gray-700 dark:text-gray-300 border-green-200 dark:border-green-800 hover:border-green-400'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Schemes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredSchemes.map((scheme, idx) => (
          <motion.div
            key={scheme.id || idx}
            whileHover={{ translateY: -3 }}
            onClick={() => setSelectedScheme(scheme)}
            className="bg-white dark:bg-card-dark p-5 rounded-3xl border border-green-100 dark:border-green-900 shadow-md hover:shadow-xl transition-all cursor-pointer flex flex-col justify-between"
          >
            <div className="space-y-2.5">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-green-100 dark:bg-green-900/60 text-green-800 dark:text-green-300 border border-green-200 dark:border-green-800">
                  {scheme.level || 'Central'} Scheme
                </span>
                <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" /> Verified
                </span>
              </div>

              <h3 className="font-extrabold text-base text-gray-900 dark:text-white line-clamp-2 leading-snug">
                {scheme.name}
              </h3>

              <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1">
                {scheme.ministry || 'Government of India'}
              </p>

              <p className="text-xs text-gray-600 dark:text-gray-300 line-clamp-3 leading-relaxed">
                {scheme.brief_description || scheme.rag_context_text}
              </p>

              {scheme.tags && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {scheme.tags.slice(0, 3).map((tag, tIdx) => (
                    <span key={tIdx} className="text-[10px] bg-gray-100 dark:bg-green-900/30 text-gray-700 dark:text-gray-300 px-2 py-0.5 rounded-md">
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="mt-4 pt-3 border-t border-gray-100 dark:border-green-900 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-gray-400 uppercase font-semibold">Max Assistance</span>
                <p className="text-sm font-black text-green-700 dark:text-green-300">
                  {scheme.baseline_max_cost ? `₹${scheme.baseline_max_cost.toLocaleString('en-IN')}` : 'Project Linked'}
                </p>
              </div>

              <button className="text-xs font-bold text-green-600 dark:text-green-400 hover:underline flex items-center gap-1">
                <span>{t('explore.view_details') || 'Details'}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredSchemes.length === 0 && (
        <div className="p-12 text-center bg-white dark:bg-card-dark rounded-3xl border border-gray-200 dark:border-green-900">
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            {t('explore.no_results') || 'No schemes match your filter. Try clearing the search.'}
          </p>
        </div>
      )}

      {/* Scheme Detail Modal Drawer */}
      <AnimatePresence>
        {selectedScheme && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-card-dark w-full max-w-2xl max-h-[85vh] rounded-3xl shadow-2xl border border-green-200 dark:border-green-800 overflow-hidden flex flex-col"
            >
              {/* Modal Header */}
              <div className="p-6 border-b border-gray-100 dark:border-green-900 flex items-start justify-between gap-4">
                <div>
                  <span className="text-xs font-bold text-green-600 dark:text-green-400 uppercase tracking-wider">
                    {selectedScheme.level} • {selectedScheme.ministry}
                  </span>
                  <h2 className="text-xl font-black text-gray-900 dark:text-white mt-1">
                    {selectedScheme.name}
                  </h2>
                </div>
                <button
                  onClick={() => setSelectedScheme(null)}
                  className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-green-900 text-gray-500"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 overflow-y-auto space-y-5 text-sm">
                <div>
                  <h4 className="font-bold text-gray-900 dark:text-white mb-1">About the Scheme</h4>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-xs sm:text-sm">
                    {selectedScheme.brief_description}
                  </p>
                </div>

                {selectedScheme.conditional_rules && (
                  <div>
                    <h4 className="font-bold text-gray-900 dark:text-white mb-2">Eligibility Criteria</h4>
                    <ul className="space-y-1.5">
                      {selectedScheme.conditional_rules.map((rule, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-xs text-gray-700 dark:text-gray-300">
                          <CheckCircle className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
                          <span>{rule}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {selectedScheme.raw_benefits && (
                  <div className="p-4 rounded-2xl bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800">
                    <h4 className="font-bold text-green-900 dark:text-green-200 mb-1">Key Financial Benefits</h4>
                    <div className="text-xs text-green-950 dark:text-green-100 whitespace-pre-line font-mono">
                      {selectedScheme.raw_benefits.replace(/\\n/g, '\n').slice(0, 500)}...
                    </div>
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="p-4 border-t border-gray-100 dark:border-green-900 flex justify-end gap-3 bg-gray-50 dark:bg-green-950/60">
                <button
                  onClick={() => setSelectedScheme(null)}
                  className="px-5 py-2.5 rounded-2xl border border-gray-300 dark:border-green-800 text-xs font-bold text-gray-700 dark:text-gray-200"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    setSelectedScheme(null);
                    navigate('/schemes');
                  }}
                  className="px-5 py-2.5 rounded-2xl bg-green-600 hover:bg-green-700 text-white text-xs font-extrabold shadow-md flex items-center gap-1.5"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Check My Eligibility for this</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
