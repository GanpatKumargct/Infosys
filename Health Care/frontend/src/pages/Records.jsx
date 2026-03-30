import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
    getMyRecords, 
    getPatientRecords, 
    addMedicalRecord, 
    getPatientsByRole, 
    downloadRecord,
    downloadPatientHistory,
    downloadMyHistory
} from '../services/api';
import { FileText, Plus, Search, Calendar, User, Clipboard, Download, ArrowLeft, Loader, FileArchive } from 'lucide-react';

const Records = () => {
    const { patientId } = useParams();
    const navigate = useNavigate();
    const [role, setRole] = useState('');
    const [records, setRecords] = useState([]);
    const [patients, setPatients] = useState([]);
    const [selectedPatientId, setSelectedPatientId] = useState(patientId || '');
    const [loading, setLoading] = useState(true);
    const [downloadingId, setDownloadingId] = useState(null);
    const [downloadingAll, setDownloadingAll] = useState(false);
    const [showAddForm, setShowAddForm] = useState(false);
    const [formData, setFormData] = useState({
        recordType: 'PRESCRIPTION',
        content: '',
        notes: ''
    });
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        const userRole = localStorage.getItem('role');
        setRole(userRole);
        if (userRole === 'PATIENT') {
            fetchRecords();
        } else if (userRole === 'DOCTOR') {
            fetchDoctorData();
        }
    }, [patientId]);

    const fetchRecords = async () => {
        setLoading(true);
        try {
            const res = await getMyRecords();
            setRecords(res.data);
        } catch (err) {
            console.error('Failed to fetch records', err);
        } finally {
            setLoading(false);
        }
    };

    const fetchDoctorData = async () => {
        setLoading(true);
        try {
            const patRes = await getPatientsByRole();
            setPatients(patRes.data);
            if (selectedPatientId) {
                const recRes = await getPatientRecords(selectedPatientId);
                setRecords(recRes.data);
            }
        } catch (err) {
            console.error('Failed to fetch doctor data', err);
        } finally {
            setLoading(false);
        }
    };

    const handlePatientChange = async (e) => {
        const pId = e.target.value;
        setSelectedPatientId(pId);
        if (pId) {
            setLoading(true);
            const recRes = await getPatientRecords(pId);
            setRecords(recRes.data);
            setLoading(false);
        } else {
            setRecords([]);
        }
    };

    const handleAddRecord = async (e) => {
        e.preventDefault();
        if (!selectedPatientId && role === 'DOCTOR') {
            setMessage({ type: 'error', text: 'Please select a patient first.' });
            return;
        }
        try {
            await addMedicalRecord(selectedPatientId, formData);
            setMessage({ type: 'success', text: 'Record added successfully!' });
            setShowAddForm(false);
            setFormData({ recordType: 'PRESCRIPTION', content: '', notes: '' });
            fetchDoctorData();
        } catch (err) {
            setMessage({ type: 'error', text: 'Failed to add record.' });
        }
    };

    const handleDownload = async (record) => {
        setDownloadingId(record.id);
        try {
            const response = await downloadRecord(record.id);
            const blob = new Blob([response.data], { type: 'application/pdf' });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `${record.recordType.toLowerCase()}_${record.id}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
        } catch (err) {
            console.error('Download failed', err);
            setMessage({ type: 'error', text: 'Failed to download record. Please try again.' });
        } finally {
            setDownloadingId(null);
        }
    };

    const handleDownloadAll = async () => {
        setDownloadingAll(true);
        try {
            let response;
            if (role === 'PATIENT') {
                response = await downloadMyHistory();
            } else {
                if (!selectedPatientId) return;
                response = await downloadPatientHistory(selectedPatientId);
            }
            const blob = new Blob([response.data], { type: 'application/pdf' });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `medical_history.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
        } catch (err) {
            console.error('Download failed', err);
            setMessage({ type: 'error', text: 'Failed to download full history.' });
        } finally {
            setDownloadingAll(false);
        }
    };

    return (
        <div className="container mt-4">
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h1 style={{ color: 'var(--primary)' }}>Medical Records</h1>
                    <p style={{ color: 'var(--text-muted)' }}>Digital health history and prescriptions</p>
                </div>
                <button onClick={() => navigate('/dashboard')} className="btn btn-outline">
                    <ArrowLeft size={18} style={{ marginRight: '0.5rem' }} /> Dashboard
                </button>
            </header>

            {role === 'DOCTOR' && (
                <div className="card mb-4" style={{ padding: '1.5rem' }}>
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end', flexWrap: 'wrap' }}>
                        <div style={{ flex: 1, minWidth: '250px' }}>
                            <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Select Patient</label>
                            <div style={{ position: 'relative' }}>
                                <select value={selectedPatientId} onChange={handlePatientChange} style={{ paddingLeft: '2.5rem' }}>
                                    <option value="">Choose a patient...</option>
                                    {patients.map(p => <option key={p.id} value={p.id}>{p.fullName} ({p.email})</option>)}
                                </select>
                                <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                            </div>
                        </div>
                        <button 
                            disabled={!selectedPatientId}
                            onClick={() => setShowAddForm(!showAddForm)} 
                            className="btn btn-primary"
                            style={{ height: '45px' }}
                        >
                            <Plus size={18} style={{ marginRight: '0.5rem' }} /> Add Record
                        </button>
                    </div>
                </div>
            )}

            {showAddForm && (
                <div className="card mb-4 fade-in-up">
                    <h3 style={{ marginBottom: '1.5rem' }}>New Medical Entry</h3>
                    <form onSubmit={handleAddRecord} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <div>
                                <label>Record Type</label>
                                <select 
                                    value={formData.recordType} 
                                    onChange={e => setFormData({...formData, recordType: e.target.value})}
                                >
                                    <option value="PRESCRIPTION">Prescription</option>
                                    <option value="LAB_RESULT">Lab Result</option>
                                    <option value="VISIT_NOTE">Visit Note</option>
                                </select>
                            </div>
                        </div>
                        <div>
                            <label>Details / Content</label>
                            <textarea 
                                value={formData.content}
                                onChange={e => setFormData({...formData, content: e.target.value})}
                                placeholder="e.g. Dosage: 500mg, Duration: 5 days..."
                                rows="4"
                                required
                            />
                        </div>
                        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                            <button type="button" onClick={() => setShowAddForm(false)} className="btn btn-outline">Cancel</button>
                            <button type="submit" className="btn btn-primary">Save Record</button>
                        </div>
                    </form>
                </div>
            )}

            <div className="card">
                <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Clipboard size={24} color="var(--primary)" />
                        History Entries
                    </div>
                    {records.length > 0 && (
                        <button 
                            onClick={handleDownloadAll}
                            disabled={downloadingAll}
                            className="btn btn-outline"
                            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}
                        >
                            {downloadingAll ? <Loader size={16} className="animate-spin" /> : <FileArchive size={16} />}
                            Download Full History
                        </button>
                    )}
                </h2>

                {loading ? (
                    <p>Loading records...</p>
                ) : records.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '3rem', background: '#f8fafc', borderRadius: 'var(--radius-md)', border: '1px dashed var(--border)' }}>
                        <FileText size={48} color="var(--text-muted)" style={{ marginBottom: '1rem', opacity: 0.5 }} />
                        <p style={{ color: 'var(--text-muted)' }}>No medical records found {selectedPatientId ? 'for this patient' : ''}.</p>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        {records.sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt)).map(record => (
                            <div key={record.id} style={{
                                padding: '1.5rem',
                                borderRadius: 'var(--radius-md)',
                                border: '1px solid var(--border)',
                                borderLeft: `5px solid ${record.recordType === 'PRESCRIPTION' ? '#8b5cf6' : record.recordType === 'LAB_RESULT' ? '#06d6a0' : '#3b82f6'}`
                            }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                        <div style={{ 
                                            padding: '0.5rem', 
                                            borderRadius: '8px', 
                                            background: record.recordType === 'PRESCRIPTION' ? '#f5f3ff' : record.recordType === 'LAB_RESULT' ? '#ecfdf5' : '#eff6ff',
                                            color: record.recordType === 'PRESCRIPTION' ? '#7c3aed' : record.recordType === 'LAB_RESULT' ? '#059669' : '#2563eb'
                                        }}>
                                            <FileText size={20} />
                                        </div>
                                        <div>
                                            <div style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>{record.recordType.replace('_', ' ')}</div>
                                            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                                <Calendar size={14} /> {new Date(record.createdAt).toLocaleDateString()}
                                                <span style={{ margin: '0 0.25rem' }}>•</span>
                                                <User size={14} /> Dr. {record.doctor.fullName}
                                            </div>
                                        </div>
                                    </div>
                                    <button 
                                        onClick={() => handleDownload(record)}
                                        disabled={downloadingId === record.id}
                                        className="btn btn-outline" 
                                        style={{ padding: '0.4rem', borderRadius: '50%', borderColor: 'var(--primary)', color: 'var(--primary)' }}
                                        title={`Download ${record.recordType} PDF`}
                                    >
                                        {downloadingId === record.id ? <Loader size={16} className="animate-spin" /> : <Download size={16} />}
                                    </button>
                                </div>
                                <div style={{ 
                                    padding: '1rem', 
                                    background: '#fafbfc', 
                                    borderRadius: 'var(--radius-sm)',
                                    fontSize: '0.95rem',
                                    whiteSpace: 'pre-wrap',
                                    lineHeight: '1.6'
                                }}>
                                    {record.content}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Records;
