import { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import HealthBlog from './HealthBlog';
import BlogDetail from './BlogDetail';
import BlogEditor from './BlogEditor';
import { getAllUsers, getDoctorsList, createDoctor, updateDoctor, deleteDoctor, registerPatient } from './services/api';
import './index.css';

/* ── Mock data for fallback ── */
const MOCK_USERS = [
  { id:1, name:'Vishnu Priya', email:'vishnu@gmail.com', role:'member', joined:'2026-01-10', status:'Active',  bmi:22.4, steps:8420, water:1.8 },
  { id:2, name:'Sumit Kumar',  email:'sumit@gmail.com',  role:'member', joined:'2026-01-15', status:'Active',  bmi:24.1, steps:6200, water:2.1 },
  { id:3, name:'Ananya R',     email:'ananya@gmail.com', role:'member', joined:'2026-02-02', status:'Inactive',bmi:20.8, steps:3100, water:1.2 },
  { id:4, name:'Rohan M',      email:'rohan@gmail.com',  role:'member', joined:'2026-02-18', status:'Active',  bmi:27.3, steps:9800, water:2.5 },
  { id:5, name:'Priya S',      email:'priya@gmail.com',  role:'member', joined:'2026-03-01', status:'Active',  bmi:19.9, steps:5500, water:1.6 },
];

const REPORTS = [
  { id:1, user:'Vishnu Priya', type:'Hydration',  date:'2026-03-06', detail:'Logged 1.8L of 2.5L goal (72%)' },
  { id:2, user:'Sumit Kumar',  type:'Walking',    date:'2026-03-06', detail:'6200 steps — 62% of 10,000 goal' },
  { id:3, user:'Rohan M',      type:'Yoga',       date:'2026-03-05', detail:'45 min session — Mountain Pose' },
  { id:4, user:'Ananya R',     type:'Diet',       date:'2026-03-05', detail:'1640 kcal logged — below target' },
  { id:5, user:'Priya S',      type:'BMI',        date:'2026-03-04', detail:'BMI 19.9 — Normal weight range' },
  { id:6, user:'Vishnu Priya', type:'Walking',    date:'2026-03-04', detail:'9200 steps — 92% of goal' },
];

const WEEKLY = [
  { day:'Mon', steps:7200, water:2.0, yoga:30, cal:1800 },
  { day:'Tue', steps:9400, water:2.3, yoga:45, cal:2100 },
  { day:'Wed', steps:5100, water:1.5, yoga:0,  cal:1600 },
  { day:'Thu', steps:8800, water:2.5, yoga:20, cal:1950 },
  { day:'Fri', steps:6200, water:1.8, yoga:30, cal:1750 },
  { day:'Sat', steps:11000,water:3.0, yoga:60, cal:2200 },
  { day:'Sun', steps:4500, water:1.2, yoga:15, cal:1500 },
];

/* ── Sections ── */
function Overview({ user }) {
  const stats = [
    { label:'Total Users',     value:'120', icon:'👥', color:'var(--orange)' },
    { label:'Active Sessions', value:'34',  icon:'🟢', color:'#22c55e' },
    { label:'Reports Today',   value:'8',   icon:'📊', color:'var(--purple-lt)' },
    { label:'System Health',   value:'99%', icon:'❤️', color:'#f43f5e' },
  ];
  return (
    <>
      <div className="admin-stats-grid">
        {stats.map(s => (
          <div key={s.label} className="admin-stat-card">
            <div className="admin-stat-icon" style={{color:s.color}}>{s.icon}</div>
            <div className="admin-stat-value" style={{color:s.color}}>{s.value}</div>
            <div className="admin-stat-label">{s.label}</div>
          </div>
        ))}
      </div>
      <div className="admin-card">
        <h3 className="admin-card-title">System Information</h3>
        <table className="admin-table">
          <thead><tr><th className="admin-th">Property</th><th className="admin-th">Value</th></tr></thead>
          <tbody>
            <tr><td className="admin-td">Admin Email</td><td className="admin-td">{user?.email}</td></tr>
            <tr><td className="admin-td">Role</td><td className="admin-td">Administrator</td></tr>
            <tr><td className="admin-td">Server</td><td className="admin-td">http://localhost:8080/api</td></tr>
            <tr><td className="admin-td">Version</td><td className="admin-td">WellNest Live v2.0</td></tr>
            <tr><td className="admin-td">Status</td><td className="admin-td">🟢 Online</td></tr>
          </tbody>
        </table>
      </div>
    </>
  );
}

function Users() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    getAllUsers().then(res => {
      const fetched = res.data.map(u => ({
        id: u.id,
        name: u.fullName,
        email: u.email,
        role: u.role,
        joined: u.createdAt ? u.createdAt.substring(0, 10) : 'N/A',
        status: 'Active',
        bmi: u.weight && u.height ? (u.weight / ((u.height/100)**2)).toFixed(1) : '-',
        steps: '-',
        water: '-'
      }));
      setUsers(fetched);
    }).catch(err => {
      console.error('Failed to fetch users, using mock data:', err);
      setUsers(MOCK_USERS);
    });
  }, []);

  const filtered = users.filter(u =>
    u.name?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase())
  );
  return (
    <div className="admin-card">
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:18,flexWrap:'wrap',gap:12}}>
        <h3 className="admin-card-title" style={{margin:0}}>👥 Registered Users</h3>
        <input
          value={search} onChange={e=>setSearch(e.target.value)}
          placeholder="Search by name or email..."
          style={{padding:'8px 14px',borderRadius:9,border:'1px solid rgba(232,98,26,0.25)',background:'rgba(255,255,255,0.04)',color:'var(--text)',fontSize:13,outline:'none',width:220}}
        />
      </div>
      <table className="admin-table">
        <thead>
          <tr>
            <th className="admin-th">#</th>
            <th className="admin-th">Name</th>
            <th className="admin-th">Email</th>
            <th className="admin-th">Joined</th>
            <th className="admin-th">BMI</th>
            <th className="admin-th">Steps</th>
            <th className="admin-th">Water</th>
            <th className="admin-th">Status</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((u,i) => (
            <tr key={u.id}>
              <td className="admin-td">{i+1}</td>
              <td className="admin-td" style={{fontWeight:700,color:'var(--text)'}}>{u.name}</td>
              <td className="admin-td">{u.email}</td>
              <td className="admin-td">{u.joined}</td>
              <td className="admin-td">{u.bmi}</td>
              <td className="admin-td">{u.steps.toLocaleString()}</td>
              <td className="admin-td">{u.water} L</td>
              <td className="admin-td">
                <span style={{padding:'3px 10px',borderRadius:50,fontSize:11,fontWeight:700,
                  background:u.status==='Active'?'rgba(34,197,94,0.15)':'rgba(248,113,113,0.12)',
                  color:u.status==='Active'?'#4ade80':'#f87171',
                  border:`1px solid ${u.status==='Active'?'rgba(74,222,128,0.3)':'rgba(248,113,113,0.25)'}`
                }}>{u.status}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {filtered.length === 0 && <p style={{color:'var(--muted)',textAlign:'center',padding:20}}>No users found.</p>}
    </div>
  );
}

