package com.fonet.real_estate_backend.controller;

import com.fonet.real_estate_backend.model.User;
import com.fonet.real_estate_backend.payload.JwtResponse;
import com.fonet.real_estate_backend.payload.RegisterRequest;
import com.fonet.real_estate_backend.payload.LoginRequest;
import com.fonet.real_estate_backend.security.JwtUtils;
import com.fonet.real_estate_backend.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * REST Controller for handling authentication operations.
 * Provides endpoints for user registration and login functionality.
 */
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @Autowired
    private JwtUtils jwtUtils;

    /**
     * Endpoint for user registration.
     * Creates a new user account with the provided registration details.
     *
     * @param registerRequest Contains user registration data (email, password, role)
     * @return ResponseEntity with success message or error details
     */
    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody RegisterRequest registerRequest) {
        try {
            authService.registerUser(registerRequest);
            return new ResponseEntity<>("User registered successfully!", HttpStatus.CREATED);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    /**
     * Endpoint for user login.
     * Authenticates user credentials and returns JWT token on success.
     *
     * @param loginRequest Contains user login credentials (email, password)
     * @return ResponseEntity with JWT response containing token and user info, or error message
     */
    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody LoginRequest loginRequest) {
        try {
            User user = authService.loginUser(loginRequest);
            String token = jwtUtils.generateJwtToken(user.getEmail(), user.getRole().name());

            return ResponseEntity.ok(new JwtResponse(user.getId(),token, user.getEmail(), user.getRole().name()));
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.UNAUTHORIZED);
        }
    }
}