package com.buy01.product.event;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class ProductEventProducer {
    private final KafkaTemplate<String, ProductCreatedEvent> kafkaTemplate;
    private static final String TOPIC = "PRODUCT_CREATED";

    public void publishProductCreated(ProductCreatedEvent event) {
        try {
            kafkaTemplate.send(TOPIC, event.getProductId(), event)
                .whenComplete((result, ex) -> {
                    if (ex != null) {
                        log.warn("Failed to publish product created event: {}", ex.getMessage());
                    }
                });
        } catch (Exception e) {
            log.warn("Error publishing product created event: {}", e.getMessage());
        }
    }
}
