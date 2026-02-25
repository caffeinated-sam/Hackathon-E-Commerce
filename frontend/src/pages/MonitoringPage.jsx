import { useState, useEffect } from 'react';
import { Activity, Cpu, HardDrive, Wifi, Server, Zap, BarChart3, ArrowUpRight, ArrowDownRight, RefreshCcw } from 'lucide-react';

const generateMetrics = () => ({
    pods: {
        active: Math.floor(Math.random() * 4) + 2,
        desired: 5,
        ready: Math.floor(Math.random() * 3) + 2,
        total: 5,
    },
    cpu: {
        gateway: Math.random() * 60 + 15,
        product: Math.random() * 70 + 20,
        order: Math.random() * 55 + 10,
        overall: Math.random() * 50 + 20,
    },
    memory: {
        gateway: Math.random() * 40 + 30,
        product: Math.random() * 50 + 25,
        order: Math.random() * 35 + 20,
    },
    autoscaling: {
        enabled: true,
        minReplicas: 1,
        maxReplicas: 5,
        targetCPU: 60,
        currentReplicas: Math.floor(Math.random() * 3) + 2,
        status: Math.random() > 0.3 ? 'STABLE' : 'SCALING_UP',
    },
    services: [
        { name: 'API Gateway', port: 8080, status: 'HEALTHY', uptime: '99.97%', requests: Math.floor(Math.random() * 500 + 100) },
        { name: 'Product Service', port: 8081, status: Math.random() > 0.1 ? 'HEALTHY' : 'DEGRADED', uptime: '99.94%', requests: Math.floor(Math.random() * 400 + 80) },
        { name: 'Order Service', port: 8082, status: 'HEALTHY', uptime: '99.99%', requests: Math.floor(Math.random() * 300 + 50) },
        { name: 'PostgreSQL', port: 5432, status: 'HEALTHY', uptime: '100%', requests: Math.floor(Math.random() * 800 + 200) },
        { name: 'Redis Cache', port: 6379, status: 'HEALTHY', uptime: '100%', requests: Math.floor(Math.random() * 1200 + 300) },
    ],
    requestsPerSec: Math.floor(Math.random() * 200 + 50),
    cacheHitRate: Math.random() * 15 + 82,
    errorRate: Math.random() * 0.5,
    avgLatency: Math.floor(Math.random() * 40 + 12),
});

const GaugeChart = ({ value, max = 100, label, color, size = 100 }) => {
    const radius = 40;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (value / max) * circumference;

    return (
        <div style={{ textAlign: 'center' }}>
            <svg width={size} height={size} viewBox="0 0 100 100" style={{ transform: 'rotate(-90deg)' }}>
                <circle cx="50" cy="50" r={radius} fill="none" stroke="var(--border-color)" strokeWidth="8" />
                <circle
                    cx="50" cy="50" r={radius} fill="none"
                    stroke={color} strokeWidth="8" strokeLinecap="round"
                    strokeDasharray={circumference} strokeDashoffset={offset}
                    style={{ transition: 'stroke-dashoffset 1s ease' }}
                />
            </svg>
            <div style={{ marginTop: '-1.75rem', position: 'relative', zIndex: 1 }}>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, fontFamily: "'Outfit', sans-serif" }}>{value.toFixed(1)}%</div>
                <div style={{ fontSize: '0.6875rem', color: 'var(--text-tertiary)', marginTop: '2px' }}>{label}</div>
            </div>
        </div>
    );
};

