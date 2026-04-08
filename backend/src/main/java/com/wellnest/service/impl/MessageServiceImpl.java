package com.wellnest.service.impl;

import com.wellnest.dto.MessageRequestDto;
import com.wellnest.dto.MessageResponseDto;
import com.wellnest.model.Message;
import com.wellnest.model.User;
import com.wellnest.repository.MessageRepository;
import com.wellnest.service.MessageService;
import com.wellnest.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MessageServiceImpl implements MessageService {

    private final MessageRepository messageRepository;
    private final UserService userService;

    @Override
    public MessageResponseDto sendMessage(MessageRequestDto requestDto) {
        User sender = userService.getCurrentUser();
        User receiver = userService.getUserById(requestDto.getReceiverId());

        Message message = Message.builder()
                .sender(sender)
                .receiver(receiver)
                .content(requestDto.getContent())
                .timestamp(LocalDateTime.now())
                .isRead(false)
                .build();

        Message savedMessage = messageRepository.save(message);
        return mapToDto(savedMessage);
    }

    @Override
    public List<MessageResponseDto> getConversation(Long userId) {
        User currentUser = userService.getCurrentUser();
        Long currentUserId = currentUser.getId();

        List<Message> messages = messageRepository.findConversation(currentUserId, userId);

        return messages.stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    public int getTotalUnreadCount() {
        User currentUser = userService.getCurrentUser();
        return messageRepository.countByReceiverIdAndIsReadFalse(currentUser.getId());
    }

    @Override
    public Map<Long, Integer> getUnreadCountsPerContact() {
        User currentUser = userService.getCurrentUser();
        List<Object[]> results = messageRepository.countUnreadPerSender(currentUser.getId());
        
        Map<Long, Integer> unreadCounts = new HashMap<>();
        for (Object[] result : results) {
            Long senderId = (Long) result[0];
            Integer count = ((Number) result[1]).intValue();
            unreadCounts.put(senderId, count);
        }
        return unreadCounts;
    }

    @Override
    @Transactional
    public void markAsRead(Long senderId) {
        User currentUser = userService.getCurrentUser();
        messageRepository.markConversationAsRead(senderId, currentUser.getId());
    }

    private MessageResponseDto mapToDto(Message message) {
        return MessageResponseDto.builder()
                .id(message.getId())
                .senderId(message.getSender().getId())
                .senderName(message.getSender().getFullName())
                .receiverId(message.getReceiver().getId())
                .receiverName(message.getReceiver().getFullName())
                .content(message.getContent())
                .timestamp(message.getTimestamp())
                .isRead(message.isRead())
                .build();
    }
}
