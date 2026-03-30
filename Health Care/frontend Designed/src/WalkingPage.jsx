import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

const WALK_TYPES = ['Morning Walk', 'Evening Walk', 'Brisk Walk', 'Jogging', 'Hiking', 'Treadmill'];

function WalkingPage() {
    const { logout } = useAuth();
    const navigate = useNavigate();
    const [walkType, setWalkType] = useState('Morning Walk');
    const [steps, setSteps] = useState(2000);
    const [duration, setDuration] = useState(20);
    const [log, setLog] = useState([
        { type: 'Morning Walk', steps: 3000, duration: 30, kcal: 120, time: '07:00 AM' },
        { type: 'Evening Walk', steps: 1500, duration: 15, kcal: 60, time: '06:00 PM' },
    ]);

    const totalSteps = log.reduce((s, e) => s + e.steps, 0);
    const goalSteps = 10000;
    const pct = Math.min(100, Math.round((totalSteps / goalSteps) * 100));
    const kcalBurned = Math.round(steps * 0.04);

    const handleLog = () => {
        const id = Date.now();
        const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        setLog([{ id, type: walkType, steps: Number(steps), duration: Number(duration), kcal: Math.round(steps * 0.04), time: now }, ...log]);
    };

    const handleRemoveLog = (idToRemove) => {
        setLog(log.filter(item => item.id !== idToRemove));
    };

    return (
        <div style={s.page}>
            <header style={s.header}>
                <button onClick={() => navigate('/dashboard')} style={s.back}>← Back</button>
                <h1 style={s.brand}>🚶 Walking Tracker</h1>

            </header>
            <div style={s.body}>
                <div style={s.left}>
                    <div style={s.card}>
                        <h3 style={s.cardTitle}>Daily Step Goal</h3>
                        <p style={s.sub}>Goal: {goalSteps.toLocaleString()} steps  |  Done: {totalSteps.toLocaleString()} steps</p>
                        <div style={s.bar}><div style={{ ...s.fill, width: pct + '%' }} /></div>
                        <p style={{ ...s.pct, color: pct >= 100 ? '#2e7d5e' : '#e65100' }}>{pct}% of daily goal</p>
                    </div>

                    <div style={s.card}>
                        <h3 style={s.cardTitle}>+ Log Walk</h3>
                        <label style={s.label}>Walk Type</label>
                        <select value={walkType} onChange={e => setWalkType(e.target.value)} style={s.input}>
                            {WALK_TYPES.map(w => <option key={w}>{w}</option>)}
                        </select>
                        <label style={s.label}>Steps</label>
                        <input type="number" value={steps} onChange={e => setSteps(e.target.value)} style={s.input} min="100" max="50000" step="100" />
                        <label style={s.label}>Duration (minutes)</label>
                        <input type="number" value={duration} onChange={e => setDuration(e.target.value)} style={s.input} min="1" max="300" />
                        <div style={s.estimate}>Estimated Calories Burned: <strong>{kcalBurned} kcal</strong></div>
                        <button onClick={handleLog} style={s.btn}>Log Walk</button>
                    </div>
                </div>
                <div style={s.right}>
                    <div style={s.card}>
                        <h3 style={s.cardTitle}>📋 Today's Walks</h3>
                        {log.map((e, i) => (
                            <div key={e.id || i} style={s.row}>
                                <span style={s.rowIcon}>🚶</span>
                                <div style={{ flex: 1 }}>
                                    <p style={s.rowTitle}>{e.type}</p>
                                    <p style={s.rowSub}>{e.steps.toLocaleString()} steps  •  {e.duration} min  •  {e.kcal} kcal</p>
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
    page: { minHeight: '100vh', background: 'linear-gradient(160deg, #0f1a0a 0%, #1a2f10 40%, #0d1a08 100%)', fontFamily: "'Segoe UI',sans-serif" },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 32px', background: 'rgba(8,18,5,0.92)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(74,222,128,0.2)', boxShadow: '0 4px 24px rgba(0,0,0,0.5)' },
    brand: { color: '#4ade80', fontSize: '20px', fontWeight: '700', margin: 0, textShadow: '0 0 20px rgba(74,222,128,0.5)' },
    back: { background: 'rgba(74,222,128,0.08)', border: '1px solid rgba(74,222,128,0.3)', borderRadius: '8px', padding: '8px 16px', color: '#86efac', cursor: 'pointer', fontWeight: '600' },
    body: { display: 'flex', gap: '24px', padding: '28px 32px', flexWrap: 'wrap' },
    left: { display: 'flex', flexDirection: 'column', gap: '20px', flex: 1, minWidth: '280px' },
    right: { flex: 1, minWidth: '280px' },
    card: { background: 'rgba(8,20,5,0.80)', backdropFilter: 'blur(20px)', borderRadius: '16px', padding: '24px', border: '1px solid rgba(74,222,128,0.15)', boxShadow: '0 8px 32px rgba(0,0,0,0.5), inset 0 1px 0 rgba(74,222,128,0.08)' },
    cardTitle: { color: '#4ade80', fontWeight: '700', fontSize: '16px', margin: '0 0 12px', textShadow: '0 0 12px rgba(74,222,128,0.4)' },
    sub: { color: 'rgba(187,247,208,0.65)', fontSize: '13px', margin: '0 0 10px' },
    bar: { background: 'rgba(74,222,128,0.10)', borderRadius: '8px', height: '12px', overflow: 'hidden', marginBottom: '8px', border: '1px solid rgba(74,222,128,0.15)' },
    fill: { background: 'linear-gradient(90deg,#16a34a,#4ade80,#86efac)', height: '100%', borderRadius: '8px', transition: 'width 0.4s', boxShadow: '0 0 12px rgba(74,222,128,0.5)' },
    pct: { fontWeight: '700', fontSize: '15px', margin: 0, color: '#86efac' },
    label: { display: 'block', fontSize: '13px', color: 'rgba(187,247,208,0.7)', marginBottom: '6px', marginTop: '12px' },
    input: { width: '100%', padding: '10px', borderRadius: '8px', border: '1.5px solid rgba(74,222,128,0.25)', fontSize: '14px', boxSizing: 'border-box', outline: 'none', background: 'rgba(74,222,128,0.06)', color: '#dcfce7' },
    btn: { marginTop: '16px', width: '100%', padding: '12px', background: 'linear-gradient(90deg,#15803d,#4ade80)', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: '700', fontSize: '15px', cursor: 'pointer', boxShadow: '0 0 20px rgba(74,222,128,0.3)' },
    estimate: { background: 'rgba(74,222,128,0.08)', border: '1px solid rgba(74,222,128,0.2)', borderRadius: '8px', padding: '10px 14px', fontSize: '13px', color: '#86efac', marginTop: '12px' },
    row: { display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 0', borderBottom: '1px solid rgba(74,222,128,0.08)' },
    rowIcon: { fontSize: '22px' },
    rowTitle: { margin: 0, fontWeight: '600', fontSize: '14px', color: '#dcfce7' },
    rowSub: { margin: 0, fontSize: '12px', color: 'rgba(187,247,208,0.55)' },
    rowTime: { marginLeft: 'auto', fontSize: '12px', color: 'rgba(187,247,208,0.35)', whiteSpace: 'nowrap', marginRight: '8px' },
    deleteBtn: { background: 'none', border: 'none', cursor: 'pointer', fontSize: '14px', padding: '4px', opacity: 0.6, transition: 'opacity 0.2s' },
};


export default WalkingPage;
