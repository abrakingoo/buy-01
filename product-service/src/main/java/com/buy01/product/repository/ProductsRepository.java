package com.buy01.product.repository;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.buy01.product.models.Product;

public interface ProductsRepository extends MongoRepository<Product, String>{
    
}
