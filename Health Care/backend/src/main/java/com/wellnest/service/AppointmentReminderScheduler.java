package com.wellnest.service;

import com.wellnest.model.Appointment;
import com.wellnest.repository.AppointmentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Component
@RequiredArgsConstructor
public class AppointmentReminderScheduler {

    private final AppointmentRepository appointmentRepository;
    private final EmailService emailService;

    // Run every minute
    @Scheduled(cron = "0 * * * * *")
    public void sendReminders() {
        LocalDateTime now = LocalDateTime.now().truncatedTo(ChronoUnit.MINUTES);
        
        // Window for 1 hour reminder (between 60 and 61 minutes from now)
        LocalDateTime oneHourLaterStart = now.plusMinutes(60);
        LocalDateTime oneHourLaterEnd = now.plusMinutes(61);
        List<Appointment> oneHourReminders = appointmentRepository.findByAppointmentTimeBetweenAndStatus(oneHourLaterStart, oneHourLaterEnd, "SCHEDULED");
        for (Appointment app : oneHourReminders) {
            emailService.sendAppointmentReminder(app.getPatient().getEmail(), 
                    app.getDoctor().getFullName(), app.getAppointmentTime().toString(), "1 hour");
        }

        // Window for 30 minutes reminder (between 30 and 31 minutes from now)
        LocalDateTime thirtyMinsLaterStart = now.plusMinutes(30);
        LocalDateTime thirtyMinsLaterEnd = now.plusMinutes(31);
        List<Appointment> thirtyMinReminders = appointmentRepository.findByAppointmentTimeBetweenAndStatus(thirtyMinsLaterStart, thirtyMinsLaterEnd, "SCHEDULED");
        for (Appointment app : thirtyMinReminders) {
            emailService.sendAppointmentReminder(app.getPatient().getEmail(), 
                    app.getDoctor().getFullName(), app.getAppointmentTime().toString(), "30 minutes");
        }
    }
}