export default function MonitoringPage() {
    const [metrics, setMetrics] = useState(generateMetrics());
    const [lastUpdated, setLastUpdated] = useState(new Date());
    const [autoRefresh, setAutoRefresh] = useState(true);

    useEffect(() => {
        if (!autoRefresh) return;
        const interval = setInterval(() => {
            setMetrics(generateMetrics());
            setLastUpdated(new Date());
        }, 5000);
        return () => clearInterval(interval);
    }, [autoRefresh]);

    const refresh = () => {
        setMetrics(generateMetrics());
        setLastUpdated(new Date());
    };

    const statusColor = (status) => {
        switch (status) {
            case 'HEALTHY': return '#10b981';
            case 'DEGRADED': return '#f59e0b';
            case 'DOWN': return '#ef4444';
            default: return '#6366f1';
        }
    };

    return (
        <div className="page-container">
            {/* Header */}
            <div className="page-header animate-entrance delay-1">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
                    <div>
                        <h1 className="page-title">System Monitoring</h1>
                        <p className="page-subtitle">
                            Real-time Kubernetes cluster metrics •{' '}
                            <span style={{ fontSize: '0.75rem' }}>Last updated: {lastUpdated.toLocaleTimeString()}</span>
                        </p>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                        <button
                            onClick={() => setAutoRefresh(!autoRefresh)}
                            className={autoRefresh ? 'btn-primary' : 'btn-secondary'}
                            style={{ padding: '0.45rem 1rem', fontSize: '0.75rem' }}
                        >
                            <Activity size={14} /> {autoRefresh ? 'Live' : 'Paused'}
                        </button>
                        <button onClick={refresh} className="btn-secondary" style={{ padding: '0.45rem 0.75rem' }}>
                            <RefreshCcw size={14} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Top Stats */}
            <div className="animate-entrance delay-2" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
                {[
                    { icon: Server, label: 'Active Pods', value: `${metrics.pods.active} / ${metrics.pods.total}`, color: '#6366f1', trend: metrics.pods.active > 3 ? 'up' : 'down' },
                    { icon: Zap, label: 'Requests/sec', value: metrics.requestsPerSec, color: '#06b6d4', trend: 'up' },
                    { icon: BarChart3, label: 'Cache Hit Rate', value: `${metrics.cacheHitRate.toFixed(1)}%`, color: '#10b981', trend: 'up' },
                    { icon: Activity, label: 'Avg Latency', value: `${metrics.avgLatency}ms`, color: metrics.avgLatency > 40 ? '#f59e0b' : '#10b981', trend: metrics.avgLatency > 30 ? 'up' : 'down' },
                ].map((stat, i) => (
                    <div key={i} className="stat-card" style={{ borderLeft: `3px solid ${stat.color}` }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.75rem' }}>
                            <stat.icon size={20} color={stat.color} />
                            {stat.trend === 'up' ?
                                <ArrowUpRight size={16} color="#10b981" /> :
                                <ArrowDownRight size={16} color="#f59e0b" />
                            }
                        </div>
                        <div className="stat-value">{stat.value}</div>
                        <div className="stat-label">{stat.label}</div>
                    </div>
                ))}
            </div>

            {/* CPU Gauges & Auto-scaling */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
                {/* CPU Usage */}
                <div className="glass-card animate-entrance delay-3" style={{ padding: '1.5rem' }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Cpu size={18} color="#6366f1" /> CPU Usage
                    </h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', gap: '1.5rem' }}>
                        <GaugeChart value={metrics.cpu.gateway} label="Gateway" color="#6366f1" />
                        <GaugeChart value={metrics.cpu.product} label="Product" color="#06b6d4" />
                        <GaugeChart value={metrics.cpu.order} label="Order" color="#10b981" />
                    </div>
                    <div style={{ marginTop: '1.25rem', padding: '0.75rem', background: 'var(--bg-secondary)', borderRadius: '0.625rem', textAlign: 'center' }}>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>Overall Cluster CPU: </span>
                        <span style={{ fontSize: '0.875rem', fontWeight: 700, color: metrics.cpu.overall > 60 ? '#f59e0b' : '#10b981' }}>
                            {metrics.cpu.overall.toFixed(1)}%
                        </span>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}> — HPA threshold: 60%</span>
                    </div>
                </div>

                {/* Auto-scaling Status */}
                <div className="glass-card animate-entrance delay-4" style={{ padding: '1.5rem' }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <HardDrive size={18} color="#06b6d4" /> Auto-Scaling (HPA)
                    </h3>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                        <span className={`badge ${metrics.autoscaling.status === 'STABLE' ? 'badge-success' : 'badge-warning'}`}>
                            <span className={`status-dot ${metrics.autoscaling.status === 'STABLE' ? 'status-dot-live' : 'status-dot-warning'}`} style={{ marginRight: '6px' }} />
                            {metrics.autoscaling.status}
                        </span>
                        <span style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                            {metrics.autoscaling.currentReplicas} replica{metrics.autoscaling.currentReplicas > 1 ? 's' : ''} running
                        </span>
                    </div>

                    {/* Scaling Bar */}
                    <div style={{ marginBottom: '1.5rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.6875rem', color: 'var(--text-tertiary)' }}>
                            <span>Min: {metrics.autoscaling.minReplicas}</span>
                            <span>Max: {metrics.autoscaling.maxReplicas}</span>
                        </div>
                        <div style={{ height: '10px', background: 'var(--bg-tertiary)', borderRadius: '5px', overflow: 'hidden', position: 'relative' }}>
                            <div style={{
                                height: '100%', borderRadius: '5px',
                                background: metrics.autoscaling.status === 'STABLE' ? 'var(--gradient-primary)' : 'linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)',
                                width: `${(metrics.autoscaling.currentReplicas / metrics.autoscaling.maxReplicas) * 100}%`,
                                transition: 'width 1s ease',
                            }} />
                        </div>
                    </div>

                    {/* Pod Info Grid */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                        {[
                            { label: 'Target CPU', value: `${metrics.autoscaling.targetCPU}%` },
                            { label: 'Current CPU', value: `${metrics.cpu.overall.toFixed(1)}%` },
                            { label: 'Pods Ready', value: `${metrics.pods.ready}/${metrics.pods.total}` },
                            { label: 'Scale Mode', value: metrics.autoscaling.enabled ? 'Auto' : 'Manual' },
                        ].map((item, i) => (
                            <div key={i} style={{ padding: '0.625rem', background: 'var(--bg-secondary)', borderRadius: '0.5rem' }}>
                                <div style={{ fontSize: '0.6875rem', color: 'var(--text-tertiary)', marginBottom: '0.125rem' }}>{item.label}</div>
                                <div style={{ fontSize: '0.875rem', fontWeight: 700, fontFamily: "'Outfit', sans-serif" }}>{item.value}</div>
                            </div>
                        ))}
                    </div>

                    {/* Memory */}
                    <div style={{ marginTop: '1.5rem' }}>
                        <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-tertiary)', marginBottom: '0.75rem' }}>MEMORY USAGE</div>
                        {Object.entries(metrics.memory).map(([service, usage]) => (
                            <div key={service} style={{ marginBottom: '0.5rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '0.25rem' }}>
                                    <span style={{ textTransform: 'capitalize', color: 'var(--text-secondary)' }}>{service}</span>
                                    <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{usage.toFixed(1)}%</span>
                                </div>
                                <div style={{ height: '4px', background: 'var(--bg-tertiary)', borderRadius: '2px', overflow: 'hidden' }}>
                                    <div style={{ height: '100%', borderRadius: '2px', background: usage > 70 ? '#f59e0b' : '#6366f1', width: `${usage}%`, transition: 'width 1s ease' }} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Service Health */}
            <div className="animate-entrance delay-5">
                <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Wifi size={18} color="#6366f1" /> Service Health
                </h3>
                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Service</th>
                                <th>Port</th>
                                <th>Status</th>
                                <th>Uptime</th>
                                <th>Requests/min</th>
                            </tr>
                        </thead>
                        <tbody>
                            {metrics.services.map((svc, i) => (
                                <tr key={i}>
                                    <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{svc.name}</td>
                                    <td style={{ fontFamily: 'monospace', fontSize: '0.8125rem' }}>{svc.port}</td>
                                    <td>
                                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                                            <span className="status-dot" style={{ background: statusColor(svc.status), boxShadow: `0 0 0 3px ${statusColor(svc.status)}33` }} />
                                            <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: statusColor(svc.status) }}>{svc.status}</span>
                                        </span>
                                    </td>
                                    <td style={{ color: '#10b981', fontWeight: 600, fontSize: '0.8125rem' }}>{svc.uptime}</td>
                                    <td style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700 }}>{svc.requests}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Error Rate */}
            <div className="glass-card animate-entrance" style={{ padding: '1rem 1.25rem', marginTop: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', animationDelay: '0.3s' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <span className="status-dot status-dot-live" />
                    <span style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>Error Rate: </span>
                    <span style={{ fontWeight: 700, color: metrics.errorRate < 1 ? '#10b981' : '#ef4444' }}>{metrics.errorRate.toFixed(2)}%</span>
                </div>
                <span style={{ fontSize: '0.6875rem', color: 'var(--text-tertiary)', fontFamily: 'monospace' }}>namespace: ecommerce</span>
            </div>

            <style>{`
        @media (max-width: 768px) {
          .page-container > div:nth-child(4) { grid-template-columns: 1fr !important; }
        }
      `}</style>
        </div>
    );
}
