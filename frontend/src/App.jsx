import React, { useState } from 'react';
import { Layers, Zap, Shield, Cpu, Plus, RefreshCcw, ShoppingBag } from 'lucide-react';
import Navbar from './components/Navbar';

const PRODUCTS = [
  { id: 1, name: 'Cloud Processor X9', price: 299.99, category: 'Hardware', stock: 45, description: 'Next-gen distributed processing unit for cloud-native workloads.', image: 'https://images.unsplash.com/photo-1591405351990-4726e33df48d?auto=format&fit=crop&q=80&w=400' },
  { id: 2, name: 'Neural Link Hub', price: 149.50, category: 'Networking', stock: 12, description: 'Zero-latency neural synchronization for edge computing.', image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=400' },
  { id: 3, name: 'Cyber Shield v4', price: 89.99, category: 'Security', stock: 78, description: 'Quantum encryption module with auto-scaling protection.', image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc51?auto=format&fit=crop&q=80&w=400' },
  { id: 4, name: 'Data Core Prime', price: 599.00, category: 'Storage', stock: 5, description: '2.5 Exabyte localized storage with instant replication.', image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=400' },
];

const SERVICES = [
  { name: 'API Gateway', port: 8080, icon: Shield, color: '#00f2fe', desc: 'JWT Auth & Routing' },
  { name: 'Product Service', port: 8081, icon: Cpu, color: '#3b82f6', desc: 'Redis + PostgreSQL' },
  { name: 'Order Service', port: 8082, icon: Layers, color: '#6366f1', desc: 'Event-driven Orders' },
  { name: 'Infrastructure', port: '5432/6379', icon: Zap, color: '#10b981', desc: 'Postgres + Redis' },
];

function App() {
  const [cartCount, setCartCount] = useState(0);

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#050505', color: 'white', overflowX: 'hidden' }}>
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
        <div style={{ position: 'absolute', top: '-10%', left: '-10%', width: '40%', height: '40%', background: 'radial-gradient(circle, rgba(0,242,254,0.06) 0%, transparent 70%)', borderRadius: '50%' }} />
        <div style={{ position: 'absolute', bottom: '-10%', right: '-10%', width: '35%', height: '35%', background: 'radial-gradient(circle, rgba(99,102,241,0.06) 0%, transparent 70%)', borderRadius: '50%' }} />
      </div>

      <Navbar cartCount={cartCount} />

      <main style={{ position: 'relative', zIndex: 10, maxWidth: '1200px', margin: '0 auto', padding: '8rem 1.5rem 5rem' }}>

        {/* Hero */}
        <section style={{ textAlign: 'center', marginBottom: '8rem' }}>
          <div className="animate-entrance delay-1" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 16px', background: 'rgba(0,242,254,0.08)', border: '1px solid rgba(0,242,254,0.2)', borderRadius: '9999px', fontSize: '11px', fontWeight: 700, color: '#00f2fe', marginBottom: '2rem' }}>
            <Zap size={12} /> CLOUD.FLOW v1.0.4 - STABLE
          </div>
          <h1 className="animate-entrance delay-2" style={{ fontSize: 'clamp(2.5rem, 7vw, 6rem)', fontWeight: 900, marginBottom: '1.5rem', letterSpacing: '-0.04em', lineHeight: 1.1 }}>
            Next-Gen <br /> <span className="premium-text">Cloud Commerce</span>
          </h1>
          <p className="animate-entrance delay-3" style={{ color: 'rgba(255,255,255,0.4)', fontSize: '1.1rem', maxWidth: '580px', margin: '0 auto 3.5rem', lineHeight: 1.6 }}>
            Distributed microservices architecture with Redis caching and PostgreSQL persistence. Scaled for the future.
          </p>
          <div className="animate-entrance delay-4">
            <button className="btn-premium">Explore Catalog</button>
          </div>
        </section>

        {/* Status */}
        <section style={{ marginBottom: '6rem' }}>
          <div className="animate-entrance delay-5" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2.5rem' }}>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '12px' }}>
              <RefreshCcw size={22} color="#00f2fe" /> Service Infrastructure
            </h3>
            <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.3)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ width: '8px', height: '8px', background: '#10b981', borderRadius: '50%' }}></span>
              Operational
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem' }}>
            {SERVICES.map((s, i) => (
              <div key={i} className="animate-entrance glass-card" style={{ padding: '1.75rem', borderLeft: `4px solid ${s.color}`, animationDelay: `${0.6 + i * 0.1}s` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                  <s.icon size={20} color={s.color} />
                  <span style={{ fontSize: '10px', fontFamily: 'monospace', color: 'rgba(255,255,255,0.2)' }}>LOCAL:{s.port}</span>
                </div>
                <div style={{ fontWeight: 800, fontSize: '1.05rem', marginBottom: '4px' }}>{s.name}</div>
                <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', lineHeight: 1.5 }}>{s.desc}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Inventory */}
        <section>
          <div className="animate-entrance" style={{ animationDelay: '1s', marginBottom: '3rem' }}>
            <h3 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '0.5rem' }}>Premium Hardware</h3>
            <p style={{ color: 'rgba(255,255,255,0.3)' }}>Hardware provisioned via distributed product service</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
            {PRODUCTS.map((p, i) => (
              <div key={p.id} className="animate-entrance glass-card" style={{ padding: '1.25rem', animationDelay: `${1.1 + i * 0.1}s` }}>
                <div style={{ position: 'relative', overflow: 'hidden', borderRadius: '1rem', marginBottom: '1.5rem' }}>
                  <img src={p.image} alt={p.name} style={{ width: '100%', aspectRatio: '16/10', objectFit: 'cover' }} />
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.4), transparent)' }} />
                </div>
                <h4 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '0.6rem' }}>{p.name}</h4>
                <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.4)', marginBottom: '1.5rem', minHeight: '3em' }}>{p.description}</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '1.25rem' }}>
                  <span style={{ fontWeight: 900, fontSize: '1.3rem', fontFamily: 'monospace' }}>${p.price}</span>
                  <button onClick={() => setCartCount(c => c + 1)} className="btn-premium" style={{ padding: '10px 20px', fontSize: '12px' }}>
                    <Plus size={14} style={{ display: 'inline', marginRight: '4px' }} /> Buy
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer style={{ textAlign: 'center', padding: '5rem 3rem', color: 'rgba(255,255,255,0.15)', fontSize: '12px', fontWeight: 600 }}>
        ⚡ CLOUD.FLOW • CLOUD-NATIVE E-COMMERCE ENGINE
      </footer>
    </div>
  );
}

export default App;
