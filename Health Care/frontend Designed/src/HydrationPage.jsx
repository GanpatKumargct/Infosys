import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

const DRINK_OPTIONS = ['Water', 'Juice', 'Coconut Water', 'Sports Drink', 'Lemonade', 'Milk', 'Cold Drink', 'Smoothie'];

function HydrationPage() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [amount, setAmount] = useState(250);
    const [drink, setDrink] = useState('Water');
    const [log, setLog] = useState([
        { drink: 'Water', amount: 300, time: '10:24 AM' },
        { drink: 'Juice', amount: 150, time: '08:10 AM' },
    ]);

    const totalIntake = log.reduce((sum, e) => sum + e.amount, 0);
    const goal = 2500;
    const pct = Math.min(100, Math.round((totalIntake / goal) * 100));

    const handleLog = () => {
        const id = Date.now(); // unique ID for deletion
        const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        setLog([{ id, drink, amount: Number(amount), time: now }, ...log]);
    };

    const handleRemoveLog = (idToRemove) => {
        setLog(log.filter(item => item.id !== idToRemove));
    };

    return (
        <div style={s.page}>
            <header style={s.header}>
                <button onClick={() => navigate('/dashboard')} style={s.back}>← Back</button>
                <h1 style={s.brand}>💧 Hydration Tracker</h1>

            </header>
            <div style={s.body}>
                {/* Left */}
                <div style={s.left}>
                    <div style={s.card}>
                        <h3 style={s.cardTitle}>Daily Goal</h3>
                        <p style={s.sub}>Target: {goal} ml  |  Logged: {totalIntake} ml</p>
                        <div style={s.bar}><div style={{ ...s.fill, width: pct + '%' }} /></div>
                        <p style={{ ...s.pct, color: pct === 100 ? '#2e7d5e' : '#1976d2' }}>{pct}% completed</p>
                    </div>

                    <div style={s.card}>
                        <h3 style={s.cardTitle}>+ Log Drink</h3>
                        <label style={s.label}>Drink Type</label>
                        <select value={drink} onChange={e => setDrink(e.target.value)} style={s.input}>
                            {DRINK_OPTIONS.map(d => <option key={d}>{d}</option>)}
                        </select>
                        <label style={s.label}>Amount (ml)</label>
                        <input type="number" value={amount} onChange={e => setAmount(e.target.value)} style={s.input} min="50" max="2000" step="50" />
                        <button onClick={handleLog} style={s.btn}>Log Drink</button>
                    </div>
                </div>
                {/* Right */}
                <div style={s.right}>
                    <div style={s.card}>
                        <h3 style={s.cardTitle}>📋 Today's Log</h3>
                        {log.length === 0 && <p style={s.sub}>No entries yet.</p>}
                        {log.map((e, i) => (
                            <div key={e.id || i} style={s.row}>
                                <span style={s.rowIcon}>💧</span>
                                <div style={{ flex: 1 }}>
                                    <p style={s.rowTitle}>{e.drink}</p>
                                    <p style={s.rowSub}>{e.amount} ml</p>
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
    page: { minHeight: '100vh', background: 'linear-gradient(160deg, #0a1628 0%, #0c2040 40%, #071a30 100%)', fontFamily: "'Segoe UI',sans-serif", position: 'relative' },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 32px', background: 'rgba(6,20,44,0.92)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(56,189,248,0.2)', boxShadow: '0 4px 24px rgba(0,0,0,0.5)' },
    brand: { color: '#38bdf8', fontSize: '20px', fontWeight: '700', margin: 0, textShadow: '0 0 20px rgba(56,189,248,0.5)' },
    back: { background: 'rgba(56,189,248,0.08)', border: '1px solid rgba(56,189,248,0.3)', borderRadius: '8px', padding: '8px 16px', color: '#7dd3fc', cursor: 'pointer', fontWeight: '600' },
    logoutBtn: { background: 'rgba(239,68,68,0.15)', color: '#f87171', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '8px', padding: '8px 18px', fontWeight: '700', cursor: 'pointer' },
    body: { display: 'flex', gap: '24px', padding: '28px 32px', flexWrap: 'wrap' },
    left: { display: 'flex', flexDirection: 'column', gap: '20px', flex: 1, minWidth: '280px' },
    right: { flex: 1, minWidth: '280px' },
    card: { background: 'rgba(8,24,52,0.80)', backdropFilter: 'blur(20px)', borderRadius: '16px', padding: '24px', border: '1px solid rgba(56,189,248,0.15)', boxShadow: '0 8px 32px rgba(0,0,0,0.5), inset 0 1px 0 rgba(56,189,248,0.08)' },
    cardTitle: { color: '#38bdf8', fontWeight: '700', fontSize: '16px', margin: '0 0 12px', textShadow: '0 0 12px rgba(56,189,248,0.4)' },
    sub: { color: 'rgba(186,230,255,0.65)', fontSize: '13px', margin: '0 0 10px' },
    bar: { background: 'rgba(56,189,248,0.12)', borderRadius: '8px', height: '12px', overflow: 'hidden', marginBottom: '8px', border: '1px solid rgba(56,189,248,0.15)' },
    fill: { background: 'linear-gradient(90deg,#0284c7,#38bdf8,#7dd3fc)', height: '100%', borderRadius: '8px', transition: 'width 0.4s', boxShadow: '0 0 12px rgba(56,189,248,0.5)' },
    pct: { fontWeight: '700', fontSize: '15px', margin: 0, color: '#7dd3fc' },
    label: { display: 'block', fontSize: '13px', color: 'rgba(186,230,255,0.7)', marginBottom: '6px', marginTop: '12px' },
    input: { width: '100%', padding: '10px', borderRadius: '8px', border: '1.5px solid rgba(56,189,248,0.25)', fontSize: '14px', boxSizing: 'border-box', outline: 'none', background: 'rgba(56,189,248,0.06)', color: '#e0f2fe' },
    btn: { marginTop: '16px', width: '100%', padding: '12px', background: 'linear-gradient(90deg,#0284c7,#38bdf8)', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: '700', fontSize: '15px', cursor: 'pointer', boxShadow: '0 0 20px rgba(56,189,248,0.3)' },
    row: { display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 0', borderBottom: '1px solid rgba(56,189,248,0.08)' },
    rowIcon: { fontSize: '22px' },
    rowTitle: { margin: 0, fontWeight: '600', fontSize: '14px', color: '#e0f2fe' },
    rowSub: { margin: 0, fontSize: '12px', color: 'rgba(186,230,255,0.6)' },
    rowTime: { marginLeft: 'auto', fontSize: '12px', color: 'rgba(186,230,255,0.4)', whiteSpace: 'nowrap', marginRight: '8px' },
    deleteBtn: { background: 'none', border: 'none', cursor: 'pointer', fontSize: '14px', padding: '4px', opacity: 0.6, transition: 'opacity 0.2s' },
};

export default HydrationPage;
