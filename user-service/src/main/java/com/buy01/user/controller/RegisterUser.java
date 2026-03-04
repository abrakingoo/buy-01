package com.buy01.user.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.buy01.user.dto.UserRegistartionDetails;
import com.buy01.user.model.User;
import com.buy01.user.service.UserRegistarionService;
import com.buy01.user.dto.UserDetails; 


import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class RegisterUser {

    private final UserRegistarionService userRegistarionService;
    
    @GetMapping("/register")
    public String registerUser(){
        return "registration form";
    }

    @PostMapping("/register")
    public UserDetails register(@RequestBody UserRegistartionDetails userRegistartionDetails){
        User user = userRegistarionService.saveUser(userRegistartionDetails);
        System.out.println("User registered: " + user);
        return new com.buy01.user.dto.UserDetails(user.getId(), user.getName(), user.getEmail(), user.getRole());
    }
    
}
