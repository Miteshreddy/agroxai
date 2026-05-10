import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import LocationSearch from './LocationSearch';
import { useLanguage } from '../context/LanguageContext';

const SOIL_TYPES = ['Clay', 'Sandy', 'Loamy', 'Black', 'Red', 'Alluvial'];
const SEASONS = ['Kharif', 'Rabi', 'Zaid'];
const OUTCOMES = ['Good Yield', 'Average', 'Poor'];

const Backdrop = ({ children, onClose }) => (
  <motion.div
    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
    className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-md p-4"
    onClick={onClose}
  >
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: 20 }}
      transition={{ duration: 0.25 }}
      className="bg-brand-surface-elevated border border-brand-border/60 rounded-3xl shadow-premium w-full max-w-md overflow-hidden text-brand-text-primary"
      onClick={e => e.stopPropagation()}
    >
      {children}
    </motion.div>
  </motion.div>
);

export const AddFieldModal = ({ open, onClose, onSave }) => {
  const { t } = useLanguage();
  const [name, setName] = useState('');
  const [district, setDistrict] = useState('');
  const [state, setState] = useState('');
  const [soilType, setSoilType] = useState('Loamy');
  const [area, setArea] = useState('');

  const handleLocationSelect = ({ district: d, state: s }) => {
    setDistrict(d); setState(s);
  };

  const handleSave = () => {
    if (!name.trim()) return;
    onSave({
      id: Date.now().toString(),
      name: name.trim(),
      district, state, soilType,
      area: parseFloat(area) || 0,
      updatedAt: new Date().toISOString().split('T')[0],
    });
    setName(''); setDistrict(''); setState(''); setSoilType('Loamy'); setArea('');
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <Backdrop onClose={onClose}>
          <div className="p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-black text-brand-text-primary uppercase tracking-tight">{t('addNewField').replace('+ ', '')}</h3>
              <button onClick={onClose} className="p-1.5 text-brand-text-secondary hover:text-brand-text-primary hover:bg-brand-surface-inset rounded-lg transition-colors"><X size={18} /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-[9px] font-black text-brand-text-secondary uppercase tracking-widest ml-1">Field Name</label>
                <input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. North Field"
                  className="w-full px-4 py-3 mt-1.5 rounded-xl bg-brand-surface-inset border border-brand-border outline-none focus:border-brand-primary text-brand-text-primary placeholder:text-brand-text-muted transition-all text-sm font-medium" />
              </div>
              <div>
                <label className="text-[9px] font-black text-brand-text-secondary uppercase tracking-widest ml-1">Location Search</label>
                <div className="mt-1.5">
                  <LocationSearch onSelect={handleLocationSelect} placeholder="Search district..." />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[9px] font-black text-brand-text-secondary uppercase tracking-widest ml-1">District</label>
                  <input value={district} onChange={e => setDistrict(e.target.value)} placeholder="District"
                    className="w-full px-4 py-3 mt-1.5 rounded-xl bg-brand-surface-inset border border-brand-border outline-none focus:border-brand-primary text-brand-text-primary placeholder:text-brand-text-muted transition-all text-sm font-medium" />
                </div>
                <div>
                  <label className="text-[9px] font-black text-brand-text-secondary uppercase tracking-widest ml-1">State</label>
                  <input value={state} onChange={e => setState(e.target.value)} placeholder="State"
                    className="w-full px-4 py-3 mt-1.5 rounded-xl bg-brand-surface-inset border border-brand-border outline-none focus:border-brand-primary text-brand-text-primary placeholder:text-brand-text-muted transition-all text-sm font-medium" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[9px] font-black text-brand-text-secondary uppercase tracking-widest ml-1">Soil Type</label>
                  <div className="relative mt-1.5">
                    <select value={soilType} onChange={e => setSoilType(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-brand-surface-inset border border-brand-border outline-none focus:border-brand-primary text-brand-text-primary text-sm font-bold appearance-none cursor-pointer">
                      {SOIL_TYPES.map(s => <option key={s} value={s}>{t(s.toLowerCase() + 'Soil')}</option>)}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-brand-text-secondary">
                      <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                    </div>
                  </div>
                </div>
                <div>
                  <label className="text-[9px] font-black text-brand-text-secondary uppercase tracking-widest ml-1">Area (Acres)</label>
                  <input type="number" value={area} onChange={e => setArea(e.target.value)} placeholder="0"
                    className="w-full px-4 py-3 mt-1.5 rounded-xl bg-brand-surface-inset border border-brand-border outline-none focus:border-brand-primary text-brand-text-primary placeholder:text-brand-text-muted transition-all text-sm font-medium" />
                </div>
              </div>
              <button onClick={handleSave}
                className="w-full mt-4 py-4 bg-brand-primary text-slate-950 rounded-xl font-black uppercase text-xs tracking-widest hover:opacity-90 transition-all shadow-premium hover:shadow-premium-hover">
                {t('saveFieldBtn')}
              </button>
            </div>
          </div>
        </Backdrop>
      )}
    </AnimatePresence>
  );
};

