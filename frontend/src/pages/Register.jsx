import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link, Navigate } from 'react-router-dom';
import { Eye, EyeOff, Loader2, Sprout } from 'lucide-react';
import T from '../components/T';

const Register = () => {
    const { register, user } = useAuth();
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    if (user) return <Navigate to="/" replace />;

    const handleRegister = async (e) => {
        e.preventDefault();

        if (!username) return setError('Please enter a username');
        if (username.length < 3) return setError('Username must be at least 3 characters');
        if (!password) return setError('Please enter a password');
        if (password.length < 6) return setError('Password must be at least 6 characters');
        if (password !== confirmPassword) return setError('Passwords do not match');

        setLoading(true);
        setError('');

        const result = await register(username, password);
        if (result.success) {
            console.log('Registration successful, forcing redirect...');
            // Force redirect to language selection
            window.location.href = '/language';
        } else {
            setError(result.error);
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-brand-bg flex flex-col items-center justify-center p-6 relative overflow-hidden transition-colors duration-500">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(16,185,129,0.03),transparent)] pointer-events-none" />
            
            <div className="text-center mb-12 relative z-10">
                <div className="w-16 h-16 bg-brand-primary rounded-[1.5rem] flex items-center justify-center mx-auto mb-6 shadow-premium">
                    <Sprout className="text-slate-950" size={32} />
                </div>
                <h1 className="text-4xl font-black text-brand-text-primary uppercase tracking-tighter mb-2">Agro<span className="text-brand-primary italic">XAI</span></h1>
                <T as="p" className="text-brand-text-secondary font-medium tracking-wide">Join the future of sustainable farming</T>
            </div>

            <div className="glass-card w-full max-w-[420px] !p-10 relative z-10">
                <T as="h2" className="text-2xl font-black text-brand-text-primary mb-8 uppercase tracking-tight">Sign Up</T>

                <form onSubmit={handleRegister} className="space-y-6">
                    <div className="space-y-2">
                        <T as="label" className="text-[10px] font-black text-brand-text-secondary uppercase tracking-widest ml-1">Username</T>
                        <input
                            type="text"
                            className="input-field"
                            placeholder="Choose a username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                        <T as="p" className="text-[9px] text-slate-400 font-black uppercase tracking-tight ml-1">3 to 20 characters</T>
                    </div>

                    <div className="space-y-2">
                        <T as="label" className="text-[10px] font-black text-brand-text-secondary uppercase tracking-widest ml-1">Password</T>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                className="input-field pr-12"
                                placeholder="Minimum 6 characters"
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

                    <div className="space-y-2">
                        <T as="label" className="text-[10px] font-black text-brand-text-secondary uppercase tracking-widest ml-1">Confirm Password</T>
                        <input
                            type="password"
                            className="input-field"
                            placeholder="Re-enter your password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                    </div>

                    {error && (
                        <div className="bg-red-500/10 text-red-500 dark:text-red-400 p-4 rounded-xl text-[10px] font-black uppercase tracking-widest border border-red-500/25 animate-shake text-center">
                            ⚠️ {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-4 bg-brand-primary text-slate-950 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-3 hover:opacity-90 transition-all shadow-premium active:scale-[0.98] disabled:opacity-70"
                    >
                        {loading ? (
                            <><Loader2 size={16} className="animate-spin" /><T>Creating Account...</T></>
                        ) : (
                            <><T>Create Account</T></>
                        )}
                    </button>
                </form>

                <div className="mt-10 text-center border-t border-slate-100 dark:border-white/5 pt-8">
                    <p className="text-xs text-brand-text-secondary font-bold">
                        <T>Already have an account?</T>{' '}
                        <Link to="/login" className="text-brand-primary font-black hover:underline underline-offset-4 transition-all">
                            <T>Login</T>
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;
