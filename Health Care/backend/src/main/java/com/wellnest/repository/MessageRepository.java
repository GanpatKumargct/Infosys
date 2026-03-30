package com.wellnest.repository;

import com.wellnest.model.Message;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MessageRepository extends JpaRepository<Message, Long> {

    @Query("SELECT m FROM Message m WHERE (m.sender.id = :user1Id AND m.receiver.id = :user2Id) " +
           "OR (m.sender.id = :user2Id AND m.receiver.id = :user1Id) ORDER BY m.timestamp ASC")
    List<Message> findConversation(@Param("user1Id") Long user1Id, @Param("user2Id") Long user2Id);

    int countByReceiverIdAndIsReadFalse(Long receiverId);

    @Query("SELECT m.sender.id, COUNT(m) FROM Message m WHERE m.receiver.id = :receiverId AND m.isRead = false GROUP BY m.sender.id")
    List<Object[]> countUnreadPerSender(@Param("receiverId") Long receiverId);

    @org.springframework.data.jpa.repository.Modifying
    @Query("UPDATE Message m SET m.isRead = true WHERE m.sender.id = :senderId AND m.receiver.id = :receiverId AND m.isRead = false")
    void markConversationAsRead(@Param("senderId") Long senderId, @Param("receiverId") Long receiverId);
}