export const LogCropModal = ({ open, onClose, onSave, fields }) => {
  const { t } = useLanguage();
  const [cropName, setCropName] = useState('');
  const [fieldName, setFieldName] = useState('');
  const [season, setSeason] = useState('Kharif');
  const [year, setYear] = useState(new Date().getFullYear());
  const [outcome, setOutcome] = useState('Good Yield');

  // Reset/Sync state when modal opens
  React.useEffect(() => {
    if (open) {
      setCropName('');
      if (fields.length > 0) {
        // If current fieldName is invalid or empty, set to first field
        if (!fieldName || !fields.find(f => f.name === fieldName)) {
          setFieldName(fields[0].name);
        }
      } else {
        setFieldName('');
      }
    }
  }, [open, fields]);

  const handleSave = () => {
    if (!cropName.trim()) {
      toast.error('Please enter a crop name');
      return;
    }
    if (!fieldName) {
      toast.error('Please select a field');
      return;
    }
    onSave({ id: Date.now().toString(), cropName: cropName.trim(), fieldName, season, year: parseInt(year), outcome });
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <Backdrop onClose={onClose}>
          <div className="p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-black text-brand-text-primary uppercase tracking-tight">{t('logPastCrop')}</h3>
              <button onClick={onClose} className="p-1.5 text-brand-text-secondary hover:text-brand-text-primary hover:bg-brand-surface-inset rounded-lg transition-colors"><X size={18} /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-[9px] font-black text-brand-text-secondary uppercase tracking-widest ml-1">Crop Name</label>
                <input value={cropName} onChange={e => setCropName(e.target.value)} placeholder="e.g. Wheat"
                  className="w-full px-4 py-3 mt-1.5 rounded-xl bg-brand-surface-inset border border-brand-border outline-none focus:border-brand-primary text-brand-text-primary placeholder:text-brand-text-muted transition-all text-sm font-medium" />
              </div>
              <div>
                <label className="text-[9px] font-black text-brand-text-secondary uppercase tracking-widest ml-1">Field</label>
                <div className="relative mt-1.5">
                  <select value={fieldName} onChange={e => setFieldName(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-brand-surface-inset border border-brand-border outline-none focus:border-brand-primary text-brand-text-primary text-sm font-bold appearance-none cursor-pointer">
                    {fields.map(f => <option key={f.id} value={f.name}>{f.name}</option>)}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-brand-text-secondary">
                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[9px] font-black text-brand-text-secondary uppercase tracking-widest ml-1">Season</label>
                  <div className="relative mt-1.5">
                    <select value={season} onChange={e => setSeason(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-brand-surface-inset border border-brand-border outline-none focus:border-brand-primary text-brand-text-primary text-sm font-bold appearance-none cursor-pointer">
                      {SEASONS.map(s => <option key={s} value={s}>{t(s.toLowerCase())}</option>)}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-brand-text-secondary">
                      <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                    </div>
                  </div>
                </div>
                <div>
                  <label className="text-[9px] font-black text-brand-text-secondary uppercase tracking-widest ml-1">Year</label>
                  <input type="number" value={year} onChange={e => setYear(e.target.value)}
                    className="w-full px-4 py-3 mt-1.5 rounded-xl bg-brand-surface-inset border border-brand-border outline-none focus:border-brand-primary text-brand-text-primary placeholder:text-brand-text-muted transition-all text-sm font-medium" />
                </div>
              </div>
              <div>
                <label className="text-[9px] font-black text-brand-text-secondary uppercase tracking-widest ml-1">Outcome</label>
                <div className="relative mt-1.5">
                  <select value={outcome} onChange={e => setOutcome(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-brand-surface-inset border border-brand-border outline-none focus:border-brand-primary text-brand-text-primary text-sm font-bold appearance-none cursor-pointer">
                    {OUTCOMES.map(o => {
                      const key = o === 'Good Yield' ? 'goodYield' : o === 'Average' ? 'averageYield' : 'poorYield';
                      return <option key={o} value={o}>{t(key)}</option>;
                    })}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-brand-text-secondary">
                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                  </div>
                </div>
              </div>
              <button onClick={handleSave}
                className="w-full mt-4 py-4 bg-brand-primary text-slate-950 rounded-xl font-black uppercase text-xs tracking-widest hover:opacity-90 transition-all shadow-premium hover:shadow-premium-hover">
                {t('logCropBtn')}
              </button>
            </div>
          </div>
        </Backdrop>
      )}
    </AnimatePresence>
  );
};

export const SelectFarmModal = ({ open, onClose, fields, onSelect }) => {
  const { t } = useLanguage();

  return (
    <AnimatePresence>
      {open && (
        <Backdrop onClose={onClose}>
          <div className="p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-black text-brand-text-primary uppercase tracking-tight">Select Farm to Analyze</h3>
              <button onClick={onClose} className="p-1.5 text-brand-text-secondary hover:text-brand-text-primary hover:bg-brand-surface-inset rounded-lg transition-colors"><X size={18} /></button>
            </div>
            
            {fields.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-sm font-bold text-brand-text-secondary mb-4">No fields added yet.</p>
                <button onClick={onClose} className="py-2 px-4 bg-brand-primary text-slate-950 rounded-xl text-xs font-black uppercase tracking-widest">
                  Close
                </button>
              </div>
            ) : (
              <div className="space-y-3 max-h-[60vh] overflow-y-auto custom-scrollbar pr-2">
                {fields.map(f => (
                  <button
                    key={f.id || f._id}
                    onClick={() => {
                      onSelect(f);
                      onClose();
                    }}
                    className="w-full text-left p-4 rounded-xl border border-brand-border bg-brand-surface hover:border-brand-primary hover:bg-brand-surface-inset transition-all group flex justify-between items-center"
                  >
                    <div>
                      <p className="text-sm font-black text-brand-text-primary uppercase">{f.name}</p>
                      <p className="text-[10px] font-black text-brand-text-secondary uppercase tracking-widest mt-1">
                        {f.district}{f.district && f.state ? ', ' : ''}{f.state} · {f.soilType}
                      </p>
                    </div>
                    <div className="w-8 h-8 rounded-lg bg-brand-surface-elevated border border-brand-border flex items-center justify-center text-brand-primary group-hover:bg-brand-primary group-hover:text-slate-950 transition-colors">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </Backdrop>
      )}
    </AnimatePresence>
  );
};
