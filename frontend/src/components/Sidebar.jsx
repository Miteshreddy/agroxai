import React from 'react';
import { motion } from 'framer-motion';
import { Brain, ShieldAlert, TestTube, LeafyGreen, IndianRupee, Activity, FileText, BookOpen, Users, Leaf } from 'lucide-react';
import T from './T';

export const TABS = [
    { id: 'ai', icon: Brain, label: 'AI Reasoning' },
    { id: 'risk', icon: ShieldAlert, label: 'Risk Analysis' },
    { id: 'soil_test', icon: TestTube, label: 'Soil Testing' },
    { id: 'soil_improve', icon: LeafyGreen, label: 'Soil Improvement' },
    { id: 'revenue', icon: IndianRupee, label: 'Market & Revenue' },
    { id: 'feasibility', icon: Activity, label: 'Feasibility Check' },
    { id: 'schemes', icon: FileText, label: 'Govt Schemes' },
    { id: 'guide', icon: BookOpen, label: 'Growing Guide' },
    { id: 'labour', icon: Users, label: 'Labour Planner' },
    { id: 'organic', icon: Leaf, label: 'Organic Farming' },
];

const Sidebar = ({ activeTab, setActiveTab }) => {
    return (
        <div className="w-full md:w-64 shrink-0 bg-white md:bg-transparent rounded-3xl md:rounded-none overflow-x-auto md:overflow-visible shadow-md md:shadow-none p-2 md:p-0 border border-gray-100 md:border-none mb-6 md:mb-0">
            <div className="flex flex-row md:flex-col gap-2 min-w-max md:min-w-0 md:sticky md:top-28">
                {TABS.map((tab) => {
                    const isActive = activeTab === tab.id;
                    const Icon = tab.icon;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-all relative outline-none focus:ring-2 focus:ring-brand-green/30 ${
                                isActive 
                                    ? 'bg-brand-dark text-white font-bold shadow-lg shadow-brand-dark/20' 
                                    : 'text-brand-olive hover:bg-white hover:shadow-sm font-medium border border-transparent hover:border-gray-100'
                            }`}
                        >
                            <Icon size={18} className={isActive ? 'text-brand-gold' : 'text-brand-green'} />
                            <T as="span" className="text-sm whitespace-nowrap">{tab.label}</T>
                            {isActive && (
                                <motion.div 
                                    layoutId="sidebar-active"
                                    className="absolute inset-0 border-2 border-brand-green rounded-2xl pointer-events-none hidden md:block"
                                    initial={false}
                                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                />
                            )}
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default Sidebar;
