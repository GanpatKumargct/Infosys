package com.wellnest.controller;

import com.wellnest.dto.WeeklySummaryDto;
import com.wellnest.model.Activity;
import com.wellnest.model.User;
import com.wellnest.service.ActivityService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/patient/activities")
@RequiredArgsConstructor
public class ActivityController {

    private final ActivityService activityService;

    @PostMapping
    public ResponseEntity<Activity> logActivity(@AuthenticationPrincipal User user, @RequestBody Activity activity) {
        return ResponseEntity.ok(activityService.logActivity(user.getId(), activity));
    }

    @GetMapping
    public ResponseEntity<List<Activity>> getActivities(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(activityService.getUserActivities(user.getId()));
    }

    @GetMapping("/weekly-summary")
    public ResponseEntity<WeeklySummaryDto> getWeeklySummary(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(activityService.getWeeklySummary(user.getId()));
    }
}
