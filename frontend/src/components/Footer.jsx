import { Link } from 'react-router-dom';
import { LayoutDashboard, Github, Twitter } from 'lucide-react';

export default function Footer() {
    return (
        <footer style={{
            borderTop: '1px solid var(--border-color)',
            background: 'var(--bg-secondary)',
            padding: '3rem 1.5rem 2rem',
        }}>
            <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem', marginBottom: '2.5rem' }}>
                    {/* Brand */}
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.75rem' }}>
                            <div style={{ width: '28px', height: '28px', background: 'var(--gradient-primary)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <LayoutDashboard size={14} color="white" />
                            </div>
                            <span className="gradient-text" style={{ fontWeight: 800, fontFamily: "'Outfit', sans-serif", letterSpacing: '-0.04em' }}>CLOUD.FLOW</span>
                        </div>
                        <p style={{ fontSize: '0.8125rem', color: 'var(--text-tertiary)', lineHeight: 1.7, maxWidth: '280px' }}>
                            Cloud-native e-commerce platform powered by microservices, auto-scaling, and Kubernetes.
                        </p>
                    </div>

                    {/* Links */}
                    <div>
                        <h4 style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem' }}>Platform</h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <Link to="/" style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', textDecoration: 'none' }}>Products</Link>
                            <Link to="/monitoring" style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', textDecoration: 'none' }}>Monitoring</Link>
                            <Link to="/orders" style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', textDecoration: 'none' }}>Orders</Link>
                        </div>
                    </div>

                    <div>
                        <h4 style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem' }}>Architecture</h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <span style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>API Gateway</span>
                            <span style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>Product Service</span>
                            <span style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>Order Service</span>
                        </div>
                    </div>

                    <div>
                        <h4 style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem' }}>Stack</h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <span style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>Spring Boot</span>
                            <span style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>Kubernetes + HPA</span>
                            <span style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>Redis + PostgreSQL</span>
                        </div>
                    </div>
                </div>

                <div style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem',
                    flexWrap: 'wrap', gap: '1rem',
                }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>
                        © 2026 Cloud.Flow — Cloud-Native E-Commerce Engine
                    </span>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <a href="#" style={{ color: 'var(--text-tertiary)', transition: 'color 0.2s' }}><Github size={16} /></a>
                        <a href="#" style={{ color: 'var(--text-tertiary)', transition: 'color 0.2s' }}><Twitter size={16} /></a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
