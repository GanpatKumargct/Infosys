package com.wellnest.dto;

import com.wellnest.model.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

public class AuthDto {

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class RegisterRequest {
        private String fullName;
        private String email;
        private String password;
        private Role role;
        // Optional fields
        private Integer age;
        private Double height;
        private Double weight;
        private String specialization;
        private String fitnessGoal;
        private String activityLevel;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class LoginRequest {
        private String email;
        private String password;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class AuthResponse {
        private String token;
        private String role;
        private String fullName;
        private Long id;
        private Integer profileCompletionPercentage;
    }
}
