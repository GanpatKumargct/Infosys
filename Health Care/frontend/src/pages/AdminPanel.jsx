import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllUsers, getDoctorsList, createDoctor, updateDoctor, deleteDoctor } from '../services/api';
import { Users, Shield, UserCog, Mail, Calendar, ArrowLeft, Search, Filter, Plus, Trash2, Edit } from 'lucide-react';

const AdminPanel = () => {
    const navigate = useNavigate();
    const [role, setRole] = useState('');
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterRole, setFilterRole] = useState('ALL');
    const [message, setMessage] = useState({ type: '', text: '' });
    
    // Manage Doctor Modal State
    const [showModal, setShowModal] = useState(false);
    const [editingDoctor, setEditingDoctor] = useState(null);
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        specialization: ''
    });

    useEffect(() => {
        const userRole = localStorage.getItem('role');
        setRole(userRole);
        if (userRole !== 'ADMIN' && userRole !== 'RECEPTIONIST') {
            navigate('/dashboard');
        } else {
            fetchData(userRole);
        }
    }, []);

    const fetchData = async (userRole) => {
        setLoading(true);
        try {
            if (userRole === 'RECEPTIONIST') {
                const res = await getDoctorsList();
                setUsers(res.data);
                setFilterRole('DOCTOR');
            } else {
                const res = await getAllUsers();
                setUsers(res.data);
            }
        } catch (err) {
            console.error('Failed to fetch users', err);
            setMessage({ type: 'error', text: 'Failed to load user data.' });
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (doctor = null) => {
        if (doctor) {
            setEditingDoctor(doctor);
            setFormData({
                fullName: doctor.fullName,
                email: doctor.email,
                password: '', // Don't show password
                specialization: doctor.specialization || ''
            });
        } else {
            setEditingDoctor(null);
            setFormData({ fullName: '', email: '', password: '', specialization: '' });
        }
        setShowModal(true);
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingDoctor) {
                await updateDoctor(editingDoctor.id, formData);
                setMessage({ type: 'success', text: 'Doctor updated successfully!' });
            } else {
                await createDoctor(formData);
                setMessage({ type: 'success', text: 'Doctor created successfully!' });
            }
            setShowModal(false);
            fetchData(role);
        } catch (err) {
            setMessage({ type: 'error', text: 'Failed to save doctor details.' });
        }
    };

    const handleDeleteDoctor = async (id) => {
        if (!window.confirm('Are you sure you want to delete this doctor?')) return;
        try {
            await deleteDoctor(id);
            setMessage({ type: 'success', text: 'Doctor removed successfully!' });
            fetchData(role);
        } catch (err) {
            setMessage({ type: 'error', text: 'Failed to delete doctor.' });
        }
    };

    const filteredUsers = users.filter(user => {
        const matchesSearch = user.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            user.email?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRole = filterRole === 'ALL' || user.role === filterRole;
        return matchesSearch && matchesRole;
    });

    const getRoleColor = (role) => {
        switch (role) {
            case 'ADMIN': return '#ef4444';
            case 'DOCTOR': return '#3b82f6';
            case 'RECEPTIONIST': return '#10b981';
            default: return '#6b7280';
        }
    };

    return (
        <div className="container mt-4">
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h1 style={{ color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <Shield size={32} /> {role === 'ADMIN' ? 'Admin Control Panel' : 'Staff Management'}
                    </h1>
                    <p style={{ color: 'var(--text-muted)' }}>{role === 'ADMIN' ? 'Manage users and monitor system access' : 'Manage medical staff and doctor profiles'}</p>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    {role === 'RECEPTIONIST' && (
                        <button onClick={() => handleOpenModal()} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Plus size={18} /> Add Doctor
                        </button>
                    )}
                    <button onClick={() => navigate('/dashboard')} className="btn btn-outline">
                        <ArrowLeft size={18} style={{ marginRight: '0.5rem' }} /> Dashboard
                    </button>
                </div>
            </header>

            {message.text && (
                <div className={`card mb-4`} style={{ 
                    padding: '1rem', 
                    background: message.type === 'success' ? '#f0fff4' : '#fff5f5',
                    border: `1px solid ${message.type === 'success' ? '#38a169' : '#e53e3e'}`,
                    color: message.type === 'success' ? '#2f855a' : '#c53030'
                }}>
                    {message.text}
                </div>
            )}

            <div className="card mb-4" style={{ padding: '1.5rem' }}>
                <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
                    <div style={{ flex: 1, minWidth: '300px', position: 'relative' }}>
                        <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                        <input 
                            type="text" 
                            placeholder="Search by name or email..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{ paddingLeft: '2.5rem' }}
                        />
                    </div>
                    {role === 'ADMIN' && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Filter size={18} color="var(--text-muted)" />
                            <select 
                                value={filterRole} 
                                onChange={(e) => setFilterRole(e.target.value)}
                                style={{ width: '180px' }}
                            >
                                <option value="ALL">All Roles</option>
                                <option value="PATIENT">Patients</option>
                                <option value="DOCTOR">Doctors</option>
                                <option value="RECEPTIONIST">Receptionists</option>
                                <option value="ADMIN">Admins</option>
                            </select>
                        </div>
                    )}
                    <div className="stats" style={{ display: 'flex', gap: '1rem', marginLeft: 'auto' }}>
                        <div style={{ padding: '0.5rem 1rem', background: 'var(--secondary)', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
                            <div style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 'bold' }}>{role === 'ADMIN' ? 'TOTAL USERS' : 'TOTAL DOCTORS'}</div>
                            <div style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>{users.length}</div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                        <tr style={{ background: '#f8fafc', borderBottom: '1px solid var(--border)' }}>
                            <th style={{ padding: '1.25rem' }}>User</th>
                            <th style={{ padding: '1.25rem' }}>Role</th>
                            <th style={{ padding: '1.25rem' }}>Contact</th>
                            <th style={{ padding: '1.25rem' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan="4" style={{ padding: '2rem', textAlign: 'center' }}>Loading user directory...</td></tr>
                        ) : filteredUsers.length === 0 ? (
                            <tr><td colSpan="4" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>No users found matching your filters.</td></tr>
                        ) : filteredUsers.map(user => (
                            <tr key={user.id} style={{ borderBottom: '1px solid var(--border)', transition: 'background 0.2s' }}>
                                <td style={{ padding: '1.25rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                        <div style={{ 
                                            width: '40px', 
                                            height: '40px', 
                                            borderRadius: '50%', 
                                            background: 'var(--secondary)', 
                                            display: 'flex', 
                                            alignItems: 'center', 
                                            justifyContent: 'center',
                                            color: 'var(--primary)',
                                            fontWeight: 'bold'
                                        }}>
                                            {user.fullName?.[0] || user.email?.[0].toUpperCase()}
                                        </div>
                                        <div>
                                            <div style={{ fontWeight: '600' }}>{user.fullName || 'Unnamed User'}</div>
                                            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>ID: #{user.id}</div>
                                        </div>
                                    </div>
                                </td>
                                <td style={{ padding: '1.25rem' }}>
                                    <span style={{ 
                                        fontSize: '0.75rem', 
                                        fontWeight: 'bold', 
                                        padding: '0.25rem 0.6rem', 
                                        borderRadius: 'var(--radius-full)', 
                                        background: `${getRoleColor(user.role)}15`, 
                                        color: getRoleColor(user.role),
                                        textTransform: 'uppercase'
                                    }}>
                                        {user.role}
                                    </span>
                                </td>
                                <td style={{ padding: '1.25rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem' }}>
                                        <Mail size={14} color="var(--text-muted)" /> {user.email}
                                    </div>
                                    {user.specialization && <div style={{ fontSize: '0.8rem', color: 'var(--primary)', marginTop: '0.25rem' }}>{user.specialization}</div>}
                                </td>
                                <td style={{ padding: '1.25rem' }}>
                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                        <button 
                                            onClick={() => handleOpenModal(user)}
                                            className="btn btn-outline" 
                                            style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}
                                        >
                                            <Edit size={14} style={{ marginRight: '0.4rem' }} /> Edit
                                        </button>
                                        {role === 'RECEPTIONIST' && (
                                            <button 
                                                onClick={() => handleDeleteDoctor(user.id)}
                                                className="btn btn-outline" 
                                                style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', color: '#e53e3e', borderColor: '#e53e3e' }}
                                            >
                                                <Trash2 size={14} style={{ marginRight: '0.4rem' }} /> Delete
                                            </button>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal for Add/Edit Doctor */}
            {showModal && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
                    background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
                }}>
                    <div className="card" style={{ width: '100%', maxWidth: '500px', padding: '2rem' }}>
                        <h2 style={{ marginBottom: '1.5rem' }}>{editingDoctor ? 'Edit Doctor' : 'Register New Doctor'}</h2>
                        <form onSubmit={handleFormSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div>
                                <label>Full Name</label>
                                <input 
                                    type="text" 
                                    required 
                                    value={formData.fullName} 
                                    onChange={e => setFormData({...formData, fullName: e.target.value})}
                                />
                            </div>
                            <div>
                                <label>Email</label>
                                <input 
                                    type="email" 
                                    required 
                                    value={formData.email} 
                                    onChange={e => setFormData({...formData, email: e.target.value})}
                                />
                            </div>
                            {!editingDoctor && (
                                <div>
                                    <label>Password</label>
                                    <input 
                                        type="password" 
                                        required 
                                        value={formData.password} 
                                        onChange={e => setFormData({...formData, password: e.target.value})}
                                    />
                                </div>
                            )}
                            <div>
                                <label>Specialization</label>
                                <input 
                                    type="text" 
                                    placeholder="e.g. Cardiologist" 
                                    value={formData.specialization} 
                                    onChange={e => setFormData({...formData, specialization: e.target.value})}
                                />
                            </div>
                            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                                <button type="button" onClick={() => setShowModal(false)} className="btn btn-outline" style={{ flex: 1 }}>Cancel</button>
                                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Save Changes</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminPanel;