function Reports() {
  const [filter, setFilter] = useState('All');
  const types = ['All','Hydration','Walking','Yoga','Diet','BMI'];
  const filtered = filter === 'All' ? REPORTS : REPORTS.filter(r => r.type === filter);
  const typeColors = { Hydration:'#38bdf8', Walking:'#4ade80', Yoga:'#a855f7', Diet:'#fbbf24', BMI:'#f4894a' };
  return (
    <div className="admin-card">
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:18,flexWrap:'wrap',gap:10}}>
        <h3 className="admin-card-title" style={{margin:0}}>📊 Activity Reports</h3>
        <div style={{display:'flex',gap:6,flexWrap:'wrap'}}>
          {types.map(t => (
            <button key={t} onClick={()=>setFilter(t)} style={{
              padding:'5px 13px',borderRadius:50,fontSize:12,fontWeight:700,cursor:'pointer',fontFamily:'var(--font)',
              background:filter===t?'rgba(232,98,26,0.18)':'rgba(255,255,255,0.04)',
              border:`1px solid ${filter===t?'rgba(232,98,26,0.45)':'rgba(255,255,255,0.08)'}`,
              color:filter===t?'var(--orange-lt)':'var(--muted)',transition:'all .2s'
            }}>{t}</button>
          ))}
        </div>
      </div>
      <table className="admin-table">
        <thead>
          <tr>
            <th className="admin-th">User</th>
            <th className="admin-th">Type</th>
            <th className="admin-th">Date</th>
            <th className="admin-th">Detail</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map(r => (
            <tr key={r.id}>
              <td className="admin-td" style={{fontWeight:700,color:'var(--text)'}}>{r.user}</td>
              <td className="admin-td">
                <span style={{padding:'3px 10px',borderRadius:50,fontSize:11,fontWeight:700,
                  background:`rgba(${typeColors[r.type]||'232,98,26'},0.12)`,
                  color:typeColors[r.type]||'var(--orange-lt)',
                  border:`1px solid ${typeColors[r.type]||'var(--orange)'}44`
                }}>{r.type}</span>
              </td>
              <td className="admin-td">{r.date}</td>
              <td className="admin-td" style={{color:'var(--muted)'}}>{r.detail}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Settings({ user }) {
  const [notif, setNotif]   = useState(true);
  const [maint, setMaint]   = useState(false);
  const [backup, setBackup] = useState(true);
  const Toggle = ({ val, set }) => (
    <div onClick={()=>set(!val)} style={{
      width:44,height:24,borderRadius:12,cursor:'pointer',transition:'all .25s',
      background:val?'var(--orange)':'rgba(255,255,255,0.12)',
      position:'relative',flexShrink:0
    }}>
      <div style={{position:'absolute',top:3,left:val?22:3,width:18,height:18,borderRadius:'50%',background:'#fff',transition:'left .25s',boxShadow:'0 1px 4px rgba(0,0,0,0.4)'}}/>
    </div>
  );
  return (
    <div style={{display:'flex',flexDirection:'column',gap:20}}>
      <div className="admin-card">
        <h3 className="admin-card-title">⚙️ System Settings</h3>
        {[
          ['🔔 Email Notifications', 'Send activity alerts to users', notif, setNotif],
          ['🔧 Maintenance Mode',    'Restrict user logins temporarily', maint, setMaint],
          ['💾 Auto Backup',         'Backup database every 24 hours', backup, setBackup],
        ].map(([label, desc, val, set]) => (
          <div key={label} style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'14px 0',borderBottom:'1px solid rgba(232,98,26,0.08)'}}>
            <div>
              <div style={{color:'var(--text)',fontWeight:600,fontSize:14}}>{label}</div>
              <div style={{color:'var(--muted)',fontSize:12,marginTop:2}}>{desc}</div>
            </div>
            <Toggle val={val} set={set}/>
          </div>
        ))}
      </div>
      <div className="admin-card">
        <h3 className="admin-card-title">👤 Admin Profile</h3>
        <table className="admin-table">
          <tbody>
            <tr><td className="admin-td">Name</td><td className="admin-td" style={{fontWeight:700,color:'var(--text)'}}>{user?.name}</td></tr>
            <tr><td className="admin-td">Email</td><td className="admin-td">{user?.email}</td></tr>
            <tr><td className="admin-td">Role</td><td className="admin-td"><span style={{color:'var(--orange-lt)',fontWeight:700}}>Administrator</span></td></tr>
            <tr><td className="admin-td">Last Login</td><td className="admin-td">Today, {new Date().toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'})}</td></tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

function TrainersManager() {
  const [trainers, setTrainers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingTrainer, setEditingTrainer] = useState(null);
  const [formData, setFormData] = useState({ fullName: '', email: '', password: '', specialization: '' });

  useEffect(() => { fetchTrainers(); }, []);

  const fetchTrainers = () => {
    getDoctorsList().then(res => setTrainers(res.data)).catch(err => console.error('Error fetching trainers:', err));
  };

  const openModal = (t = null) => {
    setEditingTrainer(t);
    if (t) {
      setFormData({ fullName: t.fullName, email: t.email, password: '', specialization: t.specialization || '' });
    } else {
      setFormData({ fullName: '', email: '', password: '', specialization: '' });
    }
    setShowModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (editingTrainer) {
        await updateDoctor(editingTrainer.id, formData);
        alert('Trainer updated!');
      } else {
        await createDoctor(formData);
        alert('Trainer created!');
      }
      setShowModal(false);
      fetchTrainers();
    } catch (err) {
      alert('Error saving trainer');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete trainer?')) {
      try {
        await deleteDoctor(id);
        alert('Trainer deleted!');
        fetchTrainers();
      } catch (err) {
        alert('Error deleting trainer');
      }
    }
  };

  return (
    <div className="admin-card">
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:18}}>
        <h3 className="admin-card-title" style={{margin:0}}>👨‍⚕️ Manage Trainers</h3>
        <button onClick={() => openModal()} className="wn-btn wn-btn-primary" style={{padding:'8px 16px',fontSize:13}}>Add Trainer</button>
      </div>
      <table className="admin-table">
        <thead>
          <tr><th className="admin-th">Name</th><th className="admin-th">Email</th><th className="admin-th">Specialization</th><th className="admin-th">Actions</th></tr>
        </thead>
        <tbody>
          {trainers.map(t => (
            <tr key={t.id}>
              <td className="admin-td" style={{fontWeight:700,color:'var(--text)'}}>{t.fullName}</td>
              <td className="admin-td">{t.email}</td>
              <td className="admin-td">{t.specialization}</td>
              <td className="admin-td" style={{display:'flex',gap:10}}>
                <button onClick={() => openModal(t)} className="wn-btn wn-btn-outline" style={{padding:'4px 10px',fontSize:12}}>Edit</button>
                <button onClick={() => handleDelete(t.id)} className="wn-btn" style={{padding:'4px 10px',fontSize:12,backgroundColor:'#f87171',color:'white',border:'none'}}>Delete</button>
              </td>
            </tr>
          ))}
          {trainers.length === 0 && <tr><td colSpan="4" className="admin-td" style={{textAlign:'center',padding:20,color:'var(--muted)'}}>No trainers found.</td></tr>}
        </tbody>
      </table>

      {showModal && (
        <div style={{position:'fixed',top:0,left:0,right:0,bottom:0,background:'rgba(0,0,0,0.5)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:1000}}>
          <div className="admin-card" style={{width:400,maxWidth:'90%'}}>
            <h3 className="admin-card-title">{editingTrainer ? 'Edit' : 'Add'} Trainer</h3>
            <form onSubmit={handleSave} style={{display:'flex',flexDirection:'column',gap:15}}>
              <input placeholder="Full Name" required value={formData.fullName} onChange={e=>setFormData({...formData, fullName: e.target.value})} className="wn-input" style={{width:'100%',boxSizing:'border-box',padding:'10px',borderRadius:'8px',border:'1px solid rgba(255,255,255,0.1)',background:'rgba(0,0,0,0.2)',color:'white'}} />
              <input type="email" placeholder="Email" required value={formData.email} onChange={e=>setFormData({...formData, email: e.target.value})} className="wn-input" style={{width:'100%',boxSizing:'border-box',padding:'10px',borderRadius:'8px',border:'1px solid rgba(255,255,255,0.1)',background:'rgba(0,0,0,0.2)',color:'white'}} />
              {!editingTrainer && <input type="password" placeholder="Password" required value={formData.password} onChange={e=>setFormData({...formData, password: e.target.value})} className="wn-input" style={{width:'100%',boxSizing:'border-box',padding:'10px',borderRadius:'8px',border:'1px solid rgba(255,255,255,0.1)',background:'rgba(0,0,0,0.2)',color:'white'}} />}
              <input placeholder="Specialization" value={formData.specialization} onChange={e=>setFormData({...formData, specialization: e.target.value})} className="wn-input" style={{width:'100%',boxSizing:'border-box',padding:'10px',borderRadius:'8px',border:'1px solid rgba(255,255,255,0.1)',background:'rgba(0,0,0,0.2)',color:'white'}} />
              <div style={{display:'flex',gap:10,justifyContent:'flex-end',marginTop:10}}>
                <button type="button" onClick={() => setShowModal(false)} className="wn-btn wn-btn-outline">Cancel</button>
                <button type="submit" className="wn-btn wn-btn-primary">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function RegisterPatientComponent() {
  const [formData, setFormData] = useState({ fullName: '', email: '', password: '', role: 'PATIENT' });
  const [status, setStatus] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('Registering...');
    try {
      await registerPatient(formData);
      setStatus('Patient registered successfully!');
      setFormData({ fullName: '', email: '', password: '', role: 'PATIENT' });
    } catch (err) {
      setStatus('Registration failed.');
      console.error(err);
    }
  };

  return (
    <div className="admin-card" style={{maxWidth:500, margin:'0 auto'}}>
      <h3 className="admin-card-title">➕ Register New Patient</h3>
      {status && <div style={{padding:'10px',marginBottom:15,borderRadius:8,background:'rgba(232,98,26,0.1)',color:'var(--orange)'}}>{status}</div>}
      <form onSubmit={handleSubmit} style={{display:'flex',flexDirection:'column',gap:15}}>
        <div>
          <label style={{fontSize:13,color:'var(--muted)',marginBottom:5,display:'block'}}>Full Name</label>
          <input required value={formData.fullName} onChange={e=>setFormData({...formData, fullName:e.target.value})} className="wn-input" style={{width:'100%',boxSizing:'border-box',padding:'10px',borderRadius:'8px',border:'1px solid rgba(255,255,255,0.1)',background:'rgba(0,0,0,0.2)',color:'white'}} />
        </div>
        <div>
          <label style={{fontSize:13,color:'var(--muted)',marginBottom:5,display:'block'}}>Email Address</label>
          <input type="email" required value={formData.email} onChange={e=>setFormData({...formData, email:e.target.value})} className="wn-input" style={{width:'100%',boxSizing:'border-box',padding:'10px',borderRadius:'8px',border:'1px solid rgba(255,255,255,0.1)',background:'rgba(0,0,0,0.2)',color:'white'}} />
        </div>
        <div>
          <label style={{fontSize:13,color:'var(--muted)',marginBottom:5,display:'block'}}>Temporary Password</label>
          <input type="password" required value={formData.password} onChange={e=>setFormData({...formData, password:e.target.value})} className="wn-input" style={{width:'100%',boxSizing:'border-box',padding:'10px',borderRadius:'8px',border:'1px solid rgba(255,255,255,0.1)',background:'rgba(0,0,0,0.2)',color:'white'}} />
        </div>
        <button type="submit" className="wn-btn wn-btn-primary" style={{marginTop:10,width:'100%'}}>Register Patient</button>
      </form>
    </div>
  );
}

/* ── Main Component ── */
function AdminDashboard() {
  const { user } = useAuth();
  const location = useLocation();
  const [active, setActive] = useState(location.state?.activeTab || 'Overview');

  // Sync tab if navigation happens via sidebar in layout
  useEffect(() => {
    if (location.state?.activeTab) {
      setActive(location.state.activeTab);
    }
  }, [location.state?.activeTab]);

  const pageTitles = {
    Overview: { title:'Admin Dashboard',   sub:`Welcome back, ${user?.name || 'Admin'}!` },
    Users:    { title:'User Management',   sub:'View and manage all registered users'     },
    Trainers: { title:'Trainer Management',sub:'Manage doctors and trainers' },
    RegisterPatient: { title:'Register Patient', sub:'Add a new patient manually' },
    Reports:  { title:'Activity Reports',  sub:'Monitor user health activity logs'         },
    Settings: { title:'System Settings',   sub:'Configure platform preferences'            },
  };
  const { title, sub } = pageTitles[active];

  return (
    <div style={{flex:1, display:'flex', flexDirection:'column'}}>
      <div className="admin-topbar">
        <div>
          <h1 className="admin-title">{title}</h1>
          <p className="admin-subtitle">{sub}</p>
        </div>
        <div className="admin-badge">🛡️ Admin</div>
      </div>

      {active === 'Overview' && <Overview user={user} />}
      {active === 'Users'    && <Users />}
      {active === 'Trainers' && <TrainersManager />}
      {active === 'RegisterPatient' && <RegisterPatientComponent />}
      {active === 'Reports'  && <Reports />}
      {active === 'Settings' && <Settings user={user} />}
    </div>
  );
}
export default AdminDashboard;
