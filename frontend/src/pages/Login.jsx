import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link, Navigate } from 'react-router-dom';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
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
            navigate(languageSelected ? '/' : '/language');
        } else {
            setError(result.error);
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-brand-cream flex flex-col items-center justify-center p-6">
            <div className="text-center mb-10">
                <span className="text-6xl mb-4 block">🌾</span>
                <h1 className="text-5xl font-black text-brand-dark uppercase tracking-tighter mb-2">CropVisionAI</h1>
                <T as="p" className="text-brand-olive font-medium">Welcome back</T>
            </div>

            <div className="glass-card w-full max-w-[400px] shadow-2xl">
                <T as="h2" className="text-2xl font-black text-brand-dark mb-8 uppercase tracking-tight">Login</T>

                <form onSubmit={handleLogin} className="space-y-6">
                    <div className="space-y-2">
                        <T as="label" className="text-xs font-black text-brand-dark/40 uppercase tracking-widest">Username</T>
                        <input
                            type="text"
                            className="input-field"
                            placeholder={t('username')}
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>

                    <div className="space-y-2">
                        <T as="label" className="text-xs font-black text-brand-dark/40 uppercase tracking-widest">Password</T>
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
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-brand-olive hover:text-brand-green transition-colors"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                    </div>

                    {error && (
                        <div className="bg-red-50 text-red-500 p-4 rounded-xl text-xs font-bold border border-red-100 animate-shake">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full btn-primary py-4 rounded-xl font-black uppercase tracking-widest flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            <><Loader2 size={20} className="animate-spin" /><T>Please wait...</T></>
                        ) : (
                            <T>Login</T>
                        )}
                    </button>
                </form>

                <div className="mt-8 text-center">
                    <p className="text-sm text-brand-olive font-medium">
                        <T>Don't have an account?</T>{' '}
                        <Link to="/register" className="text-brand-green font-black hover:underline underline-offset-4 transition-all">
                            <T>Sign Up</T>
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
