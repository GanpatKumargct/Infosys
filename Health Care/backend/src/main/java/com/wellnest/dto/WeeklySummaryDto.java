package com.wellnest.dto;

import lombok.Builder;
import lombok.Data;
import java.util.Map;

@Data
@Builder
public class WeeklySummaryDto {
    private double totalWaterMl;
    private double totalWorkoutMin;
    private double totalCaloriesBurned;
    private double averageSleepHours;
    private Map<String, Double> caloriesByDate;
    private Map<String, Double> waterByDate;
}
