import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Leaf, History, Home as HomeIcon, Sprout, LogOut, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import LanguageSwitcher from './LanguageSwitcher';
import T from './T';
import { useLanguage } from '../context/LanguageContext';

const Navbar = () => {
    const { user, logout } = useAuth();
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
        { path: '/history', labelKey: 'navHistory', icon: <History size={18} /> },
    ];

    return (
        <nav
            className={`fixed top-0 left-0 w-full z-[100] transition-all duration-300 ${isScrolled ? 'py-3' : 'py-6'}`}
            style={isScrolled ? {
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
                transition: 'all 0.4s ease'
            } : {
                transition: 'all 0.4s ease'
            }}
        >
            <div className={`max-w-7xl mx-auto px-6`}>
                <div className={`flex items-center justify-between transition-all duration-[0.4s] ease px-6 py-3 rounded-full ${isScrolled
                    ? 'bg-white/80 backdrop-blur-[16px] shadow-[0_4px_24px_rgba(0,0,0,0.15)] border border-white/20'
                    : 'bg-transparent border border-transparent'
                    }`}>
                    <Link to="/" className="flex items-center space-x-2 px-2 group">
                        <div
                            className="w-10 h-10 bg-brand-green rounded-full flex items-center justify-center shadow-lg transition-all group-hover:rotate-12"
                        >
                            <Leaf className="text-brand-gold" size={20} />
                        </div>
                        <span className="text-xl font-black tracking-tighter text-brand-dark hidden md:block uppercase">
                            Agro<span className="text-brand-green italic">XAI</span>
                        </span>
                    </Link>

                    <div className="flex items-center space-x-1 md:space-x-4">
                        {user && navLinks.map((link) => {
                            const isActive = location.pathname === link.path;
                            return (
                                <div key={link.path}>
                                    <Link
                                        to={link.path}
                                        className={`nav-link text-sm font-bold flex items-center space-x-2 px-2 relative ${isActive ? 'text-brand-green' : 'text-brand-olive'
                                            }`}
                                    >
                                        <span className={`transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`}>
                                            {link.icon}
                                        </span>
                                    <span className="hidden sm:block">{t(link.labelKey)}</span>
                                        {isActive && (
                                            <div
                                                className="absolute bottom-0 left-0 w-full h-0.5 bg-brand-green"
                                            />
                                        )}
                                    </Link>
                                </div>
                            );
                        })}

                        {/* Language Switcher — always visible */}
                        <LanguageSwitcher />

                        {user && (
                            <div className="flex items-center gap-4 pl-4 border-l border-brand-green/10 ml-2">
                                <div className="hidden lg:flex items-center gap-2">
                                    <div className="w-8 h-8 bg-brand-green/10 rounded-full flex items-center justify-center text-brand-green">
                                        <User size={16} />
                                    </div>
                                    <span className="text-xs font-black text-brand-dark uppercase tracking-tight">Hi, {user.username}</span>
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className="p-2 hover:bg-red-50 text-brand-olive hover:text-red-500 rounded-xl transition-all group"
                                    title="Logout"
                                >
                                    <LogOut size={20} className="group-hover:translate-x-0.5 transition-transform" />
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
