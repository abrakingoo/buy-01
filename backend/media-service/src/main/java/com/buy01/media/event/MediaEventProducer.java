package com.buy01.media.event;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class MediaEventProducer {
    private final KafkaTemplate<String, ImageUploadedEvent> kafkaTemplate;
    private static final String TOPIC = "IMAGE_UPLOADED";

    public void publishImageUploaded(ImageUploadedEvent event) {
        try {
            kafkaTemplate.send(TOPIC, event.getImageId(), event)
                .whenComplete((result, ex) -> {
                    if (ex != null) {
                        log.warn("Failed to publish image uploaded event: {}", ex.getMessage());
                    }
                });
        } catch (Exception e) {
            log.warn("Error publishing image uploaded event: {}", e.getMessage());
        }
    }
}
