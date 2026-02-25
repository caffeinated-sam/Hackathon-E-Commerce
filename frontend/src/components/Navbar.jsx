import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, Menu, X, Sun, Moon, User, LogOut, Package, LayoutDashboard, Activity, ChevronDown, ShieldCheck } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function Navbar() {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const { isDark, toggleTheme } = useTheme();
    const { isAuthenticated, isAdmin, user, logout } = useAuth();
    const { cartCount } = useCart();
    const location = useLocation();

    const isActive = (path) => location.pathname === path;

    const navLinks = [
        { to: '/', label: 'Products', icon: Package },
        { to: '/monitoring', label: 'Monitoring', icon: Activity },
        ...(isAdmin ? [{ to: '/admin', label: 'Admin', icon: ShieldCheck }] : []),
    ];

    return (
        <nav className="glass-nav" style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50 }}>
            <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '64px' }}>

                {/* Logo */}
                <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
                    <div style={{ width: '34px', height: '34px', background: 'var(--gradient-primary)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <LayoutDashboard size={18} color="white" />
                    </div>
                    <span className="gradient-text" style={{ fontSize: '1.15rem', fontWeight: 800, fontFamily: "'Outfit', sans-serif", letterSpacing: '-0.04em' }}>
                        CLOUD.FLOW
                    </span>
                </Link>

                {/* Desktop Nav */}
                <div className="hide-mobile" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    {navLinks.map((link) => (
                        <Link
                            key={link.to}
                            to={link.to}
                            style={{
                                display: 'flex', alignItems: 'center', gap: '6px',
                                padding: '0.5rem 0.875rem', borderRadius: '0.5rem',
                                fontSize: '0.8125rem', fontWeight: 500,
                                color: isActive(link.to) ? 'var(--text-primary)' : 'var(--text-secondary)',
                                background: isActive(link.to) ? 'var(--bg-tertiary)' : 'transparent',
                                textDecoration: 'none', transition: 'all 0.2s',
                            }}
                        >
                            <link.icon size={15} />
                            {link.label}
                        </Link>
                    ))}
                </div>

                {/* Right Side */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    {/* Theme Toggle */}
                    <button onClick={toggleTheme} className="btn-icon" title={isDark ? 'Light mode' : 'Dark mode'}>
                        {isDark ? <Sun size={18} /> : <Moon size={18} />}
                    </button>

                    {/* Cart */}
                    <Link to="/cart" className="btn-icon" style={{ position: 'relative', textDecoration: 'none' }}>
                        <ShoppingCart size={18} />
                        {cartCount > 0 && (
                            <span style={{
                                position: 'absolute', top: '2px', right: '2px',
                                width: '16px', height: '16px', borderRadius: '50%',
                                background: 'var(--gradient-primary)', color: 'white',
                                fontSize: '10px', fontWeight: 700,
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                            }}>
                                {cartCount > 9 ? '9+' : cartCount}
                            </span>
                        )}
                    </Link>

                    {/* Auth */}
                    {isAuthenticated ? (
                        <div style={{ position: 'relative' }}>
                            <button
                                onClick={() => setUserMenuOpen(!userMenuOpen)}
                                className="btn-ghost"
                                style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '0.4rem 0.75rem' }}
                            >
                                <div style={{
                                    width: '28px', height: '28px', borderRadius: '50%',
                                    background: 'var(--gradient-primary)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                }}>
                                    <User size={14} color="white" />
                                </div>
                                <span className="hide-mobile" style={{ fontSize: '0.8125rem', fontWeight: 600 }}>{user?.username}</span>
                                <ChevronDown size={14} className="hide-mobile" />
                            </button>

                            {userMenuOpen && (
                                <>
                                    <div style={{ position: 'fixed', inset: 0, zIndex: 40 }} onClick={() => setUserMenuOpen(false)} />
                                    <div style={{
                                        position: 'absolute', right: 0, top: '100%', marginTop: '8px',
                                        width: '200px', background: 'var(--bg-primary)',
                                        border: '1px solid var(--border-color)', borderRadius: '0.75rem',
                                        boxShadow: 'var(--shadow-xl)', overflow: 'hidden', zIndex: 50,
                                        animation: 'slide-up 0.2s ease',
                                    }}>
                                        <div style={{ padding: '0.75rem 1rem', borderBottom: '1px solid var(--border-color)' }}>
                                            <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-primary)' }}>{user?.username}</div>
                                            <div style={{ fontSize: '0.6875rem', color: 'var(--text-tertiary)' }}>{user?.role || 'USER'}</div>
                                        </div>
                                        <Link
                                            to="/orders"
                                            onClick={() => setUserMenuOpen(false)}
                                            style={{
                                                display: 'flex', alignItems: 'center', gap: '8px',
                                                padding: '0.625rem 1rem', fontSize: '0.8125rem',
                                                color: 'var(--text-secondary)', textDecoration: 'none',
                                                transition: 'background 0.2s',
                                            }}
                                            onMouseEnter={(e) => e.target.style.background = 'var(--bg-secondary)'}
                                            onMouseLeave={(e) => e.target.style.background = 'transparent'}
                                        >
                                            <Package size={14} /> My Orders
                                        </Link>
                                        <button
                                            onClick={() => { logout(); setUserMenuOpen(false); }}
                                            style={{
                                                display: 'flex', alignItems: 'center', gap: '8px',
                                                padding: '0.625rem 1rem', fontSize: '0.8125rem', width: '100%',
                                                color: '#ef4444', background: 'transparent', border: 'none',
                                                cursor: 'pointer', textAlign: 'left', fontFamily: 'inherit',
                                                transition: 'background 0.2s',
                                            }}
                                            onMouseEnter={(e) => e.target.style.background = 'var(--bg-secondary)'}
                                            onMouseLeave={(e) => e.target.style.background = 'transparent'}
                                        >
                                            <LogOut size={14} /> Sign Out
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    ) : (
                        <Link to="/login" className="btn-primary" style={{ padding: '0.45rem 1rem', fontSize: '0.8125rem', textDecoration: 'none' }}>
                            Sign In
                        </Link>
                    )}

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setMobileOpen(!mobileOpen)}
                        className="btn-icon"
                        style={{ display: 'none' }}
                        id="mobile-menu-btn"
                    >
                        {mobileOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {mobileOpen && (
                <div style={{
                    borderTop: '1px solid var(--border-color)',
                    padding: '1rem 1.5rem',
                    background: 'var(--bg-primary)',
                }}>
                    {navLinks.map((link) => (
                        <Link
                            key={link.to}
                            to={link.to}
                            onClick={() => setMobileOpen(false)}
                            style={{
                                display: 'flex', alignItems: 'center', gap: '8px',
                                padding: '0.75rem 0', fontSize: '0.875rem', fontWeight: 500,
                                color: isActive(link.to) ? 'var(--text-primary)' : 'var(--text-secondary)',
                                textDecoration: 'none', borderBottom: '1px solid var(--border-light)',
                            }}
                        >
                            <link.icon size={16} />
                            {link.label}
                        </Link>
                    ))}
                </div>
            )}

            <style>{`
        @media (max-width: 768px) {
          #mobile-menu-btn { display: inline-flex !important; }
        }
      `}</style>
        </nav>
    );
}
