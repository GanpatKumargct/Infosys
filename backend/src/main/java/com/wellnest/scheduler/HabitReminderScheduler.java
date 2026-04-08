package com.wellnest.scheduler;

import com.wellnest.model.Habit;
import com.wellnest.service.EmailService;
import com.wellnest.service.HabitService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.List;

@Slf4j
@Component
@RequiredArgsConstructor
public class HabitReminderScheduler {

    private final HabitService habitService;
    private final EmailService emailService;

    // Run every day at 18:00 (6:00 PM) server time
    @Scheduled(cron = "0 0 18 * * ?")
    public void sendHabitReminders() {
        log.info("Starting daily habit reminder check.");
        LocalDate today = LocalDate.now();
        
        List<Habit> allHabits = habitService.getAllHabits();
        
        int sentCount = 0;
        for (Habit habit : allHabits) {
            boolean completedToday = habitService.isHabitLoggedForDate(habit.getId(), today);
            if (!completedToday) {
                String toEmail = habit.getUser().getEmail();
                String fullName = habit.getUser().getFullName() != null ? habit.getUser().getFullName() : "User";
                
                try {
                    emailService.sendHabitReminder(toEmail, fullName, habit.getName());
                    sentCount++;
                } catch (Exception e) {
                    log.error("Failed to send habit reminder to {}", toEmail, e);
                }
            }
        }
        log.info("Finished daily habit reminder check. Sent {} reminders.", sentCount);
    }
}
