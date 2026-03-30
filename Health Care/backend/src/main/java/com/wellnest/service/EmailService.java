package com.wellnest.service;

import lombok.RequiredArgsConstructor;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;

    public void sendEmail(String to, String subject, String text) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject(subject);
        message.setText(text);
        mailSender.send(message);
    }

    public void sendOtpEmail(String to, String otp) {
        String subject = "Password Reset OTP - WellNest";
        String text = "Your OTP for password reset is: " + otp + ". This OTP is valid for 10 minutes.";
        sendEmail(to, subject, text);
    }

    public void sendAppointmentConfirmation(String to, String doctorName, String time) {
        String subject = "Appointment Confirmation - WellNest";
        String text = "Your appointment with " + doctorName + " has been confirmed for " + time + ".";
        sendEmail(to, subject, text);
    }

    public void sendAppointmentReminder(String to, String doctorName, String time, String leadTime) {
        String subject = "Appointment Reminder - WellNest";
        String text = "Reminder: You have an appointment with " + doctorName + " in " + leadTime + " at " + time + ".";
        sendEmail(to, subject, text);
    }

    public void sendHabitReminder(String to, String fullName, String habitName) {
        String subject = "Habit Reminder - WellNest";
        String text = "Hi " + fullName + ",\n\nJust a friendly reminder to complete your habit: " + habitName + " today!\n\nStay healthy,\nThe WellNest Team";
        sendEmail(to, subject, text);
    }
}
