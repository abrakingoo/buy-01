package com.buy01.product.service;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.buy01.product.models.Product;
import com.buy01.product.repository.ProductsRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class DeleteProductService {

    private final ProductsRepository productsRepo;
    private final RestTemplate restTemplate;

    public ResponseEntity<?> delete(String id) {
        var product = productsRepo.findById(id);
        if (product.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Product existingProduct = product.get();
        
        if (existingProduct.getImageUrls() != null && !existingProduct.getImageUrls().isEmpty()) {
            for (String imageUrl : existingProduct.getImageUrls()) {
                try {
                    String imageId = extractImageId(imageUrl);
                    restTemplate.delete("http://media-service:8083/api/media/images/" + imageId);
                } catch (Exception e) {
                    System.err.println("Failed to delete image: " + imageUrl);
                }
            }
        }

        productsRepo.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    private String extractImageId(String imageUrl) {
        return imageUrl.substring(imageUrl.lastIndexOf('/') + 1);
    }
}
