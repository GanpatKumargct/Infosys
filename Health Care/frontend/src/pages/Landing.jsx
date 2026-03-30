import { Link } from 'react-router-dom';
import { User, Stethoscope, ClipboardList } from 'lucide-react';

const Landing = () => {
    return (
        <div className="container" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
            <h1 style={{ fontSize: '3rem', color: 'var(--primary)', marginBottom: '1rem' }}>WellNest</h1>
            <p style={{ fontSize: '1.25rem', color: 'var(--text-muted)', marginBottom: '3rem' }}>Smart Health & Habit Companion</p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem', width: '100%' }}>

                {/* Patient Card */}
                <div className="card text-center" style={{ transition: 'transform 0.2s' }}>
                    <User size={48} color="var(--primary)" style={{ marginBottom: '1rem' }} />
                    <h3>Patient</h3>
                    <p style={{ margin: '1rem 0' }}>Track your health, appointments, and habits.</p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <Link to="/login?role=patient" className="btn btn-outline">Login</Link>
                        <Link to="/register/patient" className="btn btn-primary">Register</Link>
                    </div>
                </div>

                {/* Doctor Card */}
                <div className="card text-center">
                    <Stethoscope size={48} color="var(--success)" style={{ marginBottom: '1rem' }} />
                    <h3>Doctor</h3>
                    <p style={{ margin: '1rem 0' }}>Manage patients and view analytics.</p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <Link to="/login?role=doctor" className="btn btn-outline">Login</Link>
                        <Link to="/register/doctor" className="btn btn-primary">Register</Link>
                    </div>
                </div>

                {/* Receptionist Card */}
                <div className="card text-center">
                    <ClipboardList size={48} color="var(--accent)" style={{ marginBottom: '1rem' }} />
                    <h3>Receptionist</h3>
                    <p style={{ margin: '1rem 0' }}>Schedule and manage appointments.</p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <Link to="/login?role=receptionist" className="btn btn-outline">Login</Link>
                        <Link to="/register/receptionist" className="btn btn-primary">Register</Link>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Landing;
