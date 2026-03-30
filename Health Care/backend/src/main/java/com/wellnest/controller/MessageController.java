package com.wellnest.controller;

import com.wellnest.dto.MessageRequestDto;
import com.wellnest.dto.MessageResponseDto;
import com.wellnest.service.MessageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/messages")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class MessageController {

    private final MessageService messageService;

    @PostMapping
    public ResponseEntity<MessageResponseDto> sendMessage(@RequestBody MessageRequestDto requestDto) {
        return ResponseEntity.ok(messageService.sendMessage(requestDto));
    }

    @GetMapping("/{userId}")
    public ResponseEntity<List<MessageResponseDto>> getConversation(@PathVariable Long userId) {
        return ResponseEntity.ok(messageService.getConversation(userId));
    }

    @GetMapping("/unread-count")
    public ResponseEntity<Integer> getTotalUnreadCount() {
        return ResponseEntity.ok(messageService.getTotalUnreadCount());
    }

    @GetMapping("/unread-counts")
    public ResponseEntity<Map<Long, Integer>> getUnreadCountsPerContact() {
        return ResponseEntity.ok(messageService.getUnreadCountsPerContact());
    }

    @PutMapping("/read/{senderId}")
    public ResponseEntity<Void> markAsRead(@PathVariable Long senderId) {
        messageService.markAsRead(senderId);
        return ResponseEntity.ok().build();
    }
}
