import { Link } from 'react-router-dom';
import { User, Stethoscope, ClipboardList, Shield, Activity, HeartPulse } from 'lucide-react';

const Landing = () => {
    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            background: 'linear-gradient(135deg, var(--secondary) 0%, var(--background) 100%)',
            padding: '4rem 2rem',
            fontFamily: "'Inter', sans-serif"
        }}>
            <div style={{
                textAlign: 'center',
                maxWidth: '800px',
                marginBottom: '4rem'
            }}>
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
                    <div style={{
                        width: '80px', height: '80px', borderRadius: '24px', background: 'linear-gradient(135deg, var(--primary), var(--primary-light))',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 10px 25px rgba(0, 119, 182, 0.3)'
                    }}>
                        <HeartPulse size={40} color="white" />
                    </div>
                </div>
                <h1 style={{ fontSize: '3.5rem', fontWeight: '800', color: 'var(--text-main)', marginBottom: '1.5rem', letterSpacing: '-0.02em' }}>
                    Welcome to <span style={{ color: 'var(--primary)' }}>WellNest</span>
                </h1>
                <p style={{ fontSize: '1.25rem', color: 'var(--text)', lineHeight: '1.8', marginBottom: '1rem', fontWeight: '400' }}>
                    WellNest is your all-in-one smart healthcare and habit companion. We seamlessly connect patients to medical professionals while equipping you with the daily tracking tools you need to optimize your lifestyle. 
                </p>
                <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', lineHeight: '1.6' }}>
                    From scheduling appointments to logging vital Health Metrics and accessing cloud medical records—experience a streamlined, responsive, and secure healthcare journey centered entirely around your well-being.
                </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem', width: '100%', maxWidth: '1000px' }}>

                {/* Patient Card */}
                <div className="card text-center" style={{ padding: '2.5rem 2rem', background: 'rgba(255, 255, 255, 0.8)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.6)', borderRadius: '24px', boxShadow: '0 20px 40px rgba(0,0,0,0.05)', transition: 'transform 0.3s ease, box-shadow 0.3s ease' }}>
                    <div style={{ width: '64px', height: '64px', margin: '0 auto 1.5rem', background: 'var(--secondary)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <User size={32} color="var(--primary)" />
                    </div>
                    <h3 style={{ fontSize: '1.5rem', color: 'var(--text-main)', marginBottom: '1rem' }}>Patient Portal</h3>
                    <p style={{ margin: '0 0 2rem 0', color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: '1.5' }}>Track your health vitals, manage appointments, log daily habits, and securely download your medical history.</p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        <Link to="/login?role=patient" className="btn btn-primary" style={{ padding: '0.8rem', borderRadius: '12px', fontWeight: '600' }}>Login as Patient</Link>
                        <Link to="/register/patient" className="btn btn-outline" style={{ padding: '0.8rem', borderRadius: '12px', fontWeight: '600' }}>Create Account</Link>
                    </div>
                </div>

                {/* Doctor Card */}
                <div className="card text-center" style={{ padding: '2.5rem 2rem', background: 'rgba(255, 255, 255, 0.8)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.6)', borderRadius: '24px', boxShadow: '0 20px 40px rgba(0,0,0,0.05)', transition: 'transform 0.3s ease, box-shadow 0.3s ease' }}>
                    <div style={{ width: '64px', height: '64px', margin: '0 auto 1.5rem', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Stethoscope size={32} color="var(--success)" />
                    </div>
                    <h3 style={{ fontSize: '1.5rem', color: 'var(--text-main)', marginBottom: '1rem' }}>Doctor Portal</h3>
                    <p style={{ margin: '0 0 2rem 0', color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: '1.5' }}>Manage patient appointments, instantly update statuses, review medical records, and communicate directly.</p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        <Link to="/login?role=doctor" className="btn btn-primary" style={{ padding: '0.8rem', borderRadius: '12px', fontWeight: '600', background: 'var(--success)', borderColor: 'var(--success)' }}>Login as Doctor</Link>
                        <Link to="/register/doctor" className="btn btn-outline" style={{ padding: '0.8rem', borderRadius: '12px', fontWeight: '600' }}>Apply for Access</Link>
                    </div>
                </div>

                {/* Receptionist Card */}
                <div className="card text-center" style={{ padding: '2.5rem 2rem', background: 'rgba(255, 255, 255, 0.8)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.6)', borderRadius: '24px', boxShadow: '0 20px 40px rgba(0,0,0,0.05)', transition: 'transform 0.3s ease, box-shadow 0.3s ease' }}>
                    <div style={{ width: '64px', height: '64px', margin: '0 auto 1.5rem', background: 'rgba(245, 158, 11, 0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <ClipboardList size={32} color="var(--accent)" />
                    </div>
                    <h3 style={{ fontSize: '1.5rem', color: 'var(--text-main)', marginBottom: '1rem' }}>Staff & Admin</h3>
                    <p style={{ margin: '0 0 2rem 0', color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: '1.5' }}>Coordinate the entire clinic. View all schedules, modify user records safely, and manage the system.</p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        <Link to="/login?role=receptionist" className="btn btn-primary" style={{ padding: '0.8rem', borderRadius: '12px', fontWeight: '600', background: 'var(--accent)', borderColor: 'var(--accent)' }}>Staff Login</Link>
                        <Link to="/register/receptionist" className="btn btn-outline" style={{ padding: '0.8rem', borderRadius: '12px', fontWeight: '600' }}>Register Staff</Link>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Landing;
