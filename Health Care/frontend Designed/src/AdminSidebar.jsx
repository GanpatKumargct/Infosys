import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';

const MENU = [
  { icon:'📋', label:'Overview', path:'/admin-dashboard' },
  { icon:'👨‍⚕️', label:'Trainers', path:'/admin-dashboard' },
  { icon:'➕', label:'RegisterPatient', path:'/admin-dashboard' },
  { icon:'📚', label:'Blog',     path:'/blog' },
  { icon:'👥', label:'Users',    path:'/admin-dashboard' }, // These stay in dashboard for now as they are tabs
  { icon:'📊', label:'Reports',  path:'/admin-dashboard' },
  { icon:'⚙️', label:'Settings', path:'/admin-dashboard' },
];

export default function AdminSidebar({ onTabChange, activeTab }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => { logout(); navigate('/login'); };

  // For the dashboard, we use internal state tabs. 
  // For other pages (like Blog), we navigate.
  const handleNav = (item) => {
    if (item.label === 'Blog') {
        navigate('/blog');
    } else {
        navigate('/admin-dashboard', { state: { activeTab: item.label } });
    }
  };

  return (
    <aside className="admin-sidebar">
      <div className="admin-sidebar-brand" onClick={() => navigate('/admin-dashboard')} style={{cursor:'pointer'}}>
        <div className="admin-brand-icon">🌿</div>
        <div>
          <div className="admin-brand-name">WellNest</div>
          <div className="admin-brand-sub">Admin Panel</div>
        </div>
      </div>
      <div className="admin-sidebar-menu-label">MENU</div>
      <nav className="admin-nav">
        {MENU.map(({ icon, label, path }) => {
          const currentTab = location.state?.activeTab || 'Overview';
          const isActive = (label === 'Blog' && location.pathname === '/blog') || 
                          (location.pathname === '/admin-dashboard' && currentTab === label);
          
          return (
            <a key={label} onClick={() => handleNav({label, path})}
              className={`admin-nav-item${isActive ? ' active' : ''}`}
              style={{cursor:'pointer'}}>
              <span>{icon}</span><span>{label}</span>
            </a>
          );
        })}
      </nav>
      <div style={{ flex: 1 }} />
      <div className="admin-sidebar-user">
        <div className="admin-user-avatar">{user?.name ? user.name[0].toUpperCase() : 'A'}</div>
        <div className="admin-user-info">
          <div className="admin-user-name">{user?.name || 'Admin'}</div>
          <div className="admin-user-role">Administrator</div>
        </div>
        <button className="admin-logout-btn" onClick={handleLogout} title="Logout">⏻</button>
      </div>
    </aside>
  );
}
