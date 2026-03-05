package com.buy01.product.service;

import java.time.LocalDateTime;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.buy01.product.dto.NewProduct;
import com.buy01.product.models.Product;
import com.buy01.product.repository.ProductsRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UpdateProductService {

    private final ProductsRepository productsRepo;

    public ResponseEntity<?> update(String id, NewProduct requestData) {
        var product = productsRepo.findById(id);
        if (product.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Product existingProduct = product.get();
        if (requestData.name() != null) {
            existingProduct.setName(requestData.name());
        }
        if (requestData.description() != null) {
            existingProduct.setDescription(requestData.description());
        }
        if (requestData.price() != null && requestData.price() > 0) {
            existingProduct.setPrice(requestData.price());
        }
        if (requestData.stock() != null && requestData.stock() >= 0) {
            existingProduct.setStock(requestData.stock());
        }
        if (requestData.imageUrls() != null) {
            existingProduct.setImageUrls(requestData.imageUrls());
        }
        existingProduct.setUpdatedAt(LocalDateTime.now());

        productsRepo.save(existingProduct);
        return ResponseEntity.ok(existingProduct);
    }
}
