package com.buy01.product.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.buy01.product.dto.NewProduct;
import com.buy01.product.service.UpdateProductService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class UpdateProduct {
    
    private final UpdateProductService updateProductService;
    
    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable String id, @RequestBody NewProduct product) {
        return updateProductService.update(id, product);
    }
}
