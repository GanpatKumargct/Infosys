import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

const EXERCISES = [
    { name: 'Box Breathing', duration: '4-4-4-4 sec', desc: 'Inhale 4s → Hold 4s → Exhale 4s → Hold 4s' },
    { name: 'Deep Belly Breathing', duration: '5-5 sec', desc: 'Inhale 5s → Exhale 5s, focus on belly expansion' },
    { name: '4-7-8 Technique', duration: '4-7-8 sec', desc: 'Inhale 4s → Hold 7s → Exhale 8s' },
    { name: 'Alternate Nostril', duration: '5-5 sec', desc: 'Alternate nostrils for each breath cycle' },
];

function BreathingPage() {
    const { logout } = useAuth();
    const navigate = useNavigate();
    const [exercise, setExercise] = useState(EXERCISES[0].name);
    const [rounds, setRounds] = useState(5);
    const [log, setLog] = useState([
        { exercise: 'Box Breathing', rounds: 5, time: '09:00 AM' },
    ]);

    const selected = EXERCISES.find(e => e.name === exercise);

    const handleLog = () => {
        const id = Date.now();
        const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        setLog([{ id, exercise, rounds: Number(rounds), time: now }, ...log]);
    };

    const handleRemoveLog = (idToRemove) => {
        setLog(log.filter(item => item.id !== idToRemove));
    };

    return (
        <div style={s.page}>
            <header style={s.header}>
                <button onClick={() => navigate('/dashboard')} style={s.back}>← Back</button>
                <h1 style={s.brand}>🌬️ Breathing Tracker</h1>

            </header>
            <div style={s.body}>
                <div style={s.left}>
                    <div style={s.card}>
                        <h3 style={s.cardTitle}>🧘 Techniques</h3>
                        {EXERCISES.map(ex => (
                            <div
                                key={ex.name}
                                onClick={() => setExercise(ex.name)}
                                style={{ ...s.techRow, border: exercise === ex.name ? '2px solid #7c3aed' : '2px solid #e9d5ff' }}
                            >
                                <p style={s.techName}>{ex.name}</p>
                                <p style={s.techDuration}>⏱ {ex.duration}</p>
                                <p style={s.techDesc}>{ex.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
                <div style={s.right}>
                    <div style={s.card}>
                        <h3 style={s.cardTitle}>+ Log Session</h3>
                        <div style={s.selectedBox}>
                            <p style={s.selName}>Selected: {selected?.name}</p>
                            <p style={s.selDesc}>{selected?.desc}</p>
                        </div>
                        <label style={s.label}>Number of Rounds</label>
                        <input type="number" value={rounds} onChange={e => setRounds(e.target.value)} style={s.input} min="1" max="30" />
                        <button onClick={handleLog} style={s.btn}>Log Session</button>
                    </div>
                    <div style={{ ...s.card, marginTop: '20px' }}>
                        <h3 style={s.cardTitle}>📋 Today's Sessions</h3>
                        {log.map((e, i) => (
                            <div key={e.id || i} style={s.row}>
                                <span style={s.rowIcon}>🌬️</span>
                                <div style={{ flex: 1 }}>
                                    <p style={s.rowTitle}>{e.exercise}</p>
                                    <p style={s.rowSub}>{e.rounds} rounds</p>
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
    page: { minHeight: '100vh', background: 'linear-gradient(135deg,#ede9fe,#f5f3ff)', fontFamily: "'Segoe UI',sans-serif" },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 32px', background: '#fff', boxShadow: '0 1px 8px rgba(0,0,0,0.08)' },
    brand: { color: '#7c3aed', fontSize: '20px', fontWeight: '700', margin: 0 },
    back: { background: 'none', border: '1px solid #c4b5fd', borderRadius: '8px', padding: '8px 16px', color: '#7c3aed', cursor: 'pointer', fontWeight: '600' },
    logoutBtn: { background: '#e53935', color: '#fff', border: 'none', borderRadius: '8px', padding: '8px 18px', fontWeight: '700', cursor: 'pointer' },
    body: { display: 'flex', gap: '24px', padding: '28px 32px', flexWrap: 'wrap' },
    left: { display: 'flex', flexDirection: 'column', gap: '20px', flex: 1, minWidth: '280px' },
    right: { flex: 1, minWidth: '280px' },
    card: { background: '#fff', borderRadius: '16px', padding: '24px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' },
    cardTitle: { color: '#7c3aed', fontWeight: '700', fontSize: '16px', margin: '0 0 12px' },
    techRow: { borderRadius: '10px', padding: '12px', marginBottom: '10px', cursor: 'pointer', transition: 'all 0.2s' },
    techName: { margin: 0, fontWeight: '700', color: '#4c1d95', fontSize: '14px' },
    techDuration: { margin: '2px 0', fontSize: '12px', color: '#7c3aed' },
    techDesc: { margin: 0, fontSize: '12px', color: '#6b7280' },
    selectedBox: { background: '#f5f3ff', borderRadius: '10px', padding: '12px', marginBottom: '12px' },
    selName: { margin: 0, fontWeight: '700', color: '#7c3aed', fontSize: '14px' },
    selDesc: { margin: '4px 0 0', fontSize: '12px', color: '#666' },
    label: { display: 'block', fontSize: '13px', color: '#555', marginBottom: '6px', marginTop: '12px' },
    input: { width: '100%', padding: '10px', borderRadius: '8px', border: '1.5px solid #c4b5fd', fontSize: '14px', boxSizing: 'border-box', outline: 'none' },
    btn: { marginTop: '16px', width: '100%', padding: '12px', background: 'linear-gradient(90deg,#7c3aed,#a78bfa)', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: '700', fontSize: '15px', cursor: 'pointer' },
    row: { display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 0', borderBottom: '1px solid #f0f0f0' },
    rowIcon: { fontSize: '22px' },
    rowTitle: { margin: 0, fontWeight: '600', fontSize: '14px', color: '#222' },
    rowSub: { margin: 0, fontSize: '12px', color: '#888' },
    rowTime: { marginLeft: 'auto', fontSize: '12px', color: '#aaa', whiteSpace: 'nowrap', marginRight: '8px' },
    deleteBtn: { background: 'none', border: 'none', cursor: 'pointer', fontSize: '14px', padding: '4px', opacity: 0.6, transition: 'opacity 0.2s' },
};

export default BreathingPage;
