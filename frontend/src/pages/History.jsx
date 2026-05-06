import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { History as HistoryIcon, Trash2, ShieldCheck, Sprout } from 'lucide-react';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import CountUp from 'react-countup';
import T from '../components/T';
import { CardSkeleton } from '../components/Skeleton';

const getApiUrl = () => {
    const url = import.meta.env.VITE_API_URL || 'https://agroxai.onrender.com/api';
    return url.endsWith('/api') ? url : `${url}/api`;
};

const apiClient = axios.create({
    baseURL: getApiUrl(),
});

const getSoilAdvice = (values) => {
    if (!values) return "Optimal";
    const recs = [];
    if (values.N < 50) recs.push("Add N");
    if (values.P < 40) recs.push("Add P");
    if (values.K < 40) recs.push("Add K");
    if (values.ph < 6.0) recs.push("Add Lime");
    if (values.ph > 7.5) recs.push("Add Gypsum");
    return recs.length > 0 ? recs.join(", ") : "Balanced Soil";
};

const History = () => {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchHistory();
    }, []);

    const fetchHistory = async () => {
        try {
            const response = await apiClient.get('/history');
            setHistory(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching history:', error);
            setLoading(false);
        }
    };

    const deleteItem = async (id) => {
        try {
            await apiClient.delete(`/history/${id}`);
            setHistory(history.filter(item => item._id !== id));
            toast.success('Record removed');
        } catch (error) {
            toast.error('Failed to delete');
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.35, ease: "easeInOut" }}
            className="bg-brand-bg min-h-screen pt-32 pb-20 px-6"
        >
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <T as="h1" className="text-5xl font-black text-brand-text-primary mb-4 uppercase tracking-tight">Record History</T>
                        <T as="p" className="text-brand-text-secondary font-medium">Tracking every analytical decision made for your farm infrastructure.</T>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white px-8 py-5 rounded-[2rem] border border-slate-100 shadow-premium flex items-center gap-6"
                    >
                        <div className="text-right">
                            <T as="p" className="text-[10px] uppercase font-black text-brand-text-secondary tracking-widest opacity-60">Total Analyses</T>
                            <p className="text-3xl font-black text-brand-primary leading-none">
                                <CountUp end={history.length} duration={1.5} />
                            </p>
                        </div>
                        <div className="w-12 h-12 bg-brand-primary/10 rounded-xl flex items-center justify-center text-brand-primary shadow-sm">
                            <ShieldCheck size={24} />
                        </div>
                    </motion.div>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[...Array(6)].map((_, i) => (
                            <CardSkeleton key={i} />
                        ))}
                    </div>
                ) : history.length > 0 ? (
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="glass-card !p-0 overflow-hidden bg-white border border-slate-100"
                    >
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-slate-50/50 border-b border-slate-100">
                                    <tr>
                                        <T as="th" className="px-8 py-6 text-[10px] font-black uppercase text-brand-text-secondary tracking-[0.2em]">Prediction (Crop & Soil)</T>
                                        <T as="th" className="px-8 py-6 text-[10px] font-black uppercase text-brand-text-secondary tracking-[0.2em]">Confidence</T>
                                        <T as="th" className="px-8 py-6 text-[10px] font-black uppercase text-brand-text-secondary tracking-[0.2em]">Condition</T>
                                        <T as="th" className="px-8 py-6 text-[10px] font-black uppercase text-brand-text-secondary tracking-[0.2em]">Growth Period</T>
                                        <T as="th" className="px-8 py-6 text-[10px] font-black uppercase text-brand-text-secondary tracking-[0.2em]">Soil Type</T>
                                        <T as="th" className="px-8 py-6 text-[10px] font-black uppercase text-brand-text-secondary tracking-[0.2em]">Date</T>
                                        <T as="th" className="px-8 py-6 text-[10px] font-black uppercase text-brand-text-secondary tracking-[0.2em]">Action</T>
                                    </tr>
                                </thead>
                                <tbody>
                                    {history.map((record, idx) => (
                                        <motion.tr
                                            key={record._id || idx}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.5, delay: idx * 0.05 }}
                                            className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors group"
                                        >
                                            <td className="px-8 py-7">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 bg-brand-primary/10 rounded-xl flex items-center justify-center text-brand-primary group-hover:scale-110 transition-transform shadow-sm">
                                                        <Sprout size={24} />
                                                    </div>
                                                    <div>
                                                        <span className="font-black text-brand-text-primary uppercase italic tracking-tighter text-xl block leading-tight">{record.result?.crop || 'Unknown'}</span>
                                                        <p className="text-[10px] font-black text-brand-primary uppercase tracking-[0.1em] opacity-80">{getSoilAdvice(record.result?.mapped_values)}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-7">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-24 h-2 bg-slate-100 rounded-full overflow-hidden">
                                                        <motion.div
                                                            initial={{ width: 0 }}
                                                            animate={{ width: `${(record.result?.confidence || 0) * 100}%` }}
                                                            transition={{ duration: 1.5, ease: "easeOut", delay: 0.3 + (idx * 0.05) }}
                                                            className="h-full bg-brand-primary"
                                                        />
                                                    </div>
                                                    <span className="text-xs font-black text-brand-text-primary">{((record.result?.confidence || 0) * 100).toFixed(0)}%</span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-7">
                                                <p className="text-brand-text-primary font-bold text-sm mb-0.5">{record.inputs.season}</p>
                                                <T as="p" className="text-[10px] uppercase font-black text-brand-text-secondary opacity-40 tracking-widest">{record.inputs.temperature}°C Engine Read</T>
                                            </td>
                                            <td className="px-8 py-7">
                                                <span className="px-3 py-1 bg-brand-primary/10 text-brand-primary rounded-lg text-xs font-black uppercase italic">
                                                    {record.result?.total_duration || 'N/A'}
                                                </span>
                                            </td>
                                            <td className="px-8 py-7 text-brand-text-primary font-bold text-sm tracking-wide">{record.inputs.soil_type}</td>
                                            <td className="px-8 py-7 text-brand-text-secondary font-bold text-sm">{new Date(record.createdAt).toLocaleDateString()}</td>
                                            <td className="px-8 py-7 text-right">
                                                <motion.button
                                                    whileHover={{ scale: 1.1, backgroundColor: '#EF4444', color: '#FFFFFF' }}
                                                    whileTap={{ scale: 0.95 }}
                                                    onClick={() => deleteItem(record._id)}
                                                    className="w-10 h-10 bg-slate-50 text-slate-400 rounded-xl flex items-center justify-center transition-all shadow-sm border border-slate-100"
                                                >
                                                    <Trash2 size={18} />
                                                </motion.button>
                                            </td>
                                        </motion.tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </motion.div>
                ) : !loading && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center py-40 glass-card bg-white"
                    >
                        <div className="w-24 h-24 bg-brand-primary/10 rounded-[2.5rem] mx-auto flex items-center justify-center text-brand-primary mb-10 shadow-premium">
                            <HistoryIcon size={48} />
                        </div>
                        <T as="h2" className="text-4xl font-black text-brand-text-primary mb-4 uppercase tracking-tight">No analysis data found</T>
                        <T as="p" className="text-brand-text-secondary font-medium mb-12 max-w-sm mx-auto">Start a new recommendation to seed your analytical history with precision data.</T>
                        <motion.div
                            whileHover={{ scale: 1.04 }}
                            whileTap={{ scale: 0.96 }}
                            style={{ display: 'inline-block' }}
                        >
                            <Link to="/recommend" className="btn-primary">
                                <T>Start First Analysis</T>
                            </Link>
                        </motion.div>
                    </motion.div>
                )}
            </div>
        </motion.div>
    );
};

export default History;
