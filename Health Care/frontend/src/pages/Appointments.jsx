import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    getPatientAppointments, 
    getDoctorAppointments, 
    getDoctors,
    getDoctorsList, 
    getPatientsByRole,
    receptionistCreateAppointment,
    patientBookAppointment,
    getAllAppointments,
    confirmAppointment,
    deleteDoctorAppointment,
    updateDoctorAppointment
} from '../services/api';
import { Calendar, Clock, User, Plus, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

const Appointments = () => {
    const navigate = useNavigate();
    const [role, setRole] = useState('');
    const [appointments, setAppointments] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showBookingForm, setShowBookingForm] = useState(false);
    const [formData, setFormData] = useState({
        patientId: '',
        doctorId: '',
        appointmentTime: '',
        notes: ''
    });
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        const userRole = localStorage.getItem('role');
        setRole(userRole);
        fetchData(userRole);
    }, []);

    const fetchData = async (userRole) => {
        setLoading(true);
        try {
            if (userRole === 'PATIENT') {
                const res = await getPatientAppointments();
                setAppointments(res.data);
                const docRes = await getDoctors();
                setDoctors(docRes.data);
            } else if (userRole === 'DOCTOR') {
                const res = await getDoctorAppointments();
                setAppointments(res.data);
            } else if (userRole === 'RECEPTIONIST') {
                const res = await getAllAppointments();
                setAppointments(res.data);
                const docRes = await getDoctorsList();
                const patRes = await getPatientsByRole();
                setDoctors(docRes.data);
                setPatients(patRes.data);
            }
        } catch (err) {
            console.error('Error fetching appointment data', err);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleBooking = async (e) => {
        e.preventDefault();
        setMessage({ type: '', text: '' });
        try {
            const dId = formData.doctorId;
            
            if (role === 'RECEPTIONIST') {
                await receptionistCreateAppointment(formData.patientId, dId, {
                    appointmentTime: formData.appointmentTime,
                    notes: formData.notes
                });
            } else {
                await patientBookAppointment(dId, {
                    appointmentTime: formData.appointmentTime,
                    notes: formData.notes
                });
            }
            
            setMessage({ type: 'success', text: 'Appointment booked successfully!' });
            setShowBookingForm(false);
            fetchData(role);
        } catch (err) {
            setMessage({ type: 'error', text: 'Failed to book appointment. Please check the details.' });
        }
    };

    const handleConfirm = async (id) => {
        try {
            await confirmAppointment(id);
            setMessage({ type: 'success', text: 'Appointment confirmed!' });
            fetchData(role);
        } catch (err) {
            setMessage({ type: 'error', text: 'Failed to confirm appointment.' });
        }
    };

    const [editingAppointment, setEditingAppointment] = useState(null);
    const [editMode, setEditMode] = useState(false);

    const handleEdit = (appointment) => {
        setEditingAppointment(appointment);
        setFormData({
            patientId: appointment.patient.id,
            doctorId: appointment.doctor.id,
            appointmentTime: appointment.appointmentTime.substring(0, 16), // Format for datetime-local
            notes: appointment.notes || ''
        });
        setEditMode(true);
        setShowBookingForm(true);
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        setMessage({ type: '', text: '' });
        try {
            await updateDoctorAppointment(editingAppointment.id, {
                appointmentTime: formData.appointmentTime,
                notes: formData.notes
            });
            setMessage({ type: 'success', text: 'Appointment updated successfully!' });
            setEditMode(false);
            setEditingAppointment(null);
            setShowBookingForm(false);
            fetchData(role);
        } catch (err) {
            setMessage({ type: 'error', text: 'Failed to update appointment.' });
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to cancel this appointment?')) return;
        try {
            await deleteDoctorAppointment(id);
            setMessage({ type: 'success', text: 'Appointment cancelled!' });
            fetchData(role);
        } catch (err) {
            setMessage({ type: 'error', text: 'Failed to cancel appointment.' });
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'SCHEDULED': return <Clock size={18} className="text-primary" />;
            case 'COMPLETED': return <CheckCircle size={18} style={{ color: 'var(--success)' }} />;
            case 'CANCELLED': return <XCircle size={18} style={{ color: 'var(--accent)' }} />;
            default: return <AlertCircle size={18} />;
        }
    };

    return (
        <div className="container mt-4">
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h1 style={{ color: 'var(--primary)' }}>Appointments</h1>
                    <p style={{ color: 'var(--text-muted)' }}>Manage and view your medical schedules</p>
                </div>
                <button onClick={() => navigate('/dashboard')} className="btn btn-outline">Back to Dashboard</button>
            </header>

            {message.text && (
                <div style={{ 
                    padding: '1rem', 
                    borderRadius: 'var(--radius-md)', 
                    marginBottom: '1.5rem',
                    background: message.type === 'success' ? '#e6fffa' : '#fff5f5',
                    border: `1px solid ${message.type === 'success' ? 'var(--success)' : 'var(--accent)'}`,
                    color: message.type === 'success' ? '#2c7a7b' : '#c53030',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                }}>
                    {message.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
                    {message.text}
                </div>
            )}

            <div className="grid" style={{ display: 'grid', gridTemplateColumns: role === 'RECEPTIONIST' ? '1fr' : 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                
                {/* Booking Section */}
                {(role === 'RECEPTIONIST' || role === 'PATIENT') && (
                    <div className="card">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <Plus size={24} color="var(--primary)" />
                                {editMode ? 'Edit Appointment' : 'Book New Appointment'}
                            </h2>
                            {editMode && (
                                <button className="btn btn-outline" style={{ fontSize: '0.8rem', padding: '0.25rem 0.5rem' }} onClick={() => {
                                    setEditMode(false);
                                    setEditingAppointment(null);
                                    setFormData({ patientId: '', doctorId: '', appointmentTime: '', notes: '' });
                                }}>Cancel Edit</button>
                            )}
                        </div>
                        
                        <form onSubmit={editMode ? handleUpdate : handleBooking} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {role === 'RECEPTIONIST' && (
                                <div>
                                    <label>Patient</label>
                                    <select name="patientId" value={formData.patientId} onChange={handleInputChange} required>
                                        <option value="">Select Patient</option>
                                        {patients.map(p => <option key={p.id} value={p.id}>{p.fullName} ({p.email})</option>)}
                                    </select>
                                </div>
                            )}

                            <div>
                                <label>Doctor</label>
                                <select name="doctorId" value={formData.doctorId} onChange={handleInputChange} required>
                                    <option value="">Select Doctor</option>
                                    {doctors.map(d => <option key={d.id} value={d.id}>{d.fullName} - {d.specialization}</option>)}
                                </select>
                            </div>

                            <div>
                                <label>Date & Time</label>
                                <input 
                                    type="datetime-local" 
                                    name="appointmentTime" 
                                    value={formData.appointmentTime} 
                                    onChange={handleInputChange} 
                                    required 
                                />
                            </div>

                            <div>
                                <label>Notes</label>
                                <textarea 
                                    name="notes" 
                                    value={formData.notes} 
                                    onChange={handleInputChange} 
                                    placeholder="Reason for visit..."
                                    rows="3"
                                />
                            </div>

                            <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem' }}>
                                {editMode ? 'Update Appointment' : 'Confirm Booking'}
                            </button>
                        </form>
                    </div>
                )}

                {/* List Section */}
                <div className="card">
                    <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
                        <Calendar size={24} color="var(--primary)" />
                        {role === 'PATIENT' ? 'My Appointments' : role === 'DOCTOR' ? 'My Schedule' : 'All Appointments'}
                    </h2>

                    {loading ? (
                        <p>Loading appointments...</p>
                    ) : appointments.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '2rem', background: '#f8fafc', borderRadius: 'var(--radius-md)', border: '1px dashed var(--border)' }}>
                            <AlertCircle size={32} color="var(--text-muted)" style={{ marginBottom: '1rem' }} />
                            <p style={{ color: 'var(--text-muted)' }}>No upcoming appointments found.</p>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {appointments.map(app => (
                                <div key={app.id} style={{
                                    padding: '1rem',
                                    borderRadius: 'var(--radius-md)',
                                    border: '1px solid var(--border)',
                                    background: '#fff',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center'
                                }}>
                                    <div>
                                        <div style={{ fontWeight: 'bold', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            <User size={16} color="var(--text-muted)" />
                                            {role === 'PATIENT' ? `Dr. ${app.doctor.fullName}` : `Patient: ${app.patient.fullName}`}
                                        </div>
                                        <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.25rem' }}>
                                            <Clock size={14} />
                                            {new Date(app.appointmentTime).toLocaleString()}
                                        </div>
                                        {app.notes && <div style={{ fontSize: '0.85rem', marginTop: '0.5rem', fontStyle: 'italic' }}>"{app.notes}"</div>}
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.5rem' }}>
                                        <span style={{ 
                                            fontSize: '0.75rem', 
                                            fontWeight: 'bold', 
                                            padding: '0.25rem 0.5rem', 
                                            borderRadius: 'var(--radius-full)',
                                            background: app.status === 'PENDING' ? '#fffaf0' : app.status === 'SCHEDULED' ? '#ebf8ff' : '#f0fff4',
                                            color: app.status === 'PENDING' ? '#975a16' : app.status === 'SCHEDULED' ? '#2b6cb0' : '#2f855a',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.25rem'
                                        }}>
                                            {getStatusIcon(app.status)}
                                            {app.status}
                                        </span>
                                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                                            {role === 'RECEPTIONIST' && app.status === 'PENDING' && (
                                                <button onClick={() => handleConfirm(app.id)} className="btn btn-primary" style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem' }}>Confirm</button>
                                            )}
                                            {(role === 'DOCTOR' || role === 'RECEPTIONIST') && (
                                                <>
                                                    <button onClick={() => handleEdit(app)} className="btn btn-outline" style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem' }}>Edit</button>
                                                    <button onClick={() => handleDelete(app.id)} className="btn btn-outline" style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem', borderColor: 'var(--accent)', color: 'var(--accent)' }}>Cancel</button>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Appointments;
