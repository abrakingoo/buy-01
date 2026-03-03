package com.buy01.gateway.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.reactive.EnableWebFluxSecurity;
import org.springframework.security.config.web.server.ServerHttpSecurity;
import org.springframework.security.web.server.SecurityWebFilterChain;

@Configuration
@EnableWebFluxSecurity
public class SecurityConfig {

    @Bean
    public SecurityWebFilterChain securityWebFilterChain(ServerHttpSecurity http) {
        return http
            .csrf(csrf -> csrf.disable())
            .authorizeExchange(exchange -> exchange
                .pathMatchers("/api/auth/**").permitAll()
                .pathMatchers("/api/products/**").permitAll()
                .pathMatchers("/api/users/**").permitAll()
                .pathMatchers("/api/media/**").permitAll()
                .pathMatchers("/eureka/**").permitAll()
                .anyExchange().permitAll()
            )
            .build();
    }
}
