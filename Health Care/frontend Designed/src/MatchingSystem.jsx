import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import './index.css';

const MatchingSystem = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [step, setStep] = useState(0);
    const [selections, setSelections] = useState({
        goals: [],
        availability: 'morning'
    });
    const [matches, setMatches] = useState([]);
    const [loading, setLoading] = useState(false);

    const goalOptions = [
        { id: 'weight-loss', label: 'Weight Loss', icon: '⚖️' },
        { id: 'muscle-gain', label: 'Muscle Gain', icon: '💪' },
        { id: 'flexibility', label: 'Flexibility', icon: '🤸' },
        { id: 'wellness', label: 'General Wellness', icon: '🌿' },
        { id: 'rehab', label: 'Injury Recovery', icon: '🩹' },
    ];

    const availabilityOptions = [
        { id: 'morning', label: 'Morning (6 AM - 12 PM)' },
        { id: 'afternoon', label: 'Afternoon (12 PM - 5 PM)' },
        { id: 'evening', label: 'Evening (5 PM - 10 PM)' },
    ];

    const toggleGoal = (id) => {
        setSelections(prev => {
            const exists = prev.goals.includes(id);
            if (exists) return { ...prev, goals: prev.goals.filter(g => g !== id) };
            return { ...prev, goals: [...prev.goals, id] };
        });
    };

    const handleMatch = async () => {
        setLoading(true);
        setStep(2);
        try {
            const res = await fetch('http://localhost:5000/api/match-trainers', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(selections)
            });
            const data = await res.json();
            setMatches(data);
        } catch (err) {
            console.error('Matching failed:', err);
        }
        setLoading(false);
    };

    return (
        <div className="ms-container">
            <header className="ms-header">
                <h1 className="ms-title">Smart Trainer Matcher 🎯</h1>
                <p className="ms-subtitle">Find the perfect coach based on your unique goals.</p>
            </header>

            <div className="ms-card">
                {step === 0 && (
                    <div className="ms-step">
                        <h3>1. What are your fitness goals?</h3>
                        <p>Select all that apply to you.</p>
                        <div className="ms-goals-grid">
                            {goalOptions.map(g => (
                                <div 
                                    key={g.id} 
                                    className={`ms-goal-item ${selections.goals.includes(g.id) ? 'selected' : ''}`}
                                    onClick={() => toggleGoal(g.id)}
                                >
                                    <span className="ms-goal-icon">{g.icon}</span>
                                    <span className="ms-goal-label">{g.label}</span>
                                </div>
                            ))}
                        </div>
                        <button 
                            className="ms-next-btn" 
                            disabled={selections.goals.length === 0}
                            onClick={() => setStep(1)}
                        >
                            Next Step
                        </button>
                    </div>
                )}

                {step === 1 && (
                    <div className="ms-step">
                        <h3>2. When do you prefer to train?</h3>
                        <p>Select your preferred time slot.</p>
                        <div className="ms-options-list">
                            {availabilityOptions.map(a => (
                                <div 
                                    key={a.id} 
                                    className={`ms-option-item ${selections.availability === a.id ? 'selected' : ''}`}
                                    onClick={() => setSelections({...selections, availability: a.id})}
                                >
                                    {a.label}
                                </div>
                            ))}
                        </div>
                        <div className="ms-btn-row">
                            <button className="ms-back-btn" onClick={() => setStep(0)}>Back</button>
                            <button className="ms-match-btn" onClick={handleMatch}>Find My Matches</button>
                        </div>
                    </div>
                )}

                {step === 2 && (
                    <div className="ms-results">
                        <h3>Your Top Trainer Matches</h3>
                        {loading ? (
                            <div className="ms-loading">Analyzing trainer profiles...</div>
                        ) : matches.length > 0 ? (
                            <div className="ms-results-list">
                                {matches.map((t, i) => (
                                    <div key={t.email} className="ms-trainer-match" style={{animationDelay: `${i*0.1}s`}}>
                                        <div className="ms-match-badge">{(i === 0 ? 'Best Match' : `${t.matchScore}% Match`)}</div>
                                        <div className="ms-trainer-core">
                                            <div className="ms-match-avatar">{t.name[0]}</div>
                                            <div className="ms-trainer-info">
                                                <h4>{t.name}</h4>
                                                <p className="ms-trainer-specialty">{t.specialty.toUpperCase()}</p>
                                            </div>
                                            <button className="ms-book-btn" onClick={() => navigate('/trainers')}>
                                                View Profile
                                            </button>
                                        </div>
                                        <div className="ms-match-reasons">
                                            {t.matchReasons.map((reason, idx) => (
                                                <span key={idx} className="ms-reason-tag">✓ {reason}</span>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="ms-no-matches">
                                <p>We couldn't find a perfect match. Try broadening your goals!</p>
                                <button className="ms-reset-btn" onClick={() => setStep(0)}>Try Again</button>
                            </div>
                        )}
                        {!loading && matches.length > 0 && (
                            <button className="ms-reset-btn" onClick={() => setStep(0)}>Start Over</button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MatchingSystem;
