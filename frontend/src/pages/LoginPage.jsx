import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, User, ArrowRight, Eye, EyeOff, LayoutDashboard } from 'lucide-react';

export default function LoginPage() {
    const [isRegister, setIsRegister] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const { login, register, loading, error, clearError } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from || '/';

    const handleSubmit = async (e) => {
        e.preventDefault();
        let success;
        if (isRegister) {
            success = await register(username, password, email);
        } else {
            success = await login(username, password);
        }
        if (success) navigate('/', { replace: true });
    };

    const switchMode = () => {
        setIsRegister(!isRegister);
        clearError();
    };

    return (
        <div className="page-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: '2rem' }}>
            {/* Background Decoration */}
            <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
                <div style={{ position: 'absolute', top: '20%', left: '10%', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(99,102,241,0.08) 0%, transparent 70%)', borderRadius: '50%' }} />
                <div style={{ position: 'absolute', bottom: '10%', right: '10%', width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(6,182,212,0.06) 0%, transparent 70%)', borderRadius: '50%' }} />
            </div>

            <div style={{ width: '100%', maxWidth: '420px', position: 'relative', zIndex: 1 }}>
                {/* Logo */}
                <div style={{ textAlign: 'center', marginBottom: '2.5rem' }} className="animate-entrance delay-1">
                    <div style={{ width: '48px', height: '48px', background: 'var(--gradient-primary)', borderRadius: '14px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                        <LayoutDashboard size={24} color="white" />
                    </div>
                    <h1 style={{ fontSize: '1.75rem', fontWeight: 800, fontFamily: "'Outfit', sans-serif", letterSpacing: '-0.03em' }}>
                        {isRegister ? 'Create Account' : 'Welcome Back'}
                    </h1>
                    <p style={{ color: 'var(--text-tertiary)', fontSize: '0.875rem', marginTop: '0.5rem' }}>
                        {isRegister ? 'Start your cloud commerce journey' : 'Sign in to your Cloud.Flow account'}
                    </p>
                </div>

                {/* Form Card */}
                <div className="glass-card animate-entrance delay-2" style={{ padding: '2rem', boxShadow: 'var(--shadow-xl)' }}>
                    <form onSubmit={handleSubmit}>
                        {/* Username */}
                        <div style={{ marginBottom: '1.25rem' }}>
                            <label className="label">Username</label>
                            <div style={{ position: 'relative' }}>
                                <User size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} />
                                <input
                                    type="text"
                                    className="input"
                                    placeholder="Enter username"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    required
                                    style={{ paddingLeft: '2.5rem' }}
                                />
                            </div>
                        </div>

                        {/* Email (Register only) */}
                        {isRegister && (
                            <div style={{ marginBottom: '1.25rem' }}>
                                <label className="label">Email</label>
                                <div style={{ position: 'relative' }}>
                                    <Mail size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} />
                                    <input
                                        type="email"
                                        className="input"
                                        placeholder="Enter email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        style={{ paddingLeft: '2.5rem' }}
                                    />
                                </div>
                            </div>
                        )}

                        {/* Password */}
                        <div style={{ marginBottom: '1.5rem' }}>
                            <label className="label">Password</label>
                            <div style={{ position: 'relative' }}>
                                <Lock size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    className="input"
                                    placeholder="Enter password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    style={{ paddingLeft: '2.5rem', paddingRight: '2.5rem' }}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-tertiary)', display: 'flex' }}
                                >
                                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                        </div>

                        {/* Error */}
                        {error && (
                            <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', borderRadius: '0.625rem', padding: '0.75rem 1rem', marginBottom: '1.25rem', fontSize: '0.8125rem', color: '#ef4444' }}>
                                {error}
                            </div>
                        )}

                        {/* Submit */}
                        <button
                            type="submit"
                            className="btn-primary"
                            disabled={loading}
                            style={{ width: '100%', padding: '0.75rem', fontSize: '0.875rem' }}
                        >
                            {loading ? 'Please wait...' : isRegister ? 'Create Account' : 'Sign In'}
                            {!loading && <ArrowRight size={16} />}
                        </button>
                    </form>

                    {/* Switch Mode */}
                    <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.8125rem', color: 'var(--text-tertiary)' }}>
                        {isRegister ? 'Already have an account?' : "Don't have an account?"}{' '}
                        <button
                            onClick={switchMode}
                            style={{ background: 'none', border: 'none', color: '#6366f1', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', fontSize: 'inherit' }}
                        >
                            {isRegister ? 'Sign In' : 'Sign Up'}
                        </button>
                    </div>

                    {/* Demo Credentials */}
                    <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'var(--bg-secondary)', borderRadius: '0.75rem', border: '1px solid var(--border-light)' }}>
                        <div style={{ fontSize: '0.6875rem', fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>Demo Credentials</div>
                        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                            <button
                                type="button"
                                onClick={() => { setUsername('admin'); setPassword('admin'); }}
                                style={{ flex: 1, padding: '0.5rem', background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '0.5rem', cursor: 'pointer', textAlign: 'center', fontSize: '0.75rem', color: 'var(--text-secondary)', fontFamily: 'inherit' }}
                            >
                                <div style={{ fontWeight: 600 }}>Admin</div>
                                <div style={{ color: 'var(--text-tertiary)', marginTop: '2px' }}>admin / admin</div>
                            </button>
                            <button
                                type="button"
                                onClick={() => { setUsername('user'); setPassword('user'); }}
                                style={{ flex: 1, padding: '0.5rem', background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '0.5rem', cursor: 'pointer', textAlign: 'center', fontSize: '0.75rem', color: 'var(--text-secondary)', fontFamily: 'inherit' }}
                            >
                                <div style={{ fontWeight: 600 }}>User</div>
                                <div style={{ color: 'var(--text-tertiary)', marginTop: '2px' }}>user / user</div>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
