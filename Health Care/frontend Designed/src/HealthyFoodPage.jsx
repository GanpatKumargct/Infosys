import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

const MEAL_TYPES = ['Breakfast', 'Lunch', 'Dinner', 'Snack', 'Pre-workout', 'Post-workout'];
const FOOD_ITEMS = ['Rice', 'Dal', 'Salad', 'Fruits', 'Sandwich', 'Oats', 'Eggs', 'Paneer', 'Chicken', 'Smoothie'];

function HealthyFoodPage() {
    const { logout } = useAuth();
    const navigate = useNavigate();
    const [meal, setMeal] = useState('Breakfast');
    const [food, setFood] = useState('Oats');
    const [kcal, setKcal] = useState(200);
    const [log, setLog] = useState([
        { meal: 'Breakfast', food: 'Oats', kcal: 250, time: '08:00 AM' },
        { meal: 'Snack', food: 'Fruits', kcal: 90, time: '11:00 AM' },
    ]);

    const totalKcal = log.reduce((s, e) => s + e.kcal, 0);
    const goal = 2000;
    const pct = Math.min(100, Math.round((totalKcal / goal) * 100));

    const handleLog = () => {
        const id = Date.now();
        const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        setLog([{ id, meal, food, kcal: Number(kcal), time: now }, ...log]);
    };

    const handleRemoveLog = (idToRemove) => {
        setLog(log.filter(item => item.id !== idToRemove));
    };

    return (
        <div style={s.page}>
            <header style={s.header}>
                <button onClick={() => navigate('/dashboard')} style={s.back}>← Back</button>
                <h1 style={s.brand}>🥗 Healthy Food Tracker</h1>

            </header>
            <div style={s.body}>
                <div style={s.left}>
                    <div style={s.card}>
                        <h3 style={s.cardTitle}>Daily Calorie Goal</h3>
                        <p style={s.sub}>Target: {goal} kcal  |  Consumed: {totalKcal} kcal</p>
                        <div style={s.bar}><div style={{ ...s.fill, width: pct + '%' }} /></div>
                        <p style={{ ...s.pct, color: pct >= 100 ? '#c62828' : '#2e7d5e' }}>{pct}% of goal</p>
                    </div>
                    <div style={s.card}>
                        <h3 style={s.cardTitle}>+ Log Meal</h3>
                        <label style={s.label}>Meal Type</label>
                        <select value={meal} onChange={e => setMeal(e.target.value)} style={s.input}>
                            {MEAL_TYPES.map(m => <option key={m}>{m}</option>)}
                        </select>
                        <label style={s.label}>Food Item</label>
                        <select value={food} onChange={e => setFood(e.target.value)} style={s.input}>
                            {FOOD_ITEMS.map(f => <option key={f}>{f}</option>)}
                        </select>
                        <label style={s.label}>Calories (kcal)</label>
                        <input type="number" value={kcal} onChange={e => setKcal(e.target.value)} style={s.input} min="10" max="2000" step="10" />
                        <button onClick={handleLog} style={s.btn}>Log Meal</button>
                    </div>
                </div>
                <div style={s.right}>
                    <div style={s.card}>
                        <h3 style={s.cardTitle}>📋 Today's Meals</h3>
                        {log.map((e, i) => (
                            <div key={e.id || i} style={s.row}>
                                <span style={s.rowIcon}>🍽️</span>
                                <div style={{ flex: 1 }}>
                                    <p style={s.rowTitle}>{e.meal} — {e.food}</p>
                                    <p style={s.rowSub}>{e.kcal} kcal</p>
                                </div>
                                <span style={s.rowTime}>{e.time}</span>
                                <button onClick={() => handleRemoveLog(e.id)} style={s.deleteBtn} title="Remove log">❌</button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

const s = {
    page: { minHeight: '100vh', background: 'linear-gradient(135deg,#f1f8e9,#e8f5e9)', fontFamily: "'Segoe UI',sans-serif" },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 32px', background: '#fff', boxShadow: '0 1px 8px rgba(0,0,0,0.08)' },
    brand: { color: '#2e7d32', fontSize: '20px', fontWeight: '700', margin: 0 },
    back: { background: 'none', border: '1px solid #a5d6a7', borderRadius: '8px', padding: '8px 16px', color: '#2e7d32', cursor: 'pointer', fontWeight: '600' },
    logoutBtn: { background: '#e53935', color: '#fff', border: 'none', borderRadius: '8px', padding: '8px 18px', fontWeight: '700', cursor: 'pointer' },
    body: { display: 'flex', gap: '24px', padding: '28px 32px', flexWrap: 'wrap' },
    left: { display: 'flex', flexDirection: 'column', gap: '20px', flex: 1, minWidth: '280px' },
    right: { flex: 1, minWidth: '280px' },
    card: { background: '#fff', borderRadius: '16px', padding: '24px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' },
    cardTitle: { color: '#2e7d32', fontWeight: '700', fontSize: '16px', margin: '0 0 12px' },
    sub: { color: '#666', fontSize: '13px', margin: '0 0 10px' },
    bar: { background: '#e8f5e9', borderRadius: '8px', height: '12px', overflow: 'hidden', marginBottom: '8px' },
    fill: { background: 'linear-gradient(90deg,#388e3c,#81c784)', height: '100%', borderRadius: '8px', transition: 'width 0.4s' },
    pct: { fontWeight: '700', fontSize: '15px', margin: 0 },
    label: { display: 'block', fontSize: '13px', color: '#555', marginBottom: '6px', marginTop: '12px' },
    input: { width: '100%', padding: '10px', borderRadius: '8px', border: '1.5px solid #a5d6a7', fontSize: '14px', boxSizing: 'border-box', outline: 'none' },
    btn: { marginTop: '16px', width: '100%', padding: '12px', background: 'linear-gradient(90deg,#2e7d32,#66bb6a)', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: '700', fontSize: '15px', cursor: 'pointer' },
    row: { display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 0', borderBottom: '1px solid #f0f0f0' },
    rowIcon: { fontSize: '22px' },
    rowTitle: { margin: 0, fontWeight: '600', fontSize: '14px', color: '#222' },
    rowSub: { margin: 0, fontSize: '12px', color: '#888' },
    rowTime: { marginLeft: 'auto', fontSize: '12px', color: '#aaa', whiteSpace: 'nowrap', marginRight: '8px' },
    deleteBtn: { background: 'none', border: 'none', cursor: 'pointer', fontSize: '14px', padding: '4px', opacity: 0.6, transition: 'opacity 0.2s' },
};

export default HealthyFoodPage;
