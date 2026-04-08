package com.wellnest.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserProfileDto {
    private String fullName;
    private Integer age;
    private Double height;
    private Double weight;
    private Double bloodGlucose;
    private String bloodPressure;
    private Integer heartRate;
    private String fitnessGoal;
    private String activityLevel;
    private Integer profileCompletionPercentage;
}
