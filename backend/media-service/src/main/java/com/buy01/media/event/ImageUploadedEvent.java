package com.buy01.media.event;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ImageUploadedEvent {
    private String imageId;
    private String sellerId;
    private String filename;
    private String url;
    private long fileSize;
    private long timestamp;
}
