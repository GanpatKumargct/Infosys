package com.wellnest.service;

import com.wellnest.model.Activity;
import com.wellnest.model.HabitScore;
import com.wellnest.model.User;
import com.wellnest.repository.ActivityRepository;
import com.wellnest.repository.HabitScoreRepository;
import com.wellnest.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class HabitScoreService {

    private final HabitScoreRepository habitScoreRepository;
    private final ActivityRepository activityRepository;
    private final UserRepository userRepository;

    public HabitScore calculateDailyScore(Long userId, LocalDate date) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<Activity> activities = activityRepository.findByUserId(userId);
        // Filter activities for the specific date
        List<Activity> dailyActivities = activities.stream()
                .filter(a -> a.getTimestamp().toLocalDate().equals(date))
                .toList();

        double workoutScore = dailyActivities.stream()
                .anyMatch(a -> "WORKOUT".equals(a.getType())) ? 25.0 : 0.0;

        double sleepDuration = dailyActivities.stream()
                .filter(a -> "SLEEP".equals(a.getType()))
                .mapToDouble(Activity::getValue)
                .sum();
        double sleepScore = (user.getTargetSleepDuration() != null && sleepDuration >= user.getTargetSleepDuration())
                ? 25.0
                : 0.0;

        double waterIntake = dailyActivities.stream()
                .filter(a -> "WATER".equals(a.getType()))
                .mapToDouble(Activity::getValue)
                .sum();
        double hydrationScore = (user.getTargetWaterIntake() != null && waterIntake >= user.getTargetWaterIntake())
                ? 25.0
                : 0.0;

        double caloriesConsumed = dailyActivities.stream()
                .filter(a -> "MEAL".equals(a.getType()))
                .mapToDouble(a -> a.getSecondaryValue() != null ? a.getSecondaryValue() : a.getValue())
                .sum();
        double calorieScore = (user.getTargetCalories() != null && caloriesConsumed > 0
                && caloriesConsumed <= user.getTargetCalories()) ? 25.0 : 0.0;
        // Special case: if target calories set but 0 calories logged today, we might
        // want to check how to handle.
        // For now, calorieScore is 0 if no calories logged or if exceeding target.

        HabitScore score = habitScoreRepository.findByUserAndDate(user, date)
                .orElse(HabitScore.builder().user(user).date(date).build());

        score.setWorkoutScore(workoutScore);
        score.setSleepScore(sleepScore);
        score.setHydrationScore(hydrationScore);
        score.setCalorieScore(calorieScore);
        score.calculateTotal();

        return habitScoreRepository.save(score);
    }

    public Double getWeeklyAverage(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        LocalDate endDate = LocalDate.now();
        LocalDate startDate = endDate.minusDays(6);

        List<HabitScore> weeklyScores = habitScoreRepository.findByUserAndDateBetween(user, startDate, endDate);

        if (weeklyScores.isEmpty())
            return 0.0;

        return weeklyScores.stream()
                .mapToDouble(HabitScore::getTotalDailyScore)
                .average()
                .orElse(0.0);
    }
}
