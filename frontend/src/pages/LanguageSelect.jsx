import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Globe, CheckCircle2, ArrowRight, Leaf } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const LanguageSelect = () => {
  const { LANGUAGES, selectLanguage, language: currentLang, t } = useLanguage();
  const [selected, setSelected] = useState(currentLang);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  const filtered = LANGUAGES.filter(lang =>
    lang.name.toLowerCase().includes(search.toLowerCase()) ||
    lang.nativeName.toLowerCase().includes(search.toLowerCase()) ||
    lang.region.toLowerCase().includes(search.toLowerCase())
  );

  const handleContinue = () => {
    selectLanguage(selected);
    navigate('/');
  };

  const selectedLang = LANGUAGES.find(l => l.code === selected);

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #0f2817 0%, #1a4a28 30%, #0d3320 60%, #071a0f 100%)',
      }}
    >
      {/* Animated background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.07, 0.12, 0.07] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -top-32 -left-32 w-96 h-96 rounded-full"
          style={{ background: 'radial-gradient(circle, #4ade80 0%, transparent 70%)' }}
        />
        <motion.div
          animate={{ scale: [1.2, 1, 1.2], opacity: [0.05, 0.1, 0.05] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
          className="absolute -bottom-32 -right-32 w-[500px] h-[500px] rounded-full"
          style={{ background: 'radial-gradient(circle, #16a34a 0%, transparent 70%)' }}
        />
        <motion.div
          animate={{ y: [0, -20, 0], opacity: [0.03, 0.06, 0.03] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          className="absolute top-1/2 left-1/4 w-64 h-64 rounded-full"
          style={{ background: 'radial-gradient(circle, #86efac 0%, transparent 70%)' }}
        />
      </div>

      {/* Floating leaf particles */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute text-2xl pointer-events-none select-none"
          style={{
            left: `${10 + i * 12}%`,
            top: `${Math.random() * 80 + 10}%`,
          }}
          animate={{
            y: [0, -30, 0],
            rotate: [0, 15, -15, 0],
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{
            duration: 4 + i * 0.5,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: i * 0.4,
          }}
        >
          🌿
        </motion.div>
      ))}

      <div className="relative z-10 w-full max-w-3xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center mb-4">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-2xl"
              style={{ background: 'linear-gradient(135deg, #16a34a, #4ade80)' }}>
              <Globe className="text-white" size={32} />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-3 tracking-tight">
            {t('selectLanguage')}
          </h1>
          <p className="text-green-200/80 text-base md:text-lg font-medium max-w-xl mx-auto leading-relaxed">
            {t('selectSubtitle')}
          </p>
          <p className="text-green-300/60 text-sm mt-2 font-medium">
            भाषा चुनें • ভাষা বেছে নিন • மொழியை தேர்ந்தெடுங்கள் • భాష ఎంచుకోండి
          </p>
        </motion.div>

        {/* Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="rounded-3xl overflow-hidden"
          style={{
            background: 'rgba(255,255,255,0.06)',
            backdropFilter: 'blur(24px)',
            border: '1px solid rgba(255,255,255,0.12)',
            boxShadow: '0 32px 80px rgba(0,0,0,0.4)',
          }}
        >
          {/* Search bar */}
          <div className="p-5 border-b border-white/10">
            <div className="relative">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-green-300/70" />
              <input
                type="text"
                placeholder={t('searchPlaceholder')}
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-11 pr-5 py-3 rounded-2xl text-white placeholder-green-200/40 text-sm font-medium focus:outline-none transition-all"
                style={{
                  background: 'rgba(255,255,255,0.08)',
                  border: '1px solid rgba(255,255,255,0.15)',
                }}
              />
            </div>
          </div>

          {/* Language grid */}
          <div className="p-5 max-h-[420px] overflow-y-auto" style={{ scrollbarWidth: 'thin', scrollbarColor: '#16a34a transparent' }}>
            {filtered.length === 0 ? (
              <div className="text-center py-12 text-green-200/50 font-medium">
                No language found
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <AnimatePresence>
                  {filtered.map((lang, idx) => {
                    const isSelected = selected === lang.code;
                    return (
                      <motion.button
                        key={lang.code}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.2, delay: idx * 0.02 }}
                        onClick={() => setSelected(lang.code)}
                        className="relative p-4 rounded-2xl text-left transition-all duration-200 group"
                        style={{
                          background: isSelected
                            ? 'linear-gradient(135deg, rgba(22,163,74,0.4), rgba(74,222,128,0.2))'
                            : 'rgba(255,255,255,0.05)',
                          border: isSelected
                            ? '1.5px solid rgba(74,222,128,0.6)'
                            : '1.5px solid rgba(255,255,255,0.08)',
                          boxShadow: isSelected ? '0 0 20px rgba(22,163,74,0.2)' : 'none',
                        }}
                        whileHover={{ scale: 1.02, backgroundColor: 'rgba(255,255,255,0.1)' }}
                        whileTap={{ scale: 0.98 }}
                      >
                        {isSelected && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="absolute top-2 right-2 text-green-400"
                          >
                            <CheckCircle2 size={16} fill="currentColor" />
                          </motion.div>
                        )}
                        <div className="mb-2 w-10 h-10 rounded-xl flex items-center justify-center text-xs font-black text-white select-none" style={{ background: 'linear-gradient(135deg, #16a34a, #4ade80)', boxShadow: '0 4px 12px rgba(22,163,74,0.3)' }}>{lang.code === 'en' ? 'EN' : '🇮🇳'}</div>
                        <div className="text-white font-black text-sm leading-tight">{lang.nativeName}</div>
                        <div className="text-green-200/60 text-xs mt-0.5 font-medium">{lang.name}</div>
                        <div className="text-green-300/40 text-[10px] mt-1 leading-tight">{lang.region}</div>
                      </motion.button>
                    );
                  })}
                </AnimatePresence>
              </div>
            )}
          </div>

          {/* Footer / Continue Button */}
          <div className="p-5 border-t border-white/10 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xs font-black text-white" style={{ background: 'linear-gradient(135deg, #16a34a, #4ade80)', boxShadow: '0 4px 12px rgba(22,163,74,0.4)' }}>
                {selectedLang?.code === 'en' ? 'EN' : 'IN'}
              </div>
              <div>
                <div className="text-white font-black text-sm">{selectedLang?.nativeName}</div>
                <div className="text-green-200/60 text-xs">{selectedLang?.name} • {selectedLang?.region}</div>
              </div>
            </div>
            <motion.button
              onClick={handleContinue}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="flex items-center gap-2 px-6 py-3 rounded-2xl font-black text-sm text-white uppercase tracking-wider shadow-lg"
              style={{
                background: 'linear-gradient(135deg, #16a34a, #4ade80)',
                boxShadow: '0 8px 24px rgba(22,163,74,0.4)',
              }}
            >
              {t('continueBtn')}
              <ArrowRight size={18} />
            </motion.button>
          </div>
        </motion.div>

        {/* Branding footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center mt-6 flex items-center justify-center gap-2 text-green-200/40 text-sm"
        >
          <Leaf size={14} />
          <span className="font-bold uppercase tracking-widest">Agro<span className="italic text-green-400">XAI</span></span>
          <span>— Powered by Explainable AI</span>
        </motion.div>
      </div>
    </div>
  );
};

export default LanguageSelect;
