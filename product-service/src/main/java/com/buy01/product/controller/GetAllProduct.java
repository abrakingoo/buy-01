package com.buy01.product.controller;


import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/products")
public class GetAllProduct {
    
    @GetMapping
    public String getAllProduct(){
        return "get all product";
    }
}
