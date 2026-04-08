import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserProfile, updateProfile } from '../services/api';

const ProfileSetup = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        fullName: '',
        age: '',
        height: '',
        weight: '',
        bloodGlucose: '',
        bloodPressure: '',
        heartRate: '',
        fitnessGoal: '',
        activityLevel: ''
    });
    const [completion, setCompletion] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await getUserProfile();
                const data = response.data;
                setFormData({
                    fullName: data.fullName || '',
                    age: data.age || '',
                    height: data.height || '',
                    weight: data.weight || '',
                    bloodGlucose: data.bloodGlucose || '',
                    bloodPressure: data.bloodPressure || '',
                    heartRate: data.heartRate || '',
                    fitnessGoal: data.fitnessGoal || '',
                    activityLevel: data.activityLevel || ''
                });
                setCompletion(data.profileCompletionPercentage || 0);
            } catch (err) {
                console.error('Failed to fetch profile', err);
                setError('Failed to load profile data.');
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await updateProfile(formData);
            setCompletion(response.data.profileCompletionPercentage);
            localStorage.setItem('profileCompletion', response.data.profileCompletionPercentage);
            localStorage.setItem('bloodGlucose', formData.bloodGlucose);
            localStorage.setItem('bloodPressure', formData.bloodPressure);
            localStorage.setItem('heartRate', formData.heartRate);
            localStorage.setItem('height', formData.height);
            localStorage.setItem('weight', formData.weight);
            setSuccess('Profile updated successfully!');
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            console.error('Update failed', err);
            setError('Failed to update profile.');
        }
    };

    if (loading) return <div className="container" style={{ marginTop: '4rem', textAlign: 'center' }}>Loading...</div>;

    return (
        <div className="container" style={{ maxWidth: '600px', marginTop: '4rem' }}>
            <div className="card">
                <header style={{ marginBottom: '2rem' }}>
                    <h2 style={{ color: 'var(--primary)', marginBottom: '0.5rem' }}>Personalize Your Profile</h2>
                    <p style={{ color: 'var(--text-muted)' }}>Help us tailor WellNest to your health goals.</p>
                </header>

                <div style={{ marginBottom: '2rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                        <span>Profile Completion</span>
                        <span>{completion}%</span>
                    </div>
                    <div style={{ height: '8px', background: 'var(--bg-alt)', borderRadius: '4px', overflow: 'hidden' }}>
                        <div style={{
                            height: '100%',
                            width: `${completion}%`,
                            background: 'var(--primary)',
                            transition: 'width 0.5s ease-out'
                        }}></div>
                    </div>
                </div>

                {error && <div style={{ color: 'var(--accent)', marginBottom: '1rem', textAlign: 'center' }}>{error}</div>}
                {success && <div style={{ color: '#10b981', marginBottom: '1rem', textAlign: 'center' }}>{success}</div>}

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div>
                        <label>Full Name</label>
                        <input
                            type="text"
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleChange}
                            required
                            style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}
                        />
                    </div>

                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <div style={{ flex: 1 }}>
                            <label>Age</label>
                            <input
                                type="number"
                                name="age"
                                value={formData.age}
                                onChange={handleChange}
                                style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}
                            />
                        </div>
                        <div style={{ flex: 1 }}>
                            <label>Height (cm)</label>
                            <input
                                type="number"
                                name="height"
                                value={formData.height}
                                onChange={handleChange}
                                style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}
                            />
                        </div>
                        <div style={{ flex: 1 }}>
                            <label>Weight (kg)</label>
                            <input
                                type="number"
                                name="weight"
                                value={formData.weight}
                                onChange={handleChange}
                                style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}
                            />
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <div style={{ flex: 1 }}>
                            <label>Blood Glucose (mg/dL)</label>
                            <input
                                type="number"
                                name="bloodGlucose"
                                value={formData.bloodGlucose}
                                onChange={handleChange}
                                style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}
                            />
                        </div>
                        <div style={{ flex: 1 }}>
                            <label>Blood Pressure (mmHg)</label>
                            <input
                                type="text"
                                name="bloodPressure"
                                placeholder="e.g. 120/80"
                                value={formData.bloodPressure}
                                onChange={handleChange}
                                style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}
                            />
                        </div>
                        <div style={{ flex: 1 }}>
                            <label>Heart Rate (bpm)</label>
                            <input
                                type="number"
                                name="heartRate"
                                value={formData.heartRate}
                                onChange={handleChange}
                                style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}
                            />
                        </div>
                    </div>

                    <div>
                        <label>Fitness Goal</label>
                        <select
                            name="fitnessGoal"
                            value={formData.fitnessGoal}
                            onChange={handleChange}
                            style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', background: 'var(--card-bg)' }}
                        >
                            <option value="">Select a goal</option>
                            <option value="Weight Loss">Weight Loss</option>
                            <option value="Muscle Gain">Muscle Gain</option>
                            <option value="Maintenance">Maintenance</option>
                            <option value="Improved Athletics">Improved Athletics</option>
                        </select>
                    </div>

                    <div>
                        <label>Activity Level</label>
                        <select
                            name="activityLevel"
                            value={formData.activityLevel}
                            onChange={handleChange}
                            style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', background: 'var(--card-bg)' }}
                        >
                            <option value="">Select activity level</option>
                            <option value="Sedentary">Sedentary (Little to no exercise)</option>
                            <option value="Lightly Active">Lightly Active (1-3 days/week)</option>
                            <option value="Moderately Active">Moderately Active (3-5 days/week)</option>
                            <option value="Very Active">Very Active (6-7 days/week)</option>
                            <option value="Extra Active">Extra Active (Very hard exercise/job)</option>
                        </select>
                    </div>

                    <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                        <button type="button" onClick={() => navigate('/dashboard')} className="btn btn-outline" style={{ flex: 1 }}>Back to Dashboard</button>
                        <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Save Changes</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProfileSetup;
