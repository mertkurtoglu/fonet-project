package com.fonet.real_estate_backend.payload;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

/**
 * Request payload class for user registration.
 * Contains all necessary information for creating new user accounts
 * with associated customer or business profiles.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class RegisterRequest {
    private String email;
    private String password;
    private String confirmPassword;
    private String role;

    private String firstName;
    private String lastName;

    private String businessName;

    private String phoneNumber;
    private String address;
}