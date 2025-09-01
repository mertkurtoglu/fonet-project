package com.fonet.real_estate_backend.payload;

import lombok.Data;

/**
 * Request payload class for user login authentication.
 * Contains credentials required for user authentication.
 */
@Data
public class LoginRequest {
    private String email;
    private String password;
}