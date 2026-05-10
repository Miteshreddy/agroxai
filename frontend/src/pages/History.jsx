import React, { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import { History as HistoryIcon, Sprout } from 'lucide-react';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import T from '../components/T';
import { CardSkeleton } from '../components/Skeleton';

// New Components
import HistoryAnalytics from '../components/history/HistoryAnalytics';
import HistoryFilterBar from '../components/history/HistoryFilterBar';
import HistoryCard from '../components/history/HistoryCard';
import HistoryDetailsModal from '../components/history/HistoryDetailsModal';
import { generateAnalytics, generateAIInsights } from '../utils/historyUtils';

const getApiUrl = () => {
    const url = import.meta.env.VITE_API_URL || 'https://agroxai.onrender.com/api';
    return url.endsWith('/api') ? url : `${url}/api`;
};

const apiClient = axios.create({
    baseURL: getApiUrl(),
});

const History = () => {
    const { user } = useAuth();
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    // Filter & Sort State
    const [searchQuery, setSearchQuery] = useState('');
    const [filterFavorites, setFilterFavorites] = useState(false);
    const [sortBy, setSortBy] = useState('date-desc'); // date-desc, date-asc, confidence-desc, confidence-asc

    // Modal State
    const [selectedRecord, setSelectedRecord] = useState(null);

    useEffect(() => {
        if (user) {
            fetchHistory();
        }
    }, [user]);

    const fetchHistory = async () => {
        try {
            const response = await apiClient.get(`/history/user/${user.id}`);
            const data = response.data.data || response.data;
            setHistory(Array.isArray(data) ? data : []);
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
            if (selectedRecord && selectedRecord._id === id) setSelectedRecord(null);
            toast.success('Analysis record deleted');
        } catch (error) {
            toast.error('Failed to delete record');
        }
    };

    const handleToggleFavorite = async (record) => {
        try {
            const newStatus = !record.bookmarked;
            await apiClient.patch(`/history/${record._id}`, { bookmarked: newStatus });
            setHistory(history.map(item => item._id === record._id ? { ...item, bookmarked: newStatus } : item));
            if (newStatus) toast.success('Added to favorites', { icon: '⭐' });
        } catch (error) {
            toast.error('Failed to update favorite status');
        }
    };

    const handleUpdateNotes = async (id, notes) => {
        try {
            await apiClient.patch(`/history/${id}`, { notes });
            setHistory(history.map(item => item._id === id ? { ...item, notes } : item));
            toast.success('Notes saved successfully');
        } catch (error) {
            toast.error('Failed to save notes');
        }
    };

    // Derived State
    const filteredAndSortedHistory = useMemo(() => {
        let result = [...history];

        // 1. Filter Favorites
        if (filterFavorites) {
            result = result.filter(item => item.bookmarked);
        }

        // 2. Search Query (Crop, Farm, Soil)
        if (searchQuery.trim() !== '') {
            const query = searchQuery.toLowerCase();
            result = result.filter(item => {
                const crop = (item.predictionResult?.crop || '').toLowerCase();
                const farm = (item.farmName || item.location || '').toLowerCase();
                const soil = (item.soilType || '').toLowerCase();
                return crop.includes(query) || farm.includes(query) || soil.includes(query);
            });
        }

        // 3. Sort
        result.sort((a, b) => {
            if (sortBy === 'date-desc') return new Date(b.createdAt) - new Date(a.createdAt);
            if (sortBy === 'date-asc') return new Date(a.createdAt) - new Date(b.createdAt);
            
            const confA = a.predictionResult?.confidence || 0;
            const confB = b.predictionResult?.confidence || 0;
            if (sortBy === 'confidence-desc') return confB - confA;
            if (sortBy === 'confidence-asc') return confA - confB;
            
            return 0;
        });

        return result;
    }, [history, filterFavorites, searchQuery, sortBy]);

    // Analytics based ONLY on filtered data (so charts update interactively)
    const analytics = useMemo(() => generateAnalytics(filteredAndSortedHistory), [filteredAndSortedHistory]);
    const insights = useMemo(() => generateAIInsights(analytics, filteredAndSortedHistory), [analytics, filteredAndSortedHistory]);

    return (
        <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.35, ease: "easeInOut" }}
            className="bg-brand-bg min-h-screen pt-32 pb-20 px-6"
        >
            <div className="max-w-[90rem] mx-auto">
                
                {/* Header */}
                <div className="mb-12">
                    <T as="h1" className="text-4xl md:text-5xl font-black text-brand-text-primary mb-4 uppercase tracking-tight">AI Analytics Center</T>
                    <T as="p" className="text-brand-text-secondary font-medium max-w-2xl">
                        Your complete history of predictive analytics, environmental metrics, and crop recommendations.
                    </T>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[...Array(8)].map((_, i) => <CardSkeleton key={i} />)}
                    </div>
                ) : history.length > 0 ? (
                    <div className="space-y-12">
                        {/* 1. Analytics Dashboard */}
                        <HistoryAnalytics analytics={analytics} insights={insights} />

                        {/* 2. Filter Bar */}
                        <div>
                            <HistoryFilterBar 
                                searchQuery={searchQuery} setSearchQuery={setSearchQuery}
                                filterFavorites={filterFavorites} setFilterFavorites={setFilterFavorites}
                                sortBy={sortBy} setSortBy={setSortBy}
                            />

                            {/* 3. Cards Grid */}
                            {filteredAndSortedHistory.length > 0 ? (
                                <motion.div layout className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                    <AnimatePresence>
                                        {filteredAndSortedHistory.map((record) => (
                                            <HistoryCard 
                                                key={record._id} 
                                                record={record} 
                                                onOpenDetails={setSelectedRecord}
                                                onDelete={deleteItem}
                                                onToggleFavorite={handleToggleFavorite}
                                            />
                                        ))}
                                    </AnimatePresence>
                                </motion.div>
                            ) : (
                                <div className="py-20 text-center bg-brand-surface rounded-3xl border border-brand-border">
                                    <SearchIcon size={48} className="mx-auto text-brand-text-tertiary mb-4 opacity-50" />
                                    <T as="h3" className="text-xl font-black text-brand-text-primary uppercase tracking-widest mb-2">No Results Found</T>
                                    <T as="p" className="text-sm font-bold text-brand-text-secondary">Try adjusting your search or filters.</T>
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    /* Empty State */
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center py-32 premium-card max-w-3xl mx-auto"
                    >
                        <div className="w-24 h-24 bg-brand-primary/10 rounded-full mx-auto flex items-center justify-center text-brand-primary mb-8 shadow-premium">
                            <HistoryIcon size={40} />
                        </div>
                        <T as="h2" className="text-3xl md:text-4xl font-black text-brand-text-primary mb-4 uppercase tracking-tight">Data Vault Empty</T>
                        <T as="p" className="text-brand-text-secondary font-medium mb-10 max-w-md mx-auto leading-relaxed">
                            Start a new AI precision analysis to seed your dashboard with environmental data, crop mapping, and actionable insights.
                        </T>
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            style={{ display: 'inline-block' }}
                        >
                            <Link to="/recommend" className="btn-primary py-4 px-8 text-sm flex items-center gap-2">
                                <Sprout size={18} />
                                <T>Start First Analysis</T>
                            </Link>
                        </motion.div>
                    </motion.div>
                )}

            </div>

            {/* Modal Drawer */}
            <HistoryDetailsModal 
                record={selectedRecord} 
                onClose={() => setSelectedRecord(null)} 
                onUpdateNotes={handleUpdateNotes}
            />

        </motion.div>
    );
};

// Quick helper for empty search state
const SearchIcon = ({ className, size }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <circle cx="11" cy="11" r="8"></circle>
        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
    </svg>
);

export default History;
