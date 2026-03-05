package com.buy01.user.utils;

import java.util.UUID;

public class GenerateUserId {
    public static String generate() {
        return UUID.randomUUID().toString();
    }
}
