package com.buy01.product.controller;


import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.buy01.product.dto.ProductRequst;
import com.buy01.product.service.GetAllProductsService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class GetAllProduct {
    
    private final GetAllProductsService getAllProductsService;

    @GetMapping("/all")
    public Iterable<ProductRequst> getAllProduct(){
        return getAllProductsService.getAll();
    }

    @GetMapping
    public Iterable<ProductRequst> getProducts(){
        return getAllProductsService.getAll();
    }
}
