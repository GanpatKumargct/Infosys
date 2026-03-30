package com.wellnest.controller;

import com.wellnest.dto.HabitDto;
import com.wellnest.dto.HabitLogDto;
import com.wellnest.service.HabitService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/patient/habits")
@RequiredArgsConstructor
public class HabitController {

    private final HabitService habitService;

    @PostMapping
    public ResponseEntity<HabitDto> createHabit(@RequestBody HabitDto habitDto) {
        return new ResponseEntity<>(habitService.createHabit(habitDto), HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<HabitDto>> getMyHabits() {
        return ResponseEntity.ok(habitService.getMyHabits());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteHabit(@PathVariable Long id) {
        habitService.deleteHabit(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{habitId}/log")
    public ResponseEntity<HabitLogDto> logHabit(
            @PathVariable Long habitId,
            @RequestBody Map<String, Object> payload) {
        
        LocalDate date = LocalDate.parse((String) payload.get("date"));
        boolean completed = (Boolean) payload.get("completed");
        
        return ResponseEntity.ok(habitService.logHabit(habitId, date, completed));
    }

    @GetMapping("/logs")
    public ResponseEntity<List<HabitLogDto>> getHabitLogs(@RequestParam String date) {
        LocalDate targetDate = LocalDate.parse(date);
        return ResponseEntity.ok(habitService.getHabitLogsForDate(targetDate));
    }
}
