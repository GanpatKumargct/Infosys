package com.wellnest.repository;

import com.wellnest.model.HabitScore;
import com.wellnest.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface HabitScoreRepository extends JpaRepository<HabitScore, Long> {
    Optional<HabitScore> findByUserAndDate(User user, LocalDate date);

    List<HabitScore> findByUserAndDateBetween(User user, LocalDate startDate, LocalDate endDate);
}
