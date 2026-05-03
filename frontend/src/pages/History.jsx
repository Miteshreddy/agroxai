import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { History as HistoryIcon, Trash2, ShieldCheck, Sprout } from 'lucide-react';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import CountUp from 'react-countup';
import T from '../components/T';

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
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/history`);
            setHistory(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching history:', error);
            setLoading(false);
        }
    };

    const deleteItem = async (id) => {
        try {
            await axios.delete(`${import.meta.env.VITE_API_URL}/api/history/${id}`);
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
            className="bg-brand-cream min-h-screen pt-32 pb-20 px-6"
        >
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                    >
                        <T as="h1" className="text-5xl font-black text-brand-dark mb-4 uppercase tracking-tighter">Record History</T>
                        <T as="p" className="text-brand-olive font-medium">Tracking every analytical decision made for your farm infrastructure.</T>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="bg-white px-6 py-4 rounded-3xl border border-brand-green/5 shadow-xl flex items-center gap-4"
                    >
                        <div className="text-right">
                            <T as="p" className="text-[10px] uppercase font-black text-brand-olive tracking-widest">Total Analyses</T>
                            <p className="text-2xl font-black text-brand-green leading-none">
                                <CountUp end={history.length} duration={1.5} />
                            </p>
                        </div>
                        <div className="w-10 h-10 bg-brand-green/10 rounded-full flex items-center justify-center text-brand-green">
                            <ShieldCheck size={20} />
                        </div>
                    </motion.div>
                </div>

                {history.length > 0 ? (
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.15 }}
                        transition={{ duration: 0.45 }}
                        className="glass-card !p-0 overflow-hidden bg-white border-brand-green/10 shadow-2xl"
                    >
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-brand-green/5 border-b border-brand-green/10">
                                    <tr>
                                        <T as="th" className="px-8 py-6 text-xs font-black uppercase text-brand-olive tracking-[0.2em]">Prediction (Crop & Soil)</T>
                                        <T as="th" className="px-8 py-6 text-xs font-black uppercase text-brand-olive tracking-[0.2em]">Confidence</T>
                                        <T as="th" className="px-8 py-6 text-xs font-black uppercase text-brand-olive tracking-[0.2em]">Condition</T>
                                        <T as="th" className="px-8 py-6 text-xs font-black uppercase text-brand-olive tracking-[0.2em]">Soil Type</T>
                                        <T as="th" className="px-8 py-6 text-xs font-black uppercase text-brand-olive tracking-[0.2em]">Date</T>
                                        <T as="th" className="px-8 py-6 text-xs font-black uppercase text-brand-olive tracking-[0.2em]">Action</T>
                                    </tr>
                                </thead>
                                <tbody>
                                    {history.map((record, idx) => (
                                        <motion.tr
                                            key={record._id}
                                            initial={{ opacity: 0, y: 20 }}
                                            whileInView={{ opacity: 1, y: 0 }}
                                            viewport={{ once: true }}
                                            transition={{ duration: 0.45, delay: idx * 0.07 }}
                                            className="border-b border-brand-green/5 hover:bg-brand-green/[0.02] transition-colors group"
                                        >
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 bg-brand-green/10 rounded-xl flex items-center justify-center text-brand-green group-hover:scale-110 transition-transform">
                                                        <Sprout size={20} />
                                                    </div>
                                                    <div>
                                                        <span className="font-black text-brand-dark uppercase italic tracking-tighter text-lg block">{record.result.crop}</span>
                                                        <p className="text-[10px] font-bold text-brand-gold uppercase tracking-widest">{getSoilAdvice(record.result.mapped_values)}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-24 h-2 bg-brand-green/10 rounded-full overflow-hidden">
                                                        <motion.div
                                                            initial={{ width: 0 }}
                                                            whileInView={{ width: `${record.result.confidence * 100}%` }}
                                                            transition={{ duration: 1, ease: "easeOut", delay: 0.2 + (idx * 0.07) }}
                                                            className="h-full bg-brand-green"
                                                        />
                                                    </div>
                                                    <span className="text-xs font-bold text-brand-olive">{(record.result.confidence * 100).toFixed(0)}%</span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <p className="text-brand-dark font-bold text-sm">{record.inputs.season}</p>
                                                <T as="p" className="text-[10px] uppercase font-black text-brand-olive opacity-60 tracking-widest">{record.inputs.temperature}°C Engine Read</T>
                                            </td>
                                            <td className="px-8 py-6 text-brand-dark font-bold text-sm">{record.inputs.soil_type}</td>
                                            <td className="px-8 py-6 text-brand-olive font-bold text-sm">{new Date(record.createdAt).toLocaleDateString()}</td>
                                            <td className="px-8 py-6">
                                                <motion.button
                                                    whileHover={{ scale: 1.15 }}
                                                    whileTap={{ scale: 0.9 }}
                                                    onClick={() => deleteItem(record._id)}
                                                    className="w-10 h-10 bg-red-50 text-red-500 rounded-xl flex items-center justify-center hover:bg-red-500 hover:text-white transition-all shadow-sm"
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
                        <div className="w-24 h-24 bg-brand-green/10 rounded-[2rem] mx-auto flex items-center justify-center text-brand-green mb-8">
                            <HistoryIcon size={48} />
                        </div>
                        <T as="h2" className="text-3xl font-black text-brand-dark mb-4">No analysis data found</T>
                        <T as="p" className="text-brand-olive font-medium mb-10 max-w-sm mx-auto">Start a new recommendation to seed your analytical history.</T>
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
