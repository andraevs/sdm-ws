package org.example.wschat.controllers;

import org.example.wschat.dto.ChatMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
public class WebSocketMessageScheduler {
    private final SimpMessagingTemplate messagingTemplate;
    public WebSocketMessageScheduler(SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }
    @Scheduled(fixedDelay = 1000)
    public void sendMessageToWebSocketClients() {
        ChatMessage chatMessage= new ChatMessage("Hello from server", "Server");
        messagingTemplate.convertAndSend("/topic/public", chatMessage);
    }
}
