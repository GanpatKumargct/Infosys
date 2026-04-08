package com.wellnest.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class HabitLogDto {
    private Long id;
    private Long habitId;
    private LocalDate date;
    private boolean completed;
}
