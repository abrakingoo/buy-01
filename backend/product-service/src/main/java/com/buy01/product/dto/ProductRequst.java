package com.buy01.product.dto;

import java.util.List;

public record ProductRequst(
    String id,
    String name,
    String description,
    double price,
    int stock,
    String sellerId,
    List<String> imageUrls
) {}
