package com.buy01.product.dto;

public record ProductRequst(
    String id,
    String name,
    String description,
    double price,
    int quantity
) {}
