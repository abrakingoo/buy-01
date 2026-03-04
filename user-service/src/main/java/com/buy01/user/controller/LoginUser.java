package com.buy01.user.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.buy01.user.dto.LoginCredentials;
import com.buy01.user.dto.UserDetails;
import com.buy01.user.model.User;
import com.buy01.user.service.UserLoginService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class LoginUser {

    private final UserLoginService userloginService;

    @GetMapping("/login")
    public String LoginForm() {
        return "login Form";
    }

    @PostMapping("/login")
    public UserDetails Login(@RequestBody LoginCredentials loginCredentials) {
        User user = userloginService.login(loginCredentials);
        if (user == null) {
            return null;
        }
        return new UserDetails(user.getId(), user.getName(), user.getEmail(), user.getRole());
    }
}
