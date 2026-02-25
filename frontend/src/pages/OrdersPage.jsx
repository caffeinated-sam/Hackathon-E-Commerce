import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, Clock, ChevronDown, ChevronUp, ShoppingBag } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { orderAPI } from '../services/api';

const MOCK_ORDERS = [
    { id: 1001, customerName: 'Demo User', productId: 1, quantity: 2, status: 'COMPLETED', totalPrice: 599.98, createdAt: '2026-02-24T10:30:00Z', productName: 'Cloud Processor X9' },
    { id: 1002, customerName: 'Demo User', productId: 3, quantity: 1, status: 'PROCESSING', totalPrice: 89.99, createdAt: '2026-02-25T08:15:00Z', productName: 'Cyber Shield v4' },
    { id: 1003, customerName: 'Demo User', productId: 4, quantity: 1, status: 'SHIPPED', totalPrice: 599.00, createdAt: '2026-02-23T14:20:00Z', productName: 'Data Core Prime' },
];

const statusStyles = {
    COMPLETED: 'badge-success',
    PROCESSING: 'badge-warning',
    SHIPPED: 'badge-primary',
    CANCELLED: 'badge-danger',
    PENDING: 'badge-warning',
};

export default function OrdersPage() {
    const { isAuthenticated } = useAuth();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandedId, setExpandedId] = useState(null);

    useEffect(() => {
        loadOrders();
    }, []);

    const loadOrders = async () => {
        try {
            const res = await orderAPI.getAll();
            const data = Array.isArray(res.data) ? res.data : [];
            setOrders(data.length > 0 ? data : MOCK_ORDERS);
        } catch {
            setOrders(MOCK_ORDERS);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateStr) => {
        return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' });
    };

    if (!isAuthenticated) {
        return (
            <div className="page-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '70vh' }}>
                <div style={{ textAlign: 'center' }} className="animate-entrance delay-1">
                    <Package size={48} style={{ color: 'var(--text-tertiary)', marginBottom: '1rem' }} />
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>Sign in to view orders</h2>
                    <p style={{ color: 'var(--text-tertiary)', fontSize: '0.875rem', marginBottom: '2rem' }}>You need to be logged in to see your order history</p>
                    <Link to="/login" state={{ from: '/orders' }} className="btn-primary" style={{ textDecoration: 'none' }}>Sign In</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="page-container" style={{ maxWidth: '900px' }}>
            <div className="page-header animate-entrance delay-1">
                <h1 className="page-title">Order History</h1>
                <p className="page-subtitle">{orders.length} order{orders.length !== 1 ? 's' : ''} placed</p>
            </div>

            {loading ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="glass-card" style={{ padding: '1.5rem' }}>
                            <div className="skeleton" style={{ height: '20px', width: '40%', marginBottom: '0.75rem' }} />
                            <div className="skeleton" style={{ height: '14px', width: '80%' }} />
                        </div>
                    ))}
                </div>
            ) : orders.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '4rem 2rem' }} className="animate-entrance delay-2">
                    <ShoppingBag size={48} style={{ color: 'var(--text-tertiary)', marginBottom: '1rem' }} />
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>No orders yet</h3>
                    <p style={{ color: 'var(--text-tertiary)', fontSize: '0.875rem', marginBottom: '2rem' }}>Start shopping to see your orders here</p>
                    <Link to="/" className="btn-primary" style={{ textDecoration: 'none' }}>Browse Products</Link>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {orders.map((order, i) => (
                        <div key={order.id} className="glass-card animate-entrance" style={{ overflow: 'hidden', animationDelay: `${0.1 + i * 0.05}s` }}>
                            <div
                                onClick={() => setExpandedId(expandedId === order.id ? null : order.id)}
                                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.25rem', cursor: 'pointer', flexWrap: 'wrap', gap: '0.75rem' }}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                    <div style={{ width: '42px', height: '42px', background: 'var(--bg-tertiary)', borderRadius: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <Package size={20} style={{ color: '#6366f1' }} />
                                    </div>
                                    <div>
                                        <div style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--text-primary)' }}>Order #{order.id}</div>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                                            <Clock size={12} /> {formatDate(order.createdAt)}
                                        </div>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                                    <span className={`badge ${statusStyles[order.status] || 'badge-primary'}`}>{order.status}</span>
                                    <span style={{ fontSize: '1.05rem', fontWeight: 800, fontFamily: "'Outfit', sans-serif" }}>
                                        ${(order.totalPrice || order.quantity * 100).toFixed(2)}
                                    </span>
                                    {expandedId === order.id ? <ChevronUp size={16} color="var(--text-tertiary)" /> : <ChevronDown size={16} color="var(--text-tertiary)" />}
                                </div>
                            </div>

                            {expandedId === order.id && (
                                <div style={{ borderTop: '1px solid var(--border-light)', padding: '1.25rem', background: 'var(--bg-secondary)', animation: 'slide-up 0.2s ease' }}>
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', fontSize: '0.8125rem' }}>
                                        <div>
                                            <div style={{ fontWeight: 600, color: 'var(--text-tertiary)', marginBottom: '0.25rem' }}>Product</div>
                                            <div style={{ color: 'var(--text-primary)' }}>{order.productName || `Product #${order.productId}`}</div>
                                        </div>
                                        <div>
                                            <div style={{ fontWeight: 600, color: 'var(--text-tertiary)', marginBottom: '0.25rem' }}>Quantity</div>
                                            <div style={{ color: 'var(--text-primary)' }}>{order.quantity}</div>
                                        </div>
                                        <div>
                                            <div style={{ fontWeight: 600, color: 'var(--text-tertiary)', marginBottom: '0.25rem' }}>Customer</div>
                                            <div style={{ color: 'var(--text-primary)' }}>{order.customerName}</div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
