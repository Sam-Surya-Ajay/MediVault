package com.nigga.medivaultsb.service;

import com.nigga.medivaultsb.model.ChatMessage;
import com.nigga.medivaultsb.model.User;
import com.nigga.medivaultsb.repository.ChatMessageRepository;
import com.nigga.medivaultsb.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ChatService {

    @Autowired
    private ChatMessageRepository chatMessageRepository;

    @Autowired
    private UserRepository userRepository;

    @Transactional
    public ChatMessage sendMessage(Long senderId, Long receiverId, String message) {
        User sender = userRepository.findById(senderId)
                .orElseThrow(() -> new RuntimeException("Sender not found"));
        User receiver = userRepository.findById(receiverId)
                .orElseThrow(() -> new RuntimeException("Receiver not found"));

        ChatMessage chatMessage = new ChatMessage();
        chatMessage.setSender(sender);
        chatMessage.setReceiver(receiver);
        chatMessage.setMessage(message);
        
        return chatMessageRepository.save(chatMessage);
    }

    public List<ChatMessage> getChatHistory(Long userId1, Long userId2) {
        return chatMessageRepository.findChatMessagesBetweenUsers(userId1, userId2);
    }

    public List<User> getChatPartners(Long userId) {
        return chatMessageRepository.findChatPartnersForUser(userId);
    }

    @Transactional
    public void markMessagesAsRead(Long senderId, Long receiverId) {
        List<ChatMessage> unreadMessages = chatMessageRepository.findChatMessagesBetweenUsers(senderId, receiverId);
        unreadMessages.stream()
                .filter(message -> !message.isRead() && message.getReceiver().getId().equals(receiverId))
                .forEach(message -> {
                    message.setRead(true);
                    chatMessageRepository.save(message);
                });
    }

    public Long getUnreadMessageCount(Long userId) {
        return chatMessageRepository.countUnreadMessages(userId);
    }
} 