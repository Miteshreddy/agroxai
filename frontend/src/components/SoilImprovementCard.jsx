import React from 'react';
import T, { TD, TList } from './T';
import { motion } from 'framer-motion';
import { Sprout, TrendingUp, Calendar, Zap, ArrowRight, Star } from 'lucide-react';
import toast from 'react-hot-toast';

const SoilImprovementCard = ({ improvementData }) => {
    if (!improvementData) return null;
    const { soil_type, current_grade, potential_grade, duration, steps, better_crops, general_tips } = improvementData;

    const handleStartPlan = () => {
        toast.success(`Improvement plan for ${soil_type} soil logged!`);
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-8 glass-card border-brand-green/10"
        >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                <div>
                    <h3 className="text-3xl font-black text-brand-dark uppercase tracking-tight flex items-center gap-3 italic">
                        🌱 <span className="text-brand-green"><T>Soil Improvement</T></span> <T>Roadmap</T>
                    </h3>
                    <p className="text-brand-olive font-medium text-sm mt-1 max-w-lg">
                        <T>Strategic intervention protocol to upgrade your</T> {soil_type} <T>field from Grade</T> {current_grade} <T>to Grade</T> {potential_grade}.
                    </p>
                </div>
                <div className="flex items-center gap-4 bg-brand-green/5 p-4 rounded-3xl border border-brand-green/10">
                    <div className="text-center">
                        <T as="p" className="text-[10px] font-black text-brand-olive uppercase tracking-[0.2em] mb-1">Current</T>
                        <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-2xl font-black text-red-500 shadow-inner">{current_grade}</div>
                    </div>
                    <ArrowRight className="text-brand-green mt-4" size={20} />
                    <div className="text-center">
                        <T as="p" className="text-[10px] font-black text-brand-olive uppercase tracking-[0.2em] mb-1">Potential</T>
                        <div className="w-12 h-12 bg-brand-green text-white rounded-2xl flex items-center justify-center text-2xl font-black shadow-lg shadow-brand-green/20">{potential_grade}</div>
                    </div>
                </div>
            </div>

            {/* Timeline */}
            <div className="mb-12">
                <div className="flex items-center gap-3 mb-6">
                    <Calendar className="text-brand-green" size={20} />
                    <span className="text-sm font-black text-brand-dark uppercase tracking-widest">
                        <T>Upgrade Timeline</T>: <span className="text-brand-green italic"><TD value={duration} /></span>
                    </span>
                </div>
                <div className="relative">
                    <div className="absolute top-1/2 left-0 w-full h-0.5 bg-brand-green/10 -translate-y-1/2" />
                    <div className="flex justify-between items-center relative z-10">
                        {steps.map((s, idx) => (
                            <motion.div key={idx} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.5 + idx * 0.1 }}
                                className="w-10 h-10 rounded-full bg-white border-4 border-brand-green flex items-center justify-center text-xs font-black text-brand-green shadow-lg">
                                {idx + 1}
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Step cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
                {steps.map((step, idx) => (
                    <motion.div key={idx} whileHover={{ y: -5 }} className="bg-white/40 border border-brand-green/5 p-5 rounded-3xl space-y-3 flex flex-col h-full group">
                        <div className="flex justify-between items-start">
                            <span className="w-8 h-8 bg-brand-green/10 rounded-xl flex items-center justify-center text-xs font-black text-brand-green">S{step.step}</span>
                            <TD value={step.timing} as="span" className="text-[10px] font-black text-brand-gold uppercase tracking-[0.1em]" />
                        </div>
                        <TD value={step.action} as="h4" className="text-sm font-black text-brand-dark uppercase leading-tight group-hover:text-brand-green transition-colors" />
                        <div className="flex-grow">
                            <p className="text-[10px] font-bold text-brand-olive uppercase mb-2"><T>Req</T>: {step.quantity}</p>
                            <TD value={step.benefit} as="p" className="text-xs text-brand-olive font-medium leading-relaxed italic opacity-80" />
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Better crops */}
            <div className="bg-brand-dark rounded-[2.5rem] p-8 md:p-12 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-12 opacity-5"><TrendingUp size={140} className="text-white" /></div>
                <h4 className="text-xl font-black text-white uppercase tracking-tight mb-8 relative z-10 flex items-center gap-3">
                    <Star className="text-brand-gold fill-brand-gold" size={24} />
                    <T>High-Value Crops Unlocked</T> <span className="text-brand-green italic"><T>After Improvement</T></span>
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
                    {better_crops.map((crop, idx) => (
                        <div key={idx} className="bg-white/5 border border-white/10 p-6 rounded-[2rem] flex items-center gap-6 group hover:bg-white/10 transition-all">
                            <div className="text-5xl group-hover:scale-110 transition-transform">{crop.emoji}</div>
                            <div className="flex-grow">
                                <div className="flex items-center justify-between mb-1">
                                    <h5 className="text-lg font-black text-white uppercase tracking-tight">{crop.name}</h5>
                                    <span className="bg-brand-green/20 text-brand-green px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-brand-green/20">
                                        +{crop.yield_increase} <T>Yield</T>
                                    </span>
                                </div>
                                <TD value={crop.reason} as="p" className="text-xs text-white/60 font-medium leading-relaxed italic" />
                            </div>
                        </div>
                    ))}
                </div>
                <div className="mt-10 flex flex-col md:flex-row items-center justify-between gap-6 pt-10 border-t border-white/10 relative z-10">
                    <T as="p" className="text-xs text-white/40 font-bold max-w-sm uppercase tracking-widest">*Estimates based on regional experimental farm data and historical nutrient mapping.</T>
                    <button onClick={handleStartPlan} className="btn-primary w-full md:w-auto px-10 py-5 bg-brand-green hover:bg-white hover:text-brand-dark flex items-center justify-center gap-3 border-none group">
                        <T>Start Improvement Plan</T> <Zap size={20} className="fill-current" />
                    </button>
                </div>
            </div>
        </motion.div>
    );
};

export default SoilImprovementCard;
