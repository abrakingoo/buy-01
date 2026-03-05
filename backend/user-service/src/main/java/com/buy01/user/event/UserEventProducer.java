package com.buy01.user.event;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserEventProducer {
    private final KafkaTemplate<String, UserRegisteredEvent> kafkaTemplate;
    private static final String TOPIC = "USER_REGISTERED";

    public void publishUserRegistered(UserRegisteredEvent event) {
        try {
            kafkaTemplate.send(TOPIC, event.getUserId(), event)
                .whenComplete((result, ex) -> {
                    if (ex != null) {
                        log.warn("Failed to publish user registered event: {}", ex.getMessage());
                    }
                });
        } catch (Exception e) {
            log.warn("Error publishing user registered event: {}", e.getMessage());
        }
    }
}
