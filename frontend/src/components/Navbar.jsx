import React from 'react';
import { ShoppingCart, Layout, Activity, Package } from 'lucide-react';

const Navbar = ({ cartCount }) => {
    return (
        <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50, padding: '1rem 1.5rem' }}>
            <div style={{
                maxWidth: '1280px', margin: '0 auto', display: 'flex', alignItems: 'center',
                justifyContent: 'space-between', background: 'rgba(255,255,255,0.05)',
                backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
                border: '1px solid rgba(255,255,255,0.1)', borderRadius: '9999px', padding: '0.6rem 1.25rem',
                boxShadow: '0 20px 60px rgba(0,0,0,0.5)'
            }}>
                {/* Logo */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{
                        width: '38px', height: '38px', background: 'linear-gradient(135deg, #00f2fe, #4facfe)',
                        borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        boxShadow: '0 4px 20px rgba(0,242,254,0.35)'
                    }}>
                        <Layout size={20} color="#050505" />
                    </div>
                    <span className="premium-text" style={{ fontSize: '1.2rem', fontWeight: 900, letterSpacing: '-0.05em' }}>
                        CLOUD.FLOW
                    </span>
                </div>

                {/* Links */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', fontSize: '13px', fontWeight: 500, color: 'rgba(255,255,255,0.6)' }}>
                    <a href="#" style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'inherit', textDecoration: 'none', transition: 'color 0.2s' }}>
                        <Package size={15} /> Products
                    </a>
                    <a href="#" style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'inherit', textDecoration: 'none', transition: 'color 0.2s' }}>
                        <Activity size={15} /> Services
                    </a>
                </div>

                {/* Cart */}
                <button style={{ position: 'relative', padding: '8px', borderRadius: '50%', background: 'transparent', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.7)', display: 'flex', alignItems: 'center' }}>
                    <ShoppingCart size={22} />
                    {cartCount > 0 && (
                        <span style={{
                            position: 'absolute', top: '-2px', right: '-2px', width: '18px', height: '18px',
                            background: 'linear-gradient(135deg, #00f2fe, #4facfe)', color: '#050505',
                            fontSize: '10px', fontWeight: 800, borderRadius: '50%',
                            display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}>
                            {cartCount}
                        </span>
                    )}
                </button>
            </div>
        </nav>
    );
};

export default Navbar;
