package com.wellnest.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "activities")
public class Activity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    private String type; // WORKOUT, MEAL, SLEEP, WATER
    private String subType; // e.g., Running, Breakfast

    @Column(columnDefinition = "TEXT")
    private String description;

    private Double value; // Primary metric: Duration(min), Calories, Hours, or ml
    private Double secondaryValue; // Secondary metric: e.g., Calories for Workout

    private String notes;

    private LocalDateTime timestamp;
}
