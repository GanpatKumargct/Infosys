import React, { useState, useEffect } from 'react';
import { logActivity, createHabit, getMyHabits, logHabit, getHabitLogs, deleteHabit } from '../services/api';
import { Activity, Utensils, Moon, Droplets, Plus, Clock, Flame, CheckCircle2, Circle, Trash2 } from 'lucide-react';

const HealthLogger = ({ onActivityLogged }) => {
    const [activeTab, setActiveTab] = useState('WORKOUT');
    const [formData, setFormData] = useState({
        subType: '',
        value: '',
        secondaryValue: '',
        notes: ''
    });
    const [loading, setLoading] = useState(false);
    
    // Habit Tracker States
    const [habits, setHabits] = useState([]);
    const [habitLogs, setHabitLogs] = useState({});
    const [newHabit, setNewHabit] = useState({ name: '', target: '' });
    const [habitLoading, setHabitLoading] = useState(false);

    useEffect(() => {
        fetchHabitData();
    }, []);

    const fetchHabitData = async () => {
        setHabitLoading(true);
        try {
            const habitsRes = await getMyHabits();
            setHabits(habitsRes.data);
            
            const today = new Date().toISOString().split('T')[0];
            const logsRes = await getHabitLogs(today);
            const logsMap = {};
            logsRes.data.forEach(log => {
                logsMap[log.habitId] = log.completed;
            });
            setHabitLogs(logsMap);
        } catch (err) {
            console.error('Failed to fetch habit data', err);
        } finally {
            setHabitLoading(false);
        }
    };

    const handleTabChange = (tab) => {
        setActiveTab(tab);
        setFormData({ subType: '', value: '', secondaryValue: '', notes: '' });
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const data = {
                type: activeTab,
                subType: formData.subType,
                value: parseFloat(formData.value) || 0,
                secondaryValue: formData.secondaryValue ? parseFloat(formData.secondaryValue) : null,
                notes: formData.notes
            };

            await logActivity(data);
            setFormData({ subType: '', value: '', secondaryValue: '', notes: '' });
            if (onActivityLogged) onActivityLogged();
        } catch (err) {
            console.error('Logging failed', err);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateHabit = async (e) => {
        e.preventDefault();
        if (!newHabit.name) return;
        try {
            await createHabit(newHabit);
            setNewHabit({ name: '', target: '' });
            fetchHabitData();
        } catch (err) {
            console.error('Failed to create habit', err);
        }
    };

    const handleToggleHabit = async (habitId) => {
        const today = new Date().toISOString().split('T')[0];
        const currentStatus = !!habitLogs[habitId];
        try {
            await logHabit(habitId, { date: today, completed: !currentStatus });
            setHabitLogs({ ...habitLogs, [habitId]: !currentStatus });
        } catch (err) {
            console.error('Failed to log habit', err);
        }
    };

    const handleDeleteHabit = async (habitId) => {
        if (!window.confirm('Are you sure you want to delete this habit?')) return;
        try {
            await deleteHabit(habitId);
            fetchHabitData();
        } catch (err) {
            console.error('Failed to delete habit', err);
        }
    };

    const tabs = [
        { id: 'WORKOUT', label: 'Workout', icon: <Activity size={18} />, color: '#3b82f6' },
        { id: 'MEAL', label: 'Meal', icon: <Utensils size={18} />, color: '#ef4444' },
        { id: 'SLEEP', label: 'Sleep', icon: <Moon size={18} />, color: '#8b5cf6' },
        { id: 'WATER', label: 'Water', icon: <Droplets size={18} />, color: '#0ea5e9' }
    ];

    return (
        <div className="health-logger" style={{
            background: 'var(--card-bg)',
            padding: '1.5rem',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border)',
            boxShadow: 'var(--shadow-sm)'
        }}>
            <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Plus size={20} color="var(--primary)" />
                Quick Log
            </h3>

            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => handleTabChange(tab.id)}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            padding: '0.5rem 1rem',
                            borderRadius: 'var(--radius-sm)',
                            border: '1px solid',
                            borderColor: activeTab === tab.id ? tab.color : 'var(--border)',
                            background: activeTab === tab.id ? `${tab.color}10` : 'transparent',
                            color: activeTab === tab.id ? tab.color : 'var(--text-muted)',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            whiteSpace: 'nowrap',
                            fontWeight: activeTab === tab.id ? '600' : '400'
                        }}
                    >
                        {tab.icon}
                        {tab.label}
                    </button>
                ))}
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: activeTab === 'WORKOUT' || activeTab === 'MEAL' ? '1fr 1fr' : '1fr', gap: '1rem' }}>
                    {activeTab === 'WORKOUT' && (
                        <>
                            <div>
                                <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Workout Type</label>
                                <input
                                    type="text"
                                    name="subType"
                                    placeholder="e.g. Running"
                                    value={formData.subType}
                                    onChange={handleChange}
                                    required
                                    style={{ width: '100%', padding: '0.6rem', background: 'var(--bg-alt)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)' }}
                                />
                            </div>
                            <div>
                                <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Duration (min)</label>
                                <div style={{ position: 'relative' }}>
                                    <input
                                        type="number"
                                        name="value"
                                        placeholder="30"
                                        value={formData.value}
                                        onChange={handleChange}
                                        required
                                        style={{ width: '100%', padding: '0.6rem', background: 'var(--bg-alt)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)' }}
                                    />
                                    <Clock size={16} style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                                </div>
                            </div>
                            <div style={{ gridColumn: 'span 2' }}>
                                <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Calories Burned</label>
                                <div style={{ position: 'relative' }}>
                                    <input
                                        type="number"
                                        name="secondaryValue"
                                        placeholder="e.g. 200"
                                        value={formData.secondaryValue}
                                        onChange={handleChange}
                                        style={{ width: '100%', padding: '0.6rem', background: 'var(--bg-alt)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)' }}
                                    />
                                    <Flame size={16} style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', color: '#f97316' }} />
                                </div>
                            </div>
                        </>
                    )}

                    {activeTab === 'MEAL' && (
                        <>
                            <div>
                                <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Meal Type</label>
                                <select
                                    name="subType"
                                    value={formData.subType}
                                    onChange={handleChange}
                                    required
                                    style={{ width: '100%', padding: '0.6rem', background: 'var(--bg-alt)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)' }}
                                >
                                    <option value="">Select...</option>
                                    <option value="Breakfast">Breakfast</option>
                                    <option value="Lunch">Lunch</option>
                                    <option value="Dinner">Dinner</option>
                                    <option value="Snack">Snack</option>
                                </select>
                            </div>
                            <div>
                                <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Calories</label>
                                <input
                                    type="number"
                                    name="value"
                                    placeholder="500"
                                    value={formData.value}
                                    onChange={handleChange}
                                    required
                                    style={{ width: '100%', padding: '0.6rem', background: 'var(--bg-alt)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)' }}
                                />
                            </div>
                            <div style={{ gridColumn: 'span 2' }}>
                                <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Macros / Notes (Optional)</label>
                                <textarea
                                    name="notes"
                                    placeholder="e.g. Protein: 30g, Carbs: 50g"
                                    value={formData.notes}
                                    onChange={handleChange}
                                    style={{ width: '100%', padding: '0.6rem', background: 'var(--bg-alt)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', resize: 'none' }}
                                    rows="2"
                                />
                            </div>
                        </>
                    )}

                    {activeTab === 'SLEEP' && (
                        <div>
                            <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Sleep Duration (hours)</label>
                            <input
                                type="number"
                                name="value"
                                placeholder="8"
                                step="0.5"
                                value={formData.value}
                                onChange={handleChange}
                                required
                                style={{ width: '100%', padding: '0.6rem', background: 'var(--bg-alt)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)' }}
                            />
                        </div>
                    )}

                    {activeTab === 'WATER' && (
                        <div>
                            <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Water Intake (ml)</label>
                            <input
                                type="number"
                                name="value"
                                placeholder="250"
                                step="50"
                                value={formData.value}
                                onChange={handleChange}
                                required
                                style={{ width: '100%', padding: '0.6rem', background: 'var(--bg-alt)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)' }}
                            />
                        </div>
                    )}
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="btn btn-primary"
                    style={{
                        marginTop: '0.5rem',
                        padding: '0.75rem',
                        background: tabs.find(t => t.id === activeTab).color,
                        borderColor: tabs.find(t => t.id === activeTab).color
                    }}
                >
                    {loading ? 'Logging...' : `Log ${tabs.find(t => t.id === activeTab).label}`}
                </button>
            </form>

            <hr style={{ margin: '2rem 0', borderColor: 'var(--border)' }} />

            <div className="habit-tracker">
                <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <CheckCircle2 size={20} color="var(--primary)" />
                    Daily Habits
                </h3>

                {/* Add New Habit Form */}
                <form onSubmit={handleCreateHabit} style={{ marginBottom: '1.5rem', display: 'flex', gap: '0.5rem' }}>
                    <div style={{ flex: 2 }}>
                        <input
                            type="text"
                            placeholder="Habit name (e.g., Drink 2L Water)"
                            value={newHabit.name}
                            onChange={(e) => setNewHabit({ ...newHabit, name: e.target.value })}
                            required
                            style={{ width: '100%', padding: '0.5rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', background: 'var(--bg-alt)' }}
                        />
                    </div>
                    <div style={{ flex: 1 }}>
                        <input
                            type="text"
                            placeholder="Target (optional)"
                            value={newHabit.target}
                            onChange={(e) => setNewHabit({ ...newHabit, target: e.target.value })}
                            style={{ width: '100%', padding: '0.5rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', background: 'var(--bg-alt)' }}
                        />
                    </div>
                    <button type="submit" className="btn btn-primary" style={{ padding: '0.5rem 1rem' }}>
                        <Plus size={18} />
                    </button>
                </form>

                {/* Habits List */}
                {habitLoading ? (
                    <p style={{ textAlign: 'center', color: 'var(--text-muted)' }}>Loading habits...</p>
                ) : habits.length === 0 ? (
                    <p style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '1rem', border: '1px dashed var(--border)', borderRadius: 'var(--radius-sm)' }}>
                        No habits defined yet. Add one above!
                    </p>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        {habits.map((habit) => (
                            <div key={habit.id} style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '1rem',
                                padding: '0.75rem 1rem',
                                borderRadius: 'var(--radius-sm)',
                                background: habitLogs[habit.id] ? 'var(--bg-alt)' : 'var(--card-bg)',
                                border: '1px solid var(--border)',
                                transition: 'all 0.2s'
                            }}>
                                <button
                                    onClick={() => handleToggleHabit(habit.id)}
                                    style={{
                                        background: 'transparent',
                                        border: 'none',
                                        cursor: 'pointer',
                                        color: habitLogs[habit.id] ? '#10b981' : 'var(--text-muted)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        transition: 'transform 0.1s active'
                                    }}
                                >
                                    {habitLogs[habit.id] ? <CheckCircle2 size={24} /> : <Circle size={24} />}
                                </button>
                                <div style={{ flex: 1 }}>
                                    <div style={{ 
                                        fontWeight: '600', 
                                        textDecoration: habitLogs[habit.id] ? 'line-through' : 'none',
                                        color: habitLogs[habit.id] ? 'var(--text-muted)' : 'var(--text)'
                                    }}>
                                        {habit.name}
                                    </div>
                                    {habit.target && (
                                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                                            Goal: {habit.target}
                                        </div>
                                    )}
                                </div>
                                <button
                                    onClick={() => handleDeleteHabit(habit.id)}
                                    style={{
                                        background: 'transparent',
                                        border: 'none',
                                        cursor: 'pointer',
                                        color: 'var(--text-muted)',
                                        opacity: 0.5,
                                        transition: 'opacity 0.2s'
                                    }}
                                    onMouseOver={(e) => e.currentTarget.style.opacity = 1}
                                    onMouseOut={(e) => e.currentTarget.style.opacity = 0.5}
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default HealthLogger;
