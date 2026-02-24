package com.ecommerce.gateway.controller;

import com.ecommerce.gateway.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.server.*;
import reactor.core.publisher.Mono;

import java.util.Map;

@Configuration
public class AuthController {

    @Autowired
    private AuthHandler authHandler;

    @Bean
    public RouterFunction<ServerResponse> authRoutes() {
        return RouterFunctions.route()
                .POST("/auth/token", authHandler::generateToken)
                .GET("/auth/health", authHandler::health)
                .build();
    }
}

@Component
class AuthHandler {

    @Autowired
    private JwtUtil jwtUtil;

    @SuppressWarnings("unchecked")
    public Mono<ServerResponse> generateToken(ServerRequest request) {
        return request.bodyToMono(Map.class)
                .flatMap(body -> {
                    String username = (String) body.get("username");
                    String password = (String) body.get("password");
                    String role = body.getOrDefault("role", "USER").toString();

                    if (username == null || password == null) {
                        return ServerResponse.badRequest()
                                .contentType(MediaType.APPLICATION_JSON)
                                .bodyValue(Map.of("error", "username and password required"));
                    }

                    if (("admin".equals(username) && "admin".equals(password)) ||
                            ("user".equals(username) && "user".equals(password)) ||
                            ("testuser".equals(username) && "test123".equals(password))) {

                        if ("admin".equals(username))
                            role = "ADMIN";

                        String token = jwtUtil.generateToken(username, role);
                        return ServerResponse.ok()
                                .contentType(MediaType.APPLICATION_JSON)
                                .bodyValue(Map.of(
                                        "token", token,
                                        "username", username,
                                        "role", role,
                                        "type", "Bearer"));
                    }

                    return ServerResponse.status(HttpStatus.UNAUTHORIZED)
                            .contentType(MediaType.APPLICATION_JSON)
                            .bodyValue(Map.of("error", "Invalid credentials"));
                });
    }

    public Mono<ServerResponse> health(ServerRequest request) {
        return ServerResponse.ok()
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue(Map.of("status", "API Gateway is running", "service", "api-gateway"));
    }
}
