package com.wellnest.service;

import com.wellnest.dto.WeeklySummaryDto;
import com.wellnest.model.Activity;
import com.wellnest.model.User;
import com.wellnest.repository.ActivityRepository;
import com.wellnest.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ActivityService {

    private final ActivityRepository activityRepository;
    private final UserRepository userRepository;
    private final HabitScoreService habitScoreService;

    public Activity logActivity(Long userId, Activity activity) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        activity.setUser(user);
        if (activity.getTimestamp() == null) {
            activity.setTimestamp(LocalDateTime.now());
        }
        Activity savedActivity = activityRepository.save(activity);

        // Trigger score calculation for the day
        habitScoreService.calculateDailyScore(userId, savedActivity.getTimestamp().toLocalDate());

        return savedActivity;
    }

    public List<Activity> getUserActivities(Long userId) {
        return activityRepository.findByUserId(userId);
    }

    public WeeklySummaryDto getWeeklySummary(Long userId) {
        LocalDateTime weekAgo = LocalDateTime.now().minusDays(7);
        List<Activity> activities = activityRepository.findByUserId(userId).stream()
                .filter(a -> a.getTimestamp().isAfter(weekAgo))
                .collect(Collectors.toList());

        double totalWater = 0;
        double totalWorkout = 0;
        double totalCalories = 0;
        double sleepSum = 0;
        int sleepCount = 0;
        Map<String, Double> caloriesByDate = new HashMap<>();
        Map<String, Double> waterByDate = new HashMap<>();

        for (Activity a : activities) {
            String date = a.getTimestamp().toLocalDate().toString();
            switch (a.getType()) {
                case "WATER":
                    totalWater += a.getValue();
                    waterByDate.merge(date, a.getValue(), Double::sum);
                    break;
                case "WORKOUT":
                    totalWorkout += a.getValue();
                    if (a.getSecondaryValue() != null) {
                        totalCalories += a.getSecondaryValue();
                        caloriesByDate.merge(date, a.getSecondaryValue(), Double::sum);
                    }
                    break;
                case "MEAL":
                    // Optionally track intake calories too? Summary uses "calories burned" usually, 
                    // but let's stick to what's requested: "water, and others things".
                    break;
                case "SLEEP":
                    sleepSum += a.getValue();
                    sleepCount++;
                    break;
            }
        }

        return WeeklySummaryDto.builder()
                .totalWaterMl(totalWater)
                .totalWorkoutMin(totalWorkout)
                .totalCaloriesBurned(totalCalories)
                .averageSleepHours(sleepCount > 0 ? sleepSum / sleepCount : 0)
                .caloriesByDate(caloriesByDate)
                .waterByDate(waterByDate)
                .build();
    }
}
