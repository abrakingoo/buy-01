package com.buy01.user.service;

import org.springframework.stereotype.Service;

import com.buy01.user.dto.UserRegistartionDetails;
import com.buy01.user.event.UserEventProducer;
import com.buy01.user.event.UserRegisteredEvent;
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
    private final UserEventProducer userEventProducer;

    public User saveUser(UserRegistartionDetails userRegistartionDetails){
        if(userRepo.findByEmail(userRegistartionDetails.email()) != null){
            return null;
        }
        
        String hashedPassword = HashPassword.hash(userRegistartionDetails.password());
        
        String userId = GenerateUserId.generate();
        User user = new User(
            userId,
            userRegistartionDetails.email(),
            hashedPassword,
            userRegistartionDetails.role(),
            userRegistartionDetails.name(),
            "http://avatar.com/123456789",
            LocalDateTime.now(),
            LocalDateTime.now()
        );

        User savedUser = userRepo.save(user);
        
        userEventProducer.publishUserRegistered(new UserRegisteredEvent(
            userId,
            userRegistartionDetails.email(),
            userRegistartionDetails.name(),
            userRegistartionDetails.role(),
            System.currentTimeMillis()
        ));
        
        return savedUser;
    }

}
