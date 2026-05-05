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
    className="fixed inset-0 z-[200] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
    onClick={onClose}
  >
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: 20 }}
      transition={{ duration: 0.25 }}
      className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
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
              <h3 className="text-lg font-black text-brand-dark uppercase">{t('addNewField').replace('+ ', '')}</h3>
              <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-lg"><X size={18} /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase ml-1">Field Name</label>
                <input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. North Field"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-brand-green transition-all text-sm font-medium" />
              </div>
              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase ml-1">Location Search</label>
                <LocationSearch onSelect={handleLocationSelect} placeholder="Search district..." />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase ml-1">District</label>
                  <input value={district} onChange={e => setDistrict(e.target.value)} placeholder="District"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-brand-green text-sm font-medium" />
                </div>
                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase ml-1">State</label>
                  <input value={state} onChange={e => setState(e.target.value)} placeholder="State"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-brand-green text-sm font-medium" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase ml-1">Soil Type</label>
                  <select value={soilType} onChange={e => setSoilType(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-brand-green text-sm font-bold appearance-none bg-white">
                    {SOIL_TYPES.map(s => <option key={s} value={s}>{t(s.toLowerCase() + 'Soil')}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase ml-1">Area (Acres)</label>
                  <input type="number" value={area} onChange={e => setArea(e.target.value)} placeholder="0"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-brand-green text-sm font-medium" />
                </div>
              </div>
              <button onClick={handleSave}
                className="w-full py-3.5 bg-[#2d5a27] text-white rounded-xl font-bold uppercase text-sm hover:bg-[#234a1f] transition-colors">
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
              <h3 className="text-lg font-black text-brand-dark uppercase">{t('logPastCrop')}</h3>
              <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-lg"><X size={18} /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase ml-1">Crop Name</label>
                <input value={cropName} onChange={e => setCropName(e.target.value)} placeholder="e.g. Wheat"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-brand-green text-sm font-medium" />
              </div>
              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase ml-1">Field</label>
                <select value={fieldName} onChange={e => setFieldName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-brand-green text-sm font-bold appearance-none bg-white">
                  {fields.map(f => <option key={f.id} value={f.name}>{f.name}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase ml-1">Season</label>
                  <select value={season} onChange={e => setSeason(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-brand-green text-sm font-bold appearance-none bg-white">
                    {SEASONS.map(s => <option key={s} value={s}>{t(s.toLowerCase())}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase ml-1">Year</label>
                  <input type="number" value={year} onChange={e => setYear(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-brand-green text-sm font-medium" />
                </div>
              </div>
              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase ml-1">Outcome</label>
                <select value={outcome} onChange={e => setOutcome(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-brand-green text-sm font-bold appearance-none bg-white">
                  {OUTCOMES.map(o => {
                    const key = o === 'Good Yield' ? 'goodYield' : o === 'Average' ? 'averageYield' : 'poorYield';
                    return <option key={o} value={o}>{t(key)}</option>;
                  })}
                </select>
              </div>
              <button onClick={handleSave}
                className="w-full py-3.5 bg-[#2d5a27] text-white rounded-xl font-bold uppercase text-sm hover:bg-[#234a1f] transition-colors">
                {t('logCropBtn')}
              </button>
            </div>
          </div>
        </Backdrop>
      )}
    </AnimatePresence>
  );
};
