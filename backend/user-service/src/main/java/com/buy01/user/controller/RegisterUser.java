package com.buy01.user.controller;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.buy01.user.dto.AuthResponse;
import com.buy01.user.dto.UserRegistartionDetails;
import com.buy01.user.model.User;
import com.buy01.user.service.UserRegistarionService;
import com.buy01.user.dto.UserDetails;
import com.buy01.user.utils.JwtTokenProvider;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class RegisterUser {

    private final UserRegistarionService userRegistarionService;
    private final JwtTokenProvider jwtTokenProvider;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody UserRegistartionDetails userRegistartionDetails){
        if(userRegistartionDetails.password() == null || userRegistartionDetails.password().length() < 6){
            return ResponseEntity.badRequest().body(Map.of("error", "Password must be at least 6 characters long"));
        }

        User user = userRegistarionService.saveUser(userRegistartionDetails);
        if(user == null){
            return ResponseEntity.badRequest().body(Map.of("error", "email already exists"));
        }
        UserDetails userDetails = new UserDetails(user.getId(), user.getName(), user.getEmail(), user.getRole(), user.getCreatedAt());
        String token = jwtTokenProvider.generateToken(user.getId(), user.getRole());
        return ResponseEntity.ok(new AuthResponse(token, userDetails));
    }
}
