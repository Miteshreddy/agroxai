import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link, Navigate } from 'react-router-dom';
import { Eye, EyeOff, Loader2, Leaf } from 'lucide-react';
import T from '../components/T';
import { useLanguage } from '../context/LanguageContext';

const Login = () => {
    const { login, user } = useAuth();
    const { languageSelected, t } = useLanguage();
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    if (user) return <Navigate to="/" replace />;

    const handleLogin = async (e) => {
        e.preventDefault();
        if (!username) return setError('Please enter your username');
        if (!password) return setError('Please enter your password');

        setLoading(true);
        setError('');

        const result = await login(username, password);
        if (result.success) {
            console.log('Login successful, forcing redirect...');
            const target = languageSelected ? '/' : '/language';
            // Use both for absolute certainty
            navigate(target);
            window.location.href = target;
        } else {
            setError(result.error);
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-brand-bg flex flex-col items-center justify-center p-6 relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(31,122,99,0.05),transparent)] pointer-events-none" />
            
            <div className="text-center mb-12 relative z-10">
                <div className="w-16 h-16 bg-brand-primary rounded-[1.5rem] flex items-center justify-center mx-auto mb-6 shadow-premium">
                    <Leaf className="text-white" size={32} />
                </div>
                <h1 className="text-4xl font-black text-brand-text-primary uppercase tracking-tighter mb-2">Agro<span className="text-brand-primary italic">XAI</span></h1>
                <T as="p" className="text-brand-text-secondary font-medium tracking-wide">Welcome back to precision farming</T>
            </div>

            <div className="glass-card w-full max-w-[420px] !p-10 relative z-10">
                <T as="h2" className="text-2xl font-black text-brand-text-primary mb-8 uppercase tracking-tight">Login</T>

                <form onSubmit={handleLogin} className="space-y-6">
                    <div className="space-y-2">
                        <T as="label" className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Username</T>
                        <input
                            type="text"
                            className="input-field"
                            placeholder={t('username')}
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>

                    <div className="space-y-2">
                        <T as="label" className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Password</T>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                className="input-field pr-12"
                                placeholder={t('password')}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <button
                                type="button"
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-brand-primary transition-colors"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    {error && (
                        <div className="bg-red-50 text-red-500 p-4 rounded-xl text-[10px] font-black uppercase tracking-widest border border-red-100 animate-shake text-center">
                            ⚠️ {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-4 bg-brand-text-primary text-white rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-brand-dark transition-all shadow-premium active:scale-[0.98] disabled:opacity-70"
                    >
                        {loading ? (
                            <><Loader2 size={16} className="animate-spin" /><T>Authenticating...</T></>
                        ) : (
                            <><T>Login</T></>
                        )}
                    </button>
                </form>

                <div className="mt-10 text-center border-t border-slate-100 pt-8">
                    <p className="text-xs text-brand-text-secondary font-bold">
                        <T>Don't have an account?</T>{' '}
                        <Link to="/register" className="text-brand-primary font-black hover:underline underline-offset-4 transition-all">
                            <T>Sign Up</T>
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
