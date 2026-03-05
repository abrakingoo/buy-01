package com.buy01.product.event;

import lombok.RequiredArgsConstructor;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ProductEventProducer {
    private final KafkaTemplate<String, ProductCreatedEvent> kafkaTemplate;
    private static final String TOPIC = "PRODUCT_CREATED";

    public void publishProductCreated(ProductCreatedEvent event) {
        kafkaTemplate.send(TOPIC, event.getProductId(), event);
    }
}
