package com.buy01.user.utils;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

public class HashPassword {
    private static final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
    
    public static String hash(String password){
        return encoder.encode(password);
    }
    
}
