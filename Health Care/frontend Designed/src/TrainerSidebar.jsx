import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

const TRAINER_INFO = {
    'priya.sharma@gmail.com':  { name:'Priya Sharma',  spec:'Weight Loss & Nutrition',   gradient:'linear-gradient(135deg,#16a34a,#15803d)', price:'₹1,200/session' },
    'arjun.mehta@gmail.com':   { name:'Arjun Mehta',   spec:'Strength & Muscle Building', gradient:'linear-gradient(135deg,#6366f1,#4f46e5)', price:'₹1,500/session' },
    'sneha.patel@gmail.com':   { name:'Sneha Patel',   spec:'Yoga & Flexibility',         gradient:'linear-gradient(135deg,#f59e0b,#d97706)', price:'₹800/session'  },
    'ravi.kumar@gmail.com':    { name:'Ravi Kumar',    spec:'Cardio & Endurance',          gradient:'linear-gradient(135deg,#ef4444,#dc2626)', price:'₹1,000/session' },
    'ananya.singh@gmail.com':  { name:'Ananya Singh',  spec:'Posture & Rehab',             gradient:'linear-gradient(135deg,#3b82f6,#2563eb)', price:'₹1,800/session' },
    'karan.joshi@gmail.com':   { name:'Karan Joshi',   spec:'General Fitness & Lifestyle', gradient:'linear-gradient(135deg,#8b5cf6,#7c3aed)', price:'₹700/session'  },
};

function getInitials(name) {
    if (!name) return '?';
    return name.split(' ').map(w => w[0] || '').join('').toUpperCase();
}

export default function TrainerSidebar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const info = TRAINER_INFO[user?.email] || { 
        name: user?.name || 'Doctor', 
        spec: 'Medical Professional', 
        gradient: 'linear-gradient(135deg,#e8621a,#d97706)', 
        price: '' 
    };
    const initials = getInitials(info.name);

    if (!user) return null;

    return (
        <aside className="trd-sidebar">
            <div className="trd-sidebar-brand" onClick={() => navigate('/trainer-dashboard')} style={{cursor:'pointer'}}>
                <div className="trd-brand-icon">🌿</div>
                <div>
                    <div className="trd-brand-name">WellNest</div>
                    <div className="trd-brand-sub">{info.name.split(' ')[0]}</div>
                </div>
            </div>

            <div className="trd-trainer-profile">
                <div className="trd-profile-avatar" style={{background: info.gradient}}>{initials}</div>
                <div className="trd-profile-name">{info.name}</div>
                <div className="trd-profile-spec">Doctor{info.spec && info.spec !== 'Medical Professional' ? ` - ${info.spec}` : ''}</div>
                <div className="trd-profile-price">{info.price}</div>
            </div>

            <nav className="trd-nav">
                <div 
                    className={`trd-nav-item ${window.location.pathname === '/trainer-dashboard' ? 'active' : ''}`}
                    onClick={() => navigate('/trainer-dashboard')}
                >
                    📊 Dashboard
                </div>
                <div 
                    className={`trd-nav-item ${window.location.pathname === '/blog' ? 'active' : ''}`}
                    onClick={() => navigate('/blog')}
                >
                    📚 Health Blog
                </div>
                <div 
                    className={`trd-nav-item ${window.location.pathname === '/messages' ? 'active' : ''}`}
                    onClick={() => navigate('/messages')}
                >
                    💬 Messages
                </div>
            </nav>

            <button className="trd-logout-btn" onClick={() => { logout(); navigate('/login'); }}>🚪 Logout</button>
        </aside>
    );
}
