package com.buy01.user.service;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.buy01.user.dto.LoginCredentials;
import com.buy01.user.model.User;
import com.buy01.user.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserLoginService {

    private final UserRepository userRepo;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public User login(LoginCredentials loginCredentials){
        User user = userRepo.findByEmail(loginCredentials.email());
        if (user == null || !passwordEncoder.matches(loginCredentials.password(), user.getPasswordHash())) {
            return null;
        }
        return user;
    }
    
}
