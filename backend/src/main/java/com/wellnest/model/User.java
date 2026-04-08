package com.wellnest.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "users")
public class User implements UserDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false)
    private String password;

    private String fullName;

    // Physical stats for Patients
    private Integer age;
    private Double height; // in cm
    private Double weight; // in kg
    private Double bloodGlucose; // in mg/dL
    private String bloodPressure; // e.g., 120/80
    private Integer heartRate; // in bpm

    // Professional details for Doctors
    private String specialization;

    private String fitnessGoal;
    private String activityLevel;
    private Integer profileCompletionPercentage;

    // Habit Targets
    private Double targetCalories;
    private Double targetWaterIntake; // in ml
    private Double targetSleepDuration; // in hours

    @Enumerated(EnumType.STRING)
    private Role role;

    public void calculateProfileCompletion() {
        int totalFields = 9; // name, age, height, weight, fitnessGoal, activityLevel, bloodGlucose, bloodPressure, heartRate
        int completedFields = 0;

        if (fullName != null && !fullName.isEmpty())
            completedFields++;
        if (age != null && age > 0)
            completedFields++;
        if (height != null && height > 0)
            completedFields++;
        if (weight != null && weight > 0)
            completedFields++;
        if (bloodGlucose != null && bloodGlucose > 0)
            completedFields++;
        if (bloodPressure != null && !bloodPressure.isEmpty())
            completedFields++;
        if (heartRate != null && heartRate > 0)
            completedFields++;
        if (fitnessGoal != null && !fitnessGoal.isEmpty())
            completedFields++;
        if (activityLevel != null && !activityLevel.isEmpty())
            completedFields++;

        this.profileCompletionPercentage = (completedFields * 100) / totalFields;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority("ROLE_" + role.name()));
    }

    @Override
    public String getUsername() {
        return email;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}
