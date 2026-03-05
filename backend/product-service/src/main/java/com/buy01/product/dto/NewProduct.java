package com.buy01.product.dto;

import java.util.List;

public record NewProduct(String name, String description, Double price, Integer stock, String sellerId, List<String> imageUrls) {}
