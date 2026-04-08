import { Link } from 'react-router-dom';
import { User, Stethoscope, ClipboardList, HeartPulse, Calendar, FileText, MessageSquare, Activity, Shield, BarChart2, Bell, Award, Github } from 'lucide-react';

/* ─── tiny inline styles reset for this page ─── */
const S = {
    page: {
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: "'Outfit', 'Inter', system-ui, sans-serif",
        background: 'linear-gradient(160deg, #e0f7ff 0%, #fdfdfd 60%, #f0fff8 100%)',
        color: 'var(--text-main)',
    },
    nav: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '1.2rem 2.5rem',
        background: 'rgba(255,255,255,0.85)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(0,119,182,0.1)',
        position: 'sticky',
        top: 0,
        zIndex: 100,
    },
    navBrand: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        fontWeight: 800,
        fontSize: '1.4rem',
        color: 'var(--primary)',
        textDecoration: 'none',
    },
    navLinks: {
        display: 'flex',
        gap: '1.5rem',
        alignItems: 'center',
    },
    navLink: {
        color: 'var(--text-muted)',
        fontWeight: 500,
        fontSize: '0.95rem',
        textDecoration: 'none',
        transition: 'color 0.2s',
    },
};

/* ─── Feature data ─── */
const features = [
    {
        icon: <Calendar size={28} color="#0077b6" />,
        bg: 'rgba(0,119,182,0.1)',
        title: 'Smart Appointment Scheduling',
        desc: 'Patients can book, view and manage appointments with any registered doctor. Staff can approve, reschedule or cancel with real-time status updates.',
    },
    {
        icon: <Activity size={28} color="#06d6a0" />,
        bg: 'rgba(6,214,160,0.1)',
        title: 'Health Logging & Vitals',
        desc: 'Daily health tracking for blood pressure, glucose, weight, sleep and more. Trend graphs and weekly reports help patients and doctors spot patterns early.',
    },
    {
        icon: <FileText size={28} color="#7b2ff7" />,
        bg: 'rgba(123,47,247,0.1)',
        title: 'Medical Records Management',
        desc: 'Secure cloud storage for diagnoses, prescriptions and lab results. Patients can download their history as PDFs; doctors can update records instantly.',
    },
    {
        icon: <MessageSquare size={28} color="#ef233c" />,
        bg: 'rgba(239,35,60,0.1)',
        title: 'Doctor–Patient Messaging',
        desc: 'Built-in real-time messaging system enabling direct, secure communication between patients and their assigned doctors without leaving the platform.',
    },
    {
        icon: <Shield size={28} color="#0077b6" />,
        bg: 'rgba(0,119,182,0.08)',
        title: 'Role-Based Access Control',
        desc: 'Three distinct portals — Patient, Doctor, and Staff/Admin — each with tailored dashboards, permissions and data visibility to protect sensitive information.',
    },
    {
        icon: <BarChart2 size={28} color="#f4a261" />,
        bg: 'rgba(244,162,97,0.1)',
        title: 'Admin Analytics Dashboard',
        desc: 'Comprehensive admin panel to monitor users, appointments, messages and system health. Full CRUD capabilities over every entity in the system.',
    },
    {
        icon: <Bell size={28} color="#06d6a0" />,
        bg: 'rgba(6,214,160,0.1)',
        title: 'Notifications & Reminders',
        desc: 'Automated reminders for upcoming appointments and follow-ups, helping both patients and doctors stay on top of their schedules effortlessly.',
    },
    {
        icon: <Award size={28} color="#7b2ff7" />,
        bg: 'rgba(123,47,247,0.1)',
        title: 'Weekly Health Reports',
        desc: 'Auto-generated weekly summary reports compiling a patient\'s logged metrics into a clean, shareable format for review during consultations.',
    },
];

/* ─── Portal cards ─── */
const portals = [
    {
        icon: <User size={32} color="var(--primary)" />,
        bg: 'var(--secondary)',
        title: 'Patient Portal',
        desc: 'Track your health vitals, manage appointments, log daily habits, and securely download your medical history.',
        loginTo: '/login?role=patient',
        loginLabel: 'Login as Patient',
        registerTo: '/register/patient',
        registerLabel: 'Create Account',
        accent: 'var(--primary)',
    },
    {
        icon: <Stethoscope size={32} color="var(--success)" />,
        bg: 'rgba(6,214,160,0.1)',
        title: 'Doctor Portal',
        desc: 'Manage patient appointments, instantly update statuses, review medical records, and communicate directly.',
        loginTo: '/login?role=doctor',
        loginLabel: 'Login as Doctor',
        registerTo: '/register/doctor',
        registerLabel: 'Apply for Access',
        accent: 'var(--success)',
    },
    {
        icon: <ClipboardList size={32} color="var(--accent)" />,
        bg: 'rgba(245,158,11,0.1)',
        title: 'Staff & Admin',
        desc: 'Coordinate the entire clinic. View all schedules, modify user records safely, and manage the system.',
        loginTo: '/login?role=receptionist',
        loginLabel: 'Staff Login',
        registerTo: '/register/receptionist',
        registerLabel: 'Register Staff',
        accent: '#ef233c',
    },
];

