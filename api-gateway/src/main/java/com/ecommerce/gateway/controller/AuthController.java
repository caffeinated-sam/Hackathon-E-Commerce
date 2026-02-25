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

import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.beans.factory.annotation.Value;
import java.util.Map;

@Configuration
public class AuthController {

    @Autowired
    private AuthHandler authHandler;

    @Bean
    public RouterFunction<ServerResponse> authRoutes() {
        return RouterFunctions.route()
                .POST("/auth/token", authHandler::generateToken)
                .POST("/auth/register", authHandler::register)
                .GET("/auth/health", authHandler::health)
                .build();
    }
}

@Component
class AuthHandler {

    @Autowired
    private JwtUtil jwtUtil;

    @Value("${USER_SERVICE_URL:http://localhost:8083}")
    private String userServiceUrl;

    private final WebClient webClient;

    public AuthHandler(WebClient.Builder webClientBuilder) {
        this.webClient = webClientBuilder.build();
    }

    @SuppressWarnings("unchecked")
    public Mono<ServerResponse> generateToken(ServerRequest request) {
        return request.bodyToMono(Map.class)
                .flatMap(body -> webClient.post()
                        .uri(userServiceUrl + "/users/validate")
                        .bodyValue(body)
                        .retrieve()
                        .bodyToMono(Map.class)
                        .flatMap(user -> {
                            String username = (String) user.get("username");
                            String role = (String) user.get("role");
                            String token = jwtUtil.generateToken(username, role);
                            return ServerResponse.ok()
                                    .contentType(MediaType.APPLICATION_JSON)
                                    .bodyValue(Map.of(
                                            "token", token,
                                            "username", username,
                                            "role", role,
                                            "type", "Bearer"));
                        })
                        .onErrorResume(e -> ServerResponse.status(HttpStatus.UNAUTHORIZED)
                                .contentType(MediaType.APPLICATION_JSON)
                                .bodyValue(Map.of("error", "Invalid credentials"))))
                .onErrorResume(e -> ServerResponse.badRequest()
                        .contentType(MediaType.APPLICATION_JSON)
                        .bodyValue(Map.of("error", "Invalid request body")));
    }

    public Mono<ServerResponse> register(ServerRequest request) {
        return request.bodyToMono(Map.class)
                .flatMap(body -> webClient.post()
                        .uri(userServiceUrl + "/users/register")
                        .bodyValue(body)
                        .retrieve()
                        .bodyToMono(Map.class)
                        .flatMap(registeredUser -> ServerResponse.status(HttpStatus.CREATED)
                                .contentType(MediaType.APPLICATION_JSON)
                                .bodyValue(registeredUser))
                        .onErrorResume(e -> ServerResponse.badRequest()
                                .contentType(MediaType.APPLICATION_JSON)
                                .bodyValue(Map.of("error", "Registration failed: " + e.getMessage()))));
    }

    public Mono<ServerResponse> health(ServerRequest request) {
        return ServerResponse.ok()
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue(Map.of("status", "API Gateway is running", "service", "api-gateway"));
    }
}
