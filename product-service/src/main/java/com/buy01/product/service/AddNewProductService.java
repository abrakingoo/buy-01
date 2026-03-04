package com.buy01.product.service;

import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.buy01.product.dto.NewProduct;
import com.buy01.product.models.Product;
import com.buy01.product.repository.ProductsRepository;
import com.buy01.product.utils.ProductId;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AddNewProductService {

    private final ProductsRepository productsRepo;
    
    public ResponseEntity<?> add(NewProduct requestData){
        if(requestData.price() < 0) {
            return ResponseEntity.badRequest().body(Map.of("error", "Price cannot be negative"));
        }

        if (requestData.name().isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Name cannot be blank"));
        }

        if (requestData.description().isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Description cannot be blank"));
        }

        if (requestData.quantity() < 0) {
            return ResponseEntity.badRequest().body(Map.of("error", "Quantity cannot be negative"));
        }

        String productId = ProductId.generateId();

        Product product = new Product();
        product.setId(productId);
        product.setName(requestData.name());
        product.setDescription(requestData.description());
        product.setPrice(requestData.price());
        product.setQuantity(requestData.quantity());
        
        if (productsRepo.save(product) == null) {
            return ResponseEntity.internalServerError().body(Map.of("error", "Failed to save product"));
        }

        return ResponseEntity.status(HttpStatus.CREATED).body(requestData);
    }
}
