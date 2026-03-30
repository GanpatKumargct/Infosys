package com.wellnest.service;

import com.wellnest.config.JwtUtils;
import com.wellnest.dto.AuthDto;
import com.wellnest.model.Role;
import com.wellnest.model.User;
import com.wellnest.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

        private final UserRepository userRepository;
        private final PasswordEncoder passwordEncoder;
        private final JwtUtils jwtUtils;
        private final AuthenticationManager authenticationManager;

        public AuthDto.AuthResponse register(AuthDto.RegisterRequest request) {
                if (userRepository.existsByEmail(request.getEmail())) {
                        throw new RuntimeException("Email already exists");
                }

                var user = User.builder()
                                .fullName(request.getFullName())
                                .email(request.getEmail())
                                .password(passwordEncoder.encode(request.getPassword()))
                                .role(request.getRole() != null ? request.getRole() : Role.PATIENT)
                                .age(request.getAge())
                                .height(request.getHeight())
                                .weight(request.getWeight())
                                .specialization(request.getSpecialization())
                                .fitnessGoal(request.getFitnessGoal())
                                .activityLevel(request.getActivityLevel())
                                .build();

                user.calculateProfileCompletion();
                userRepository.save(user);

                var jwtToken = jwtUtils.generateToken(user);
                return AuthDto.AuthResponse.builder()
                                .token(jwtToken)
                                .role(user.getRole().name())
                                .fullName(user.getFullName())
                                .id(user.getId())
                                .profileCompletionPercentage(user.getProfileCompletionPercentage())
                                .build();
        }

        public AuthDto.AuthResponse login(AuthDto.LoginRequest request) {
                authenticationManager.authenticate(
                                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));

                var user = userRepository.findByEmail(request.getEmail())
                                .orElseThrow(() -> new RuntimeException("User not found"));

                var jwtToken = jwtUtils.generateToken(user);
                return AuthDto.AuthResponse.builder()
                                .token(jwtToken)
                                .role(user.getRole().name())
                                .fullName(user.getFullName())
                                .profileCompletionPercentage(user.getProfileCompletionPercentage())
                                .build();
        }
}
