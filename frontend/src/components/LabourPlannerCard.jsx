import React, { useState } from 'react';
import T, { TD, TList } from './T';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, IndianRupee, Calendar, Hammer, Clock, Landmark, Zap, ChevronRight, Info, CheckCircle2, Tractor, HelpCircle } from 'lucide-react';
import CountUp from 'react-countup';

const LabourPhaseCard = ({ phase, idx, area }) => {
    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8 + idx * 0.1 }}
            className="relative pl-12 pb-10 last:pb-0 group"
        >
            {/* Timeline Line */}
            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-brand-green/10 group-last:bottom-auto group-last:h-6" />

            {/* Phase Node */}
            <div className="absolute left-0 top-0 w-12 h-12 rounded-2xl bg-white border-4 border-brand-green/5 flex items-center justify-center text-xl shadow-lg z-10 group-hover:scale-110 transition-transform">
                {phase.emoji}
            </div>

            <div className="bg-white/40 border border-brand-green/5 p-6 rounded-[2rem] hover:bg-white/60 transition-all shadow-sm">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                    <div>
                        <h4 className="text-lg font-black text-brand-dark uppercase tracking-tight flex items-center gap-2">
                            <T>Phase</T> {idx + 1}: <TD value={phase.name} />
                        </h4>
                        <div className="flex items-center gap-4 mt-1 opacity-70">
                            <span className="text-[10px] font-black uppercase tracking-widest text-brand-olive flex items-center gap-1">
                                <Clock size={12} /> <TD value={phase.duration} />
                            </span>
                            <span className="text-[10px] font-black uppercase tracking-widest text-brand-olive flex items-center gap-1">
                                <Users size={12} /> {phase.workers} <T>Workers</T>
                            </span>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="text-[10px] font-black uppercase tracking-widest text-brand-olive opacity-60 mb-1"><T>Est. Cost for</T> {area} <T>Acres</T></p>
                        <p className="text-xl font-black text-brand-green italic tracking-tighter">₹{phase.cost_for_area.toLocaleString()}</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <T as="h5" className="text-[10px] font-black text-brand-olive uppercase tracking-[0.2em] mb-3 opacity-60">Tasks to Execute</T>
                        <ul className="space-y-2">
                            <TList
                                items={phase.tasks}
                                renderItem={(task, i) => (
                                    <li key={i} className="flex items-center gap-2 text-sm font-bold text-brand-dark italic opacity-90">
                                        <CheckCircle2 size={14} className="text-brand-green shrink-0" /> {task}
                                    </li>
                                )}
                            />
                        </ul>
                    </div>
                    <div className="bg-brand-green/5 p-4 rounded-2xl border border-brand-green/10 h-full flex flex-col justify-center">
                        <T as="p" className="text-[10px] font-black text-brand-green uppercase tracking-widest mb-1">Worker Profile</T>
                        <p className="text-sm font-bold text-brand-dark capitalize italic"><TD value={phase.type} /> <T>Labour</T></p>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

