package com.buy01.media.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "images")
public class ImageModel {
    @Id
    String id;

    String imagePath;
    String productId;
    String sellerId;
}
