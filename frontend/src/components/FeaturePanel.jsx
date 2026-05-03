import React, { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, VolumeX } from 'lucide-react';
import T from './T';
import { useLanguage } from '../context/LanguageContext';

const FeaturePanel = ({ activeTab, children }) => {
    const { language } = useLanguage();
    const contentRef = useRef(null);
    const [isSpeaking, setIsSpeaking] = useState(false);

    const handleReadAloud = () => {
        if (!('speechSynthesis' in window)) {
            alert('Text-to-speech is not supported in this browser.');
            return;
        }

        if (isSpeaking) {
            window.speechSynthesis.cancel();
            setIsSpeaking(false);
            return;
        }

        if (contentRef.current) {
            // A simple way to grab all text inside the panel
            const textToRead = contentRef.current.innerText;
            if (!textToRead || !textToRead.trim()) return;

            const utterance = new SpeechSynthesisUtterance(textToRead);
            utterance.lang = language === 'en' ? 'en-US' : (language === 'hi' ? 'hi-IN' : 'en-US'); 
            
            utterance.onend = () => setIsSpeaking(false);
            utterance.onerror = () => setIsSpeaking(false);
            
            window.speechSynthesis.speak(utterance);
            setIsSpeaking(true);
        }
    };

    // Ensure speech stops when tab changes
    useEffect(() => {
        if (isSpeaking) {
            window.speechSynthesis.cancel();
            setIsSpeaking(false);
        }
        return () => window.speechSynthesis.cancel();
    }, [activeTab]);

    return (
        <div className="flex-1 min-w-0">
            <div className="flex justify-end mb-4">
                <button 
                    onClick={handleReadAloud}
                    className="flex items-center gap-2 px-4 py-2 bg-white text-brand-dark border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors shadow-sm text-xs font-bold uppercase tracking-wider group"
                    title="Read content aloud"
                >
                    {isSpeaking ? (
                        <>
                            <VolumeX size={16} className="text-red-500" />
                            <T as="span" className="text-red-500">Stop Reading</T>
                        </>
                    ) : (
                        <>
                            <Volume2 size={16} className="text-brand-green group-hover:scale-110 transition-transform" />
                            <T as="span">Read Aloud</T>
                        </>
                    )}
                </button>
            </div>
            <div ref={contentRef} className="relative">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                    >
                        {children}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
};

export default FeaturePanel;
