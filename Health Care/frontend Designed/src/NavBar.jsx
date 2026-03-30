import { Link, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';

const NAV_ITEMS = [
  { name:'Dashboard',  path:'/dashboard', icon:'🏠' },
  { name:'Hydration',  path:'/hydration',  icon:'💧' },
  { name:'Yoga',       path:'/yoga',        icon:'🧘' },
  { name:'Walking',    path:'/walking',     icon:'🚶' },
  { name:'BMI',        path:'/bmi',         icon:'⚖️'  },
  { name:'Trainers',   path:'/trainers',    icon:'🏋️' },
  { name:'Diet',       path:'/diet',        icon:'🥗' },
  { name:'Messages',   path:'/messages',    icon:'💬' },
  { name:'Blog',       path:'/blog',         icon:'📚' },
];

export default function NavBar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  if (!user) return null;

  const initials = user?.name
    ? user.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
    : 'U';

  return (
    <nav className="wn-sidebar">
      {/* Brand */}
      <div className="wn-sidebar-brand">
        <div className="wn-sidebar-brand-icon">🌿</div>
        <span className="wn-sidebar-brand-text">WellNest</span>
      </div>

      {/* Menu label */}
      <div className="wn-sidebar-menu-label">MENU</div>

      {/* Links */}
      <div className="wn-sidebar-links">
        {NAV_ITEMS.filter(item => {
          if (user?.role === 'admin') {
            // Admin only needs Dashboard link (internal tabs handle the rest)
            return item.name === 'Dashboard';
          }
          return true;
        }).map(item => {
          const path = (user?.role === 'admin' && item.name === 'Dashboard') 
            ? '/admin-dashboard' 
            : item.path;
          const active = location.pathname === path;
          
          return (
            <Link
              key={item.name}
              to={path}
              className={`wn-sidebar-link${active ? ' active' : ''}`}
            >
              <span className="wn-sidebar-link-icon">{item.icon}</span>
              <span className="wn-sidebar-link-label">{item.name}</span>
              {active && <span className="wn-sidebar-active-dot" />}
            </Link>
          );
        })}
      </div>

      {/* Spacer */}
      <div style={{ flex: 1 }} />

      {/* User */}
      <div className="wn-sidebar-user">
        <div className="wn-sidebar-avatar">{initials}</div>
        <div className="wn-sidebar-user-info">
          <div className="wn-sidebar-username">{user?.name || 'User'}</div>
          <div className="wn-sidebar-role">{user?.role === 'admin' ? 'Receptionist' : user?.role === 'trainer' ? 'Doctor' : 'Patient'}</div>
        </div>
        <button className="wn-sidebar-logout-btn" onClick={logout} title="Logout">⏻</button>
      </div>
    </nav>
  );
}
