package com.wellnest.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "habit_scores")
public class HabitScore {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    private LocalDate date;

    private Double workoutScore;
    private Double sleepScore;
    private Double hydrationScore;
    private Double calorieScore;

    private Double totalDailyScore;

    public void calculateTotal() {
        this.totalDailyScore = workoutScore + sleepScore + hydrationScore + calorieScore;
    }
}
