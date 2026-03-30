import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { getDoctorAppointments, updateDoctorAppointment, addMedicalRecord } from './services/api';
import './index.css';

const TRAINER_INFO = {
    'priya.sharma@gmail.com':  { name:'Priya Sharma',  spec:'Weight Loss & Nutrition',   gradient:'linear-gradient(135deg,#16a34a,#15803d)', price:'₹1,200/session' },
    'arjun.mehta@gmail.com':   { name:'Arjun Mehta',   spec:'Strength & Muscle Building', gradient:'linear-gradient(135deg,#6366f1,#4f46e5)', price:'₹1,500/session' },
    'sneha.patel@gmail.com':   { name:'Sneha Patel',   spec:'Yoga & Flexibility',         gradient:'linear-gradient(135deg,#f59e0b,#d97706)', price:'₹800/session'  },
    'ravi.kumar@gmail.com':    { name:'Ravi Kumar',    spec:'Cardio & Endurance',          gradient:'linear-gradient(135deg,#ef4444,#dc2626)', price:'₹1,000/session' },
    'ananya.singh@gmail.com':  { name:'Ananya Singh',  spec:'Posture & Rehab',             gradient:'linear-gradient(135deg,#3b82f6,#2563eb)', price:'₹1,800/session' },
    'karan.joshi@gmail.com':   { name:'Karan Joshi',   spec:'General Fitness & Lifestyle', gradient:'linear-gradient(135deg,#8b5cf6,#7c3aed)', price:'₹700/session'  },
};

const STATUS_COLORS = {
    confirmed: { bg:'rgba(34,197,94,0.12)',  border:'rgba(34,197,94,0.35)',  text:'#86efac', label:'✅ Confirmed'  },
    pending:   { bg:'rgba(251,191,36,0.10)', border:'rgba(251,191,36,0.35)', text:'#fde68a', label:'⏳ Pending'    },
    cancelled: { bg:'rgba(248,113,113,0.10)',border:'rgba(248,113,113,0.30)',text:'#fca5a5', label:'❌ Cancelled'  },
};

function fmtDate(iso) {
    const d = new Date(iso);
    return d.toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'numeric' }) +
           ' · ' + d.toLocaleTimeString('en-IN', { hour:'2-digit', minute:'2-digit' });
}

function getInitials(name) {
    if (!name) return '?';
    return name.split(' ').map(w => w[0] || '').join('').toUpperCase();
}