const LabourPlannerCard = ({ labourData }) => {
    if (!labourData) return null;

    const { total_labour_days, total_labour_cost, daily_wage_rate, peak_labour_periods, labour_phases, machinery_options, booking_tip, land_area } = labourData;

    const allMonths = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="mt-8 glass-card border-brand-green/10"
        >
            {/* Header Content */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 pb-10 border-b border-brand-green/10">
                <div>
                    <h3 className="text-3xl font-black text-brand-dark uppercase tracking-tight flex items-center gap-3 italic text-center md:text-left">
                        👷 <span className="text-brand-green"><T>Labour</T></span> <T>Planner</T>
                    </h3>
                    <T as="p" className="text-brand-olive font-medium text-sm mt-1 text-center md:text-left max-w-lg">
                        Operational workload management and cost estimation for {labourData.crop_name} across {land_area} acres.
                    </T>
                </div>

                <div className="flex gap-4">
                    <div className="bg-brand-dark p-6 rounded-[2rem] text-center shadow-lg transform -rotate-1">
                        <T as="p" className="text-[10px] font-black uppercase text-white/50 tracking-widest mb-1">Total Labour Days</T>
                        <div className="text-3xl font-black text-brand-green italic tracking-tighter">
                            <CountUp end={total_labour_days} duration={2} />
                        </div>
                    </div>
                    <div className="bg-brand-green p-6 rounded-[2rem] text-center shadow-lg transform rotate-1">
                        <T as="p" className="text-[10px] font-black uppercase text-white/70 tracking-widest mb-1">Total Labour Budget</T>
                        <div className="text-3xl font-black text-white italic tracking-tighter">
                            ₹<CountUp end={total_labour_cost} duration={2} separator="," />
                        </div>
                    </div>
                </div>
            </div>

            {/* Peak Month Stripe */}
            <div className="mb-12">
                <h4 className="text-[11px] font-black text-brand-dark uppercase tracking-[0.25em] mb-4 flex items-center gap-2 opacity-60">
                    <Calendar size={16} className="text-brand-green" /> <T>Workload Intensity Heatmap</T>
                </h4>
                <div className="flex flex-wrap gap-2 md:grid md:grid-cols-12 md:gap-3">
                    {allMonths.map((month) => {
                        const isPeak = peak_labour_periods.some(p => p.includes(month));
                        return (
                            <div
                                key={month}
                                className={`text-center py-4 rounded-2xl border transition-all ${isPeak
                                        ? 'bg-brand-green border-brand-green text-white font-black shadow-lg shadow-brand-green/20'
                                        : 'bg-white/50 border-brand-green/5 text-brand-olive font-bold opacity-40'
                                    }`}
                            >
                                <TD value={month} as="span" className="text-xs uppercase tracking-widest" />
                                {isPeak && <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 2 }} className="w-1.5 h-1.5 bg-white rounded-full mx-auto mt-2" />}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Phases Timeline */}
            <div className="mb-16">
                <h4 className="text-[11px] font-black text-brand-dark uppercase tracking-[0.25em] mb-8 flex items-center gap-2 opacity-60">
                    <Hammer size={16} className="text-brand-green" /> <T>Strategic Execution Phases</T>
                </h4>
                <div className="max-w-4xl">
                    {labour_phases.map((phase, idx) => (
                        <LabourPhaseCard key={idx} phase={phase} idx={idx} area={land_area} />
                    ))}
                </div>
            </div>

            {/* Machinery Section */}
            {machinery_options.length > 0 && (
                <div className="bg-brand-dark rounded-[2.5rem] p-8 md:p-12 relative overflow-hidden mb-10">
                    <div className="absolute top-0 right-0 p-10 opacity-5">
                        <Tractor size={150} className="text-white" />
                    </div>

                    <h4 className="text-xl font-black text-white uppercase tracking-tight mb-8 relative z-10 flex items-center gap-3">
                        <Zap className="text-brand-green fill-brand-green" size={24} />
                        <T>Machinery & Automation Alternatives</T>
                    </h4>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
                        {machinery_options.map((option, idx) => (
                            <div key={idx} className="bg-white/5 border border-white/10 p-6 rounded-[2rem] flex flex-col items-center text-center group hover:bg-white/10 transition-all">
                                <Tractor className="text-brand-green mb-4 opacity-50 group-hover:opacity-100 transition-opacity" size={40} />
                                <TD value={option.name} as="h5" className="text-base font-black text-white uppercase tracking-tight mb-2" />
                                <p className="text-[10px] font-black text-brand-green uppercase tracking-widest mb-4"><T>Rental</T>: <TD value={option.rental} /></p>
                                <div className="bg-brand-green/20 px-4 py-2 rounded-xl border border-brand-green/20 w-full">
                                    <p className="text-[10px] font-black text-white uppercase tracking-widest"><T>Saves</T> <TD value={option.saving} /> <T>Labour Time</T></p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Booking Tip */}
            <div className="bg-white/50 p-6 rounded-[2rem] border-2 border-dashed border-brand-green/20 flex flex-col md:flex-row items-center gap-6">
                <div className="w-14 h-14 bg-brand-green/10 rounded-2xl flex items-center justify-center text-brand-green shrink-0">
                    <HelpCircle size={30} />
                </div>
                <div>
                    <T as="p" className="text-[10px] font-black text-brand-green uppercase tracking-[0.2em] mb-1">Strategic Labour Pro-Tip</T>
                    <TD value={booking_tip} as="p" className="text-sm font-bold text-brand-dark italic opacity-80 leading-relaxed" prefix='"' suffix='"' />
                </div>
            </div>
        </motion.div>
    );
};

export default LabourPlannerCard;
