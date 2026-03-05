package com.buy01.user.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.buy01.user.dto.UserDetails;
import com.buy01.user.model.User;
import com.buy01.user.repository.UserRepository;
import com.buy01.user.utils.JwtTokenProvider;

import lombok.RequiredArgsConstructor;
import java.time.LocalDateTime;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UpdateUser {

    private final UserRepository userRepository;
    private final JwtTokenProvider jwtTokenProvider;

    @PutMapping("/me")
    public ResponseEntity<?> updateProfile(
            @RequestHeader(value = "Authorization", required = false) String token,
            @RequestBody Map<String, Object> updateData) {
        
        try {
            if (token == null || token.isEmpty()) {
                return ResponseEntity.status(401).body(Map.of("error", "Missing authorization token"));
            }
            
            String userId = jwtTokenProvider.extractUserId(token.replace("Bearer ", ""));
            User user = userRepository.findById(userId).orElse(null);
            
            if (user == null) {
                return ResponseEntity.notFound().build();
            }
            
            if (updateData.containsKey("name")) {
                user.setName((String) updateData.get("name"));
            }
            
            user.setUpdatedAt(LocalDateTime.now());
            User updatedUser = userRepository.save(user);
            
            UserDetails userDetails = new UserDetails(
                updatedUser.getId(),
                updatedUser.getName(),
                updatedUser.getEmail(),
                updatedUser.getRole(),
                updatedUser.getCreatedAt()
            );
            
            return ResponseEntity.ok(userDetails);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
