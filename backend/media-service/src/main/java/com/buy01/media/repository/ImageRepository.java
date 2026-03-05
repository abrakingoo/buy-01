package com.buy01.media.repository;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.buy01.media.model.ImageModel;


public interface ImageRepository  extends MongoRepository<ImageModel, String> {
    
}
