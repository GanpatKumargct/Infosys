import React, { useState, useEffect } from 'react';
import { getWeeklySummary } from '../services/api';
import { TrendingUp, Droplets, Activity, Moon, Calendar, Loader, AlertCircle } from 'lucide-react';

const WeeklyReport = () => {
    const [summary, setSummary] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchSummary();
    }, []);

    const fetchSummary = async () => {
        setLoading(true);
        try {
            const res = await getWeeklySummary();
            setSummary(res.data);
        } catch (err) {
            console.error('Failed to fetch weekly summary', err);
            setError('Could not load weekly report.');
        } finally {
            setLoading(false);
        }
    };

    if (loading) return (
        <div style={{ padding: '2rem', textAlign: 'center' }}>
            <Loader size={24} className="animate-spin" color="var(--primary)" />
            <p style={{ marginTop: '0.5rem', color: 'var(--text-muted)' }}>Generating your weekly report...</p>
        </div>
    );

    if (error) return (
        <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--accent)' }}>
            <AlertCircle size={24} />
            <p style={{ marginTop: '0.5rem' }}>{error}</p>
        </div>
    );

    if (!summary) return null;

    const metrics = [
        { label: 'Water Intake', value: `${summary.totalWaterMl} ml`, icon: <Droplets size={20} color="#0ea5e9" />, bg: '#0ea5e910' },
        { label: 'Workout Time', value: `${summary.totalWorkoutMin} min`, icon: <Activity size={20} color="#3b82f6" />, bg: '#3b82f610' },
        { label: 'Calories Burned', value: `${summary.totalCaloriesBurned} kcal`, icon: <TrendingUp size={20} color="#f97316" />, bg: '#f9731610' },
        { label: 'Avg Sleep', value: `${summary.averageSleepHours.toFixed(1)} hrs`, icon: <Moon size={20} color="#8b5cf6" />, bg: '#8b5cf610' },
    ];

    return (
        <div className="card" style={{ marginBottom: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
                    <Calendar size={22} color="var(--primary)" />
                    Weekly Health Summary
                </h3>
            </div>

            <div className="grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                {metrics.map((m, i) => (
                    <div key={i} style={{ 
                        padding: '1.25rem', 
                        borderRadius: 'var(--radius-md)', 
                        background: m.bg, 
                        border: '1px solid var(--border)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.5rem'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                            {m.icon}
                            {m.label}
                        </div>
                        <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--text)' }}>
                            {m.value}
                        </div>
                    </div>
                ))}
            </div>
            
            <p style={{ marginTop: '1.5rem', fontSize: '0.85rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                * Summary reflects data from the last 7 days.
            </p>
        </div>
    );
};

export default WeeklyReport;
