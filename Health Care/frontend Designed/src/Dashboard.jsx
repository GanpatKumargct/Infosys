import { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { useNavigate } from 'react-router-dom';
import { getUserProfile, downloadMyHistory } from './services/api';
import Chatbot from './Chatbot';
import './index.css';

const CARDS = [
  { title:'Hydration',      value:'1.5',   goal:'2.5 L',         icon:'💧', grad:'linear-gradient(135deg,#0284c7,#38bdf8)', glow:'rgba(56,189,248,0.30)',  route:'/hydration' },
  { title:'Walking',        value:'6,500', goal:'10,000 steps',  icon:'🚶', grad:'linear-gradient(135deg,#15803d,#4ade80)', glow:'rgba(74,222,128,0.28)', route:'/walking'   },
  { title:'Yoga',           value:'30',    goal:'45 mins',       icon:'🧘', grad:'linear-gradient(135deg,#7c3aed,#a855f7)', glow:'rgba(168,85,247,0.28)', route:'/yoga'      },
  { title:'Diet',           value:'1,640', goal:'2,000 kcal',    icon:'🥗', grad:'linear-gradient(135deg,#92400e,#f59e0b)', glow:'rgba(251,191,36,0.28)',  route:'/diet'      },
  { title:'BMI Calculator', value:'22.4',  goal:'Normal',        icon:'⚖️', grad:'linear-gradient(135deg,#e8621a,#7c3aed)', glow:'rgba(232,98,26,0.25)',  route:'/bmi'       },
  { title:'View Trainers',  value:'6',     goal:'Expert Coaches',icon:'🏋️',grad:'linear-gradient(135deg,#be185d,#7c3aed)', glow:'rgba(190,24,93,0.25)',  route:'/trainers'  },
];

const WEEKLY = [
  { day:'Mon', steps:7200,  water:2.0, yoga:30, cal:1800, score:72 },
  { day:'Tue', steps:9400,  water:2.3, yoga:45, cal:2050, score:88 },
  { day:'Wed', steps:5100,  water:1.5, yoga:0,  cal:1600, score:55 },
  { day:'Thu', steps:8800,  water:2.5, yoga:20, cal:1950, score:82 },
  { day:'Fri', steps:6500,  water:1.8, yoga:30, cal:1640, score:70 },
  { day:'Sat', steps:11000, water:3.0, yoga:60, cal:2200, score:96 },
  { day:'Sun', steps:4500,  water:1.2, yoga:15, cal:1500, score:48 },
];

const TODAY_LOGS = [
  { time:'08:00 AM', icon:'🥣', label:'Breakfast — Oatmeal',       detail:'150 kcal · P:5g · C:27g',   color:'#fbbf24' },
  { time:'09:30 AM', icon:'🚶', label:'Morning Walk',               detail:'3,200 steps · 30 min',       color:'#4ade80' },
  { time:'10:30 AM', icon:'💧', label:'Drank Water',                detail:'500 ml logged',              color:'#38bdf8' },
  { time:'01:00 PM', icon:'🍛', label:'Lunch — Dal & Rice',         detail:'320 kcal · P:12g',           color:'#fbbf24' },
  { time:'04:00 PM', icon:'🧘', label:'Yoga Session — Warrior Pose',detail:'30 min · Intermediate',      color:'#a855f7' },
  { time:'06:00 PM', icon:'🚶', label:'Evening Walk',               detail:'3,300 steps · 25 min',       color:'#4ade80' },
  { time:'07:30 PM', icon:'💧', label:'Drank Water',                detail:'300 ml logged',              color:'#38bdf8' },
];

const maxScore = Math.max(...WEEKLY.map(d => d.score));

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [weekMetric, setWeekMetric] = useState('score');
  const [bmiValue, setBmiValue] = useState('22.4'); // Default fallback
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  useEffect(() => {
    getUserProfile().then(res => {
      const data = res.data;
      if (data.weight) localStorage.setItem('weight', data.weight);
      if (data.height) {
        localStorage.setItem('height', data.height);
        if (data.weight) {
            setBmiValue((data.weight / ((data.height/100)**2)).toFixed(1));
        }
      }
      if (data.bloodGlucose) localStorage.setItem('bloodGlucose', data.bloodGlucose);
      if (data.bloodPressure) localStorage.setItem('bloodPressure', data.bloodPressure);
      if (data.heartRate) localStorage.setItem('heartRate', data.heartRate);
      if (data.fitnessGoal) localStorage.setItem('fitnessGoal', data.fitnessGoal);
      if (data.activityLevel) localStorage.setItem('activityLevel', data.activityLevel);
    }).catch(err => {
      console.log('Using local profile data or no profile found');
    });
  }, []);

  // Update cards dynamically based on state
  const DYNAMIC_CARDS = CARDS.map(c => 
    c.title === 'BMI Calculator' ? { ...c, value: bmiValue } : c
  );

  const metricConfig = {
    score: { label:'Health Score', max:100,   unit:'',    color:'#f4894a' },
    steps: { label:'Steps',        max:12000,  unit:'',    color:'#4ade80' },
    water: { label:'Water (L)',    max:3.5,    unit:'L',   color:'#38bdf8' },
    yoga:  { label:'Yoga (min)',   max:70,     unit:'min', color:'#a855f7' },
    cal:   { label:'Calories',     max:2500,   unit:'cal', color:'#fbbf24' },
  };
  const mc = metricConfig[weekMetric];

  return (
    <div className="wn-dashboard">
      <div style={{position:'absolute',top:-150,left:-100,width:500,height:500,background:'radial-gradient(circle,rgba(232,98,26,0.07) 0%,transparent 70%)',borderRadius:'50%',pointerEvents:'none'}}/>
      <div style={{position:'absolute',bottom:-100,right:-80,width:380,height:380,background:'radial-gradient(circle,rgba(124,58,237,0.08) 0%,transparent 70%)',borderRadius:'50%',pointerEvents:'none'}}/>

      <div className="wn-dashboard-inner">

        {/* Welcome banner */}
        <div className="wn-welcome-banner">
          <div style={{position:'absolute',right:50,top:-60,width:200,height:200,background:'radial-gradient(circle,rgba(232,98,26,0.12) 0%,transparent 70%)',borderRadius:'50%',pointerEvents:'none'}}/>
          <div style={{position:'relative',zIndex:1}}>
            <h2 className="wn-welcome-title">{greeting}, {user?.name?.split(' ')[0] || 'User'}! 👋</h2>
            <p className="wn-welcome-sub">Here is your daily health overview. Stay consistent!</p>
          </div>
          <div className="wn-streak-badge" style={{position:'relative',zIndex:1}}>
            <div className="wn-streak-fire">🔥</div>
            <div className="wn-streak-num">5</div>
            <div className="wn-streak-label">Day Streak</div>
          </div>
        </div>

        {/* Quick nav cards */}
        <div className="wn-stats-grid">
          {DYNAMIC_CARDS.map((c, i) => (
            <div key={c.title} className="wn-stat-card" style={{animationDelay:`${i*0.08}s`}}
              onClick={() => navigate(c.route)} role="button" tabIndex={0}
              onKeyDown={e => e.key==='Enter' && navigate(c.route)}
              onMouseEnter={e => { e.currentTarget.style.transform='translateY(-7px) scale(1.02)'; e.currentTarget.style.borderColor='rgba(232,98,26,0.38)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform=''; e.currentTarget.style.borderColor='rgba(232,98,26,0.10)'; }}
            >
              <div className="wn-stat-icon" style={{background:c.grad,boxShadow:`0 6px 22px ${c.glow}`}}>{c.icon}</div>
              <div style={{flex:1}}>
                <div className="wn-stat-label">{c.title}</div>
                <div><span className="wn-stat-val">{c.value}</span><span className="wn-stat-goal"> / {c.goal}</span></div>
              </div>
              <div className="wn-stat-arrow">➔</div>
            </div>
          ))}
        </div>

        {/* ── Daily Activity + Weekly Report ── */}
        <div className="dash-two-col">

          {/* Daily Activity Timeline */}
          <div className="dash-panel">
            <div className="dash-panel-header">
              <span className="dash-panel-title">📅 Today's Activity</span>
              <button 
                  onClick={async () => {
                      try {
                          const res = await downloadMyHistory();
                          const url = window.URL.createObjectURL(new Blob([res.data]));
                          const a = document.createElement('a');
                          a.href = url;
                          a.download = 'Medical_History.pdf';
                          a.click();
                      } catch (err) { alert('Failed to download PDF'); }
                  }}
                  style={{padding:'4px 12px', background:'var(--primary)', color:'white', border:'none', borderRadius:'6px', cursor:'pointer', fontSize:'0.8rem'}}
              >
                  📥 Download Report
              </button>
            </div>

            {/* Today summary pills */}
            <div className="dash-today-pills">
              {[
                { icon:'🚶', val:'6,500', label:'Steps',   color:'#4ade80' },
                { icon:'💧', val:'1.5L',  label:'Water',   color:'#38bdf8' },
                { icon:'🧘', val:'30m',   label:'Yoga',    color:'#a855f7' },
                { icon:'🔥', val:'482',   label:'Cal out', color:'#f4894a' },
              ].map(p => (
                <div key={p.label} className="dash-pill" style={{borderColor:`${p.color}44`}}>
                  <span style={{fontSize:16}}>{p.icon}</span>
                  <span style={{color:p.color,fontWeight:800,fontSize:14}}>{p.val}</span>
                  <span style={{color:'var(--muted)',fontSize:10}}>{p.label}</span>
                </div>
              ))}
            </div>

            {/* Timeline */}
            <div className="dash-timeline">
              {TODAY_LOGS.map((log, i) => (
                <div key={i} className="dash-timeline-item">
                  <div className="dash-timeline-time">{log.time}</div>
                  <div className="dash-timeline-dot" style={{background:log.color, boxShadow:`0 0 8px ${log.color}88`}}/>
                  <div className="dash-timeline-line" style={{background: i === TODAY_LOGS.length-1 ? 'transparent' : 'rgba(232,98,26,0.12)'}}/>
                  <div className="dash-timeline-content">
                    <div className="dash-timeline-icon">{log.icon}</div>
                    <div>
                      <div className="dash-timeline-label">{log.label}</div>
                      <div className="dash-timeline-detail">{log.detail}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Weekly Report */}
          <div className="dash-panel">
            <div className="dash-panel-header">
              <span className="dash-panel-title">📈 Weekly Report</span>
              <span className="dash-panel-date">This Week</span>
            </div>

            {/* Metric selector */}
            <div className="dash-metric-tabs">
              {Object.entries(metricConfig).map(([key, cfg]) => (
                <button key={key} onClick={() => setWeekMetric(key)}
                  className={`dash-metric-tab${weekMetric===key?' active':''}`}
                  style={weekMetric===key?{borderColor:cfg.color,color:cfg.color,background:`${cfg.color}18`}:{}}>
                  {cfg.label}
                </button>
              ))}
            </div>

            {/* Bar chart */}
            <div className="dash-bar-chart">
              {WEEKLY.map(d => {
                const val = d[weekMetric];
                const pct = Math.min(100, Math.round((val / mc.max) * 100));
                return (
                  <div key={d.day} className="dash-bar-col">
                    <div className="dash-bar-val" style={{color:mc.color}}>{val}{mc.unit==='L'?'L':mc.unit==='min'?'m':mc.unit==='cal'?'':''}</div>
                    <div className="dash-bar-wrap">
                      <div className="dash-bar-fill" style={{height:`${pct}%`, background:`linear-gradient(180deg,${mc.color},${mc.color}88)`, boxShadow:`0 0 8px ${mc.color}55`}}/>
                    </div>
                    <div className="dash-bar-day">{d.day}</div>
                  </div>
                );
              })}
            </div>

            {/* Weekly summary stats */}
            <div className="dash-week-summary">
              {[
                { label:'Avg Score',  val: Math.round(WEEKLY.reduce((s,d)=>s+d.score,0)/7)+'%', color:'#f4894a' },
                { label:'Total Steps',val: WEEKLY.reduce((s,d)=>s+d.steps,0).toLocaleString(),  color:'#4ade80' },
                { label:'Best Day',   val: WEEKLY.reduce((a,b)=>a.score>b.score?a:b).day,        color:'#a855f7' },
                { label:'Yoga Time',  val: WEEKLY.reduce((s,d)=>s+d.yoga,0)+' min',              color:'#38bdf8' },
              ].map(s => (
                <div key={s.label} className="dash-week-stat">
                  <div className="dash-week-stat-val" style={{color:s.color}}>{s.val}</div>
                  <div className="dash-week-stat-label">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

{/* Trainer Matcher CTA */}
        <div className="dash-matcher-cta" onClick={() => navigate('/matcher')} role="button" tabIndex={0}
          onMouseEnter={e => e.currentTarget.style.transform='translateY(-5px)'}
          onMouseLeave={e => e.currentTarget.style.transform=''}
        >
          <div className="dash-matcher-content">
            <span className="dash-matcher-badge">NEW</span>
            <h3>Stop Guessing. Start Matching. 🎯</h3>
            <p>Our smart algorithm finds the best trainers for your specific fitness goals in seconds.</p>
            <button className="dash-matcher-btn">Find My Perfect Trainer</button>
          </div>
          <div className="dash-matcher-icon">🕵️‍♂️</div>
        </div>

        {/* Bottom badge */}
        <div className="wn-badge">
          <div className="wn-badge-circle">
            <span className="wn-badge-sm">getting</span>
            <span className="wn-badge-lg">HEALTHIER</span>
            <span className="wn-badge-sm">everyday</span>
          </div>
          <p className="wn-badge-txt">Every step counts. Stay consistent and your results will follow.</p>
        </div>
      </div>
      <Chatbot />
    </div>
  );
}
