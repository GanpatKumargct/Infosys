package com.wellnest.controller;

import com.wellnest.model.HabitScore;
import com.wellnest.service.HabitScoreService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

@RestController
@RequestMapping("/api/habit-scores")
@RequiredArgsConstructor
public class HabitScoreController {

    private final HabitScoreService habitScoreService;

    @GetMapping("/daily/{userId}")
    public ResponseEntity<HabitScore> getDailyScore(@PathVariable Long userId,
            @RequestParam(required = false) String date) {
        LocalDate localDate = (date != null) ? LocalDate.parse(date) : LocalDate.now();
        return ResponseEntity.ok(habitScoreService.calculateDailyScore(userId, localDate));
    }

    @GetMapping("/weekly-average/{userId}")
    public ResponseEntity<Double> getWeeklyAverage(@PathVariable Long userId) {
        return ResponseEntity.ok(habitScoreService.getWeeklyAverage(userId));
    }
}
