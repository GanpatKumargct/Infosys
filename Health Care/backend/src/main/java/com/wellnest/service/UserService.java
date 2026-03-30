package com.wellnest.service;

import com.wellnest.dto.UserProfileDto;
import com.wellnest.model.Role;
import com.wellnest.model.User;
import com.wellnest.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public User getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public User getUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public UserProfileDto getUserProfile() {
        User user = getCurrentUser();
        return UserProfileDto.builder()
                .fullName(user.getFullName())
                .age(user.getAge())
                .height(user.getHeight())
                .weight(user.getWeight())
                .bloodGlucose(user.getBloodGlucose())
                .bloodPressure(user.getBloodPressure())
                .heartRate(user.getHeartRate())
                .fitnessGoal(user.getFitnessGoal())
                .activityLevel(user.getActivityLevel())
                .profileCompletionPercentage(user.getProfileCompletionPercentage())
                .build();
    }

    public UserProfileDto updateProfile(UserProfileDto profileDto) {
        User user = getCurrentUser();

        user.setFullName(profileDto.getFullName());
        user.setAge(profileDto.getAge());
        user.setHeight(profileDto.getHeight());
        user.setWeight(profileDto.getWeight());
        user.setBloodGlucose(profileDto.getBloodGlucose());
        user.setBloodPressure(profileDto.getBloodPressure());
        user.setHeartRate(profileDto.getHeartRate());
        user.setFitnessGoal(profileDto.getFitnessGoal());
        user.setActivityLevel(profileDto.getActivityLevel());

        user.calculateProfileCompletion();
        userRepository.save(user);

        return getUserProfile();
    }

    public User createDoctor(User doctor) {
        doctor.setRole(Role.DOCTOR);
        doctor.setPassword(passwordEncoder.encode(doctor.getPassword() != null ? doctor.getPassword() : "DefaultPass123!"));
        return userRepository.save(doctor);
    }

    public User updateDoctor(Long id, User doctorDetails) {
        User doctor = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Doctor not found"));
        doctor.setFullName(doctorDetails.getFullName());
        doctor.setSpecialization(doctorDetails.getSpecialization());
        doctor.setEmail(doctorDetails.getEmail());
        if (doctorDetails.getPassword() != null && !doctorDetails.getPassword().isEmpty()) {
            doctor.setPassword(passwordEncoder.encode(doctorDetails.getPassword()));
        }
        return userRepository.save(doctor);
    }

    public void deleteDoctor(Long id) {
        userRepository.deleteById(id);
    }

    public User registerPatient(User patient) {
        patient.setRole(Role.PATIENT);
        patient.setPassword(passwordEncoder.encode(patient.getPassword() != null ? patient.getPassword() : "DefaultPass123!"));
        patient.calculateProfileCompletion();
        return userRepository.save(patient);
    }

    public List<User> getDoctors() {
        return userRepository.findByRole(Role.DOCTOR);
    }

    public List<User> getPatients() {
        return userRepository.findByRole(Role.PATIENT);
    }
}
