import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { Plus, Pencil, Trash2, X, Package, DollarSign, BarChart3, ShoppingCart } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { productAPI } from '../services/api';

const EMPTY_PRODUCT = { name: '', description: '', price: '', stockQuantity: '', category: 'Hardware', image: '' };

const MOCK_PRODUCTS = [
    { id: 1, name: 'Cloud Processor X9', price: 299.99, category: 'Hardware', stockQuantity: 45, description: 'Next-gen distributed processing unit for cloud-native workloads.', image: 'https://images.unsplash.com/photo-1591405351990-4726e33df48d?auto=format&fit=crop&q=80&w=400' },
    { id: 2, name: 'Neural Link Hub', price: 149.50, category: 'Networking', stockQuantity: 12, description: 'Zero-latency neural synchronization for edge computing.', image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=400' },
    { id: 3, name: 'Cyber Shield v4', price: 89.99, category: 'Security', stockQuantity: 78, description: 'Quantum encryption module with auto-scaling protection.', image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc51?auto=format&fit=crop&q=80&w=400' },
    { id: 4, name: 'Data Core Prime', price: 599.00, category: 'Storage', stockQuantity: 5, description: '2.5 Exabyte localized storage with instant replication.', image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=400' },
];

export default function AdminPage() {
    const { isAdmin, isAuthenticated } = useAuth();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modal, setModal] = useState(null);
    const [form, setForm] = useState(EMPTY_PRODUCT);
    const [saving, setSaving] = useState(false);
    const [deleteConfirm, setDeleteConfirm] = useState(null);

    useEffect(() => { loadProducts(); }, []);

    if (!isAuthenticated) return <Navigate to="/login" state={{ from: '/admin' }} />;
    if (!isAdmin) {
        return (
            <div className="page-container" style={{ textAlign: 'center', paddingTop: '10rem' }}>
                <ShoppingCart size={48} style={{ color: 'var(--text-tertiary)', marginBottom: '1rem' }} />
                <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>Access Denied</h2>
                <p style={{ color: 'var(--text-tertiary)' }}>Admin privileges required. Login as admin/admin.</p>
            </div>
        );
    }

    const loadProducts = async () => {
        try {
            const res = await productAPI.getAll();
            const data = Array.isArray(res.data) ? res.data : [];
            setProducts(data.length > 0 ? data : MOCK_PRODUCTS);
        } catch { setProducts(MOCK_PRODUCTS); }
        finally { setLoading(false); }
    };

    const openCreate = () => { setForm(EMPTY_PRODUCT); setModal('create'); };
    const openEdit = (product) => { setForm({ ...product, price: String(product.price), stockQuantity: String(product.stockQuantity) }); setModal('edit'); };

    const handleSave = async () => {
        setSaving(true);
        const payload = { ...form, price: parseFloat(form.price), stockQuantity: parseInt(form.stockQuantity) };
        try {
            if (modal === 'create') {
                const res = await productAPI.create(payload);
                setProducts((prev) => [...prev, { ...payload, id: res.data?.id || Date.now() }]);
            } else {
                await productAPI.update(form.id, payload);
                setProducts((prev) => prev.map((p) => (p.id === form.id ? { ...p, ...payload } : p)));
            }
        } catch {
            if (modal === 'create') {
                setProducts((prev) => [...prev, { ...payload, id: Date.now() }]);
            } else {
                setProducts((prev) => prev.map((p) => (p.id === form.id ? { ...p, ...payload } : p)));
            }
        }
        setSaving(false);
        setModal(null);
    };

    const handleDelete = async (id) => {
        try { await productAPI.delete(id); } catch { /* delete locally */ }
        setProducts((prev) => prev.filter((p) => p.id !== id));
        setDeleteConfirm(null);
    };

    const totalValue = products.reduce((s, p) => s + p.price * p.stockQuantity, 0);
    const totalItems = products.reduce((s, p) => s + p.stockQuantity, 0);

    return (
        <div className="page-container">
            <div className="page-header animate-entrance delay-1">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
                    <div>
                        <h1 className="page-title">Admin Dashboard</h1>
                        <p className="page-subtitle">Manage your product catalog</p>
                    </div>
                    <button onClick={openCreate} className="btn-primary"><Plus size={16} /> Add Product</button>
                </div>
            </div>

            {/* Stats */}
            <div className="animate-entrance delay-2" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
                {[
                    { icon: Package, label: 'Products', value: products.length, color: '#6366f1' },
                    { icon: BarChart3, label: 'Total Items', value: totalItems.toLocaleString(), color: '#06b6d4' },
                    { icon: DollarSign, label: 'Inventory Value', value: `$${totalValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}`, color: '#10b981' },
                ].map((stat, i) => (
                    <div key={i} className="stat-card">
                        <stat.icon size={20} color={stat.color} style={{ marginBottom: '0.75rem' }} />
                        <div className="stat-value">{stat.value}</div>
                        <div className="stat-label">{stat.label}</div>
                    </div>
                ))}
            </div>

            {/* Products Table */}
            <div className="table-container animate-entrance delay-3">
                <table>
                    <thead>
                        <tr>
                            <th>Product</th>
                            <th>Category</th>
                            <th>Price</th>
                            <th>Stock</th>
                            <th style={{ textAlign: 'right' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            [1, 2, 3].map((i) => (
                                <tr key={i}>
                                    <td><div className="skeleton" style={{ height: '16px', width: '60%' }} /></td>
                                    <td><div className="skeleton" style={{ height: '16px', width: '50%' }} /></td>
                                    <td><div className="skeleton" style={{ height: '16px', width: '40%' }} /></td>
                                    <td><div className="skeleton" style={{ height: '16px', width: '30%' }} /></td>
                                    <td></td>
                                </tr>
                            ))
                        ) : products.map((product) => (
                            <tr key={product.id}>
                                <td>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                        <img src={product.image || 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=100'} alt="" style={{ width: '40px', height: '40px', borderRadius: '0.5rem', objectFit: 'cover' }} />
                                        <div>
                                            <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.875rem' }}>{product.name}</div>
                                            <div style={{ fontSize: '0.6875rem', color: 'var(--text-tertiary)' }}>ID: {product.id}</div>
                                        </div>
                                    </div>
                                </td>
                                <td><span className="badge badge-primary">{product.category}</span></td>
                                <td style={{ fontWeight: 600, fontFamily: "'Outfit', sans-serif" }}>${product.price.toFixed(2)}</td>
                                <td>
                                    <span className={`badge ${product.stockQuantity > 10 ? 'badge-success' : product.stockQuantity > 0 ? 'badge-warning' : 'badge-danger'}`}>
                                        {product.stockQuantity}
                                    </span>
                                </td>
                                <td style={{ textAlign: 'right' }}>
                                    <div style={{ display: 'flex', gap: '0.25rem', justifyContent: 'flex-end' }}>
                                        <button onClick={() => openEdit(product)} className="btn-icon"><Pencil size={15} /></button>
                                        <button onClick={() => setDeleteConfirm(product.id)} className="btn-icon" style={{ color: '#ef4444' }}><Trash2 size={15} /></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Product Modal */}
            {modal && (
                <div className="modal-overlay" onClick={() => setModal(null)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <h2 style={{ fontSize: '1.125rem', fontWeight: 700 }}>{modal === 'create' ? 'Add Product' : 'Edit Product'}</h2>
                            <button onClick={() => setModal(null)} className="btn-icon"><X size={18} /></button>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div>
                                <label className="label">Name</label>
                                <input className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Product name" />
                            </div>
                            <div>
                                <label className="label">Description</label>
                                <textarea className="input" rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Description" style={{ resize: 'vertical' }} />
                            </div>
                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <div style={{ flex: 1 }}>
                                    <label className="label">Price ($)</label>
                                    <input type="number" step="0.01" className="input" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} placeholder="0.00" />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <label className="label">Stock</label>
                                    <input type="number" className="input" value={form.stockQuantity} onChange={(e) => setForm({ ...form, stockQuantity: e.target.value })} placeholder="0" />
                                </div>
                            </div>
                            <div>
                                <label className="label">Category</label>
                                <select className="input" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} style={{ cursor: 'pointer' }}>
                                    {['Hardware', 'Networking', 'Security', 'Storage'].map((c) => <option key={c} value={c}>{c}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="label">Image URL</label>
                                <input className="input" value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} placeholder="https://..." />
                            </div>
                            <button onClick={handleSave} disabled={saving || !form.name || !form.price} className="btn-primary" style={{ width: '100%', marginTop: '0.5rem' }}>
                                {saving ? 'Saving...' : modal === 'create' ? 'Create Product' : 'Update Product'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation */}
            {deleteConfirm && (
                <div className="modal-overlay" onClick={() => setDeleteConfirm(null)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '380px', textAlign: 'center' }}>
                        <Trash2 size={32} color="#ef4444" style={{ marginBottom: '1rem' }} />
                        <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '0.5rem' }}>Delete Product?</h3>
                        <p style={{ fontSize: '0.875rem', color: 'var(--text-tertiary)', marginBottom: '1.5rem' }}>This action cannot be undone.</p>
                        <div style={{ display: 'flex', gap: '0.75rem' }}>
                            <button onClick={() => setDeleteConfirm(null)} className="btn-secondary" style={{ flex: 1 }}>Cancel</button>
                            <button onClick={() => handleDelete(deleteConfirm)} className="btn-danger" style={{ flex: 1 }}>Delete</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
