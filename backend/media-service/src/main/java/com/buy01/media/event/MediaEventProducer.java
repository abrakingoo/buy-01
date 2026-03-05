package com.buy01.media.event;

import lombok.RequiredArgsConstructor;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class MediaEventProducer {
    private final KafkaTemplate<String, ImageUploadedEvent> kafkaTemplate;
    private static final String TOPIC = "IMAGE_UPLOADED";

    public void publishImageUploaded(ImageUploadedEvent event) {
        kafkaTemplate.send(TOPIC, event.getImageId(), event);
    }
}
