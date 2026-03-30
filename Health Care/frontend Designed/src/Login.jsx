import { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';
import './index.css';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    // Pre-fill email if coming from trainer page
    const trainerEmail = location.state?.trainerEmail || '';
    const trainerName  = location.state?.trainerName  || '';

    useEffect(() => {
        if (trainerEmail) {
            setEmail(trainerEmail);
        }
    }, [trainerEmail]);

    const validateEmail = (email) => {
        const re = /^[a-zA-Z0-9._%+-]+@gmail\.com$/i;
        return re.test(String(email).trim());
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        const trimmedEmail = email.trim();

        if (!validateEmail(trimmedEmail)) {
            setError('Please enter a valid Gmail address (e.g., user@gmail.com)');
            return;
        }

        setLoading(true);
        const result = await login(trimmedEmail, password);
        setLoading(false);

        if (result.success) {
            if (result.role === 'admin') {
                navigate('/admin-dashboard');
            } else if (result.role === 'trainer') {
                navigate('/trainer-dashboard');
            } else {
                navigate('/dashboard');
            }
        } else {
            setError(result.message);
        }
    };

    return (
        <div className="auth-page">
            {/* Left branding panel */}
            <div className="auth-left">
                <div className="auth-brand-block">
                    <div className="auth-brand-icon">🌿</div>
                    <div>
                        <div className="auth-brand-name">WellNest</div>
                        <div className="auth-brand-sub">Smart Health & Fitness Companion</div>
                    </div>
                </div>
                <div className="auth-tagline-block">
                    <h2>Track Your Fitness Journey</h2>
                    <p>Monitor your health, stay hydrated, practice yoga, and achieve your wellness goals every day.</p>
                </div>
                <div className="auth-features-list">
                    <div className="auth-feature-item"><span className="af-icon">💧</span><span>Daily hydration tracking</span></div>
                    <div className="auth-feature-item"><span className="af-icon">🧘</span><span>Yoga & breathing exercises</span></div>
                    <div className="auth-feature-item"><span className="af-icon">🚶</span><span>Step counter & walking goals</span></div>
                    <div className="auth-feature-item"><span className="af-icon">⚖️</span><span>BMI calculator & health tips</span></div>
                    <div className="auth-feature-item"><span className="af-icon">🏋️</span><span>Connect with expert trainers</span></div>
                </div>
            </div>

            {/* Right form panel */}
            <div className="auth-right">
                <div className="auth-card">
                    <div className="auth-card-title">Welcome back 👋</div>
                    <p className="auth-card-sub">Sign in to continue your health journey</p>

                    {trainerName && (
                        <div className="auth-trainer-banner">
                            🏋️ Logging in as <strong>{trainerName}</strong>
                            <span className="auth-trainer-email">{trainerEmail}</span>
                        </div>
                    )}

                    {error && <div className="auth-error-msg">⚠️ {error}</div>}

                    <form onSubmit={handleSubmit}>
                        <div className="auth-field">
                            <label className="auth-field-label">Email Address</label>
                            <div className="auth-input-wrap">
                                <span className="auth-input-icon">📧</span>
                                <input
                                    type="text"
                                    className={`auth-input${error ? ' input-err' : ''}`}
                                    placeholder="yourname@gmail.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="auth-field">
                            <label className="auth-field-label">Password</label>
                            <div className="auth-input-wrap">
                                <span className="auth-input-icon">🔒</span>
                                <input
                                    type="password"
                                    className={`auth-input${error ? ' input-err' : ''}`}
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="forgot-link-row">
                            <Link to="/forgot-password">Forgot password?</Link>
                        </div>

                        <button type="submit" className="auth-submit-btn" disabled={loading}>
                            {loading ? '⏳ Signing in...' : '🚀 Sign In'}
                        </button>
                    </form>

                    <div className="auth-divider">or</div>

                    <p className="auth-switch-link">
                        Don't have an account? <Link to="/register">Create one free →</Link>
                    </p>

                    <div className="auth-hint">
                        💡 New here? <Link to="/register">Register first</Link> to create your account
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;
