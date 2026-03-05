package com.buy01.media.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.buy01.media.service.MinioService;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/media/images")
@RequiredArgsConstructor
public class Image {
    
    private final MinioService minioService;
    
    @PostMapping
    public ResponseEntity<?> upload(
        @RequestParam(value = "file", required = false) MultipartFile file,
        @RequestParam(value = "productId", required = false) String productId,
        @RequestParam(value = "sellerId", required = false) String sellerId) {
        return minioService.uploadImage(file, productId, sellerId);
    }

    @GetMapping("/{fileName}")
    public ResponseEntity<?> getImage(@PathVariable String fileName) {
        return minioService.getImageResponse(fileName);
    }
}
