import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "./AuthContext";
import "./index.css";

function SuccessModal({ onClose }) {
  return (
    <div className="modal-overlay">
      <div className="modal-card">
        <div className="modal-icon">🎉</div>
        <h2 className="modal-title">Registration Successful!</h2>
        <p className="modal-sub">Your WellNest account has been created. Welcome aboard your wellness journey!</p>
        <div className="modal-features">
          <div className="modal-feat">✅ Account created</div>
          <div className="modal-feat">✅ Profile saved</div>
          <div className="modal-feat">✅ Ready to start</div>
        </div>
        <button className="auth-submit-btn" onClick={onClose}>🚀 Go to Login</button>
      </div>
    </div>
  );
}

function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    age: "",
    weight: ""
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
    setErrors({ ...errors, [e.target.id]: '' });
  };

  const validateEmail = (email) => {
    const re = /^[a-zA-Z0-9._%+-]+@gmail\.com$/i;
    return re.test(String(email).trim());
  };

  const validatePassword = (password) => {
    const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return re.test(password);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    const trimmedEmail = formData.email.trim();

    if (!formData.name.trim())             newErrors.name = "Full name is required";
    if (!validateEmail(trimmedEmail))    newErrors.email = "Please use a valid Gmail address";
    if (!validatePassword(formData.password)) newErrors.password = "Min 8 chars, 1 upper, 1 lower, 1 number, 1 special";
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "Passwords do not match";
    if (!formData.age || formData.age < 1) newErrors.age = "Enter a valid age";
    if (!formData.weight || formData.weight < 1) newErrors.weight = "Enter a valid weight";

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setLoading(true);
    const result = await register({
      name: formData.name,
      email: trimmedEmail,
      password: formData.password,
      age: formData.age,
      weight: formData.weight
    });
    setLoading(false);

    if (result.success) {
      setShowModal(true);
    } else {
      setErrors({ email: result.message || "Registration failed" });
    }
  };

  return (
    <>
    {showModal && <SuccessModal onClose={() => { setShowModal(false); navigate("/login"); }} />}
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
          <h2>Start Your Wellness Journey</h2>
          <p>Join our community and take control of your health with daily tracking, expert tips, and personalized plans.</p>
        </div>
        <div className="auth-features-list">
          <div className="auth-feature-item"><span className="af-icon">🎯</span><span>Set personalized health goals</span></div>
          <div className="auth-feature-item"><span className="af-icon">🥗</span><span>Track nutrition & calories</span></div>
          <div className="auth-feature-item"><span className="af-icon">🔥</span><span>Build healthy daily streaks</span></div>
          <div className="auth-feature-item"><span className="af-icon">📈</span><span>View your weekly progress</span></div>
          <div className="auth-feature-item"><span className="af-icon">🏋️</span><span>Book sessions with trainers</span></div>
        </div>
      </div>

      {/* Right form panel */}
      <div className="auth-right">
        <div className="auth-card" style={{ maxWidth: 440 }}>
          <div className="auth-card-title">Create Account ✨</div>
          <p className="auth-card-sub">Fill in your details to get started</p>

          {errors.general && <div className="auth-error-msg">⚠️ {errors.general}</div>}

          <form onSubmit={handleSubmit}>
            {/* Name */}
            <div className="auth-field">
              <label className="auth-field-label">Full Name</label>
              <div className="auth-input-wrap">
                <span className="auth-input-icon">👤</span>
                <input id="name" className={`auth-input${errors.name ? ' input-err' : ''}`} placeholder="John Doe" value={formData.name} onChange={handleChange} />
              </div>
              {errors.name && <span className="auth-field-err">⚠️ {errors.name}</span>}
            </div>

            {/* Age & Weight row */}
            <div className="auth-field-row">
              <div className="auth-field">
                <label className="auth-field-label">Age</label>
                <div className="auth-input-wrap">
                  <span className="auth-input-icon">🎂</span>
                  <input id="age" type="number" className={`auth-input${errors.age ? ' input-err' : ''}`} placeholder="21" value={formData.age} onChange={handleChange} min="1" />
                </div>
                {errors.age && <span className="auth-field-err">{errors.age}</span>}
              </div>
              <div className="auth-field">
                <label className="auth-field-label">Weight (kg)</label>
                <div className="auth-input-wrap">
                  <span className="auth-input-icon">⚖️</span>
                  <input id="weight" type="number" className={`auth-input${errors.weight ? ' input-err' : ''}`} placeholder="65" value={formData.weight} onChange={handleChange} min="1" />
                </div>
                {errors.weight && <span className="auth-field-err">{errors.weight}</span>}
              </div>
            </div>

            {/* Email */}
            <div className="auth-field">
              <label className="auth-field-label">Email Address</label>
              <div className="auth-input-wrap">
                <span className="auth-input-icon">📧</span>
                <input id="email" type="email" className={`auth-input${errors.email ? ' input-err' : ''}`} placeholder="yourname@gmail.com" value={formData.email} onChange={handleChange} />
              </div>
              {errors.email && <span className="auth-field-err">⚠️ {errors.email}</span>}
            </div>

            {/* Password */}
            <div className="auth-field">
              <label className="auth-field-label">Password</label>
              <div className="auth-input-wrap">
                <span className="auth-input-icon">🔒</span>
                <input id="password" type="password" className={`auth-input${errors.password ? ' input-err' : ''}`} placeholder="Min 8 chars, A-z, 0-9, @$!" value={formData.password} onChange={handleChange} />
              </div>
              {errors.password && <span className="auth-field-err">⚠️ {errors.password}</span>}
            </div>

            {/* Confirm Password */}
            <div className="auth-field">
              <label className="auth-field-label">Confirm Password</label>
              <div className="auth-input-wrap">
                <span className="auth-input-icon">🔒</span>
                <input id="confirmPassword" type="password" className={`auth-input${errors.confirmPassword ? ' input-err' : ''}`} placeholder="Repeat your password" value={formData.confirmPassword} onChange={handleChange} />
              </div>
              {errors.confirmPassword && <span className="auth-field-err">⚠️ {errors.confirmPassword}</span>}
            </div>

            <button type="submit" className="auth-submit-btn" disabled={loading}>
              {loading ? '⏳ Creating account...' : '🎉 Create My Account'}
            </button>
          </form>

          <div className="auth-divider">or</div>

          <p className="auth-switch-link">
            Already have an account? <Link to="/login">Sign in →</Link>
          </p>
        </div>
      </div>
    </div>
    </>
  );
}

export default Register;
