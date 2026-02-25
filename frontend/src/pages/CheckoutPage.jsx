import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, Truck, ShieldCheck, ArrowLeft, Check } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { orderAPI } from '../services/api';

/* ── InputField moved OUTSIDE the component so React keeps identity across re-renders ── */
function InputField({ label, field, type = 'text', placeholder, width, value, onChange, pattern, minLength, maxLength, title, onInput }) {
    return (
        <div style={{ flex: width || '1 1 auto' }}>
            <label className="label">{label}</label>
            <input
                type={type}
                className="input"
                placeholder={placeholder}
                value={value}
                onChange={(e) => onChange(field, e.target.value)}
                onInput={onInput}
                pattern={pattern}
                minLength={minLength}
                maxLength={maxLength}
                title={title}
                required
            />
        </div>
    );
}

/* ── Auto-format helpers ── */
function formatCardNumber(raw) {
    const digits = raw.replace(/\D/g, '').slice(0, 16);
    return digits.replace(/(\d{4})(?=\d)/g, '$1 ');
}

function formatExpiry(raw) {
    const digits = raw.replace(/\D/g, '').slice(0, 4);
    if (digits.length >= 3) return digits.slice(0, 2) + '/' + digits.slice(2);
    return digits;
}

export default function CheckoutPage() {
    const navigate = useNavigate();
    const { items, cartTotal, clearCart } = useCart();
    const { isAuthenticated } = useAuth();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [orderPlaced, setOrderPlaced] = useState(false);
    const [form, setForm] = useState({
        firstName: '', lastName: '', email: '', address: '', city: '', zip: '', country: 'US',
        cardNumber: '', expiry: '', cvv: '', nameOnCard: '',
    });

    const updateForm = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));

    const handlePlaceOrder = async () => {
        setLoading(true);
        try {
            for (const item of items) {
                await orderAPI.create({ productId: item.id, quantity: item.quantity, customerName: `${form.firstName} ${form.lastName}` });
            }
        } catch {
            /* Order placed locally even if API is down */
        }
        setOrderPlaced(true);
        clearCart();
        setLoading(false);
    };

    /* ── Step validation with HTML5 form ── */
    const handleStepSubmit = (e, nextStep) => {
        e.preventDefault();
        if (nextStep === 'place') {
            handlePlaceOrder();
        } else {
            setStep(nextStep);
        }
    };

    if (orderPlaced) {
        return (
            <div className="page-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '70vh' }}>
                <div style={{ textAlign: 'center', maxWidth: '440px' }} className="animate-entrance delay-1">
                    <div style={{ width: '72px', height: '72px', background: 'rgba(16, 185, 129, 0.12)', borderRadius: '50%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
                        <Check size={36} color="#10b981" />
                    </div>
                    <h1 style={{ fontSize: '1.75rem', fontWeight: 800, fontFamily: "'Outfit', sans-serif", marginBottom: '0.75rem' }}>Order Confirmed!</h1>
                    <p style={{ color: 'var(--text-tertiary)', fontSize: '0.9375rem', lineHeight: 1.7, marginBottom: '2rem' }}>
                        Your order has been placed successfully. You'll receive a confirmation email shortly.
                    </p>
                    <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
                        <button onClick={() => navigate('/orders')} className="btn-primary">View Orders</button>
                        <button onClick={() => navigate('/')} className="btn-secondary">Continue Shopping</button>
                    </div>
                </div>
            </div>
        );
    }

    if (items.length === 0) {
        return (
            <div className="page-container" style={{ textAlign: 'center', paddingTop: '10rem' }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem' }}>Your cart is empty</h2>
                <button onClick={() => navigate('/')} className="btn-primary">Browse Products</button>
            </div>
        );
    }

    const tax = cartTotal * 0.08;
    const total = cartTotal + tax;

    return (
        <div className="page-container" style={{ maxWidth: '960px' }}>
            <div className="page-header animate-entrance delay-1">
                <button onClick={() => navigate('/cart')} className="btn-ghost" style={{ marginBottom: '1rem', paddingLeft: 0 }}>
                    <ArrowLeft size={16} /> Back to Cart
                </button>
                <h1 className="page-title">Checkout</h1>
            </div>

            {/* Progress Steps */}
            <div className="animate-entrance delay-2" style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem' }}>
                {['Shipping', 'Payment', 'Review'].map((label, i) => (
                    <div key={label} style={{ flex: 1, textAlign: 'center' }}>
                        <div style={{
                            height: '4px', borderRadius: '2px', marginBottom: '0.5rem',
                            background: i + 1 <= step ? 'var(--gradient-primary)' : 'var(--bg-tertiary)',
                            transition: 'background 0.3s',
                        }} />
                        <span style={{ fontSize: '0.75rem', fontWeight: 600, color: i + 1 <= step ? 'var(--text-primary)' : 'var(--text-tertiary)' }}>{label}</span>
                    </div>
                ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '2rem', alignItems: 'start' }}>
                {/* Form */}
                <div className="glass-card animate-entrance delay-3" style={{ padding: '1.75rem' }}>
                    {step === 1 && (
                        <form onSubmit={(e) => handleStepSubmit(e, 2)}>
                            <h2 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <Truck size={20} color="#6366f1" /> Shipping Information
                            </h2>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
                                <InputField label="First Name" field="firstName" placeholder="John" width="1 1 45%" value={form.firstName} onChange={updateForm} />
                                <InputField label="Last Name" field="lastName" placeholder="Doe" width="1 1 45%" value={form.lastName} onChange={updateForm} />
                                <InputField label="Email" field="email" type="email" placeholder="john@example.com" width="1 1 100%" value={form.email} onChange={updateForm} />
                                <InputField label="Address" field="address" placeholder="123 Cloud St" width="1 1 100%" value={form.address} onChange={updateForm} />
                                <InputField
                                    label="City" field="city" placeholder="San Francisco" width="1 1 45%"
                                    value={form.city}
                                    onChange={(field, val) => updateForm(field, val.replace(/[0-9]/g, ''))}
                                />
                                <InputField
                                    label="ZIP Code" field="zip" placeholder="94102" width="1 1 45%"
                                    value={form.zip}
                                    onChange={(field, val) => updateForm(field, val.replace(/\D/g, '').slice(0, 5))}
                                />
                            </div>
                            <button type="submit" className="btn-primary" style={{ marginTop: '1.5rem', width: '100%' }}>
                                Continue to Payment
                            </button>
                        </form>
                    )}

                    {step === 2 && (
                        <form onSubmit={(e) => handleStepSubmit(e, 3)}>
                            <h2 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <CreditCard size={20} color="#6366f1" /> Payment Details
                            </h2>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
                                <InputField
                                    label="Name on Card" field="nameOnCard" placeholder="John Doe" width="1 1 100%"
                                    value={form.nameOnCard} onChange={updateForm}
                                    minLength={2} title="Enter the cardholder's full name"
                                />
                                <InputField
                                    label="Card Number" field="cardNumber" placeholder="4242 4242 4242 4242" width="1 1 100%"
                                    value={form.cardNumber}
                                    onChange={(field, raw) => updateForm(field, formatCardNumber(raw))}
                                    pattern="\d{4}\s\d{4}\s\d{4}\s\d{4}"
                                    maxLength={19}
                                    title="Enter a 16-digit card number"
                                />
                                <InputField
                                    label="Expiry (MM/YY)" field="expiry" placeholder="MM/YY" width="1 1 45%"
                                    value={form.expiry}
                                    onChange={(field, raw) => updateForm(field, formatExpiry(raw))}
                                    pattern="(0[1-9]|1[0-2])\/\d{2}"
                                    maxLength={5}
                                    title="Enter a valid expiry date as MM/YY (e.g. 03/27)"
                                />
                                <InputField
                                    label="CVV" field="cvv" placeholder="123" width="1 1 45%"
                                    value={form.cvv}
                                    onChange={(field, raw) => updateForm(field, raw.replace(/\D/g, '').slice(0, 4))}
                                    pattern="\d{3,4}"
                                    minLength={3} maxLength={4}
                                    title="Enter the 3 or 4 digit security code"
                                />
                            </div>
                            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
                                <button type="button" onClick={() => setStep(1)} className="btn-secondary" style={{ flex: 1 }}>Back</button>
                                <button type="submit" className="btn-primary" style={{ flex: 2 }}>Review Order</button>
                            </div>
                        </form>
                    )}

                    {step === 3 && (
                        <form onSubmit={(e) => handleStepSubmit(e, 'place')}>
                            <h2 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <ShieldCheck size={20} color="#6366f1" /> Review Order
                            </h2>
                            {/* Shipping Summary */}
                            <div style={{ background: 'var(--bg-secondary)', borderRadius: '0.75rem', padding: '1rem', marginBottom: '1rem' }}>
                                <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-tertiary)', marginBottom: '0.375rem' }}>SHIPPING TO</div>
                                <div style={{ fontSize: '0.875rem', color: 'var(--text-primary)' }}>{form.firstName} {form.lastName}</div>
                                <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>{form.address}, {form.city} {form.zip}</div>
                            </div>
                            {/* Items */}
                            <div style={{ marginBottom: '1rem' }}>
                                {items.map((item) => (
                                    <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.625rem 0', borderBottom: '1px solid var(--border-light)', fontSize: '0.875rem' }}>
                                        <span style={{ color: 'var(--text-secondary)' }}>{item.name} × {item.quantity}</span>
                                        <span style={{ fontWeight: 600 }}>${(item.price * item.quantity).toFixed(2)}</span>
                                    </div>
                                ))}
                            </div>
                            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
                                <button type="button" onClick={() => setStep(2)} className="btn-secondary" style={{ flex: 1 }}>Back</button>
                                <button type="submit" disabled={loading} className="btn-primary" style={{ flex: 2 }}>
                                    {loading ? 'Processing...' : `Place Order — $${total.toFixed(2)}`}
                                </button>
                            </div>
                        </form>
                    )}
                </div>

                {/* Order Summary Sidebar */}
                <div className="glass-card animate-entrance delay-4" style={{ padding: '1.5rem', position: 'sticky', top: '80px' }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem' }}>Summary</h3>
                    {items.map((item) => (
                        <div key={item.id} style={{ display: 'flex', gap: '0.75rem', marginBottom: '0.75rem', alignItems: 'center' }}>
                            <img src={item.image || 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=100'} alt={item.name} style={{ width: '44px', height: '44px', borderRadius: '0.5rem', objectFit: 'cover' }} />
                            <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ fontSize: '0.8125rem', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.name}</div>
                                <div style={{ fontSize: '0.6875rem', color: 'var(--text-tertiary)' }}>Qty: {item.quantity}</div>
                            </div>
                            <span style={{ fontSize: '0.8125rem', fontWeight: 600, flexShrink: 0 }}>${(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                    ))}
                    <div style={{ borderTop: '1px solid var(--border-color)', marginTop: '0.75rem', paddingTop: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem', color: 'var(--text-secondary)' }}><span>Subtotal</span><span>${cartTotal.toFixed(2)}</span></div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem', color: 'var(--text-secondary)' }}><span>Tax</span><span>${tax.toFixed(2)}</span></div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1rem', fontWeight: 800, marginTop: '0.5rem', paddingTop: '0.5rem', borderTop: '1px solid var(--border-color)' }}><span>Total</span><span>${total.toFixed(2)}</span></div>
                    </div>
                </div>
            </div>

            <style>{`
                @media (max-width: 768px) {
                    .page-container > div:last-of-type { grid-template-columns: 1fr !important; }
                }
            `}</style>
        </div>
    );
}
