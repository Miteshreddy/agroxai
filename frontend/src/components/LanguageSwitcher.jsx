import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, ChevronDown, Check, Search } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useNavigate } from 'react-router-dom';

const LanguageSwitcher = ({ compact = false }) => {
  const { currentLanguage, LANGUAGES, selectLanguage, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const filtered = LANGUAGES.filter(lang =>
    lang.name.toLowerCase().includes(search.toLowerCase()) ||
    lang.nativeName.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
        setSearch('');
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (code) => {
    selectLanguage(code);
    setIsOpen(false);
    setSearch('');
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        title={t('changeLanguage')}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all duration-200 font-bold text-xs"
        style={{
          background: isOpen ? 'rgba(22,163,74,0.12)' : 'rgba(22,163,74,0.06)',
          border: '1.5px solid rgba(22,163,74,0.2)',
          color: '#16a34a',
        }}
      >
        <Globe size={15} />
        {!compact && (
          <span className="hidden sm:block max-w-[60px] truncate">{currentLanguage.nativeName}</span>
        )}
        <span className="text-[10px] font-black px-1 py-0.5 rounded-md text-white" style={{ background: 'linear-gradient(135deg,#16a34a,#4ade80)' }}>
          {currentLanguage.code === 'en' ? 'EN' : 'IN'}
        </span>
        <ChevronDown
          size={13}
          className="transition-transform duration-200"
          style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.96 }}
            transition={{ duration: 0.18 }}
            className="absolute right-0 mt-2 w-72 rounded-2xl overflow-hidden z-[200] shadow-2xl"
            style={{
              background: 'rgba(255,255,255,0.97)',
              backdropFilter: 'blur(16px)',
              border: '1px solid rgba(22,163,74,0.15)',
              boxShadow: '0 20px 60px rgba(0,0,0,0.18)',
            }}
          >
            {/* Header */}
            <div className="px-4 py-3 border-b border-green-100 flex items-center gap-2">
              <Globe size={16} className="text-green-600" />
              <span className="text-xs font-black text-gray-600 uppercase tracking-widest">{t('changeLanguage')}</span>
            </div>

            {/* Search */}
            <div className="px-3 py-2 border-b border-green-50">
              <div className="relative">
                <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  autoFocus
                  placeholder={t('searchPlaceholder')}
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 text-xs rounded-xl bg-gray-50 border border-gray-100 focus:outline-none focus:border-green-300 font-medium text-gray-700 placeholder-gray-400"
                />
              </div>
            </div>

            {/* Language List */}
            <div className="max-h-64 overflow-y-auto py-1" style={{ scrollbarWidth: 'thin', scrollbarColor: '#16a34a transparent' }}>
              {filtered.length === 0 ? (
                <div className="text-center py-6 text-gray-400 text-xs font-medium">No language found</div>
              ) : (
                filtered.map(lang => {
                  const isActive = lang.code === currentLanguage.code;
                  return (
                    <button
                      key={lang.code}
                      onClick={() => handleSelect(lang.code)}
                      className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-green-50 transition-colors text-left group"
                    >
                      <span className="w-8 h-8 flex-shrink-0 rounded-lg flex items-center justify-center text-[10px] font-black text-white" style={{ background: 'linear-gradient(135deg,#16a34a,#4ade80)' }}>
                        {lang.code === 'en' ? 'EN' : 'IN'}
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-black text-gray-800 leading-tight">{lang.nativeName}</div>
                        <div className="text-[10px] text-gray-400 font-medium">{lang.name} • {lang.region}</div>
                      </div>
                      {isActive && (
                        <Check size={15} className="text-green-500 flex-shrink-0" strokeWidth={3} />
                      )}
                    </button>
                  );
                })
              )}
            </div>

            {/* Footer link to full language page */}
            <div className="border-t border-green-100 px-4 py-2.5">
              <button
                onClick={() => { setIsOpen(false); navigate('/language'); }}
                className="w-full text-center text-xs text-green-600 font-black hover:text-green-700 transition-colors uppercase tracking-wider"
              >
                {t('allLanguages')} →
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LanguageSwitcher;
