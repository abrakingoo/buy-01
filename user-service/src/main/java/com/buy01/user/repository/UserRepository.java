package com.buy01.user.repository;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.buy01.user.model.User;

public interface UserRepository extends MongoRepository<User, String> {
    User findByEmail(String email);
}
