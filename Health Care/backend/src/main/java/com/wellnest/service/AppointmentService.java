package com.wellnest.service;

import com.wellnest.model.Appointment;
import com.wellnest.model.Role;
import com.wellnest.model.User;
import com.wellnest.repository.AppointmentRepository;
import com.wellnest.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AppointmentService {

    private final AppointmentRepository appointmentRepository;
    private final UserRepository userRepository;
    private final EmailService emailService;

    public Appointment createAppointment(Long patientId, Long doctorId, Appointment appointment) {
        User patient = userRepository.findById(patientId)
                .orElseThrow(() -> new RuntimeException("Patient not found"));
        User doctor = userRepository.findById(doctorId)
                .orElseThrow(() -> new RuntimeException("Doctor not found"));

        if (patient.getRole() != Role.PATIENT) {
            throw new RuntimeException("Invalid Patient ID");
        }
        if (doctor.getRole() != Role.DOCTOR) {
            throw new RuntimeException("Invalid Doctor ID");
        }

        appointment.setPatient(patient);
        appointment.setDoctor(doctor);
        // If booked via this method (receptionist), status is SCHEDULED
        appointment.setStatus("SCHEDULED");
        Appointment saved = appointmentRepository.save(appointment);
        
        emailService.sendAppointmentConfirmation(patient.getEmail(), doctor.getFullName(), appointment.getAppointmentTime().toString());
        
        return saved;
    }

    public Appointment createPatientAppointment(Long patientId, Long doctorId, Appointment appointment) {
        User patient = userRepository.findById(patientId)
                .orElseThrow(() -> new RuntimeException("Patient not found"));
        User doctor = userRepository.findById(doctorId)
                .orElseThrow(() -> new RuntimeException("Doctor not found"));

        appointment.setPatient(patient);
        appointment.setDoctor(doctor);
        // Booked by patient -> PENDING
        appointment.setStatus("PENDING");
        
        return appointmentRepository.save(appointment);
    }

    public Appointment confirmAppointment(Long appointmentId) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new RuntimeException("Appointment not found"));
        appointment.setStatus("SCHEDULED");
        Appointment saved = appointmentRepository.save(appointment);
        
        emailService.sendAppointmentConfirmation(appointment.getPatient().getEmail(), 
                appointment.getDoctor().getFullName(), appointment.getAppointmentTime().toString());
        
        return saved;
    }

    public void deleteAppointment(Long id) {
        appointmentRepository.deleteById(id);
    }

    public Appointment updateAppointment(Long id, Appointment updated) {
        Appointment appointment = appointmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Appointment not found"));
        if (updated.getAppointmentTime() != null) {
            appointment.setAppointmentTime(updated.getAppointmentTime());
        }
        if (updated.getNotes() != null) {
            appointment.setNotes(updated.getNotes());
        }
        if (updated.getStatus() != null) {
            appointment.setStatus(updated.getStatus());
        }
        return appointmentRepository.save(appointment);
    }

    public List<Appointment> getAppointmentsForPatient(Long patientId) {
        return appointmentRepository.findByPatientId(patientId);
    }

    public List<Appointment> getAppointmentsForDoctor(Long doctorId) {
        return appointmentRepository.findByDoctorId(doctorId);
    }

    public List<Appointment> getAllAppointments() {
        return appointmentRepository.findAll();
    }
}
