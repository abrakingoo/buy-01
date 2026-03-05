package com.buy01.product.models;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;
import java.util.List;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "products")
public class Product {

    @Id
    String id;
    
    String name;
    String description;
    double price;
    int stock;
    String sellerId;
    List<String> imageUrls;
    LocalDateTime createdAt;
    LocalDateTime updatedAt;

}
