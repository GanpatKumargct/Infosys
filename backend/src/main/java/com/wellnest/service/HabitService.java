package com.wellnest.service;

import com.wellnest.dto.HabitDto;
import com.wellnest.dto.HabitLogDto;
import com.wellnest.model.Habit;
import com.wellnest.model.HabitLog;
import com.wellnest.model.User;
import com.wellnest.repository.HabitLogRepository;
import com.wellnest.repository.HabitRepository;
import com.wellnest.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class HabitService {

    private final HabitRepository habitRepository;
    private final HabitLogRepository habitLogRepository;
    private final UserService userService;

    public HabitDto createHabit(HabitDto habitDto) {
        User user = userService.getCurrentUser();
        Habit habit = Habit.builder()
                .user(user)
                .name(habitDto.getName())
                .target(habitDto.getTarget())
                .build();
        habit = habitRepository.save(habit);
        return mapToDto(habit);
    }

    public List<HabitDto> getMyHabits() {
        User user = userService.getCurrentUser();
        return habitRepository.findByUserId(user.getId()).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public void deleteHabit(Long habitId) {
        Habit habit = habitRepository.findById(habitId)
                .orElseThrow(() -> new RuntimeException("Habit not found"));
        
        if (!habit.getUser().getId().equals(userService.getCurrentUser().getId())) {
             throw new RuntimeException("Unauthorized");
        }
        
        habitRepository.delete(habit);
    }

    @Transactional
    public HabitLogDto logHabit(Long habitId, LocalDate date, boolean completed) {
        Habit habit = habitRepository.findById(habitId)
                .orElseThrow(() -> new RuntimeException("Habit not found"));

        if (!habit.getUser().getId().equals(userService.getCurrentUser().getId())) {
            throw new RuntimeException("Unauthorized");
        }

        HabitLog habitLog = habitLogRepository.findByHabitIdAndDate(habitId, date)
                .orElse(HabitLog.builder()
                        .habit(habit)
                        .date(date)
                        .build());

        habitLog.setCompleted(completed);
        habitLog = habitLogRepository.save(habitLog);
        
        return mapLogToDto(habitLog);
    }

    public List<HabitLogDto> getHabitLogsForDate(LocalDate date) {
        User user = userService.getCurrentUser();
        List<Habit> userHabits = habitRepository.findByUserId(user.getId());
        
        return userHabits.stream()
                .map(habit -> habitLogRepository.findByHabitIdAndDate(habit.getId(), date)
                        .map(this::mapLogToDto)
                        .orElse(HabitLogDto.builder()
                                .habitId(habit.getId())
                                .date(date)
                                .completed(false)
                                .build()))
                .collect(Collectors.toList());
    }
    
    // Admin/Scheduler use
    public List<Habit> getAllHabits() {
        return habitRepository.findAll();
    }
    
    public boolean isHabitLoggedForDate(Long habitId, LocalDate date) {
        return habitLogRepository.findByHabitIdAndDate(habitId, date)
                .map(HabitLog::isCompleted)
                .orElse(false);
    }

    private HabitDto mapToDto(Habit habit) {
        return HabitDto.builder()
                .id(habit.getId())
                .userId(habit.getUser().getId())
                .name(habit.getName())
                .target(habit.getTarget())
                .build();
    }

    private HabitLogDto mapLogToDto(HabitLog log) {
        return HabitLogDto.builder()
                .id(log.getId())
                .habitId(log.getHabit().getId())
                .date(log.getDate())
                .completed(log.isCompleted())
                .build();
    }
}
