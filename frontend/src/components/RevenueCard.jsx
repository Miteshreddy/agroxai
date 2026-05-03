import React, { useState } from 'react';
import T, { TD, TList } from './T';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Wallet, Info, LandPlot, BadgeIndianRupee, Zap, Gauge } from 'lucide-react';
import CountUp from 'react-countup';
import toast from 'react-hot-toast';
import { useLanguage } from '../context/LanguageContext';

const RevenueCard = ({ crop, rainfall, season }) => {
    const { t } = useLanguage();
    const [landArea, setLandArea] = useState(1);
    const [soilQuality, setSoilQuality] = useState('Good');
    const [prediction, setPrediction] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleCalculate = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await axios.post(`${import.meta.env.VITE_API_URL || 'https://agroxai.onrender.com'}/api/revenue-prediction`, {
                crop,
                rainfall_level: rainfall,
                season,
                land_area_acres: landArea,
                soil_quality: soilQuality
            });
            setPrediction(response.data);
            toast.success(t('Revenue analysis complete!') || 'Revenue analysis complete!');
        } catch (error) {
            toast.error(t('Prediction failed. Ensure backend is running.') || 'Prediction failed. Ensure backend is running.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-8 glass-card border-brand-green/10"
        >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 pb-6 border-b border-brand-green/10">
                <div>
                    <h3 className="text-3xl font-black text-brand-dark uppercase tracking-tight flex items-center gap-3 italic">
                        💰 <span className="text-brand-green"><T>Revenue</T></span> <T>Predictor</T>
                    </h3>
                    <T as="p" className="text-brand-olive font-medium text-sm mt-1">Estimating profitability based on market MSP (2024-25) and crop yield.</T>
                </div>
                <div className="px-6 py-2 bg-brand-green/10 rounded-2xl border border-brand-green/20">
                    <span className="text-xs font-black text-brand-green uppercase tracking-[0.2em]">{crop} <T>Model</T></span>
                </div>
            </div>

            <form onSubmit={handleCalculate} className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 items-end">
                <div className="space-y-2">
                    <T as="label" className="text-[10px] uppercase font-black text-brand-olive tracking-[0.2em] ml-2">Land Area (Acres)</T>
                    <div className="relative">
                        <LandPlot size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-olive opacity-40" />
                        <input
                            type="number"
                            step="0.1"
                            className="input-field pl-12 focus:ring-brand-green/50"
                            value={landArea}
                            onChange={(e) => setLandArea(e.target.value)}
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <T as="label" className="text-[10px] uppercase font-black text-brand-olive tracking-[0.2em] ml-2">Soil Analytical Quality</T>
                    <div className="relative">
                        <Gauge size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-olive opacity-40" />
                        <select
                            className="input-field pl-12 focus:ring-brand-green/50"
                            value={soilQuality}
                            onChange={(e) => setSoilQuality(e.target.value)}
                        >
                            <option value="Excellent">{t('Excellent') || 'Excellent'}</option>
                            <option value="Good">{t('Good') || 'Good'}</option>
                            <option value="Average">{t('Average') || 'Average'}</option>
                            <option value="Poor">{t('Poor') || 'Poor'}</option>
                        </select>
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary w-full py-4 text-sm uppercase tracking-widest flex items-center justify-center gap-3 disabled:opacity-50"
                >
                    {loading ? <T>Processing...</T> : <T>Calculate Revenue</T>} <Zap size={18} />
                </button>
            </form>

            <AnimatePresence>
                {prediction && (
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        className="space-y-10"
                    >
                        {/* Main Profit Display */}
                        <div className="bg-brand-dark p-10 rounded-[2.5rem] relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-10 opacity-5">
                                <BadgeIndianRupee size={150} className="text-white" />
                            </div>

                            <div className="relative z-10 text-center">
                                <T as="h4" className="text-brand-green font-black uppercase tracking-[0.3em] mb-4">Estimated Net Profit</T>
                                <div className="text-6xl md:text-8xl font-black text-white italic tracking-tighter mb-4">
                                    ₹<CountUp end={prediction.net_profit} duration={2} separator="," />
                                </div>
                                <p className="text-white/40 text-[10px] uppercase font-bold tracking-[0.2em]">
                                    <T>Based on</T> {prediction.land_area_acres} <T>acres of</T> {prediction.crop_used}
                                </p>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-2 gap-6 mt-10 border-t border-white/5 pt-10 relative z-10">
                                <div className="text-center">
                                    <T as="p" className="text-brand-olive text-[10px] uppercase font-black tracking-widest mb-1">Gross Revenue</T>
                                    <p className="text-xl font-bold text-white">₹{prediction.gross_revenue.toLocaleString()}</p>
                                </div>
                                <div className="text-center">
                                    <T as="p" className="text-red-400 text-[10px] uppercase font-black tracking-widest mb-1 italic">Est. Input Costs</T>
                                    <p className="text-xl font-bold text-white">₹{prediction.input_cost.toLocaleString()}</p>
                                </div>
                            </div>
                        </div>

                        {/* Revenue Ranges */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="p-6 bg-red-500/5 border border-red-500/10 rounded-3xl text-center">
                                <T as="span" className="text-[9px] font-black text-red-500 uppercase tracking-widest mb-2 block">Conservative</T>
                                <p className="text-lg font-black text-brand-dark">₹{prediction.revenue_range.conservative.toLocaleString()}</p>
                            </div>
                            <div className="p-6 bg-brand-green/10 border border-brand-green/20 rounded-3xl text-center">
                                <T as="span" className="text-[9px] font-black text-brand-green uppercase tracking-widest mb-2 block">Realistic</T>
                                <p className="text-2xl font-black text-brand-dark">₹{prediction.revenue_range.realistic.toLocaleString()}</p>
                            </div>
                            <div className="p-6 bg-brand-gold/5 border border-brand-gold/10 rounded-3xl text-center">
                                <T as="span" className="text-[9px] font-black text-brand-gold uppercase tracking-widest mb-2 block">Optimistic</T>
                                <p className="text-lg font-black text-brand-dark">₹{prediction.revenue_range.optimistic.toLocaleString()}</p>
                            </div>
                        </div>

                        {/* Breakdown Table */}
                        <div className="space-y-6">
                            <h5 className="text-[10px] uppercase font-black text-brand-olive tracking-[0.2rem] flex items-center gap-2">
                                <Info size={14} /> <T>Yield Breakdown</T>
                            </h5>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                {prediction.yield_breakdown.map((item, idx) => (
                                    <div key={idx} className="bg-white/40 p-4 rounded-2xl border border-brand-green/5 flex justify-between items-center">
                                        <TD value={item.factor} as="span" className="text-[10px] font-bold text-brand-olive uppercase" />
                                        <span className="text-sm font-black text-brand-dark">{item.value}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="bg-white/50 p-6 rounded-3xl border border-brand-green/5 space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-brand-green/10 rounded-xl flex items-center justify-center text-brand-green">
                                        <Wallet size={20} />
                                    </div>
                                    <T as="p" className="text-xs font-black text-brand-dark uppercase">MSP Rate Used (2024-25)</T>
                                </div>
                                <span className="text-sm font-black text-brand-green">₹{prediction.msp_used} / {prediction.crop_used === 'Sugarcane' ? <T>Tonne</T> : <T>Quintal</T>}</span>
                            </div>
                            <p className="text-[10px] text-brand-olive font-medium italic leading-relaxed pt-4 border-t border-brand-green/5">
                                * <TD value={prediction.disclaimer} />
                            </p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default RevenueCard;
