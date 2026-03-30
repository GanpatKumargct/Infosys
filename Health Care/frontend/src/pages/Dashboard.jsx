import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getActivities, getPatientAppointments, getDoctorAppointments, getAllAppointments } from '../services/api';
import HealthLogger from './HealthLogger';
import WeeklyReport from './WeeklyReport';
import BMICalculator from '../components/BMICalculator';
import Chatbot from '../components/Chatbot';
import { Activity, Utensils, Moon, Droplets, Calendar, Clock, PlusCircle, Clipboard, BarChart3, User, Shield, UserCog, CheckCircle2 } from 'lucide-react';
import api, { getTotalUnreadCount } from '../services/api';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';

const Dashboard = () => {
    const navigate = useNavigate();
    const [userRole, setUserRole] = useState('');
    const [fullName, setFullName] = useState('');
    const [completion, setCompletion] = useState(0);
    const [activities, setActivities] = useState([]);
    const [appointments, setAppointments] = useState([]);
    const [loadingLogs, setLoadingLogs] = useState(false);
    const [habitSummary, setHabitSummary] = useState({ total: 0, completed: 0 });
    const [unreadCount, setUnreadCount] = useState(0);

    const fetchActivities = async () => {
        setLoadingLogs(true);
        try {
            const response = await getActivities();
            // Sort by timestamp descending
            const sorted = response.data.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
            setActivities(sorted);
        } catch (err) {
            console.error('Failed to fetch activities', err);
        } finally {
            setLoadingLogs(false);
        }
    };

    const fetchHabitSummary = async () => {
        try {
            const today = new Date().toISOString().split('T')[0];
            const logsRes = await api.get(`/patient/habits/logs?date=${today}`);
            const habitsCount = logsRes.data.length;
            const completedCount = logsRes.data.filter(log => log.completed).length;
            setHabitSummary({ total: habitsCount, completed: completedCount });
        } catch (err) {
            console.error('Failed to fetch habit summary', err);
        }
    };

    const fetchAppointments = async (role) => {
        try {
            let res;
            if (role === 'PATIENT') {
                res = await getPatientAppointments();
            } else if (role === 'DOCTOR') {
                res = await getDoctorAppointments();
            } else if (role === 'RECEPTIONIST') {
                res = await getAllAppointments();
            }
            if (res) setAppointments(res.data.slice(0, 5)); // show top 5 for better overview
        } catch (err) {
            console.error('Failed to fetch appointments', err);
        }
    };

    const fetchUnreadCount = async () => {
        try {
            const res = await getTotalUnreadCount();
            setUnreadCount(res.data || 0);
        } catch (err) {
            console.error('Failed to fetch unread count', err);
        }
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        const role = localStorage.getItem('role');
        const savedCompletion = localStorage.getItem('profileCompletion');

        if (!token) {
            navigate('/login');
        } else {
            setUserRole(role);
            setFullName(localStorage.getItem('fullName') || role);
            if (savedCompletion) setCompletion(parseInt(savedCompletion));
            if (role === 'PATIENT') {
                fetchActivities();
                fetchAppointments('PATIENT');
                fetchHabitSummary();
                fetchUnreadCount();
            } else if (role === 'DOCTOR') {
                fetchAppointments('DOCTOR');
                fetchUnreadCount();
            } else if (role === 'RECEPTIONIST') {
                fetchAppointments('RECEPTIONIST');
            }
        }
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        navigate('/');
    };

    const getActivityIcon = (type) => {
        switch (type) {
            case 'WORKOUT': return <Activity size={18} color="#3b82f6" />;
            case 'MEAL': return <Utensils size={18} color="#ef4444" />;
            case 'SLEEP': return <Moon size={18} color="#8b5cf6" />;
            case 'WATER': return <Droplets size={18} color="#0ea5e9" />;
            default: return <Activity size={18} />;
        }
    };

    const formatTimestamp = (ts) => {
        const date = new Date(ts);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const getChartData = () => {
        const last7Days = [...Array(7)].map((_, i) => {
            const d = new Date();
            d.setDate(d.getDate() - i);
            return d.toISOString().split('T')[0];
        }).reverse();

        return last7Days.map(date => {
            const dayActs = activities.filter(a => a.timestamp && typeof a.timestamp === 'string' && a.timestamp.startsWith(date));
            return {
                name: new Date(date).toLocaleDateString([], { weekday: 'short' }),
                workout: dayActs.filter(a => a.type === 'WORKOUT').reduce((sum, a) => sum + (a.value || 0), 0),
                water: dayActs.filter(a => a.type === 'WATER').reduce((sum, a) => sum + (a.value || 0), 0),
                sleep: dayActs.filter(a => a.type === 'SLEEP').reduce((sum, a) => sum + (a.value || 0), 0),
            };
        });
    };

    const chartData = getChartData();

    return (
        <div className="container" style={{ marginTop: '2rem' }}>
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', padding: '1.5rem', background: '#fff', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                    <div style={{ 
                        width: '48px', 
                        height: '48px', 
                        borderRadius: '12px', 
                        background: 'var(--primary)', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)'
                    }}>
                        <Shield color="white" size={24} />
                    </div>
                    <div>
                        <h1 style={{ color: 'var(--primary)', fontSize: '1.5rem', margin: 0 }}>WellNest Dashboard</h1>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '0.2rem' }}>
                            <span style={{ fontSize: '0.95rem', color: 'var(--text-main)', fontWeight: '500' }}>{fullName}</span>
                            <span style={{ 
                                fontSize: '0.65rem', 
                                padding: '0.15rem 0.5rem', 
                                background: 'var(--secondary)', 
                                color: 'var(--primary)', 
                                borderRadius: 'var(--radius-full)',
                                fontWeight: 'bold',
                                textTransform: 'uppercase',
                                border: '1px solid var(--primary)'
                            }}>{userRole}</span>
                        </div>
                    </div>
                </div>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <button onClick={() => navigate('/messages')} className="btn btn-primary" style={{ position: 'relative', borderRadius: 'var(--radius-md)' }}>
                        Messages
                        {unreadCount > 0 && (
                            <span style={{
                                position: 'absolute',
                                top: '-8px',
                                right: '-8px',
                                background: '#ef4444',
                                color: 'white',
                                borderRadius: '50%',
                                width: '22px',
                                height: '22px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '0.75rem',
                                fontWeight: 'bold',
                                border: '2px solid white'
                            }}>
                                {unreadCount > 99 ? '99+' : unreadCount}
                            </span>
                        )}
                    </button>
                    <button onClick={handleLogout} className="btn btn-outline" style={{ borderRadius: 'var(--radius-md)' }}>Logout</button>
                </div>
            </header>


            <div className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <h2 style={{ fontSize: '1.25rem' }}>Overview</h2>
                </div>

                {userRole === 'PATIENT' && (
                    <div style={{ marginTop: '2rem' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                            <div className="left-column">
                                <div style={{
                                    background: 'var(--bg-alt)',
                                    padding: '1.5rem',
                                    borderRadius: 'var(--radius-md)',
                                    marginBottom: '2rem',
                                    border: '1px solid var(--border)'
                                }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                                        <div>
                                            <h3 style={{ marginBottom: '0.25rem' }}>Profile Completion</h3>
                                            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                                                {completion === 100 ? 'Your profile is fully optimized!' : 'Complete your profile to get better insights.'}
                                            </p>
                                        </div>
                                        <span style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--primary)' }}>{completion}%</span>
                                    </div>
                                    <div style={{ height: '10px', background: 'rgba(0,0,0,0.05)', borderRadius: '5px', overflow: 'hidden', marginBottom: '1rem' }}>
                                        <div style={{
                                            height: '100%',
                                            width: `${completion}%`,
                                            background: 'var(--primary)',
                                            transition: 'width 0.5s ease-out'
                                        }}></div>
                                    </div>
                                    {completion < 100 && (
                                        <button
                                            onClick={() => navigate('/profile-setup')}
                                            className="btn btn-primary"
                                            style={{ width: '100%', marginTop: '0.5rem' }}
                                        >
                                            Complete Your Profile
                                        </button>
                                    )}
                                </div>

                                <div className="card" style={{ padding: '1.5rem', marginBottom: '2rem', background: 'linear-gradient(135deg, var(--primary) 0%, #4f46e5 100%)', color: 'white' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                                        <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'white' }}>
                                            <CheckCircle2 size={20} />
                                            Daily Goal Progress
                                        </h3>
                                        <span style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>
                                            {habitSummary.total > 0 ? Math.round((habitSummary.completed / habitSummary.total) * 100) : 0}%
                                        </span>
                                    </div>
                                    <div style={{ height: '8px', background: 'rgba(255,255,255,0.2)', borderRadius: '4px', overflow: 'hidden', marginBottom: '1rem' }}>
                                        <div style={{
                                            height: '100%',
                                            width: `${habitSummary.total > 0 ? (habitSummary.completed / habitSummary.total) * 100 : 0}%`,
                                            background: 'white',
                                            transition: 'width 0.5s ease-out'
                                        }}></div>
                                    </div>
                                    <p style={{ fontSize: '0.85rem', opacity: 0.9 }}>
                                        {habitSummary.total > 0 
                                            ? `${habitSummary.completed} of ${habitSummary.total} habits completed today. Keep it up!`
                                            : "No daily habits defined. Start tracking your goals now!"}
                                    </p>
                                </div>

                                <div className="card" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                                        <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            <Activity size={20} color="var(--primary)" />
                                            Health Vitals
                                        </h3>
                                        <button onClick={() => navigate('/profile-setup')} className="btn btn-text" style={{ fontSize: '0.8rem' }}>Update</button>
                                    </div>
                                    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                                        <div style={{ flex: 1, minWidth: '100px', background: 'var(--bg-alt)', padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}>
                                            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Glucose</div>
                                            <div style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>{completion > 0 && localStorage.getItem('bloodGlucose') !== 'null' ? localStorage.getItem('bloodGlucose') || '--' : '--'}<span style={{ fontSize: '0.8rem', fontWeight: 'normal', color: 'var(--text-muted)' }}> mg/dL</span></div>
                                        </div>
                                        <div style={{ flex: 1, minWidth: '100px', background: 'var(--bg-alt)', padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}>
                                            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>BP</div>
                                            <div style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>{completion > 0 && localStorage.getItem('bloodPressure') !== 'null' ? localStorage.getItem('bloodPressure') || '--' : '--'}<span style={{ fontSize: '0.8rem', fontWeight: 'normal', color: 'var(--text-muted)' }}> mmHg</span></div>
                                        </div>
                                        <div style={{ flex: 1, minWidth: '100px', background: 'var(--bg-alt)', padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}>
                                            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Heart Rate</div>
                                            <div style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>{completion > 0 && localStorage.getItem('heartRate') !== 'null' ? localStorage.getItem('heartRate') || '--' : '--'}<span style={{ fontSize: '0.8rem', fontWeight: 'normal', color: 'var(--text-muted)' }}> bpm</span></div>
                                        </div>
                                    </div>
                                </div>

                                <BMICalculator />

                                <div className="card" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                                        <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            <Clock size={20} color="var(--primary)" />
                                            Upcoming Appointments
                                        </h3>
                                        <button onClick={() => navigate('/appointments')} className="btn btn-text" style={{ fontSize: '0.8rem' }}>View All</button>
                                    </div>
                                    {appointments.length === 0 ? (
                                        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>No upcoming appointments.</p>
                                    ) : (
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                            {appointments.map(app => (
                                                <div key={app.id} style={{ fontSize: '0.9rem', padding: '0.5rem', borderLeft: '3px solid var(--primary)', background: 'var(--bg-alt)' }}>
                                                    <strong>{app.doctor.fullName}</strong>
                                                    <div style={{ color: 'var(--text-muted)' }}>{new Date(app.appointmentTime).toLocaleDateString()} at {new Date(app.appointmentTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                <HealthLogger onActivityLogged={fetchActivities} />
                            </div>

                            <div className="right-column">
                                <WeeklyReport />
                                <div className="card mb-4" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
                                    <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <BarChart3 size={20} color="var(--primary)" />
                                        Health Trends (Last 7 Days)
                                    </h3>
                                    <div style={{ height: '250px', width: '100%' }}>
                                        <ResponsiveContainer width="100%" height="100%">
                                            <LineChart data={chartData}>
                                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                                                <Tooltip 
                                                    contentStyle={{ borderRadius: 'var(--radius-md)', border: 'none', boxShadow: 'var(--shadow-md)' }}
                                                />
                                                <Legend iconType="circle" />
                                                <Line type="monotone" dataKey="workout" name="Workout (min)" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                                                <Line type="monotone" dataKey="sleep" name="Sleep (hrs)" stroke="#8b5cf6" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                                            </LineChart>
                                        </ResponsiveContainer>
                                    </div>
                                    <div style={{ height: '200px', width: '100%', marginTop: '2rem' }}>
                                        <ResponsiveContainer width="100%" height="100%">
                                            <BarChart data={chartData}>
                                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                                                <Tooltip 
                                                    contentStyle={{ borderRadius: 'var(--radius-md)', border: 'none', boxShadow: 'var(--shadow-md)' }}
                                                />
                                                <Bar dataKey="water" name="Water (ml)" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>

                                <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <Calendar size={20} color="var(--primary)" />
                                    Today's Activity
                                </h3>

                                {loadingLogs ? (
                                    <p>Loading activities...</p>
                                ) : activities.length === 0 ? (
                                    <div style={{ textAlign: 'center', padding: '3rem', background: 'var(--bg-alt)', borderRadius: 'var(--radius-md)', border: '1px dashed var(--border)' }}>
                                        <p style={{ color: 'var(--text-muted)' }}>No activities logged for today.</p>
                                    </div>
                                ) : (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                        {activities.slice(0, 5).map((act) => (
                                            <div key={act.id} style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '1rem',
                                                padding: '1rem',
                                                borderRadius: 'var(--radius-sm)',
                                                background: 'var(--card-bg)',
                                                border: '1px solid var(--border)'
                                            }}>
                                                <div style={{ padding: '0.5rem', borderRadius: '50%', background: 'var(--bg-alt)' }}>
                                                    {getActivityIcon(act.type)}
                                                </div>
                                                <div style={{ flex: 1 }}>
                                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                        <span style={{ fontWeight: '600' }}>{act.subType || act.type}</span>
                                                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{formatTimestamp(act.timestamp)}</span>
                                                    </div>
                                                    <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                                                        {act.type === 'WORKOUT' && `${act.value} min • ${act.secondaryValue} kcal`}
                                                        {act.type === 'MEAL' && `${act.value} kcal`}
                                                        {act.type === 'SLEEP' && `${act.value} hours`}
                                                        {act.type === 'WATER' && `${act.value} ml`}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                        {activities.length > 5 && (
                                            <button className="btn btn-text" style={{ alignSelf: 'center', fontSize: '0.85rem' }}>View All</button>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {userRole === 'DOCTOR' && (
                    <div style={{ marginTop: '2rem', display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
                        <div className="card">
                            <h3 style={{ marginBottom: '1.5rem' }}>Upcoming Patients</h3>
                            {appointments.length === 0 ? (
                                <p>No appointments scheduled.</p>
                            ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    {appointments.map(app => (
                                        <div key={app.id} style={{ padding: '1rem', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <div>
                                                <div style={{ fontWeight: '600' }}>{app.patient.fullName}</div>
                                                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{new Date(app.appointmentTime).toLocaleString()}</div>
                                            </div>
                                            <button 
                                                onClick={() => navigate(`/records/${app.patient.id}`)}
                                                className="btn btn-outline" 
                                                style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}
                                            >
                                                View Records
                                            </button>
                                        </div>
                                    ))}
                                    <button onClick={() => navigate('/appointments')} className="btn btn-text">Go to Schedule</button>
                                </div>
                            )}
                        </div>
                        <div className="card">
                            <h3 style={{ marginBottom: '1.5rem' }}>Quick Actions</h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'flex-start', gap: '0.5rem' }}>
                                    <PlusCircle size={18} /> Add Prescription
                                </button>
                                <button 
                                    onClick={() => navigate('/records')}
                                    className="btn btn-outline" 
                                    style={{ width: '100%', justifyContent: 'flex-start', gap: '0.5rem' }}
                                >
                                    <User size={18} /> Search Patients
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {userRole === 'RECEPTIONIST' && (
                    <div style={{ marginTop: '2rem' }}>                        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
                            <div className="card">
                                <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <Clock size={20} color="var(--primary)" />
                                    Recent Appointments
                                </h3>
                                {appointments.length === 0 ? (
                                    <p style={{ color: 'var(--text-muted)' }}>No appointments scheduled.</p>
                                ) : (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                        {appointments.map(app => (
                                            <div key={app.id} style={{ padding: '1rem', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <div>
                                                    <div style={{ fontWeight: '600' }}>Patient: {app.patient.fullName}</div>
                                                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                                                        With Dr. {app.doctor.fullName} • {new Date(app.appointmentTime).toLocaleString()}
                                                    </div>
                                                    <span style={{ 
                                                        fontSize: '0.7rem', 
                                                        padding: '0.1rem 0.4rem', 
                                                        borderRadius: 'var(--radius-full)',
                                                        background: app.status === 'PENDING' ? '#fffaf0' : '#ebf8ff',
                                                        color: app.status === 'PENDING' ? '#975a16' : '#2b6cb0',
                                                        fontWeight: 'bold',
                                                        marginTop: '0.25rem',
                                                        display: 'inline-block'
                                                    }}>
                                                        {app.status}
                                                    </span>
                                                </div>
                                                <button 
                                                    onClick={() => navigate('/appointments')}
                                                    className="btn btn-outline" 
                                                    style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}
                                                >
                                                    View Details
                                                </button>
                                            </div>
                                        ))}
                                        <button onClick={() => navigate('/appointments')} className="btn btn-text">View Full Schedule</button>
                                    </div>
                                )}
                            </div>
                            <div className="card">
                                <h3 style={{ marginBottom: '1.5rem' }}>Receptionist Tools</h3>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    <div 
                                        onClick={() => navigate('/appointments')}
                                        style={{ padding: '1.25rem', background: 'var(--secondary)', borderRadius: 'var(--radius-md)', cursor: 'pointer', border: '1px solid var(--primary)' }}
                                    >
                                        <Calendar size={24} color="var(--primary)" style={{ marginBottom: '0.5rem' }} />
                                        <div style={{ fontWeight: '600', fontSize: '0.95rem' }}>Manage Appointments</div>
                                        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>Confirm patient bookings.</p>
                                    </div>
                                    <div 
                                        onClick={() => navigate('/register/patient')}
                                        style={{ padding: '1.25rem', background: '#f0fff4', borderRadius: 'var(--radius-md)', cursor: 'pointer', border: '1px solid #2f855a' }}
                                    >
                                        <User size={24} color="#2f855a" style={{ marginBottom: '0.5rem' }} />
                                        <div style={{ fontWeight: '600', fontSize: '0.95rem' }}>New Patient</div>
                                        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>Register arriving patients.</p>
                                    </div>
                                    <div 
                                        onClick={() => navigate('/admin')}
                                        style={{ padding: '1.25rem', background: '#fff5f5', borderRadius: 'var(--radius-md)', cursor: 'pointer', border: '1px solid #c53030' }}
                                    >
                                        <UserCog size={24} color="#c53030" style={{ marginBottom: '0.5rem' }} />
                                        <div style={{ fontWeight: '600', fontSize: '0.95rem' }}>Manage Doctors</div>
                                        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>CRUD medical staff.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {userRole === 'ADMIN' && (
                    <div style={{ marginTop: '2rem' }}>
                        <div className="card">
                            <h3 style={{ marginBottom: '1.5rem' }}>Administrator Console</h3>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
                                <div 
                                    onClick={() => navigate('/admin')}
                                    style={{ padding: '2rem', background: 'var(--bg-alt)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', cursor: 'pointer' }}
                                >
                                    <Shield size={32} color="#ef4444" style={{ marginBottom: '1rem' }} />
                                    <h4 style={{ marginBottom: '0.5rem' }}>User Management</h4>
                                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Manage all Doctors, Patients, and Staff accounts.</p>
                                </div>
                                <div style={{ padding: '2rem', background: 'var(--bg-alt)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', cursor: 'pointer' }}>
                                    <Activity size={32} color="#10b981" style={{ marginBottom: '1rem' }} />
                                    <h4 style={{ marginBottom: '0.5rem' }}>System Logs</h4>
                                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Monitor system-wide activity and security events.</p>
                                </div>
                                <div style={{ padding: '2rem', background: 'var(--bg-alt)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', cursor: 'pointer' }}>
                                    <Calendar size={32} color="#3b82f6" style={{ marginBottom: '1rem' }} />
                                    <h4 style={{ marginBottom: '0.5rem' }}>Facility Schedule</h4>
                                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Overview of all upcoming hospital appointments.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            
            {userRole === 'PATIENT' && <Chatbot />}
        </div>
    );
};

export default Dashboard;
