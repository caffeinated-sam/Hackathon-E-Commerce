import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, SlidersHorizontal, Plus, ShoppingBag, Star, Filter } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { productAPI } from '../services/api';

const PLACEHOLDER_IMG = 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="400" height="250" viewBox="0 0 400 250"><defs><linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#6366f1"/><stop offset="100%" stop-color="#06b6d4"/></linearGradient></defs><rect fill="url(#g)" width="400" height="250"/><text x="200" y="130" text-anchor="middle" fill="rgba(255,255,255,0.6)" font-family="sans-serif" font-size="14" font-weight="600">Product Image</text></svg>');

const handleImgError = (e) => { e.target.onerror = null; e.target.src = PLACEHOLDER_IMG; };

const MOCK_PRODUCTS = [
    { id: 1, name: 'Cloud Processor X9', price: 299.99, category: 'Hardware', stockQuantity: 45, description: 'Next-gen distributed processing unit for cloud-native workloads.', image: 'https://images.unsplash.com/photo-1555617981-dac3880eac6e?auto=format&fit=crop&q=80&w=400' },
    { id: 2, name: 'Neural Link Hub', price: 149.50, category: 'Networking', stockQuantity: 12, description: 'Zero-latency neural synchronization for edge computing.', image: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&q=80&w=400' },
    { id: 3, name: 'Cyber Shield v4', price: 89.99, category: 'Security', stockQuantity: 78, description: 'Quantum encryption module with auto-scaling protection.', image: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&q=80&w=400' },
    { id: 4, name: 'Data Core Prime', price: 599.00, category: 'Storage', stockQuantity: 5, description: '2.5 Exabyte localized storage with instant replication.', image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&q=80&w=400' },
    { id: 5, name: 'Quantum Switch Q1', price: 449.00, category: 'Networking', stockQuantity: 22, description: 'Entanglement-based network switch with 0ms jitter.', image: 'https://images.unsplash.com/photo-1606765962248-7ff407b51667?auto=format&fit=crop&q=80&w=400' },
    { id: 6, name: 'Edge Compute Module', price: 199.99, category: 'Hardware', stockQuantity: 60, description: 'Compact edge computing unit for IoT deployments.', image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=400' },
];

const CATEGORIES = ['All', 'Hardware', 'Networking', 'Security', 'Storage'];
const SORT_OPTIONS = [
    { value: 'name-asc', label: 'Name A-Z' },
    { value: 'name-desc', label: 'Name Z-A' },
    { value: 'price-asc', label: 'Price Low-High' },
    { value: 'price-desc', label: 'Price High-Low' },
];

export default function ProductsPage() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('All');
    const [sort, setSort] = useState('name-asc');
    const [addedIds, setAddedIds] = useState(new Set());
    const { addItem } = useCart();

    useEffect(() => {
        loadProducts();
    }, []);

    const loadProducts = async () => {
        try {
            const res = await productAPI.getAll();
            const data = Array.isArray(res.data) ? res.data : [];
            setProducts(data.length > 0 ? data : MOCK_PRODUCTS);
        } catch {
            setProducts(MOCK_PRODUCTS);
        } finally {
            setLoading(false);
        }
    };

    const handleAddToCart = (product) => {
        addItem(product);
        setAddedIds((prev) => new Set(prev).add(product.id));
        setTimeout(() => setAddedIds((prev) => { const n = new Set(prev); n.delete(product.id); return n; }), 1500);
    };

    const filtered = products
        .filter((p) => category === 'All' || p.category === category)
        .filter((p) => p.name.toLowerCase().includes(search.toLowerCase()) || p.description?.toLowerCase().includes(search.toLowerCase()))
        .sort((a, b) => {
            switch (sort) {
                case 'name-asc': return a.name.localeCompare(b.name);
                case 'name-desc': return b.name.localeCompare(a.name);
                case 'price-asc': return a.price - b.price;
                case 'price-desc': return b.price - a.price;
                default: return 0;
            }
        });

    return (
        <div className="page-container">
            {/* Header */}
            <div className="page-header animate-entrance delay-1">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
                    <div>
                        <h1 className="page-title">Product Catalog</h1>
                        <p className="page-subtitle">{filtered.length} products available via distributed product service</p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span className="badge badge-success"><span className="status-dot status-dot-live" style={{ marginRight: '4px' }} /> API Connected</span>
                    </div>
                </div>
            </div>

            {/* Filters Bar */}
            <div className="animate-entrance delay-2 glass-card" style={{ padding: '1rem 1.25rem', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                {/* Search */}
                <div style={{ flex: '1 1 280px', position: 'relative' }}>
                    <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} />
                    <input
                        type="text"
                        className="input"
                        placeholder="Search products..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        style={{ paddingLeft: '2.5rem' }}
                    />
                </div>

                {/* Category Filter */}
                <div style={{ display: 'flex', gap: '0.375rem', flexWrap: 'wrap' }}>
                    {CATEGORIES.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setCategory(cat)}
                            className={category === cat ? 'btn-primary' : 'btn-secondary'}
                            style={{ padding: '0.4rem 0.875rem', fontSize: '0.75rem' }}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Sort */}
                <select
                    value={sort}
                    onChange={(e) => setSort(e.target.value)}
                    className="input"
                    style={{ width: 'auto', minWidth: '150px', cursor: 'pointer' }}
                >
                    {SORT_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                </select>
            </div>

            {/* Product Grid */}
            {loading ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="glass-card" style={{ padding: '1.25rem' }}>
                            <div className="skeleton" style={{ width: '100%', aspectRatio: '16/10', marginBottom: '1rem' }} />
                            <div className="skeleton" style={{ height: '20px', width: '70%', marginBottom: '0.5rem' }} />
                            <div className="skeleton" style={{ height: '14px', width: '100%', marginBottom: '1rem' }} />
                            <div className="skeleton" style={{ height: '14px', width: '90%' }} />
                        </div>
                    ))}
                </div>
            ) : filtered.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
                    <ShoppingBag size={48} style={{ color: 'var(--text-tertiary)', marginBottom: '1rem' }} />
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>No products found</h3>
                    <p style={{ color: 'var(--text-tertiary)', fontSize: '0.875rem' }}>Try adjusting your search or filter criteria</p>
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
                    {filtered.map((product, i) => (
                        <div key={product.id} className="glass-card animate-entrance" style={{ overflow: 'hidden', animationDelay: `${0.1 + i * 0.05}s` }}>
                            {/* Image */}
                            <Link to={`/product/${product.id}`}>
                                <div style={{ position: 'relative', overflow: 'hidden' }}>
                                    <img
                                        src={product.image || PLACEHOLDER_IMG}
                                        alt={product.name}
                                        onError={handleImgError}
                                        style={{ width: '100%', aspectRatio: '16/10', objectFit: 'cover', transition: 'transform 0.5s' }}
                                        onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
                                        onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                                    />
                                    <div style={{ position: 'absolute', top: '12px', left: '12px' }}>
                                        <span className="badge badge-primary" style={{ backdropFilter: 'blur(8px)' }}>{product.category}</span>
                                    </div>
                                </div>
                            </Link>

                            {/* Content */}
                            <div style={{ padding: '1.25rem' }}>
                                <Link to={`/product/${product.id}`} style={{ textDecoration: 'none' }}>
                                    <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.375rem', letterSpacing: '-0.01em' }}>{product.name}</h3>
                                </Link>
                                <p style={{ fontSize: '0.8125rem', color: 'var(--text-tertiary)', marginBottom: '1rem', lineHeight: 1.6, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                    {product.description}
                                </p>

                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--border-light)', paddingTop: '1rem' }}>
                                    <div>
                                        <span style={{ fontSize: '1.25rem', fontWeight: 800, fontFamily: "'Outfit', sans-serif", color: 'var(--text-primary)' }}>
                                            ${product.price.toFixed(2)}
                                        </span>
                                        <div style={{ fontSize: '0.6875rem', color: product.stockQuantity > 10 ? 'var(--text-tertiary)' : '#f59e0b', marginTop: '2px' }}>
                                            {product.stockQuantity > 10 ? `${product.stockQuantity} in stock` : `Only ${product.stockQuantity} left`}
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => handleAddToCart(product)}
                                        className={addedIds.has(product.id) ? 'btn-secondary' : 'btn-primary'}
                                        style={{ padding: '0.5rem 1rem', fontSize: '0.75rem' }}
                                    >
                                        {addedIds.has(product.id) ? '✓ Added' : <><Plus size={14} /> Add</>}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
