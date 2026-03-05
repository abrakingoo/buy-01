package com.buy01.product.service;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.buy01.product.dto.ProductRequst;
import com.buy01.product.repository.ProductsRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class GetProductByIdService {

    private final ProductsRepository productRepo;

    public ResponseEntity<?> get(String id) {
        var product = productRepo.findById(id);
        if (product.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(
            new ProductRequst(
                product.get().getId(), 
                product.get().getName(), 
                product.get().getDescription(), 
                product.get().getPrice(), 
                product.get().getStock(),
                product.get().getSellerId(),
                product.get().getImageUrls())
        );
    }
}
