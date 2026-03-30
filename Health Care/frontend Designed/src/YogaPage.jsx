import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

const POSES = [
    { name: 'Mountain Pose', level: 'Beginner', desc: 'Stand tall, grounding all four corners of your feet.' },
    { name: 'Downward Dog', level: 'Beginner', desc: 'Form an inverted V-shape, stretching the spine.' },
    { name: 'Warrior I', level: 'Intermediate', desc: 'Lunging pose that strengthens legs and opens hips.' },
    { name: 'Tree Pose', level: 'Intermediate', desc: 'Balance on one foot, improving focus and stability.' },
    { name: 'Child\'s Pose', level: 'Beginner', desc: 'Restful pose that gently stretches hips and back.' },
];

function YogaPage() {
    const { logout } = useAuth();
    const navigate = useNavigate();
    const [pose, setPose] = useState(POSES[0].name);
    const [duration, setDuration] = useState(10);
    const [log, setLog] = useState([
        { pose: 'Mountain Pose', duration: 10, time: '07:30 AM' },
    ]);

    const selected = POSES.find(p => p.name === pose);
    const totalMins = log.reduce((s, e) => s + e.duration, 0);

    const handleLog = () => {
        const id = Date.now();
        const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        setLog([{ id, pose, duration: Number(duration), time: now }, ...log]);
    };

    const handleRemoveLog = (idToRemove) => {
        setLog(log.filter(item => item.id !== idToRemove));
    };

    return (
        <div style={s.page}>
            <header style={s.header}>
                <button onClick={() => navigate('/dashboard')} style={s.back}>← Back</button>
                <h1 style={s.brand}>🧘 Yoga Tracker</h1>

            </header>
            <div style={s.body}>
                <div style={s.left}>
                    <div style={s.card}>
                        <h3 style={s.cardTitle}>Today's Summary</h3>
                        <p style={s.summary}>🧘 Total Practice Time: <strong>{totalMins} min</strong></p>
                        <p style={s.summary}>📌 Sessions Logged: <strong>{log.length}</strong></p>
                    </div>
                    <div style={s.card}>
                        <h3 style={s.cardTitle}>🌿 Yoga Poses</h3>
                        {POSES.map(p => (
                            <div
                                key={p.name}
                                onClick={() => setPose(p.name)}
                                style={{ ...s.poseRow, border: pose === p.name ? '2px solid #e91e63' : '2px solid #fce4ec' }}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <p style={s.poseName}>{p.name}</p>
                                    <span style={{ ...s.level, background: p.level === 'Beginner' ? '#e8f5e9' : '#fff3e0', color: p.level === 'Beginner' ? '#2e7d32' : '#e65100' }}>{p.level}</span>
                                </div>
                                <p style={s.poseDesc}>{p.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
                <div style={s.right}>
                    <div style={s.card}>
                        <h3 style={s.cardTitle}>+ Log Session</h3>
                        <div style={s.selectedBox}>
                            <p style={s.selName}>{selected?.name}</p>
                            <p style={s.selDesc}>{selected?.desc}</p>
                        </div>
                        <label style={s.label}>Duration (minutes)</label>
                        <input type="number" value={duration} onChange={e => setDuration(e.target.value)} style={s.input} min="1" max="120" />
                        <button onClick={handleLog} style={s.btn}>Log Session</button>
                    </div>
                    <div style={{ ...s.card, marginTop: '20px' }}>
                        <h3 style={s.cardTitle}>📋 Today's Sessions</h3>
                        {log.map((e, i) => (
                            <div key={e.id || i} style={s.row}>
                                <span style={s.rowIcon}>🧘</span>
                                <div style={{ flex: 1 }}>
                                    <p style={s.rowTitle}>{e.pose}</p>
                                    <p style={s.rowSub}>{e.duration} min</p>
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
    page: { minHeight: '100vh', background: 'linear-gradient(160deg, #1a0a2e 0%, #2d1b4e 40%, #1a0f35 100%)', fontFamily: "'Segoe UI',sans-serif" },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 32px', background: 'rgba(18,6,40,0.92)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(168,85,247,0.2)', boxShadow: '0 4px 24px rgba(0,0,0,0.5)' },
    brand: { color: '#c084fc', fontSize: '20px', fontWeight: '700', margin: 0, textShadow: '0 0 20px rgba(168,85,247,0.5)' },
    back: { background: 'rgba(168,85,247,0.08)', border: '1px solid rgba(168,85,247,0.3)', borderRadius: '8px', padding: '8px 16px', color: '#c084fc', cursor: 'pointer', fontWeight: '600' },
    body: { display: 'flex', gap: '24px', padding: '28px 32px', flexWrap: 'wrap' },
    left: { display: 'flex', flexDirection: 'column', gap: '20px', flex: 1, minWidth: '280px' },
    right: { flex: 1, minWidth: '280px', display: 'flex', flexDirection: 'column', gap: '20px' },
    card: { background: 'rgba(20,8,45,0.80)', backdropFilter: 'blur(20px)', borderRadius: '16px', padding: '24px', border: '1px solid rgba(168,85,247,0.15)', boxShadow: '0 8px 32px rgba(0,0,0,0.5), inset 0 1px 0 rgba(168,85,247,0.08)' },
    cardTitle: { color: '#c084fc', fontWeight: '700', fontSize: '16px', margin: '0 0 12px', textShadow: '0 0 12px rgba(168,85,247,0.4)' },
    summary: { color: 'rgba(233,213,255,0.8)', fontSize: '14px', margin: '0 0 6px' },
    poseRow: { borderRadius: '10px', padding: '12px 14px', marginBottom: '8px', cursor: 'pointer', transition: 'all 0.2s', background: 'rgba(168,85,247,0.04)', border: '2px solid rgba(168,85,247,0.15)' },
    poseName: { margin: 0, fontWeight: '600', fontSize: '14px', color: '#e9d5ff' },
    poseDesc: { margin: '4px 0 0', fontSize: '12px', color: 'rgba(233,213,255,0.55)' },
    level: { fontSize: '11px', fontWeight: '700', padding: '2px 9px', borderRadius: '50px' },
    label: { display: 'block', fontSize: '13px', color: 'rgba(233,213,255,0.7)', marginBottom: '6px', marginTop: '12px' },
    input: { width: '100%', padding: '10px', borderRadius: '8px', border: '1.5px solid rgba(168,85,247,0.25)', fontSize: '14px', boxSizing: 'border-box', outline: 'none', background: 'rgba(168,85,247,0.06)', color: '#e9d5ff' },
    btn: { marginTop: '16px', width: '100%', padding: '12px', background: 'linear-gradient(90deg,#7c3aed,#a855f7)', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: '700', fontSize: '15px', cursor: 'pointer', boxShadow: '0 0 20px rgba(168,85,247,0.3)' },
    selectedCard: { background: 'rgba(168,85,247,0.10)', backdropFilter: 'blur(20px)', borderRadius: '12px', padding: '14px 16px', border: '1px solid rgba(168,85,247,0.25)', marginBottom: '14px' },
    selectedName: { color: '#c084fc', fontWeight: '700', fontSize: '15px', margin: '0 0 4px' },
    selectedDesc: { color: 'rgba(233,213,255,0.6)', fontSize: '12px', margin: 0 },
    row: { display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 0', borderBottom: '1px solid rgba(168,85,247,0.08)' },
    rowIcon: { fontSize: '22px' },
    rowTitle: { margin: 0, fontWeight: '600', fontSize: '14px', color: '#e9d5ff' },
    rowSub: { margin: 0, fontSize: '12px', color: 'rgba(233,213,255,0.5)' },
    rowTime: { marginLeft: 'auto', fontSize: '12px', color: 'rgba(233,213,255,0.35)', whiteSpace: 'nowrap', marginRight: '8px' },
    deleteBtn: { background: 'none', border: 'none', cursor: 'pointer', fontSize: '14px', padding: '4px', opacity: 0.6, transition: 'opacity 0.2s' },
};


export default YogaPage;
