package com.nigga.medivaultsb.controller;

import com.nigga.medivaultsb.model.ChatMessage;
import com.nigga.medivaultsb.model.User;
import com.nigga.medivaultsb.service.ChatService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/chat")
@CrossOrigin(origins = "http://localhost:5743")
public class ChatController {

    @Autowired
    private ChatService chatService;

    @PostMapping("/send")
    public ResponseEntity<ChatMessage> sendMessage(@RequestBody Map<String, Object> payload) {
        Long senderId = Long.parseLong(payload.get("senderId").toString());
        Long receiverId = Long.parseLong(payload.get("receiverId").toString());
        String message = payload.get("message").toString();
        
        ChatMessage chatMessage = chatService.sendMessage(senderId, receiverId, message);
        return ResponseEntity.ok(chatMessage);
    }

    @GetMapping("/history/{userId1}/{userId2}")
    public ResponseEntity<List<ChatMessage>> getChatHistory(
            @PathVariable Long userId1,
            @PathVariable Long userId2) {
        List<ChatMessage> messages = chatService.getChatHistory(userId1, userId2);
        return ResponseEntity.ok(messages);
    }

    @GetMapping("/partners/{userId}")
    public ResponseEntity<List<User>> getChatPartners(@PathVariable Long userId) {
        List<User> partners = chatService.getChatPartners(userId);
        return ResponseEntity.ok(partners);
    }

    @PostMapping("/read/{senderId}/{receiverId}")
    public ResponseEntity<Void> markMessagesAsRead(
            @PathVariable Long senderId,
            @PathVariable Long receiverId) {
        chatService.markMessagesAsRead(senderId, receiverId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/unread/{userId}")
    public ResponseEntity<Long> getUnreadMessageCount(@PathVariable Long userId) {
        Long count = chatService.getUnreadMessageCount(userId);
        return ResponseEntity.ok(count);
    }
} 