import { Link } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function CartPage() {
    const { items, updateQuantity, removeItem, clearCart, cartTotal, cartCount } = useCart();

    if (items.length === 0) {
        return (
            <div className="page-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '70vh' }}>
                <div style={{ textAlign: 'center' }} className="animate-entrance delay-1">
                    <ShoppingBag size={56} style={{ color: 'var(--text-tertiary)', marginBottom: '1.5rem' }} />
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>Your cart is empty</h2>
                    <p style={{ color: 'var(--text-tertiary)', fontSize: '0.875rem', marginBottom: '2rem' }}>Add some amazing products to get started</p>
                    <Link to="/" className="btn-primary" style={{ textDecoration: 'none' }}>
                        Browse Products
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="page-container" style={{ maxWidth: '960px' }}>
            {/* Header */}
            <div className="page-header animate-entrance delay-1">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                        <h1 className="page-title">Shopping Cart</h1>
                        <p className="page-subtitle">{cartCount} item{cartCount > 1 ? 's' : ''} in your cart</p>
                    </div>
                    <button onClick={clearCart} className="btn-ghost" style={{ color: '#ef4444', fontSize: '0.8125rem' }}>
                        Clear All
                    </button>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '2rem', alignItems: 'start' }}>
                {/* Items */}
                <div className="animate-entrance delay-2" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {items.map((item) => (
                        <div key={item.id} className="glass-card" style={{ display: 'flex', gap: '1.25rem', padding: '1.25rem', alignItems: 'center' }}>
                            <Link to={`/product/${item.id}`}>
                                <img
                                    src={item.image || 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=200'}
                                    alt={item.name}
                                    style={{ width: '88px', height: '88px', borderRadius: '0.75rem', objectFit: 'cover', flexShrink: 0 }}
                                />
                            </Link>
                            <div style={{ flex: 1, minWidth: 0 }}>
                                <Link to={`/product/${item.id}`} style={{ textDecoration: 'none' }}>
                                    <h3 style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>{item.name}</h3>
                                </Link>
                                <p style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', marginBottom: '0.75rem' }}>{item.category}</p>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--border-color)', borderRadius: '0.5rem', overflow: 'hidden' }}>
                                        <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="btn-icon" style={{ borderRadius: 0, width: '2rem', height: '2rem' }}>
                                            <Minus size={14} />
                                        </button>
                                        <span style={{ width: '2.5rem', textAlign: 'center', fontSize: '0.8125rem', fontWeight: 600 }}>{item.quantity}</span>
                                        <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="btn-icon" style={{ borderRadius: 0, width: '2rem', height: '2rem' }}>
                                            <Plus size={14} />
                                        </button>
                                    </div>
                                    <button onClick={() => removeItem(item.id)} className="btn-icon" style={{ color: '#ef4444' }}>
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                            <div style={{ textAlign: 'right', flexShrink: 0 }}>
                                <div style={{ fontSize: '1.1rem', fontWeight: 800, fontFamily: "'Outfit', sans-serif", color: 'var(--text-primary)' }}>
                                    ${(item.price * item.quantity).toFixed(2)}
                                </div>
                                <div style={{ fontSize: '0.6875rem', color: 'var(--text-tertiary)' }}>
                                    ${item.price.toFixed(2)} each
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Order Summary */}
                <div className="glass-card animate-entrance delay-3" style={{ padding: '1.5rem', position: 'sticky', top: '80px' }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1.25rem' }}>Order Summary</h3>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.25rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                            <span>Subtotal ({cartCount} items)</span>
                            <span>${cartTotal.toFixed(2)}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                            <span>Shipping</span>
                            <span style={{ color: '#10b981', fontWeight: 600 }}>Free</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                            <span>Tax (est.)</span>
                            <span>${(cartTotal * 0.08).toFixed(2)}</span>
                        </div>
                    </div>

                    <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1rem', marginBottom: '1.25rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.125rem', fontWeight: 800 }}>
                            <span>Total</span>
                            <span style={{ fontFamily: "'Outfit', sans-serif" }}>${(cartTotal * 1.08).toFixed(2)}</span>
                        </div>
                    </div>

                    <Link to="/checkout" className="btn-primary" style={{ width: '100%', justifyContent: 'center', textDecoration: 'none', padding: '0.75rem' }}>
                        Proceed to Checkout <ArrowRight size={16} />
                    </Link>

                    <Link to="/" style={{ display: 'block', textAlign: 'center', marginTop: '1rem', fontSize: '0.8125rem', color: 'var(--text-tertiary)', textDecoration: 'none' }}>
                        Continue Shopping
                    </Link>
                </div>
            </div>

            <style>{`
        @media (max-width: 768px) {
          .page-container > div:last-of-type {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
        </div>
    );
}