export default function TrainerDashboard() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const info = TRAINER_INFO[user?.email] || { name: user?.name || 'Trainer', spec: 'Fitness Coach', gradient:'linear-gradient(135deg,#e8621a,#d97706)', price:'' };
    const initials = getInitials(info.name);

    const [bookings, setBookings] = useState([]);
    const [filter, setFilter]     = useState('all');
    const [prescriptionModal, setPrescriptionModal] = useState(null);
    const [prescData, setPrescData] = useState({ diagnosis: '', prescription: '', labResults: '', nextFollowUp: '' });

    const INDIAN_DEMO_USERS = [
        { name:'Rohan Sharma',    email:'rohan.s@gmail.com'    },
        { name:'Megha Gupta',     email:'megha.g@gmail.com'    },
        { name:'Siddharth Verma', email:'sid.verma@gmail.com'  },
        { name:'Ishaan Malhotra', email:'ishaan.m@gmail.com'   },
        { name:'Anjali Rao',      email:'anjali.rao@gmail.com' },
        { name:'Amit Patel',      email:'amit.patel@gmail.com' },
        { name:'Shweta Tiwari',   email:'shweta.t@gmail.com'   },
        { name:'Rajesh Khanna',   email:'rajesh.k@gmail.com'   },
        { name:'Sunita Iyer',     email:'sunita.i@gmail.com'   },
        { name:'Vikram Rathore',  email:'vikram.r@gmail.com'   },
        { name:'Priya Nair',      email:'priya.nair@gmail.com' },
        { name:'Manish Pandey',   email:'manish.p@gmail.com'   },
        { name:'Kavita Seth',     email:'kavita.s@gmail.com'   },
        { name:'Suresh Raina',    email:'suresh.r@gmail.com'   },
        { name:'Lata Mangeshkar', email:'lata.m@gmail.com'     },
    ];

    useEffect(() => {
        if (!user?.email) return;
        
        getDoctorAppointments()
            .then(res => {
                const mapped = res.data.map(app => ({
                    id: app.id,
                    patientId: app.patient?.id || app.patientId,
                    trainerEmail: user.email,
                    userName: app.patient?.fullName || app.patientName || 'Unknown Patient',
                    userEmail: app.patient?.email || 'patient@example.com',
                    bookedAt: app.appointmentTime || app.appointmentDate || new Date().toISOString(),
                    status: (app.status || 'pending').toLowerCase(),
                }));
                setBookings(mapped);
            })
            .catch(err => {
                console.error("Failed to load real appointments, using empty state", err);
                setBookings([]);
            });
    }, [user, info.name]);

    const handleCancel = async (bookingId) => {
        try {
            await updateDoctorAppointment(bookingId, { status: 'CANCELLED' });
            setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status: 'cancelled' } : b));
        } catch (err) {
            console.error('Failed to cancel', err);
        }
    };

    const handleConfirm = async (bookingId) => {
        try {
            await updateDoctorAppointment(bookingId, { status: 'CONFIRMED' });
            setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status: 'confirmed' } : b));
        } catch (err) {
            console.error('Failed to confirm', err);
        }
    };

    const submitPrescription = async (e) => {
        e.preventDefault();
        try {
            const contentStr = `Diagnosis: ${prescData.diagnosis}\nPrescription: ${prescData.prescription}\nLab Results: ${prescData.labResults || 'None'}\nNext Follow Up: ${prescData.nextFollowUp || 'None'}`;
            await addMedicalRecord(prescriptionModal.patientId, {
                recordType: 'PRESCRIPTION',
                content: contentStr
            });
            alert('Medical record added successfully!');
            setPrescriptionModal(null);
            setPrescData({ diagnosis: '', prescription: '', labResults: '', nextFollowUp: '' });
        } catch (err) {
            console.error(err);
            alert('Failed to save record.');
        }
    };

    const handleLogout = () => { logout(); navigate('/login'); };

    const shown = filter === 'all' ? bookings : bookings.filter(b => (b.status || 'confirmed') === filter);

    const totalConfirmed = bookings.filter(b => (b.status || 'confirmed') === 'confirmed').length;
    const totalPending   = bookings.filter(b => b.status === 'pending').length;
    const totalCancelled = bookings.filter(b => b.status === 'cancelled').length;

    return (
        <>
            <div className="trd-topbar">
                <div>
                    <h1 className="trd-title">{info.name.split(' ')[0]}'s Dashboard</h1>
                    <p className="trd-subtitle">Manage your booked sessions</p>
                </div>
                <div className="trd-live-badge">🟢 Live</div>
            </div>

            {/* Prescription Modal */}
            {prescriptionModal && (
                <div style={{position:'fixed',top:0,left:0,right:0,bottom:0,background:'rgba(0,0,0,0.5)',display:'flex',justifyContent:'center',alignItems:'center',zIndex:999}}>
                    <div style={{background:'var(--card-bg)',padding:'2rem',borderRadius:'16px',width:'100%',maxWidth:'500px'}}>
                        <h3 style={{marginTop:0}}>Write Prescription</h3>
                        <p style={{color:'var(--muted)',marginBottom:'1rem'}}>For: {prescriptionModal.userName}</p>
                        <form onSubmit={submitPrescription} style={{display:'flex',flexDirection:'column',gap:'1rem'}}>
                            <input placeholder="Diagnosis" value={prescData.diagnosis} onChange={e=>setPrescData({...prescData, diagnosis: e.target.value})} style={{padding:'10px',borderRadius:'8px',border:'1px solid var(--border)'}} required/>
                            <textarea placeholder="Prescription Details" value={prescData.prescription} onChange={e=>setPrescData({...prescData, prescription: e.target.value})} rows={4} style={{padding:'10px',borderRadius:'8px',border:'1px solid var(--border)'}} required/>
                            <input placeholder="Lab Results (Optional)" value={prescData.labResults} onChange={e=>setPrescData({...prescData, labResults: e.target.value})} style={{padding:'10px',borderRadius:'8px',border:'1px solid var(--border)'}}/>
                            <input type="date" placeholder="Next Follow Up" value={prescData.nextFollowUp} onChange={e=>setPrescData({...prescData, nextFollowUp: e.target.value})} style={{padding:'10px',borderRadius:'8px',border:'1px solid var(--border)'}}/>
                            <div style={{display:'flex',justifyContent:'flex-end',gap:'1rem',marginTop:'1rem'}}>
                                <button type="button" onClick={()=>setPrescriptionModal(null)} style={{padding:'8px 16px',background:'transparent',border:'1px solid var(--border)',borderRadius:'8px',cursor:'pointer'}}>Cancel</button>
                                <button type="submit" style={{padding:'8px 16px',background:'var(--primary)',color:'white',border:'none',borderRadius:'8px',cursor:'pointer'}}>Save Record</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Stats */}
                <div className="trd-stats-row">
                    <div className="trd-stat-card">
                        <div className="trd-stat-icon">📅</div>
                        <div className="trd-stat-num">{bookings.length}</div>
                        <div className="trd-stat-label">Total Bookings</div>
                    </div>
                    <div className="trd-stat-card confirmed">
                        <div className="trd-stat-icon">✅</div>
                        <div className="trd-stat-num">{totalConfirmed}</div>
                        <div className="trd-stat-label">Confirmed</div>
                    </div>
                    <div className="trd-stat-card" style={{borderColor:'rgba(251,191,36,0.22)'}}>
                        <div className="trd-stat-icon">⏳</div>
                        <div className="trd-stat-num">{totalPending}</div>
                        <div className="trd-stat-label">Pending</div>
                    </div>
                    <div className="trd-stat-card cancelled">
                        <div className="trd-stat-icon">❌</div>
                        <div className="trd-stat-num">{totalCancelled}</div>
                        <div className="trd-stat-label">Cancelled</div>
                    </div>
                </div>

                {/* Filter tabs */}
                <div className="trd-filter-row">
                    {['all','confirmed','pending','cancelled'].map(f => (
                        <button
                            key={f}
                            className={`trd-filter-btn${filter === f ? ' active' : ''}`}
                            onClick={() => setFilter(f)}
                        >
                            {f.charAt(0).toUpperCase() + f.slice(1)}
                            <span className="trd-filter-count">
                                {f === 'all' ? bookings.length : bookings.filter(b => (b.status||'confirmed') === f).length}
                            </span>
                        </button>
                    ))}
                </div>

                {/* Bookings table */}
                <div className="trd-card">
                    <div className="trd-card-header">
                        <h2 className="trd-card-title">👥 Booked Users</h2>
                        <span className="trd-card-count">{shown.length} session{shown.length !== 1 ? 's' : ''}</span>
                    </div>

                    {shown.length === 0 ? (
                        <div className="trd-empty">
                            <div className="trd-empty-icon">📭</div>
                            <p className="trd-empty-text">
                                {bookings.length === 0
                                    ? 'No sessions booked yet. Share your profile to get bookings!'
                                    : 'No sessions match this filter.'}
                            </p>
                        </div>
                    ) : (
                        <div className="trd-table-wrap">
                            <table className="trd-table">
                                <thead>
                                    <tr>
                                        <th className="trd-th">#</th>
                                        <th className="trd-th">User</th>
                                        <th className="trd-th">Email</th>
                                        <th className="trd-th">Booked On</th>
                                        <th className="trd-th">Status</th>
                                        <th className="trd-th">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {shown.map((b, i) => {
                                        const st = b.status || 'confirmed';
                                        const sc = STATUS_COLORS[st] || STATUS_COLORS.confirmed;
                                        const userInitials = getInitials(b.userName || '?');
                                        return (
                                            <tr key={b.id} className="trd-tr">
                                                <td className="trd-td trd-td-num">{i + 1}</td>
                                                <td className="trd-td">
                                                    <div className="trd-user-cell">
                                                        <div className="trd-user-avatar">{userInitials}</div>
                                                        <span className="trd-user-name">{b.userName}</span>
                                                    </div>
                                                </td>
                                                <td className="trd-td trd-td-email">{b.userEmail}</td>
                                                <td className="trd-td trd-td-date">{fmtDate(b.bookedAt)}</td>
                                                <td className="trd-td">
                                                    <span
                                                        className="trd-status-pill"
                                                        style={{background: sc.bg, border:`1px solid ${sc.border}`, color: sc.text}}
                                                    >
                                                        {sc.label}
                                                    </span>
                                                </td>
                                                <td className="trd-td">
                                                    <div style={{display:'flex',gap:6}}>
                                                        {st === 'cancelled' || st === 'pending' ? (
                                                            <button
                                                                className="trd-confirm-btn"
                                                                onClick={() => handleConfirm(b.id)}
                                                            >
                                                                ✅ Confirm
                                                            </button>
                                                        ) : null}
                                                        {st !== 'cancelled' ? (
                                                            <button
                                                                className="trd-cancel-btn"
                                                                onClick={() => handleCancel(b.id)}
                                                            >
                                                                Cancel
                                                            </button>
                                                        ) : (
                                                            <span className="trd-na">—</span>
                                                        )}
                                                        {st === 'confirmed' && (
                                                            <button
                                                                style={{padding:'6px 14px',background:'var(--primary)',color:'white',border:'none',borderRadius:'50px',fontSize:'12px',fontWeight:'600',cursor:'pointer'}}
                                                                onClick={() => setPrescriptionModal(b)}
                                                            >
                                                                📝 Prescribe
                                                            </button>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
        </>
    );
}
