import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include the JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Profile APIs
export const getUserProfile = () => api.get('/users/profile');
export const updateProfile = (data) => api.put('/users/profile', data);

// Activity APIs
export const logActivity = (data) => api.post('/patient/activities', data);
export const getActivities = () => api.get('/patient/activities');
export const getWeeklySummary = () => api.get('/patient/activities/weekly-summary');

// User Listing APIs
export const getDoctors = () => api.get('/users/doctors');
export const getPatientsByRole = () => api.get('/users/patients');

// Appointment APIs
export const receptionistCreateAppointment = (patientId, doctorId, data) => 
    api.post(`/receptionist/appointments?patientId=${patientId}&doctorId=${doctorId}`, data);
export const getAllAppointments = () => api.get('/receptionist/appointments');
export const confirmAppointment = (id) => api.put(`/receptionist/appointments/${id}/confirm`);

export const patientBookAppointment = (doctorId, data) => 
    api.post(`/patient/appointments?doctorId=${doctorId}`, data);
export const getPatientAppointments = () => api.get('/patient/appointments');
export const getDoctorAppointments = () => api.get('/doctor/appointments');
export const updateDoctorAppointment = (id, data) => api.put(`/doctor/appointments/${id}`, data);
export const deleteDoctorAppointment = (id) => api.delete(`/doctor/appointments/${id}`);

// Receptionist - User Management
export const getDoctorsList = () => api.get('/receptionist/doctors');
export const createDoctor = (data) => api.post('/receptionist/doctors', data);
export const updateDoctor = (id, data) => api.put(`/receptionist/doctors/${id}`, data);
export const deleteDoctor = (id) => api.delete(`/receptionist/doctors/${id}`);

export const getAllPatients = () => api.get('/receptionist/patients');
export const registerPatient = (data) => api.post('/receptionist/patients', data);
export const updatePatient = (id, data) => api.put(`/receptionist/patients/${id}`, data);
export const deletePatient = (id) => api.delete(`/receptionist/patients/${id}`);

// Medical Record APIs
export const addMedicalRecord = (patientId, data) => api.post(`/records/doctor/add?patientId=${patientId}`, data);
export const getMyRecords = () => api.get('/records/patient');
export const getPatientRecords = (patientId) => api.get(`/records/doctor/patient/${patientId}`);
export const downloadRecord = (id) => api.get(`/records/download/${id}`, { responseType: 'blob' });
export const downloadPatientHistory = (patientId) => api.get(`/records/download/patient/${patientId}/all`, { responseType: 'blob' });
export const downloadMyHistory = () => api.get('/records/download/me/all', { responseType: 'blob' });

// Habit APIs
export const createHabit = (data) => api.post('/patient/habits', data);
export const getMyHabits = () => api.get('/patient/habits');
export const deleteHabit = (id) => api.delete(`/patient/habits/${id}`);
export const logHabit = (id, data) => api.post(`/patient/habits/${id}/log`, data);
export const getHabitLogs = (date) => api.get(`/patient/habits/logs?date=${date}`);

// Admin APIs
export const getAllUsers = () => api.get('/admin/users');

// Message APIs
export const getTotalUnreadCount = () => api.get('/messages/unread-count');
export const getUnreadCountsPerContact = () => api.get('/messages/unread-counts');
export const markMessagesAsRead = (senderId) => api.put(`/messages/read/${senderId}`);

export default api;

