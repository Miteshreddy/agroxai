import React, { useState } from 'react';
import T, { TD } from './T';
import { motion, AnimatePresence } from 'framer-motion';
import { Building2, ChevronDown, ChevronUp, Copy, ExternalLink, PhoneCall, HelpCircle, CheckCircle2, BookmarkCheck, FileText, Info } from 'lucide-react';
import toast from 'react-hot-toast';
import { useLanguage } from '../context/LanguageContext';

const SchemeAccordion = ({ scheme, isSpecific, cropName }) => {
    const [isOpen, setIsOpen] = useState(false);
    const { t } = useLanguage();

    const handleCopy = (e) => {
        e.stopPropagation();
        navigator.clipboard.writeText(scheme.name);
        toast.success(t('Scheme name copied to clipboard!') || 'Scheme name copied to clipboard!');
    };

    return (
        <div className={`overflow-hidden rounded-3xl border transition-all duration-300 mb-4 ${isSpecific
                ? 'bg-brand-green/5 border-brand-green/20'
                : 'bg-white border-brand-green/10'
            }`}>
            <div
                className="p-6 cursor-pointer flex items-center justify-between gap-4"
                onClick={() => setIsOpen(!isOpen)}
            >
                <div className="flex items-center gap-4 flex-grow">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${isSpecific ? 'bg-brand-green text-white' : 'bg-brand-green/10 text-brand-green'}`}>
                        <Building2 size={24} />
                    </div>
                    <div className="flex-grow">
                        <div className="flex items-center gap-2 mb-1">
                            <TD value={scheme.name} as="h4" className="font-black text-brand-dark uppercase tracking-tight text-lg" />
                            {isSpecific && (
                                <span className="bg-brand-green/20 text-brand-green text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest border border-brand-green/20">
                                    <T>For</T> {cropName}
                                </span>
                            )}
                        </div>
                        <TD value={scheme.benefit} as="p" className="text-sm text-brand-olive font-medium line-clamp-1" />
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={handleCopy}
                        className="p-2 hover:bg-brand-green/10 rounded-xl text-brand-olive hover:text-brand-green transition-colors"
                        title="Copy Scheme Name"
                    >
                        <Copy size={18} />
                    </button>
                    <div className="text-brand-green ml-2">
                        {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                    </div>
                </div>
            </div>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <div className="px-6 pb-6 pt-2 space-y-6 border-t border-brand-green/10">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <div>
                                        <h5 className="text-[10px] font-black text-brand-olive uppercase tracking-[0.2em] mb-2 flex items-center gap-2 opacity-60">
                                            <Info size={12} /> <T>Full Name & Eligibility</T>
                                        </h5>
                                        <TD value={scheme.fullName} as="p" className="text-xs font-black text-brand-dark mb-1" />
                                        <TD value={scheme.eligibility} as="p" className="text-sm text-brand-olive font-medium leading-relaxed italic" />
                                    </div>
                                    <div>
                                        <h5 className="text-[10px] font-black text-brand-olive uppercase tracking-[0.2em] mb-2 flex items-center gap-2 opacity-60">
                                            <HelpCircle size={12} /> <T>How to Apply</T>
                                        </h5>
                                        <TD value={scheme.howToApply} as="p" className="text-sm text-brand-olive font-bold leading-relaxed" />
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <h5 className="text-[10px] font-black text-brand-olive uppercase tracking-[0.2em] mb-2 flex items-center gap-2 opacity-60">
                                            <FileText size={12} /> <T>Required Documents</T>
                                        </h5>
                                        <div className="flex flex-wrap gap-2">
                                            {scheme.documents.map((doc, idx) => (
                                                <span key={idx} className="bg-white px-3 py-1.5 rounded-xl border border-brand-green/10 text-[10px] font-bold text-brand-dark flex items-center gap-1">
                                                    <CheckCircle2 size={10} className="text-brand-green" /> <TD value={doc} />
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="pt-2">
                                        <a
                                            href={scheme.website}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-2 bg-brand-dark text-white px-5 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-brand-green transition-all group"
                                        >
                                            <T>Visit Official Website</T> <ExternalLink size={14} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const GovernmentSchemesCard = ({ schemesData, cropName }) => {
    if (!schemesData) return null;

    const { universal_schemes, crop_specific_schemes, state_schemes_note, kisan_helpline } = schemesData;

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mt-8 glass-card border-brand-green/10"
        >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 pb-6 border-b border-brand-green/10 text-center md:text-left">
                <div>
                    <h3 className="text-3xl font-black text-brand-dark uppercase tracking-tight flex items-center gap-3 justify-center md:justify-start italic">
                        🏛️ <span className="text-brand-green"><T>Government</T></span> <T>Support</T>
                    </h3>
                    <T as="p" className="text-brand-olive font-medium text-sm mt-1">Official subsidies, income support, and insurance schemes for your crop.</T>
                </div>
                <div className="bg-brand-green text-white px-6 py-4 rounded-[2rem] border-4 border-white shadow-xl flex items-center gap-4 justify-center">
                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                        <PhoneCall size={20} />
                    </div>
                    <div>
                        <T as="p" className="text-[10px] font-black uppercase tracking-widest opacity-80 leading-none mb-1">Kisan Helpline</T>
                        <p className="text-lg font-black">{kisan_helpline}</p>
                    </div>
                </div>
            </div>

            {/* Crop Specific Section */}
            {crop_specific_schemes.length > 0 && (
                <div className="mb-10">
                    <h4 className="text-[11px] font-black text-brand-dark uppercase tracking-[0.25em] mb-6 flex items-center gap-2 opacity-60">
                        <BookmarkCheck className="text-brand-green" size={16} /> <T>Targeted Schemes for</T> {cropName}
                    </h4>
                    <div className="space-y-2">
                        {crop_specific_schemes.map((scheme, idx) => (
                            <SchemeAccordion key={idx} scheme={scheme} isSpecific={true} cropName={cropName} />
                        ))}
                    </div>
                </div>
            )}

            {/* Universal Section */}
            <div>
                <h4 className="text-[11px] font-black text-brand-dark uppercase tracking-[0.25em] mb-6 flex items-center gap-2 opacity-60">
                    <CheckCircle2 size={16} /> <T>Universal Farmer Support</T>
                </h4>
                <div className="space-y-2">
                    {universal_schemes.map((scheme, idx) => (
                        <SchemeAccordion key={idx} scheme={scheme} isSpecific={false} />
                    ))}
                </div>
            </div>

            {/* Context Note */}
            <div className="mt-10 p-5 bg-brand-green/5 border border-brand-green/10 rounded-2xl flex items-center gap-4">
                <Info className="text-brand-green shrink-0" size={20} />
                <p className="text-xs text-brand-olive font-bold italic leading-relaxed">
                    <T>Note:</T> <TD value={state_schemes_note} />
                </p>
            </div>
        </motion.div>
    );
};

export default GovernmentSchemesCard;
