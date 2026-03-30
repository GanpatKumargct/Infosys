import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from './AuthContext';
import './index.css';

function ForgotPassword() {
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const { checkEmail, resetPassword } = useAuth();
    const navigate = useNavigate();

    const validateEmail = (email) => {
        const re = /^[a-zA-Z0-9._%+-]+@gmail\.com$/i;
        return re.test(String(email).trim());
    };

    const handleEmailSubmit = async (e) => {
        e.preventDefault(); setError(''); setMessage('');
        const trimmedEmail = email.trim();
        if (!validateEmail(trimmedEmail)) { setError('Please enter a valid Gmail address'); return; }
        const emailExists = await checkEmail(trimmedEmail);
        if (!emailExists) { setError('Email not found. Please register.'); return; }
        setLoading(true);
        try {
            const res = await fetch('http://localhost:5000/api/send-otp', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ email: trimmedEmail }) });
            const data = await res.json();
            if (data.success) { setStep(2); setMessage('OTP sent to your email. Check your inbox.'); }
            else setError(data.message || 'Failed to send OTP');
        } catch { setError('Server error. Ensure backend is running.'); }
        finally { setLoading(false); }
    };

    const handleOtpSubmit = async (e) => {
        e.preventDefault(); setError(''); setMessage(''); setLoading(true);
        try {
            const res = await fetch('http://localhost:5000/api/verify-otp', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ email, otp }) });
            const data = await res.json();
            if (data.success) { setStep(3); setMessage('OTP Verified. Set a new password.'); }
            else setError(data.message || 'Invalid OTP');
        } catch { setError('Verification failed. Try again.'); }
        finally { setLoading(false); }
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault(); setError(''); setMessage('');
        if (newPassword.length < 6) { setError('Password must be at least 6 characters'); return; }
        if (newPassword !== confirmPassword) { setError('Passwords do not match'); return; }
        const result = await resetPassword(email, newPassword);
        if (result.success) {
            setMessage('Password reset successfully. Redirecting to login...');
            setTimeout(() => navigate('/login'), 2000);
        } else setError(result.message || 'Failed to reset password');
    };

    const stepLabels = ['Find Email', 'Verify OTP', 'New Password'];

    return (
        <div className="auth-page">
            <div className="auth-left">
                <div className="auth-brand-block">
                    <div className="auth-brand-icon">🌿</div>
                    <div>
                        <div className="auth-brand-name">WellNest</div>
                        <div className="auth-brand-sub">Account Recovery</div>
                    </div>
                </div>
                <div className="auth-tagline-block">
                    <h2>Recover Your Account</h2>
                    <p>Reset your password in just a few steps. We'll verify your identity and get you back in.</p>
                </div>
                <div className="auth-features-list">
                    <div className="auth-feature-item"><span className="af-icon">📧</span><span>Enter your registered Gmail</span></div>
                    <div className="auth-feature-item"><span className="af-icon">🔐</span><span>Receive a secure 6-digit OTP</span></div>
                    <div className="auth-feature-item"><span className="af-icon">🔑</span><span>Set a strong new password</span></div>
                    <div className="auth-feature-item"><span className="af-icon">✅</span><span>Access your account instantly</span></div>
                </div>
            </div>

            <div className="auth-right">
                <div className="auth-card">
                    {/* Step indicator */}
                    <div className="fp-steps">
                        {stepLabels.map((label, i) => (
                            <div key={label} className={`fp-step ${step === i+1 ? 'active' : step > i+1 ? 'done' : ''}`}>
                                <div className="fp-step-dot">{step > i+1 ? '✓' : i+1}</div>
                                <div className="fp-step-label">{label}</div>
                            </div>
                        ))}
                    </div>

                    <div className="auth-card-title">
                        {step === 1 ? '🔍 Find Your Account' : step === 2 ? '📨 Enter OTP' : '🔑 Reset Password'}
                    </div>
                    <p className="auth-card-sub">
                        {step === 1 ? 'Enter your Gmail to receive a one-time code' : step === 2 ? 'Check your inbox for the 6-digit OTP' : 'Choose a strong new password'}
                    </p>

                    {error && <div className="auth-error-msg">⚠️ {error}</div>}
                    {message && <div className="auth-success-msg">✅ {message}</div>}

                    {step === 1 && (
                        <form onSubmit={handleEmailSubmit}>
                            <div className="auth-field">
                                <label className="auth-field-label">Email Address</label>
                                <div className="auth-input-wrap">
                                    <span className="auth-input-icon">📧</span>
                                    <input type="text" className="auth-input" placeholder="yourname@gmail.com" value={email} onChange={e => setEmail(e.target.value)} required />
                                </div>
                            </div>
                            <button type="submit" className="auth-submit-btn" disabled={loading}>{loading ? '⏳ Sending OTP...' : '📨 Send OTP'}</button>
                            <div className="auth-divider">or</div>
                            <p className="auth-switch-link"><Link to="/login">← Back to Login</Link></p>
                        </form>
                    )}

                    {step === 2 && (
                        <form onSubmit={handleOtpSubmit}>
                            <div className="auth-field">
                                <label className="auth-field-label">6-Digit OTP</label>
                                <div className="auth-input-wrap">
                                    <span className="auth-input-icon">🔐</span>
                                    <input type="text" className="auth-input" placeholder="Enter OTP" value={otp} onChange={e => setOtp(e.target.value)} maxLength="6" required />
                                </div>
                            </div>
                            <button type="submit" className="auth-submit-btn" disabled={loading}>{loading ? '⏳ Verifying...' : '✅ Verify OTP'}</button>
                            <div className="auth-divider">or</div>
                            <p className="auth-switch-link"><button type="button" onClick={() => setStep(1)} style={{background:'none',border:'none',color:'var(--orange-lt)',fontWeight:700,cursor:'pointer'}}>← Back</button></p>
                        </form>
                    )}

                    {step === 3 && (
                        <form onSubmit={handlePasswordSubmit}>
                            <div className="auth-field">
                                <label className="auth-field-label">New Password</label>
                                <div className="auth-input-wrap">
                                    <span className="auth-input-icon">🔒</span>
                                    <input type="password" className="auth-input" placeholder="Min 6 characters" value={newPassword} onChange={e => setNewPassword(e.target.value)} required />
                                </div>
                            </div>
                            <div className="auth-field">
                                <label className="auth-field-label">Confirm Password</label>
                                <div className="auth-input-wrap">
                                    <span className="auth-input-icon">🔒</span>
                                    <input type="password" className="auth-input" placeholder="Repeat password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required />
                                </div>
                            </div>
                            <button type="submit" className="auth-submit-btn">🔑 Reset Password</button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}
export default ForgotPassword;
