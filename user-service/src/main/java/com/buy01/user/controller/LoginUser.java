package com.buy01.user.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.buy01.user.dto.LoginCredentials;

@RestController
@RequestMapping("/api/auth")
public class LoginUser {

    @GetMapping("/login")
    public String LoginForm() {
        return "login Form";
    }

    @PostMapping("/login")
    public ResponseEntity<?> Login(@RequestBody LoginCredentials loginCredentials) {
        return ResponseEntity.ok(loginCredentials);
    }
}
