package com.buy01.product.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import com.buy01.product.dto.NewProduct;

@RestController
@RequestMapping("/api/products")
public class GetProductById {

    @GetMapping("/{id}")
    public NewProduct getProductById(@PathVariable Long id){
        return new NewProduct("name", "description", 23.2);
    }
}
