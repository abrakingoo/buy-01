package com.buy01.media.service;

import io.minio.MinioClient;
import io.minio.PutObjectArgs;
import io.minio.GetPresignedObjectUrlArgs;
import io.minio.GetObjectArgs;
import io.minio.http.Method;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.buy01.media.event.ImageUploadedEvent;
import com.buy01.media.event.MediaEventProducer;
import com.buy01.media.model.ImageModel;
import com.buy01.media.repository.ImageRepository;

import lombok.RequiredArgsConstructor;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class MinioService {

    private final MinioClient minioClient;
    private final ImageRepository imageRepo;
    private final MediaEventProducer mediaEventProducer;

    @Value("${minio.bucket-name}")
    private String bucketName;

    public ResponseEntity<?> uploadImage(MultipartFile file, String productId, String sellerId) {
        if (file == null || file.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "File is required"));
        }

        try {
            String fileName = UUID.randomUUID() + "-" + file.getOriginalFilename();
            
            minioClient.putObject(
                PutObjectArgs.builder()
                    .bucket(bucketName)
                    .object(fileName)
                    .stream(file.getInputStream(), file.getSize(), -1)
                    .contentType(file.getContentType())
                    .build()
            );

            String imageUrl = getPresignedUrl(fileName);
            ImageModel imageModel = new ImageModel(UUID.randomUUID().toString(), imageUrl, productId, sellerId);
            if (imageRepo.save(imageModel) == null){
                return ResponseEntity.internalServerError().body(Map.of("error", "Failed to save image metadata"));
            };
            
            mediaEventProducer.publishImageUploaded(new ImageUploadedEvent(
                imageModel.getId(),
                sellerId,
                fileName,
                imageUrl,
                file.getSize(),
                System.currentTimeMillis()
            ));
            
            return ResponseEntity.ok(Map.of("url", imageUrl, "message", "Image uploaded successfully"));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("error", e.getMessage()));
        }
    }

    public ResponseEntity<?> getImageResponse(String fileName) {
        try {
            byte[] imageData = getImageData(fileName);
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.IMAGE_JPEG);
            headers.setContentDispositionFormData("inline", fileName);
            return ResponseEntity.ok().headers(headers).body(imageData);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    private String getPresignedUrl(String fileName) throws Exception {
        return minioClient.getPresignedObjectUrl(
            GetPresignedObjectUrlArgs.builder()
                .method(Method.GET)
                .bucket(bucketName)
                .object(fileName)
                .build()
        );
    }

    private byte[] getImageData(String fileName) throws Exception {
        var response = minioClient.getObject(
            GetObjectArgs.builder()
                .bucket(bucketName)
                .object(fileName)
                .build()
        );
        return response.readAllBytes();
    }
}
