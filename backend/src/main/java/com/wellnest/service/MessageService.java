package com.wellnest.service;

import com.wellnest.dto.MessageRequestDto;
import com.wellnest.dto.MessageResponseDto;

import java.util.List;
import java.util.Map;

public interface MessageService {
    MessageResponseDto sendMessage(MessageRequestDto requestDto);
    List<MessageResponseDto> getConversation(Long userId);
    int getTotalUnreadCount();
    Map<Long, Integer> getUnreadCountsPerContact();
    void markAsRead(Long senderId);
}
