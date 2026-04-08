import React, { useState, useEffect } from 'react';
import { Activity } from 'lucide-react';

const BMICalculator = () => {
    const [weight, setWeight] = useState('');
    const [height, setHeight] = useState('');
    const [bmi, setBmi] = useState(null);
    const [status, setStatus] = useState('');
    const [color, setColor] = useState('');

    useEffect(() => {
        // Attempt to load from localStorage if previously saved in profile
        const savedWeight = localStorage.getItem('weight');
        const savedHeight = localStorage.getItem('height');
        if (savedWeight && savedHeight) {
            setWeight(savedWeight);
            setHeight(savedHeight);
        }
    }, []);

    const calculateBMI = (e) => {
        e.preventDefault();
        if (weight > 0 && height > 0) {
            const heightInMeters = height / 100;
            const calculatedBmi = (weight / (heightInMeters * heightInMeters)).toFixed(1);
            setBmi(calculatedBmi);

            if (calculatedBmi < 18.5) {
                setStatus('Underweight');
                setColor('#3b82f6'); // blue
            } else if (calculatedBmi >= 18.5 && calculatedBmi < 24.9) {
                setStatus('Normal weight');
                setColor('#10b981'); // green
            } else if (calculatedBmi >= 25 && calculatedBmi < 29.9) {
                setStatus('Overweight');
                setColor('#f59e0b'); // yellow
            } else {
                setStatus('Obese');
                setColor('#ef4444'); // red
            }
        }
    };

    return (
        <div className="card" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                <Activity size={20} color="var(--primary)" />
                BMI Calculator
            </h3>
            <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
                <form onSubmit={calculateBMI} style={{ flex: 1, minWidth: '200px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div>
                        <label style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Height (cm)</label>
                        <input 
                            type="number" 
                            value={height} 
                            onChange={(e) => setHeight(e.target.value)} 
                            placeholder="e.g. 175"
                            required
                            style={{ width: '100%', padding: '0.5rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', marginTop: '0.25rem' }}
                        />
                    </div>
                    <div>
                        <label style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Weight (kg)</label>
                        <input 
                            type="number" 
                            value={weight} 
                            onChange={(e) => setWeight(e.target.value)} 
                            placeholder="e.g. 70"
                            required
                            style={{ width: '100%', padding: '0.5rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', marginTop: '0.25rem' }}
                        />
                    </div>
                    <button type="submit" className="btn btn-primary" style={{ marginTop: '0.5rem' }}>Calculate</button>
                </form>

                {bmi !== null && (
                    <div style={{ flex: 1, minWidth: '200px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-alt)', borderRadius: 'var(--radius-md)', padding: '1.5rem', border: `2px solid ${color}` }}>
                        <div style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>Your BMI</div>
                        <div style={{ fontSize: '3rem', fontWeight: 'bold', color: color, margin: '0.5rem 0' }}>
                            {bmi}
                        </div>
                        <div style={{ fontSize: '1.1rem', fontWeight: '600', color: color, background: `${color}15`, padding: '0.25rem 1rem', borderRadius: '1rem' }}>
                            {status}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BMICalculator;
