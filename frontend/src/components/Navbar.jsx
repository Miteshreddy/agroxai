import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Leaf, History, Home as HomeIcon, Sprout, LogOut, User, Wheat, Sun, Moon, Cpu } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import LanguageSwitcher from './LanguageSwitcher';
import T from './T';
import { useLanguage } from '../context/LanguageContext';

const Navbar = () => {
    const { user, logout } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const { t } = useLanguage();
    const navigate = useNavigate();
    const location = useLocation();
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 80);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const navLinks = [
        { path: '/', labelKey: 'navHome', icon: <HomeIcon size={18} /> },
        { path: '/recommend', labelKey: 'navRecommend', icon: <Sprout size={18} /> },
        { path: '/my-farm', labelKey: 'navMyFarm', icon: <Wheat size={18} /> },
        { path: '/history', labelKey: 'navHistory', icon: <History size={18} /> },
        { path: '/intelligence', labelKey: 'navIntelligence', icon: <Cpu size={18} /> },
    ];

    return (
        <nav
            className={`fixed top-0 left-0 w-full z-[100] transition-all duration-500 ${isScrolled ? 'py-4' : 'py-8'}`}
        >
            <div className="max-w-7xl mx-auto px-6">
                <div className={`flex items-center justify-between transition-all duration-500 px-6 py-3 rounded-[2rem] ${isScrolled
                    ? 'glass-panel'
                    : 'bg-transparent border border-transparent'
                    }`}>
                    <Link to="/" className="flex items-center space-x-3 px-2 group">
                        <div
                            className="w-10 h-10 bg-brand-primary rounded-xl flex items-center justify-center shadow-premium transition-all group-hover:rotate-12 group-hover:scale-110"
                        >
                            <Leaf className="text-white" size={20} />
                        </div>
                        <span className="text-xl font-black tracking-tighter text-brand-text-primary hidden md:block uppercase">
                            Agro<span className="text-brand-primary italic">XAI</span>
                        </span>
                    </Link>

                    <div className="flex items-center space-x-2 md:space-x-6">
                        {user && navLinks.map((link) => {
                            const isActive = location.pathname === link.path;
                            return (
                                <Link
                                    key={link.path}
                                    to={link.path}
                                    className={`text-xs font-black uppercase tracking-widest flex items-center space-x-2 px-3 py-2 rounded-xl transition-all duration-300 group ${
                                        isActive 
                                            ? 'text-brand-primary bg-brand-primary/5' 
                                            : 'text-brand-text-secondary hover:text-brand-primary hover:bg-brand-primary/5'
                                    }`}
                                >
                                    <span className={`transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`}>
                                        {link.icon}
                                    </span>
                                    <span className="hidden sm:block">{t(link.labelKey)}</span>
                                </Link>
                            );
                        })}

                        {/* Language Switcher */}
                        <div className="pl-2 border-l border-brand-border ml-2">
                            <LanguageSwitcher />
                        </div>

                        {/* Theme Switcher */}
                        <button
                            onClick={toggleTheme}
                            className="p-2.5 bg-brand-primary/5 hover:bg-brand-primary/10 text-brand-primary rounded-xl border border-brand-primary/15 transition-all flex items-center justify-center cursor-pointer ml-2 relative overflow-hidden"
                            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                        >
                            <motion.div
                                key={theme}
                                initial={{ y: -20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                exit={{ y: 20, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                            >
                                {theme === 'dark' ? (
                                    <Sun size={15} />
                                ) : (
                                    <Moon size={15} />
                                )}
                            </motion.div>
                        </button>

                        {user && (
                            <div className="flex items-center gap-4 pl-4 border-l border-brand-border ml-2">
                                <div className="hidden lg:flex items-center gap-2">
                                    <div className="w-8 h-8 bg-brand-primary/10 rounded-lg flex items-center justify-center text-brand-primary">
                                        <User size={16} />
                                    </div>
                                    <span className="text-[10px] font-black text-brand-text-primary uppercase tracking-wider">Hi, {user.username}</span>
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className="p-2.5 hover:bg-red-500/10 text-brand-text-secondary hover:text-red-500 rounded-xl transition-all group"
                                    title="Logout"
                                >
                                    <LogOut size={18} className="group-hover:translate-x-0.5 transition-transform" />
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
