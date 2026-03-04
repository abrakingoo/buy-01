package com.buy01.product.utils;

public class ProductId {
    public static String generateId() {
        return java.util.UUID.randomUUID().toString();
    }
}
