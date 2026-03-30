package com.wellnest.controller;

import com.wellnest.model.Appointment;
import com.wellnest.model.User;
import com.wellnest.service.AppointmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class AppointmentController {

    private final AppointmentService appointmentService;

    // Receptionist creates appointments (auto-confirmed)
    @PostMapping("/receptionist/appointments")
    public ResponseEntity<Appointment> createAppointment(@RequestParam Long patientId,
            @RequestParam Long doctorId,
            @RequestBody Appointment appointment) {
        return ResponseEntity.ok(appointmentService.createAppointment(patientId, doctorId, appointment));
    }

    // Receptionist views all appointments
    @GetMapping("/receptionist/appointments")
    public ResponseEntity<List<Appointment>> getAllAppointments() {
        return ResponseEntity.ok(appointmentService.getAllAppointments());
    }

    // Receptionist confirms a patient booking
    @PutMapping("/receptionist/appointments/{id}/confirm")
    public ResponseEntity<Appointment> confirmAppointment(@PathVariable Long id) {
        return ResponseEntity.ok(appointmentService.confirmAppointment(id));
    }

    // Patient books an appointment (starts as PENDING)
    @PostMapping("/patient/appointments")
    public ResponseEntity<Appointment> patientBookAppointment(@RequestParam Long doctorId,
            @RequestBody Appointment appointment,
            @AuthenticationPrincipal User patient) {
        return ResponseEntity.ok(appointmentService.createPatientAppointment(patient.getId(), doctorId, appointment));
    }

    // Patient views their own appointments
    @GetMapping("/patient/appointments")
    public ResponseEntity<List<Appointment>> getPatientAppointments(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(appointmentService.getAppointmentsForPatient(user.getId()));
    }

    // Doctor views their appointments
    @GetMapping("/doctor/appointments")
    public ResponseEntity<List<Appointment>> getDoctorAppointments(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(appointmentService.getAppointmentsForDoctor(user.getId()));
    }

    // Doctor updates their appointment
    @PutMapping("/doctor/appointments/{id}")
    public ResponseEntity<Appointment> updateDoctorAppointment(@PathVariable Long id, @RequestBody Appointment appointment) {
        // In a real app, verify doctor ownership
        return ResponseEntity.ok(appointmentService.updateAppointment(id, appointment));
    }

    // Doctor deletes their appointment
    @DeleteMapping("/doctor/appointments/{id}")
    public ResponseEntity<Void> deleteDoctorAppointment(@PathVariable Long id) {
        // In a real app, verify doctor ownership
        appointmentService.deleteAppointment(id);
        return ResponseEntity.noContent().build();
    }
}
