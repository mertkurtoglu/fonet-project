package com.fonet.real_estate_backend.payload;

import lombok.Data;

/**
 * Response payload class for JWT authentication.
 * Contains authentication token and user information returned after successful login.
 */
@Data
public class JwtResponse {
    private Long id;
    private String token;
    private String type = "Bearer";
    private String email;
    private String role;

    public JwtResponse(Long id, String token, String email, String role) {
        this.id = id;
        this.token = token;
        this.email = email;
        this.role = role;
    }
}