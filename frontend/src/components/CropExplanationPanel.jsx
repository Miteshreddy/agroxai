import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Brain, TrendingUp, AlertCircle, Droplets, Thermometer, CloudRain, Map as SoilIcon, Scale, Leaf, Target, Sparkles, Sprout, BarChart3 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, LabelList } from 'recharts';
import CountUp from 'react-countup';
import T, { TD } from './T';

const getSoilAdviceDetail = (values) => {
    if (!values) return "Evaluating your soil's specific nutrient needs based on environmental descriptors...";
    const recs = [];
    if (values.N < 50) recs.push("Nitrogen (N) is critically low; apply Urea or Ammonium Nitrate to improve crop stature and leaf health.");
    if (values.P < 40) recs.push("Phosphorus (P) is deficient; adding DAP (Di-Ammonium Phosphate) will bolster root development.");
    if (values.K < 40) recs.push("Potassium (K) levels are substandard; consider MOP (Muriate of Potash) for fruit quality and disease resistance.");
    if (values.ph < 6.0) recs.push("Soil pH is too acidic for most crops; add agricultural limestone to neutralize.");
    if (values.ph > 7.5) recs.push("Soil is moderately alkaline; adding gypsum can help balance high pH levels.");

    if (recs.length === 0) return "Your soil nutrient levels are excellently balanced for the current recommendation. Maintain organic fertilization cycles.";
    return recs.join(" ");
};

const CropExplanationPanel = ({ crop, confidence, explanation, inputs, mapped_values }) => {
    const chartData = useMemo(() => {
        return Object.entries(explanation)
            .map(([key, value]) => ({
                name: key,
                impact: value,
                formattedImpact: (value * 100).toFixed(1)
            }))
            .sort((a, b) => Math.abs(b.impact) - Math.abs(a.impact));
    }, [explanation]);

    const pcolor = (val) => val > 0 ? '#2D4B37' : '#EF4444'; // brand-green or red

    return (
        <div className="space-y-12">
            {/* 1. AI Strategic Summary */}
            <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="glass-card bg-white border-brand-green/10"
            >
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-brand-green/10 rounded-xl flex items-center justify-center text-brand-green">
                        <Brain size={24} />
                    </div>
                    <div>
                        <T as="h3" className="text-xl font-black text-brand-dark uppercase tracking-tight">AI Logical Reasoning</T>
                        <T as="p" className="text-brand-olive text-xs font-bold uppercase tracking-widest">Decision Analysis Report</T>
                    </div>
                </div>
                <p className="text-xl text-brand-dark font-medium leading-relaxed">
                    <TD value={`The AgroXAI model recommends ${crop} because your ${chartData[0]?.name || 'nutrient'} levels are the primary driver for success in this ${inputs.season}. With ${Math.round(confidence * 100)}% confidence, the engine has analyzed the specific ${inputs.soil_type} profile and environmental constraints.`} />
                </p>
            </motion.div>

            {/* 2. Nutrient Snapshot */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <NutrientTile label="Nitrogen (N)" value={mapped_values?.N} delay={0} />
                <NutrientTile label="Phosphorus (P)" value={mapped_values?.P} delay={0.1} />
                <NutrientTile label="Potassium (K)" value={mapped_values?.K} delay={0.2} />
                <NutrientTile label="Soil pH" value={mapped_values?.ph} delay={0.3} isPH={true} />
            </div>

            {/* 2.5 Soil Health Recommendation (New) */}
            <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="glass-card bg-brand-dark p-8 rounded-[2rem] border-brand-green/20 text-white relative overflow-hidden"
            >
                <div className="absolute top-0 right-0 p-8 opacity-10">
                    <Sparkles size={120} />
                </div>
                <div className="flex items-center gap-4 mb-6 relative z-10">
                    <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-brand-gold">
                        <AlertCircle size={28} />
                    </div>
                    <div>
                        <T as="h3" className="text-xl font-black uppercase tracking-tight text-white">Soil Health Management</T>
                        <T as="p" className="text-brand-green text-[10px] font-black uppercase tracking-[0.2em]">Actionable Agronomic Advice</T>
                    </div>
                </div>
                <p className="text-lg text-white/90 font-medium leading-relaxed relative z-10 max-w-2xl">
                    <TD value={getSoilAdviceDetail(mapped_values)} />
                </p>
            </motion.div>

            {/* 3. SHAP BAR CHART (Light Mode) */}
            <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="glass-card bg-white border-brand-green/5"
            >
                <div className="flex items-center justify-between mb-8">
                    <h3 className="text-xl font-black text-brand-dark flex items-center gap-3 uppercase tracking-tight">
                        <TrendingUp size={24} className="text-brand-green" /> <T>Feature Impact Map</T>
                    </h3>
                    <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest opacity-60">
                        <span className="flex items-center gap-2"><div className="w-2 h-2 bg-[#2D4B37] rounded-full" /> <T>Positive</T></span>
                        <span className="flex items-center gap-2"><div className="w-2 h-2 bg-[#EF4444] rounded-full" /> <T>Negative</T></span>
                    </div>
                </div>
                <div className="w-full h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData} layout="vertical" margin={{ left: 30, right: 50 }}>
                            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E5E7EB" />
                            <XAxis type="number" hide />
                            <YAxis
                                type="category"
                                dataKey="name"
                                width={120}
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: '#1A1A1A', fontSize: '11px', fontWeight: 800 }}
                            />
                            <Tooltip
                                cursor={{ fill: '#F5F5F0' }}
                                contentStyle={{ background: '#FFFFFF', border: '1px solid #1A1A1A', borderRadius: '12px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}
                            />
                            <Bar
                                dataKey="impact"
                                radius={[0, 4, 4, 0]}
                                isAnimationActive={true}
                                animationDuration={800}
                                animationEasing="ease-out"
                            >
                                {chartData.map((entry, index) => (
                                    <Cell
                                        key={index}
                                        fill={pcolor(entry.impact)}
                                    />
                                ))}
                                <LabelList dataKey="formattedImpact" position="right" fill="#6B705C" fontSize={11} fontWeight={700} formatter={(val) => `${val}%`} />
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="text-center py-10"
            >
                <div className="w-24 h-24 bg-brand-green rounded-[2rem] mx-auto flex items-center justify-center text-brand-gold mb-8 rotate-12 hover:rotate-0 transition-transform shadow-2xl">
                    <Sprout size={48} />
                </div>
                <T as="h2" className="text-4xl font-black text-brand-dark mb-4">OPTIMIZED FOR SUCCESS.</T>
                <motion.p
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="text-brand-olive font-medium max-w-xl mx-auto mb-10 text-lg"
                >
                    <TD value={`Your field is scientifically prepared for this match. The ${inputs.soil_type} soil provides the perfect base for high-yield seeding.`} />
                </motion.p>
                <button className="btn-primary group">
                    <T>Save Recommendation</T> <Target size={18} className="ml-2 transition-transform group-hover:scale-125" />
                </button>
            </motion.div>
        </div>
    );
};

const NutrientTile = ({ label, value, delay, isPH }) => (
    <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        transition={{ delay }}
        viewport={{ once: true }}
        className="p-6 bg-white border border-brand-green/5 rounded-3xl shadow-lg text-center"
    >
        <p className="text-[10px] font-black uppercase text-brand-olive tracking-widest mb-2"><T>{label}</T></p>
        <p className="text-3xl font-black text-brand-dark">
            <CountUp end={value || 0} decimals={isPH ? 1 : 0} duration={2} />
        </p>
    </motion.div>
);

export default CropExplanationPanel;
