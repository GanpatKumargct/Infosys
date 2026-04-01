import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { Lock, Mail, Shield, ArrowRight } from 'lucide-react';
import api from '../services/api';

const Login = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const roleParam = searchParams.get('role');

    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Optional: Pre-fill or adjust UI based on roleParam if needed
    }, [roleParam]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const response = await api.post('/auth/login', formData);
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('role', response.data.role);
            localStorage.setItem('userId', response.data.id);
            localStorage.setItem('fullName', response.data.fullName);
            localStorage.setItem('profileCompletion', response.data.profileCompletionPercentage);

            navigate('/dashboard');
        } catch (err) {
            setError('Invalid credentials. Please try again.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, var(--secondary) 0%, var(--background) 100%)',
            padding: '2rem'
        }}>
            <div className="card" style={{
                maxWidth: '450px',
                width: '100%',
                padding: '3rem',
                borderRadius: '24px',
                background: 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(10px)',
                boxShadow: '0 20px 40px rgba(0,0,0,0.08)',
                border: '1px solid rgba(255,255,255,0.5)'
            }}>
                <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                    <div style={{
                        width: '64px',
                        height: '64px',
                        background: 'linear-gradient(135deg, var(--primary), var(--primary-light))',
                        borderRadius: '20px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 1.5rem',
                        boxShadow: '0 10px 20px rgba(0, 119, 182, 0.2)'
                    }}>
                        <Shield color="white" size={32} />
                    </div>
                    <h2 style={{ color: 'var(--text-main)', fontSize: '1.75rem', fontWeight: '700', marginBottom: '0.5rem' }}>
                        Welcome Back
                    </h2>
                    <p style={{ color: 'var(--text-muted)' }}>
                        {roleParam ? `Log in to your ${roleParam} portal` : 'Enter your credentials to access your account'}
                    </p>
                </div>

                {error && (
                    <div style={{
                        background: '#fef2f2',
                        color: '--accent',
                        padding: '1rem',
                        borderRadius: '12px',
                        marginBottom: '1.5rem',
                        textAlign: 'center',
                        border: '1px solid #fecaca',
                        fontSize: '0.9rem'
                    }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', fontSize: '0.9rem', color: 'var(--text-main)' }}>Email Address</label>
                        <div style={{ position: 'relative' }}>
                            <Mail size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
                            <input
                                type="email"
                                name="email"
                                placeholder="name@example.com"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                style={{
                                    paddingLeft: '3rem',
                                    height: '50px',
                                    borderRadius: '12px',
                                    border: '1px solid var(--border)',
                                    background: '#f8fafc',
                                    fontSize: '1rem',
                                    transition: 'all 0.3s ease'
                                }}
                            />
                        </div>
                    </div>

                    <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                            <label style={{ fontWeight: '500', fontSize: '0.9rem', color: 'var(--text-main)' }}>Password</label>
                            <Link to="/forgot-password" style={{ fontSize: '0.85rem', color: 'var(--primary)', fontWeight: '600' }}>Forgot Password?</Link>
                        </div>
                        <div style={{ position: 'relative' }}>
                            <Lock size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
                            <input
                                type="password"
                                name="password"
                                placeholder="••••••••"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                style={{
                                    paddingLeft: '3rem',
                                    height: '50px',
                                    borderRadius: '12px',
                                    border: '1px solid var(--border)',
                                    background: '#f8fafc',
                                    fontSize: '1rem',
                                    transition: 'all 0.3s ease'
                                }}
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="btn btn-primary"
                        style={{
                            marginTop: '1rem',
                            height: '50px',
                            width: '100%',
                            borderRadius: '12px',
                            fontSize: '1rem',
                            display: 'flex',
                            gap: '0.5rem',
                            opacity: loading ? 0.8 : 1
                        }}
                    >
                        {loading ? 'Signing in...' : 'Sign In'}
                        {!loading && <ArrowRight size={18} />}
                    </button>
                </form>

                <div className="text-center" style={{ marginTop: '2rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                    Don't have an account? <Link to="/" style={{ color: 'var(--primary)', fontWeight: '600', marginLeft: '0.25rem' }}>Register here</Link>
                </div>
            </div>
        </div>
    );
};

export default Login;
