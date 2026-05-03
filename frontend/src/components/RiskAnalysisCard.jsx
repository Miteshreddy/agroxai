import React from 'react';
import T, { TD, TList } from './T';
import { motion } from 'framer-motion';
import { AlertTriangle, CheckCircle2, FlaskConical, ArrowUpRight, Gauge } from 'lucide-react';

const RiskAnalysisCard = ({ riskData, cropName }) => {
    if (!riskData) return null;
    const { risk_level, risk_color, risk_score, risk_factors, mitigations, overall_recommendation, should_soil_test } = riskData;

    const getRiskStyles = (color) => {
        if (color === '#ef4444') return 'border-red-500/20 bg-red-500/10 text-red-500';
        if (color === '#f97316') return 'border-orange-500/20 bg-orange-500/10 text-orange-500';
        if (color === '#eab308') return 'border-yellow-500/20 bg-yellow-500/10 text-yellow-500';
        return 'border-brand-green/20 bg-brand-green/10 text-brand-green';
    };

    const scrollToSoilTest = () => {
        document.getElementById('soil-explanation-panel')?.scrollIntoView({ behavior: 'smooth' });
    };

    const radius = 35;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (risk_score / 100) * circumference;

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mt-8 glass-card border-brand-green/10 overflow-hidden relative"
        >
            <div className="absolute top-0 right-0 p-8 opacity-5"><Gauge size={120} /></div>

            <div className="flex flex-col md:flex-row gap-10 items-start relative z-10">
                {/* Score Ring */}
                <div className="flex flex-col items-center gap-6 shrink-0 w-full md:w-auto">
                    <div className="relative w-40 h-40">
                        <svg className="w-full h-full transform -rotate-90">
                            <defs>
                                <linearGradient id="riskGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                    <stop offset="0%" stopColor="#22c55e" />
                                    <stop offset="50%" stopColor="#eab308" />
                                    <stop offset="100%" stopColor="#ef4444" />
                                </linearGradient>
                            </defs>
                            <circle cx="80" cy="80" r={radius} stroke="currentColor" strokeWidth="8" fill="transparent" className="text-brand-green/5" />
                            <motion.circle
                                cx="80" cy="80" r={radius}
                                stroke="url(#riskGradient)" strokeWidth="8" fill="transparent" strokeLinecap="round"
                                style={{ strokeDasharray: circumference, strokeDashoffset: offset }}
                                initial={{ strokeDashoffset: circumference }}
                                animate={{ strokeDashoffset: offset }}
                                transition={{ duration: 1.5, ease: "easeOut" }}
                            />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-4xl font-black text-brand-dark">{risk_score}</span>
                            <T as="span" className="text-[10px] font-black text-brand-olive uppercase tracking-widest">Risk Score</T>
                        </div>
                    </div>
                    <div className={`px-6 py-2 rounded-full border text-sm font-black uppercase tracking-widest flex items-center gap-2 ${getRiskStyles(risk_color)}`}>
                        <AlertTriangle size={16} />
                        <TD value={risk_level} />
                    </div>
                </div>

                {/* Right: Details */}
                <div className="flex-grow space-y-8">
                    <div>
                        <h3 className="text-2xl font-black text-brand-dark uppercase tracking-tighter mb-4 flex items-center gap-3 italic">
                            <T>Confidence</T> & <span className="text-brand-green"><T>Risk Analysis</T></span>
                        </h3>
                        <TD value={overall_recommendation} as="p" className="text-brand-olive font-medium text-sm leading-relaxed max-w-xl" />
                    </div>

                    <div className="space-y-4">
                        <TList
                            items={risk_factors}
                            renderItem={(factor, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.3 + index * 0.1 }}
                                    className="bg-white/40 border border-brand-green/5 rounded-2xl p-5 group hover:bg-white/60 transition-colors"
                                >
                                    <div className="flex items-start gap-4">
                                        <div className="w-10 h-10 bg-brand-gold/10 rounded-xl flex items-center justify-center text-brand-gold group-hover:scale-110 transition-transform">
                                            <AlertTriangle size={18} />
                                        </div>
                                        <div className="space-y-1">
                                            <h4 className="text-sm font-black text-brand-dark uppercase tracking-wide">{factor}</h4>
                                            <p className="text-xs text-brand-olive font-medium leading-relaxed italic opacity-80">
                                                💡 <T>Mitigation</T>: <TD value={mitigations[index]} as="span" />
                                            </p>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        />

                        {risk_factors.length === 0 && (
                            <div className="bg-brand-green/5 border border-brand-green/10 rounded-2xl p-6 flex items-center gap-4">
                                <CheckCircle2 className="text-brand-green" size={24} />
                                <T as="p" className="text-sm font-bold text-brand-dark">All environmental factors within safe operating buffers.</T>
                            </div>
                        )}
                    </div>

                    {should_soil_test && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-blue-50 border border-blue-200 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-4"
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600">
                                    <FlaskConical size={24} />
                                </div>
                                <div>
                                    <T as="h4" className="text-sm font-black text-blue-900 uppercase tracking-widest leading-none mb-1">Testing Recommended</T>
                                    <T as="p" className="text-xs text-blue-700 font-bold italic opacity-70">Physical soil testing is highly advised before cultivation.</T>
                                </div>
                            </div>
                            <button
                                onClick={scrollToSoilTest}
                                className="whitespace-nowrap bg-blue-600 text-white px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest flex items-center gap-2 hover:bg-blue-700 transition-colors shadow-lg active:scale-95"
                            >
                                <T>See Testing Guide</T> <ArrowUpRight size={14} />
                            </button>
                        </motion.div>
                    )}
                </div>
            </div>
        </motion.div>
    );
};

export default RiskAnalysisCard;
