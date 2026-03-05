package com.buy01.user.dto;

import java.time.LocalDateTime;

public record UserDetails(String id, String name, String email, String role, LocalDateTime createdAt) {
    
}
