import { createContext, useContext, useState } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext(null);

/* Creates a fake JWT for demo/offline mode */
function makeDemoToken(username) {
    const header = btoa(JSON.stringify({ alg: 'none', typ: 'JWT' }));
    const role = username.toLowerCase() === 'admin' ? 'ADMIN' : 'USER';
    const payload = btoa(JSON.stringify({ sub: username, role, iat: Date.now() }));
    return `${header}.${payload}.demo`;
}

function setSession(jwt, userData, setToken, setUser) {
    localStorage.setItem('cf_token', jwt);
    localStorage.setItem('cf_user', JSON.stringify(userData));
    setToken(jwt);
    setUser(userData);
}

export function AuthProvider({ children }) {
    const [user, setUser] = useState(() => {
        const saved = localStorage.getItem('cf_user');
        return saved ? JSON.parse(saved) : null;
    });
    const [token, setToken] = useState(() => localStorage.getItem('cf_token'));
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const isAuthenticated = !!token;
    const isAdmin = user?.role === 'ADMIN' || user?.username === 'admin';

    const login = async (username, password) => {
        setLoading(true);
        setError(null);
        try {
            const res = await authAPI.login({ username, password });
            const jwt = typeof res.data === 'string' ? res.data : res.data.token || res.data.access_token || '';
            if (!jwt) throw new Error('No token received');
            const userData = { username, role: parseRole(jwt) };
            setSession(jwt, userData, setToken, setUser);
            return true;
        } catch (err) {
            /* If server is unreachable, fall back to demo mode */
            if (err.code === 'ERR_NETWORK' || err.code === 'ECONNABORTED') {
                const jwt = makeDemoToken(username);
                const userData = { username, role: username.toLowerCase() === 'admin' ? 'ADMIN' : 'USER' };
                setSession(jwt, userData, setToken, setUser);
                return true;
            }
            const msg =
                err.response?.data?.message ||
                err.response?.data?.error ||
                err.message ||
                'Invalid credentials';
            setError(msg);
            return false;
        } finally {
            setLoading(false);
        }
    };

    const register = async (username, password, email) => {
        setLoading(true);
        setError(null);
        try {
            await authAPI.register({ username, password, email });
            return await login(username, password);
        } catch (err) {
            /* If server is unreachable, fall back to demo mode */
            if (err.code === 'ERR_NETWORK' || err.code === 'ECONNABORTED') {
                const jwt = makeDemoToken(username);
                const userData = { username, role: 'USER' };
                setSession(jwt, userData, setToken, setUser);
                return true;
            }
            const msg =
                err.response?.data?.message ||
                err.response?.data?.error ||
                'Registration failed';
            setError(msg);
            return false;
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        localStorage.removeItem('cf_token');
        localStorage.removeItem('cf_user');
        setToken(null);
        setUser(null);
    };

    const clearError = () => setError(null);

    return (
        <AuthContext.Provider value={{ user, token, isAuthenticated, isAdmin, loading, error, login, register, logout, clearError }}>
            {children}
        </AuthContext.Provider>
    );
}

function parseRole(token) {
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.role || payload.roles?.[0] || 'USER';
    } catch {
        return 'USER';
    }
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within AuthProvider');
    return context;
}
