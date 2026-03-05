package com.buy01.product.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.buy01.product.dto.NewProduct;
import com.buy01.product.service.AddNewProductService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class AddNewProduct {

    private final AddNewProductService addProduct;

    @PostMapping
    public ResponseEntity<?> addNewProduct(@RequestBody NewProduct requestData){
        return addProduct.add(requestData);
    }
}