const Landing = () => {
    return (
        <div style={S.page}>

            {/* ── Navbar ── */}
            <nav style={S.nav}>
                <a href="#hero" style={S.navBrand}>
                    <div style={{
                        width: 38, height: 38, borderRadius: 12,
                        background: 'linear-gradient(135deg, var(--primary), var(--primary-light))',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                        <HeartPulse size={22} color="white" />
                    </div>
                    WellNest
                </a>
                <div style={S.navLinks}>
                    <a href="#about" style={S.navLink}>About</a>
                    <a href="#features" style={S.navLink}>Features</a>
                    <a href="#portals" style={S.navLink}>Portals</a>
                    <a href="#team" style={S.navLink}>Team</a>
                    <Link to="/login" style={{
                        background: 'linear-gradient(135deg, var(--primary), var(--primary-light))',
                        color: 'white', padding: '0.5rem 1.25rem',
                        borderRadius: 10, fontWeight: 600, fontSize: '0.9rem', textDecoration: 'none',
                    }}>Sign In</Link>
                </div>
            </nav>

            {/* ── Hero ── */}
            <section id="hero" style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center',
                textAlign: 'center', padding: '5rem 2rem 4rem',
            }}>
                <div style={{
                    width: 90, height: 90, borderRadius: 28,
                    background: 'linear-gradient(135deg, var(--primary), var(--primary-light))',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: '0 16px 40px rgba(0,119,182,0.3)', marginBottom: '2rem',
                }}>
                    <HeartPulse size={46} color="white" />
                </div>
                <h1 style={{ fontSize: '3.6rem', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '1.25rem', lineHeight: 1.15 }}>
                    Welcome to <span style={{ color: 'var(--primary)' }}>WellNest</span>
                </h1>
                <p style={{ fontSize: '1.25rem', color: 'var(--text-muted)', maxWidth: 680, lineHeight: 1.8, marginBottom: '2.5rem' }}>
                    Your all-in-one smart healthcare management platform — connecting patients,
                    doctors and clinical staff in a single secure ecosystem.
                </p>
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                    <a href="#portals" style={{
                        background: 'linear-gradient(135deg, var(--primary), var(--primary-light))',
                        color: 'white', padding: '0.9rem 2rem', borderRadius: 14,
                        fontWeight: 700, fontSize: '1rem', textDecoration: 'none',
                        boxShadow: '0 8px 20px rgba(0,119,182,0.35)',
                    }}>Get Started</a>
                    <a href="#about" style={{
                        border: '2px solid var(--primary)', color: 'var(--primary)',
                        padding: '0.9rem 2rem', borderRadius: 14,
                        fontWeight: 700, fontSize: '1rem', textDecoration: 'none',
                    }}>Learn More</a>
                </div>
            </section>

            {/* ── About / Project Explanation ── */}
            <section id="about" style={{
                padding: '4rem 2rem',
                background: 'rgba(255,255,255,0.7)',
                backdropFilter: 'blur(8px)',
                borderTop: '1px solid rgba(0,119,182,0.08)',
                borderBottom: '1px solid rgba(0,119,182,0.08)',
            }}>
                <div style={{ maxWidth: 1000, margin: '0 auto' }}>
                    {/* Section header */}
                    <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                        <span style={{
                            display: 'inline-block',
                            background: 'rgba(0,119,182,0.1)', color: 'var(--primary)',
                            padding: '0.35rem 1rem', borderRadius: 99,
                            fontWeight: 700, fontSize: '0.8rem', letterSpacing: '0.08em',
                            textTransform: 'uppercase', marginBottom: '1rem',
                        }}>About the Project</span>
                        <h2 style={{ fontSize: '2.4rem', fontWeight: 800, marginBottom: '1rem' }}>
                            What is <span style={{ color: 'var(--primary)' }}>WellNest</span>?
                        </h2>
                        <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', maxWidth: 720, margin: '0 auto', lineHeight: 1.8 }}>
                            WellNest is a full-stack digital healthcare management platform developed as part of the
                            <strong style={{ color: 'var(--primary)' }}> Infosys Springboard Internship Program</strong>.
                            It digitises the end-to-end workflow of a modern clinic — from patient registration to appointment scheduling,
                            real-time doctor–patient communication and AI-assisted health analytics.
                        </p>
                    </div>

                    {/* Three pillars */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.75rem' }}>
                        {[
                            {
                                emoji: '🏥',
                                title: 'What it does',
                                body: 'WellNest bridges the gap between patients, healthcare providers and administrative staff. It replaces paper-based processes with a responsive, cloud-ready web application accessible from any device.',
                                accent: '#0077b6',
                            },
                            {
                                emoji: '⚙️',
                                title: 'How it works',
                                body: 'Built on a Spring Boot REST API backend and a React + Vite frontend, WellNest employs JWT-based authentication, role-based access control, and a relational MySQL database to ensure data integrity and security.',
                                accent: '#06d6a0',
                            },
                            {
                                emoji: '🎯',
                                title: 'Who it is for',
                                body: 'Patients needing 24/7 health tracking, doctors requiring efficient appointment and record management, and clinic administrators who need full operational visibility — all in one platform.',
                                accent: '#7b2ff7',
                            },
                        ].map((p, i) => (
                            <div key={i} style={{
                                background: 'white', borderRadius: 20, padding: '2rem',
                                boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
                                border: `1px solid ${p.accent}22`,
                                transition: 'transform 0.3s, box-shadow 0.3s',
                            }}
                                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 32px rgba(0,0,0,0.1)'; }}
                                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 24px rgba(0,0,0,0.06)'; }}
                            >
                                <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>{p.emoji}</div>
                                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.75rem', color: p.accent }}>{p.title}</h3>
                                <p style={{ color: 'var(--text-muted)', lineHeight: 1.75, fontSize: '0.95rem' }}>{p.body}</p>
                            </div>
                        ))}
                    </div>

                    {/* Tech Stack strip */}
                    <div style={{
                        marginTop: '3rem', padding: '1.5rem 2rem',
                        background: 'linear-gradient(135deg, rgba(0,119,182,0.07), rgba(6,214,160,0.07))',
                        borderRadius: 16, border: '1px solid rgba(0,119,182,0.12)',
                        display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: '1rem',
                    }}>
                        <span style={{ fontWeight: 700, color: 'var(--primary)', marginRight: '0.5rem' }}>Tech Stack:</span>
                        {['React 18 + Vite', 'Spring Boot 3', 'MySQL', 'JWT Auth', 'REST API', 'Lucide Icons'].map(t => (
                            <span key={t} style={{
                                background: 'white', padding: '0.35rem 0.9rem', borderRadius: 99,
                                fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.06)', border: '1px solid var(--border)',
                            }}>{t}</span>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Features ── */}
            <section id="features" style={{ padding: '5rem 2rem' }}>
                <div style={{ maxWidth: 1100, margin: '0 auto' }}>
                    <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                        <span style={{
                            display: 'inline-block',
                            background: 'rgba(6,214,160,0.12)', color: '#06d6a0',
                            padding: '0.35rem 1rem', borderRadius: 99,
                            fontWeight: 700, fontSize: '0.8rem', letterSpacing: '0.08em',
                            textTransform: 'uppercase', marginBottom: '1rem',
                        }}>Platform Capabilities</span>
                        <h2 style={{ fontSize: '2.4rem', fontWeight: 800, marginBottom: '1rem' }}>
                            Everything you need, <span style={{ color: 'var(--primary)' }}>all in one place</span>
                        </h2>
                        <p style={{ color: 'var(--text-muted)', maxWidth: 600, margin: '0 auto', lineHeight: 1.8 }}>
                            WellNest packs a comprehensive suite of tools to digitise every aspect of clinic management and personal health tracking.
                        </p>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
                        {features.map((f, i) => (
                            <div key={i} style={{
                                background: 'white', borderRadius: 18, padding: '1.75rem',
                                boxShadow: '0 4px 20px rgba(0,0,0,0.05)', border: '1px solid var(--border)',
                                transition: 'transform 0.3s, box-shadow 0.3s',
                                animationDelay: `${i * 0.05}s`,
                            }}
                                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.boxShadow = '0 16px 36px rgba(0,0,0,0.1)'; }}
                                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.05)'; }}
                            >
                                <div style={{
                                    width: 52, height: 52, borderRadius: 14, background: f.bg,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    marginBottom: '1.1rem',
                                }}>{f.icon}</div>
                                <h4 style={{ fontWeight: 700, marginBottom: '0.5rem', fontSize: '1rem' }}>{f.title}</h4>
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', lineHeight: 1.7 }}>{f.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Portals ── */}
            <section id="portals" style={{
                padding: '5rem 2rem',
                background: 'rgba(255,255,255,0.6)',
                backdropFilter: 'blur(8px)',
                borderTop: '1px solid rgba(0,119,182,0.08)',
            }}>
                <div style={{ maxWidth: 1050, margin: '0 auto' }}>
                    <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                        <span style={{
                            display: 'inline-block',
                            background: 'rgba(0,119,182,0.1)', color: 'var(--primary)',
                            padding: '0.35rem 1rem', borderRadius: 99,
                            fontWeight: 700, fontSize: '0.8rem', letterSpacing: '0.08em',
                            textTransform: 'uppercase', marginBottom: '1rem',
                        }}>Access Portals</span>
                        <h2 style={{ fontSize: '2.4rem', fontWeight: 800, marginBottom: '1rem' }}>
                            Choose your <span style={{ color: 'var(--primary)' }}>portal</span>
                        </h2>
                        <p style={{ color: 'var(--text-muted)', maxWidth: 560, margin: '0 auto', lineHeight: 1.8 }}>
                            WellNest provides tailored experiences for every role in the healthcare pathway.
                        </p>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
                        {portals.map((p, i) => (
                            <div key={i} className="card text-center" style={{
                                padding: '2.5rem 2rem',
                                background: 'rgba(255,255,255,0.9)',
                                backdropFilter: 'blur(10px)',
                                border: '1px solid rgba(255,255,255,0.7)',
                                borderRadius: 24,
                                boxShadow: '0 20px 40px rgba(0,0,0,0.05)',
                            }}>
                                <div style={{
                                    width: 64, height: 64, margin: '0 auto 1.5rem',
                                    background: p.bg, borderRadius: '50%',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                }}>{p.icon}</div>
                                <h3 style={{ fontSize: '1.45rem', color: 'var(--text-main)', marginBottom: '1rem' }}>{p.title}</h3>
                                <p style={{ margin: '0 0 2rem', color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.6 }}>{p.desc}</p>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                    <Link to={p.loginTo} className="btn btn-primary" style={{
                                        padding: '0.8rem', borderRadius: 12, fontWeight: 600,
                                        ...(p.accent !== 'var(--primary)' ? { background: p.accent, borderColor: p.accent } : {}),
                                    }}>{p.loginLabel}</Link>
                                    <Link to={p.registerTo} className="btn btn-outline" style={{ padding: '0.8rem', borderRadius: 12, fontWeight: 600 }}>{p.registerLabel}</Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Team ── */}
            <section id="team" style={{ padding: '5rem 2rem', background: 'linear-gradient(135deg, rgba(0,119,182,0.05), rgba(6,214,160,0.05))' }}>
                <div style={{ maxWidth: 900, margin: '0 auto', textAlign: 'center' }}>
                    <span style={{
                        display: 'inline-block',
                        background: 'rgba(123,47,247,0.1)', color: '#7b2ff7',
                        padding: '0.35rem 1rem', borderRadius: 99,
                        fontWeight: 700, fontSize: '0.8rem', letterSpacing: '0.08em',
                        textTransform: 'uppercase', marginBottom: '1rem',
                    }}>The Team</span>
                    <h2 style={{ fontSize: '2.4rem', fontWeight: 800, marginBottom: '1rem' }}>
                        Built with 💙 by <span style={{ color: 'var(--primary)' }}>Team 3</span>
                    </h2>
                    <p style={{ color: 'var(--text-muted)', maxWidth: 580, margin: '0 auto 3rem', lineHeight: 1.8 }}>
                        Developed during the <strong>Infosys Springboard Internship Program</strong> — a team effort to build a
                        production-grade healthcare platform from the ground up.
                    </p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '1.5rem' }}>
                        {[
                            { name: 'Ganpat Kumar', role: 'Full-Stack Developer', initials: 'GK', color: '#0077b6' },
                            { name: 'Priyal Gandi', role: 'Full-Stack Developer', initials: 'PG', color: '#06d6a0' },
                            { name: 'Vishnu Priya', role: 'Full-Stack Developer', initials: 'VP', color: '#7b2ff7' },
                            { name: 'Sumit Brooker', role: 'Full-Stack Developer', initials: 'SB', color: '#ef233c' },
                        ].map((m, i) => (
                            <div key={i} style={{
                                background: 'white', borderRadius: 20, padding: '1.75rem 2rem',
                                boxShadow: '0 4px 24px rgba(0,0,0,0.07)', border: '1px solid var(--border)',
                                minWidth: 170, transition: 'transform 0.3s',
                            }}
                                onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-5px)'}
                                onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
                            >
                                <div style={{
                                    width: 56, height: 56, borderRadius: '50%',
                                    background: `${m.color}20`, border: `2px solid ${m.color}`,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    margin: '0 auto 1rem',
                                    fontSize: '1.1rem', fontWeight: 800, color: m.color,
                                }}>{m.initials}</div>
                                <p style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '0.25rem' }}>{m.name}</p>
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>{m.role}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Footer ── */}
            <footer style={{
                background: 'linear-gradient(135deg, #0d1b2a 0%, #03045e 100%)',
                color: 'rgba(255,255,255,0.85)',
                padding: '3rem 2rem 2rem',
                marginTop: 'auto',
            }}>
                <div style={{ maxWidth: 1000, margin: '0 auto' }}>

                    {/* Top row */}
                    <div style={{
                        display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between',
                        gap: '2rem', marginBottom: '2.5rem',
                    }}>
                        {/* Brand */}
                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.75rem' }}>
                                <div style={{
                                    width: 36, height: 36, borderRadius: 10,
                                    background: 'linear-gradient(135deg, #0077b6, #00b4d8)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                }}>
                                    <HeartPulse size={20} color="white" />
                                </div>
                                <span style={{ fontWeight: 800, fontSize: '1.2rem', color: 'white' }}>WellNest</span>
                            </div>
                            <p style={{ fontSize: '0.88rem', color: 'rgba(255,255,255,0.55)', maxWidth: 260, lineHeight: 1.7 }}>
                                Smart healthcare management platform — connecting patients, doctors and staff in one secure ecosystem.
                            </p>
                        </div>

                        {/* Quick Links */}
                        <div>
                            <p style={{ fontWeight: 700, marginBottom: '0.75rem', color: '#00b4d8', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.07em' }}>Quick Access</p>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                {[
                                    { label: 'Patient Login', to: '/login?role=patient' },
                                    { label: 'Doctor Login', to: '/login?role=doctor' },
                                    { label: 'Staff Login', to: '/login?role=receptionist' },
                                    { label: 'Register as Patient', to: '/register/patient' },
                                ].map(l => (
                                    <Link key={l.label} to={l.to} style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.88rem', textDecoration: 'none', transition: 'color 0.2s' }}
                                        onMouseEnter={e => e.currentTarget.style.color = '#00b4d8'}
                                        onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.6)'}
                                    >{l.label}</Link>
                                ))}
                            </div>
                        </div>

                        {/* Internship Credit */}
                        <div style={{
                            background: 'rgba(255,255,255,0.06)', borderRadius: 16,
                            padding: '1.25rem 1.5rem', border: '1px solid rgba(255,255,255,0.1)',
                            maxWidth: 280,
                        }}>
                            <p style={{ fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#00b4d8', marginBottom: '0.5rem' }}>
                                🎓 Internship Project
                            </p>
                            <p style={{ fontSize: '0.88rem', color: 'rgba(255,255,255,0.7)', lineHeight: 1.6, marginBottom: '0.75rem' }}>
                                Built during the <strong style={{ color: 'white' }}>Infosys Springboard Internship</strong> — Team 3
                            </p>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                                {['Ganpat Kumar', 'Priyal Gandi', 'Vishnu Priya', 'Sumit Brooker'].map(n => (
                                    <span key={n} style={{ fontSize: '0.84rem', color: 'rgba(255,255,255,0.6)' }}>✦ {n}</span>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Divider */}
                    <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1.5rem', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '0.75rem' }}>
                        <p style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.4)' }}>
                            © 2025 WellNest. Built for educational purposes during Infosys Springboard Internship — Team 3.
                        </p>
                        <p style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.4)' }}>
                            Made with 💙 by Ganpat Kumar · Priyal Gandi · Vishnu Priya · Sumit Brooker
                        </p>
                    </div>
                </div>
            </footer>

        </div>
    );
};

export default Landing;
