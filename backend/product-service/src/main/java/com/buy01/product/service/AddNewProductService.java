package com.buy01.product.service;

import java.time.LocalDateTime;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.buy01.product.dto.NewProduct;
import com.buy01.product.event.ProductCreatedEvent;
import com.buy01.product.event.ProductEventProducer;
import com.buy01.product.models.Product;
import com.buy01.product.repository.ProductsRepository;
import com.buy01.product.utils.ProductId;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AddNewProductService {

    private final ProductsRepository productsRepo;
    private final ProductEventProducer productEventProducer;
    
    public ResponseEntity<?> add(NewProduct requestData){
        if(requestData.price() != null && requestData.price() < 0) {
            return ResponseEntity.badRequest().body(Map.of("error", "Price cannot be negative"));
        }

        if (requestData.name().isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Name cannot be blank"));
        }

        if (requestData.description().isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Description cannot be blank"));
        }

        if (requestData.stock() != null && requestData.stock() < 0) {
            return ResponseEntity.badRequest().body(Map.of("error", "Stock cannot be negative"));
        }

        String productId = ProductId.generateId();
        LocalDateTime now = LocalDateTime.now();

        Product product = new Product();
        product.setId(productId);
        product.setName(requestData.name());
        product.setDescription(requestData.description());
        product.setPrice(requestData.price() != null ? requestData.price() : 0);
        product.setStock(requestData.stock() != null ? requestData.stock() : 0);
        product.setSellerId(requestData.sellerId());
        product.setImageUrls(requestData.imageUrls());
        product.setCreatedAt(now);
        product.setUpdatedAt(now);
        
        if (productsRepo.save(product) == null) {
            return ResponseEntity.internalServerError().body(Map.of("error", "Failed to save product"));
        }
        
        productEventProducer.publishProductCreated(new ProductCreatedEvent(
            productId,
            requestData.sellerId(),
            requestData.name(),
            requestData.price() != null ? requestData.price() : 0,
            System.currentTimeMillis()
        ));

        return ResponseEntity.status(HttpStatus.CREATED).body(product);
    }
}
