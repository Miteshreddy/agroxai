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
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all duration-200 font-bold text-xs border ${
          isOpen 
            ? 'bg-brand-primary/15 border-brand-primary/35 text-brand-primary' 
            : 'bg-brand-primary/5 hover:bg-brand-primary/10 border-brand-primary/15 text-brand-primary'
        }`}
      >
        <Globe size={15} />
        {!compact && (
          <span className="hidden sm:block max-w-[60px] truncate">{currentLanguage.nativeName}</span>
        )}
        <span className="text-[10px] font-black px-1 py-0.5 rounded-md text-brand-bg" style={{ background: 'linear-gradient(135deg,var(--accent-primary),var(--accent-cyan))' }}>
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
            className="absolute right-0 mt-2 w-72 rounded-2xl overflow-hidden z-[200] shadow-2xl bg-brand-surface border border-brand-border backdrop-blur-md"
          >
            {/* Header */}
            <div className="px-4 py-3 border-b border-brand-border flex items-center gap-2">
              <Globe size={16} className="text-brand-primary" />
              <span className="text-xs font-black text-brand-text-secondary uppercase tracking-widest">{t('changeLanguage')}</span>
            </div>

            {/* Search */}
            <div className="px-3 py-2 border-b border-brand-border">
              <div className="relative">
                <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-text-secondary" />
                <input
                  type="text"
                  autoFocus
                  placeholder={t('searchPlaceholder')}
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 text-xs rounded-xl bg-brand-surface-inset border border-brand-border focus:outline-none focus:border-brand-primary font-medium text-brand-text-primary placeholder:text-brand-text-secondary"
                />
              </div>
            </div>

            {/* Language List */}
            <div className="max-h-64 overflow-y-auto py-1" style={{ scrollbarWidth: 'thin', scrollbarColor: 'var(--accent-primary) transparent' }}>
              {filtered.length === 0 ? (
                <div className="text-center py-6 text-brand-text-secondary text-xs font-medium">No language found</div>
              ) : (
                filtered.map(lang => {
                  const isActive = lang.code === currentLanguage.code;
                  return (
                    <button
                      key={lang.code}
                      onClick={() => handleSelect(lang.code)}
                      className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-brand-surface-hover transition-colors text-left group"
                    >
                      <span className="w-8 h-8 flex-shrink-0 rounded-lg flex items-center justify-center text-[10px] font-black text-white" style={{ background: 'linear-gradient(135deg,#10B981,#14B8A6)' }}>
                        {lang.code === 'en' ? 'EN' : 'IN'}
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-black text-brand-text-primary leading-tight">{lang.nativeName}</div>
                        <div className="text-[10px] text-brand-text-secondary font-medium">{lang.name} • {lang.region}</div>
                      </div>
                      {isActive && (
                        <Check size={15} className="text-brand-primary flex-shrink-0" strokeWidth={3} />
                      )}
                    </button>
                  );
                })
              )}
            </div>

            {/* Footer link to full language page */}
            <div className="border-t border-brand-border px-4 py-2.5 bg-brand-surface-inset">
              <button
                onClick={() => { setIsOpen(false); navigate('/language'); }}
                className="w-full text-center text-xs text-brand-primary font-black hover:opacity-80 transition-colors uppercase tracking-wider"
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
