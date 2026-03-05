package com.buy01.product.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.buy01.product.dto.ProductRequst;
import com.buy01.product.models.Product;
import com.buy01.product.repository.ProductsRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class GetAllProductsService {
    
    private final ProductsRepository productRepo;

    public Iterable<ProductRequst> getAll() {
        List<Product> product = productRepo.findAll();

        return product.stream().map(p -> new ProductRequst(p.getId(), p.getName(), p.getDescription(), p.getPrice(), p.getStock(), p.getSellerId(), p.getImageUrls())).toList();
    }
}
