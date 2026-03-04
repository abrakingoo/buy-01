package com.buy01.user.service;

import org.springframework.stereotype.Service;

import com.buy01.user.dto.UserRegistartionDetails;
import com.buy01.user.model.User;
import com.buy01.user.repository.UserRepository;
import com.buy01.user.utils.GenerateUserId;
import com.buy01.user.utils.HashPassword;

import lombok.RequiredArgsConstructor;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class UserRegistarionService {

    private final UserRepository userRepo;

    public User saveUser(UserRegistartionDetails userRegistartionDetails){
        
        String hashedPassword = HashPassword.hash(userRegistartionDetails.password());
        
        User user = new User(
            GenerateUserId.generate(),
            userRegistartionDetails.email(),
            hashedPassword,
            userRegistartionDetails.role(),
            userRegistartionDetails.name(),
            "http://avatar.com/123456789",
            LocalDateTime.now(),
            LocalDateTime.now()
        );

        return userRepo.save(user);
    }

}
