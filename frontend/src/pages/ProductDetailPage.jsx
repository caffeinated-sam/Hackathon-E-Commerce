import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Plus, Minus, ShoppingCart, Package, Shield, Truck, Check } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { productAPI } from '../services/api';

const PLACEHOLDER_IMG = 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="800" height="800" viewBox="0 0 800 800"><defs><linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#6366f1"/><stop offset="100%" stop-color="#06b6d4"/></linearGradient></defs><rect fill="url(#g)" width="800" height="800"/><text x="400" y="410" text-anchor="middle" fill="rgba(255,255,255,0.6)" font-family="sans-serif" font-size="18" font-weight="600">Product Image</text></svg>');

const handleImgError = (e) => { e.target.onerror = null; e.target.src = PLACEHOLDER_IMG; };

const MOCK_PRODUCTS = [
    { id: 1, name: 'Cloud Processor X9', price: 299.99, category: 'Hardware', stockQuantity: 45, description: 'Next-gen distributed processing unit for cloud-native workloads. Engineered for high-throughput distributed computing, supporting up to 128 parallel streams with built-in fault tolerance and automatic load balancing.', image: 'https://images.unsplash.com/photo-1555617981-dac3880eac6e?auto=format&fit=crop&q=80&w=800' },
    { id: 2, name: 'Neural Link Hub', price: 149.50, category: 'Networking', stockQuantity: 12, description: 'Zero-latency neural synchronization for edge computing. Features quantum-entangled fiber channels for instantaneous data transfer across distributed nodes.', image: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&q=80&w=800' },
    { id: 3, name: 'Cyber Shield v4', price: 89.99, category: 'Security', stockQuantity: 78, description: 'Quantum encryption module with auto-scaling protection. Military-grade encryption with zero-knowledge proof authentication and real-time threat detection.', image: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&q=80&w=800' },
    { id: 4, name: 'Data Core Prime', price: 599.00, category: 'Storage', stockQuantity: 5, description: '2.5 Exabyte localized storage with instant replication. Triple-redundant storage array with cross-datacenter synchronization and automated failover.', image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&q=80&w=800' },
    { id: 5, name: 'Quantum Switch Q1', price: 449.00, category: 'Networking', stockQuantity: 22, description: 'Entanglement-based network switch with 0ms jitter. Supports up to 10,000 concurrent connections with automatic routing optimization.', image: 'https://images.unsplash.com/photo-1606765962248-7ff407b51667?auto=format&fit=crop&q=80&w=800' },
    { id: 6, name: 'Edge Compute Module', price: 199.99, category: 'Hardware', stockQuantity: 60, description: 'Compact edge computing unit for IoT deployments. Runs containerized workloads at the network edge with sub-millisecond response times.', image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=800' },
];

export default function ProductDetailPage() {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [added, setAdded] = useState(false);
    const { addItem } = useCart();

    useEffect(() => {
        loadProduct();
    }, [id]);

    const loadProduct = async () => {
        try {
            const res = await productAPI.getById(id);
            setProduct(res.data);
        } catch {
            const mock = MOCK_PRODUCTS.find((p) => p.id === parseInt(id));
            setProduct(mock || null);
        } finally {
            setLoading(false);
        }
    };

    const handleAddToCart = () => {
        addItem(product, quantity);
        setAdded(true);
        setTimeout(() => setAdded(false), 2000);
    };

    if (loading) {
        return (
            <div className="page-container">
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', maxWidth: '1000px' }}>
                    <div className="skeleton" style={{ aspectRatio: '1', borderRadius: '1rem' }} />
                    <div>
                        <div className="skeleton" style={{ height: '32px', width: '80%', marginBottom: '1rem' }} />
                        <div className="skeleton" style={{ height: '16px', width: '60%', marginBottom: '2rem' }} />
                        <div className="skeleton" style={{ height: '100px', width: '100%' }} />
                    </div>
                </div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="page-container" style={{ textAlign: 'center', paddingTop: '10rem' }}>
                <Package size={48} style={{ color: 'var(--text-tertiary)', marginBottom: '1rem' }} />
                <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Product not found</h2>
                <Link to="/" className="btn-primary" style={{ marginTop: '1.5rem', display: 'inline-flex', textDecoration: 'none' }}>
                    <ArrowLeft size={16} /> Back to Products
                </Link>
            </div>
        );
    }

    return (
        <div className="page-container">
            {/* Breadcrumb */}
            <div className="animate-entrance delay-1" style={{ marginBottom: '2rem' }}>
                <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--text-tertiary)', fontSize: '0.8125rem', fontWeight: 500, textDecoration: 'none' }}>
                    <ArrowLeft size={14} /> Back to Products
                </Link>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: '3rem', maxWidth: '1100px' }}>
                {/* Image */}
                <div className="animate-entrance delay-2">
                    <div className="glass-card" style={{ overflow: 'hidden', borderRadius: '1.25rem' }}>
                        <img
                            src={product.image || PLACEHOLDER_IMG}
                            alt={product.name}
                            onError={handleImgError}
                            style={{ width: '100%', aspectRatio: '1', objectFit: 'cover' }}
                        />
                    </div>
                </div>

                {/* Details */}
                <div className="animate-entrance delay-3">
                    <span className="badge badge-primary" style={{ marginBottom: '1rem' }}>{product.category}</span>
                    <h1 style={{ fontSize: '2rem', fontWeight: 800, fontFamily: "'Outfit', sans-serif", letterSpacing: '-0.03em', marginBottom: '0.5rem' }}>
                        {product.name}
                    </h1>

                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '1rem', marginBottom: '1.5rem' }}>
                        <span style={{ fontSize: '2rem', fontWeight: 800, fontFamily: "'Outfit', sans-serif", color: '#6366f1' }}>
                            ${product.price.toFixed(2)}
                        </span>
                        <span style={{ fontSize: '0.8125rem', color: product.stockQuantity > 10 ? 'var(--text-tertiary)' : '#f59e0b' }}>
                            {product.stockQuantity > 10 ? `${product.stockQuantity} in stock` : `Only ${product.stockQuantity} left`}
                        </span>
                    </div>

                    <p style={{ fontSize: '0.9375rem', color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: '2rem' }}>
                        {product.description}
                    </p>

                    {/* Quantity */}
                    <div style={{ marginBottom: '1.5rem' }}>
                        <label className="label">Quantity</label>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="btn-icon" style={{ border: '1px solid var(--border-color)' }}>
                                <Minus size={16} />
                            </button>
                            <span style={{ width: '3rem', textAlign: 'center', fontWeight: 700, fontSize: '1.1rem' }}>{quantity}</span>
                            <button onClick={() => setQuantity(Math.min(product.stockQuantity, quantity + 1))} className="btn-icon" style={{ border: '1px solid var(--border-color)' }}>
                                <Plus size={16} />
                            </button>
                        </div>
                    </div>

                    {/* Add to Cart */}
                    <button
                        onClick={handleAddToCart}
                        className="btn-primary"
                        style={{ width: '100%', padding: '0.875rem', fontSize: '0.9375rem', marginBottom: '1.5rem' }}
                    >
                        {added ? <><Check size={18} /> Added to Cart</> : <><ShoppingCart size={18} /> Add to Cart — ${(product.price * quantity).toFixed(2)}</>}
                    </button>

                    {/* Features */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
                        {[
                            { icon: Truck, label: 'Free Shipping', sub: 'Orders over $100' },
                            { icon: Shield, label: 'Secure', sub: 'Encrypted checkout' },
                            { icon: Package, label: 'Returns', sub: '30-day policy' },
                        ].map((feat, i) => (
                            <div key={i} style={{ textAlign: 'center', padding: '1rem', background: 'var(--bg-secondary)', borderRadius: '0.75rem' }}>
                                <feat.icon size={20} style={{ color: '#6366f1', marginBottom: '0.5rem' }} />
                                <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-primary)' }}>{feat.label}</div>
                                <div style={{ fontSize: '0.6875rem', color: 'var(--text-tertiary)' }}>{feat.sub}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
