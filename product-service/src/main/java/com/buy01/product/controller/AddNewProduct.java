package com.buy01.product.controller;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.buy01.product.dto.NewProduct;

@RestController
@RequestMapping("/api/products")
public class AddNewProduct {

    @PostMapping
    public NewProduct addNewProduct(@RequestBody NewProduct requestData){
        return new NewProduct(requestData.name(), requestData.description(), requestData.price());

    }
}
