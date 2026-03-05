package com.buy01.product.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import com.buy01.product.service.GetProductByIdService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class GetProductById {

    private final GetProductByIdService getProduct;

    @GetMapping("/{id}")
    public ResponseEntity<?> getProductById(@PathVariable String id){
        return getProduct.get(id);
    }
}
