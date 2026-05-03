import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link, Navigate } from 'react-router-dom';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
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
            navigate('/language');
        } else {
            setError(result.error);
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-brand-cream flex flex-col items-center justify-center p-6">
            <div className="text-center mb-10">
                <span className="text-6xl mb-4 block">🌱</span>
                <h1 className="text-5xl font-black text-brand-dark uppercase tracking-tighter mb-2">CropVisionAI</h1>
                <T as="p" className="text-brand-olive font-medium">Create your account</T>
            </div>

            <div className="glass-card w-full max-w-[400px] shadow-2xl">
                <T as="h2" className="text-2xl font-black text-brand-dark mb-8 uppercase tracking-tight">Sign Up</T>

                <form onSubmit={handleRegister} className="space-y-6">
                    <div className="space-y-2">
                        <T as="label" className="text-xs font-black text-brand-dark/40 uppercase tracking-widest">Username</T>
                        <input
                            type="text"
                            className="input-field"
                            placeholder="Choose a username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                        <T as="p" className="text-[10px] text-brand-olive/60 font-bold uppercase tracking-tight">3 to 20 characters</T>
                    </div>

                    <div className="space-y-2">
                        <T as="label" className="text-xs font-black text-brand-dark/40 uppercase tracking-widest">Password</T>
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
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-brand-olive hover:text-brand-green transition-colors"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <T as="label" className="text-xs font-black text-brand-dark/40 uppercase tracking-widest">Confirm Password</T>
                        <input
                            type="password"
                            className="input-field"
                            placeholder="Re-enter your password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
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
                            <T>Create Account</T>
                        )}
                    </button>
                </form>

                <div className="mt-8 text-center">
                    <p className="text-sm text-brand-olive font-medium">
                        <T>Already have an account?</T>{' '}
                        <Link to="/login" className="text-brand-green font-black hover:underline underline-offset-4 transition-all">
                            <T>Login</T>
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;
