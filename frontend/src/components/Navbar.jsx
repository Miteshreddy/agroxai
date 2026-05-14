import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Leaf, History, Home as HomeIcon, Sprout, LogOut, User, Wheat, Sun, Moon, Cpu, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
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
    const [mobileOpen, setMobileOpen] = useState(false);
    const isHome = location.pathname === '/';

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 40);
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => { setMobileOpen(false); }, [location.pathname]);

    const handleLogout = () => { logout(); navigate('/login'); };

    const navLinks = [
        { path: '/', labelKey: 'navHome', icon: <HomeIcon size={14} /> },
        { path: '/recommend', labelKey: 'navRecommend', icon: <Sprout size={14} /> },
        { path: '/my-farm', labelKey: 'navMyFarm', icon: <Wheat size={14} /> },
        { path: '/history', labelKey: 'navHistory', icon: <History size={14} /> },
        { path: '/intelligence', labelKey: 'navIntelligence', icon: <Cpu size={14} /> },
    ];

    const navBg = isScrolled ? 'glass-panel-premium' : 'bg-transparent border-transparent';

    const textPrimary = 'text-brand-text-primary';
    const textSecondary = 'text-brand-text-secondary';
    const textTertiary = 'text-brand-text-tertiary';
    const hoverText = 'hover:text-brand-primary';
    const activeBg = 'bg-brand-primary/8 text-brand-primary';
    const btnBg = 'bg-brand-primary/5 border-brand-border hover:bg-brand-primary/10';
    const btnText = 'text-brand-text-secondary hover:text-brand-primary';

    return (
        <>
            <nav className={`fixed top-0 left-0 w-full z-[100] transition-all duration-500 ${isScrolled ? 'py-3' : 'py-4'}`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6">
                    <div className={`flex items-center justify-between transition-all duration-500 px-4 sm:px-5 py-2 rounded-2xl border ${navBg}`}>
                        {/* Logo */}
                        <Link to="/" className="flex items-center gap-2 group">
                            <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center shadow-glow-sm transition-all group-hover:shadow-glow group-hover:scale-105 duration-300">
                                <Leaf className="text-white" size={15} />
                            </div>
                            <span className={`text-base font-bold tracking-tight hidden sm:block font-display ${isHome ? 'text-white/80' : 'text-brand-text-primary'}`}>
                                Agro<span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">XAI</span>
                            </span>
                        </Link>

                        {/* Desktop Links */}
                        <div className="hidden lg:flex items-center gap-0.5">
                            {user && navLinks.map((link) => {
                                const isActive = location.pathname === link.path;
                                return (
                                    <Link key={link.path} to={link.path}
                                        className={`relative text-[12px] font-medium flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all duration-300 ${
                                            isActive ? activeBg : `${textSecondary} ${hoverText}`
                                        }`}>
                                        <span className={`transition-colors ${isActive ? '' : textTertiary}`}>{link.icon}</span>
                                        <span>{t(link.labelKey)}</span>
                                    </Link>
                                );
                            })}
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-1.5">
                            <div className="hidden sm:block"><LanguageSwitcher compact /></div>
                            <button onClick={toggleTheme}
                                className={`no-scale w-8 h-8 flex items-center justify-center rounded-lg border transition-all duration-300 ${btnBg} ${btnText}`}>
                                <AnimatePresence mode="wait">
                                    <motion.div key={theme} initial={{rotate:-90,opacity:0,scale:0.5}} animate={{rotate:0,opacity:1,scale:1}} exit={{rotate:90,opacity:0,scale:0.5}} transition={{duration:0.2}}>
                                        {theme === 'dark' ? <Sun size={13} /> : <Moon size={13} />}
                                    </motion.div>
                                </AnimatePresence>
                            </button>
                            {user && (
                                <div className="hidden lg:flex items-center gap-1.5 pl-2 ml-1 border-l border-white/[0.06]">
                                    <div className={`flex items-center gap-1.5 ${textSecondary}`}>
                                        <div className="w-7 h-7 bg-emerald-500/10 rounded-lg flex items-center justify-center text-emerald-400 border border-emerald-500/10">
                                            <User size={12} />
                                        </div>
                                        <span className="text-[11px] font-medium">{user.username}</span>
                                    </div>
                                    <button onClick={handleLogout} className="no-scale p-1.5 hover:bg-red-500/10 text-white/20 hover:text-red-400 rounded-lg transition-all">
                                        <LogOut size={13} />
                                    </button>
                                </div>
                            )}
                            <button onClick={() => setMobileOpen(!mobileOpen)}
                                className={`no-scale lg:hidden w-8 h-8 flex items-center justify-center rounded-lg border transition-all ${btnBg} ${btnText}`}>
                                {mobileOpen ? <X size={14} /> : <Menu size={14} />}
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Mobile Menu */}
            <AnimatePresence>
                {mobileOpen && (
                    <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} transition={{duration:0.2}}
                        className="fixed inset-0 z-[99] bg-brand-surface/95 dark:bg-[#060B18]/98 backdrop-blur-3xl flex flex-col pt-24 px-6 pb-8 lg:hidden">
                        <div className="flex-1 space-y-1">
                            {user && navLinks.map((link, i) => {
                                const isActive = location.pathname === link.path;
                                return (
                                    <motion.div key={link.path} initial={{opacity:0,x:-20}} animate={{opacity:1,x:0}} transition={{delay:i*0.05}}>
                                        <Link to={link.path} onClick={() => setMobileOpen(false)}
                                            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                                                isActive ? 'text-emerald-500 bg-emerald-500/10 dark:text-emerald-400' : 'text-brand-text-secondary hover:text-brand-text-primary hover:bg-brand-surface-hover dark:text-white/30 dark:hover:text-white/50 dark:hover:bg-white/[0.03]'
                                            }`}>
                                            {link.icon}
                                            <span>{t(link.labelKey)}</span>
                                        </Link>
                                    </motion.div>
                                );
                            })}
                        </div>
                        <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:0.3}}
                            className="space-y-3 pt-6 border-t border-brand-border dark:border-white/[0.04]">
                            <div className="flex items-center justify-between">
                                <LanguageSwitcher />
                                <button onClick={toggleTheme} className="no-scale w-9 h-9 flex items-center justify-center rounded-lg bg-brand-surface text-brand-text-secondary border border-brand-border dark:bg-white/[0.04] dark:text-white/30 dark:border-white/[0.06]">
                                    {theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
                                </button>
                            </div>
                            {user && (
                                <div className="flex items-center justify-between bg-brand-surface rounded-xl px-4 py-3 border border-brand-border dark:bg-white/[0.02] dark:border-white/[0.04]">
                                    <div className="flex items-center gap-2">
                                        <div className="w-7 h-7 bg-emerald-500/10 rounded-lg flex items-center justify-center text-emerald-500 dark:text-emerald-400"><User size={12} /></div>
                                        <span className="text-xs font-medium text-brand-text-secondary dark:text-white/50">{user.username}</span>
                                    </div>
                                    <button onClick={handleLogout} className="no-scale text-[11px] font-medium text-red-500 hover:bg-red-500/10 dark:text-red-400 px-3 py-1 rounded-lg transition-all">Logout</button>
                                </div>
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default Navbar;
