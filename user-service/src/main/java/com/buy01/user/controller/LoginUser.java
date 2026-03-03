package com.buy01.user.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class LoginUser {

    @GetMapping("/login")
    public String Login() {
        return "login user";
    }
}
