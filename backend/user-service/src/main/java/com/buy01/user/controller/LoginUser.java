package com.buy01.user.controller;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.buy01.user.dto.AuthResponse;
import com.buy01.user.dto.LoginCredentials;
import com.buy01.user.dto.UserDetails;
import com.buy01.user.model.User;
import com.buy01.user.service.UserLoginService;
import com.buy01.user.utils.JwtTokenProvider;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class LoginUser {

    private final UserLoginService userloginService;
    private final JwtTokenProvider jwtTokenProvider;

    @PostMapping("/login")
    public AuthResponse login(@RequestBody LoginCredentials loginCredentials) {
        User user = userloginService.login(loginCredentials);
        if (user == null) {
            return null;
        }
        UserDetails userDetails = new UserDetails(user.getId(), user.getName(), user.getEmail(), user.getRole(), user.getCreatedAt());
        String token = jwtTokenProvider.generateToken(user.getId(), user.getRole());
        return new AuthResponse(token, userDetails);
    }
}
