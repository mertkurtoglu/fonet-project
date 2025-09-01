package com.fonet.real_estate_backend.service;

import com.fonet.real_estate_backend.model.Business;
import com.fonet.real_estate_backend.model.Customer;
import com.fonet.real_estate_backend.model.Role;
import com.fonet.real_estate_backend.model.User;
import com.fonet.real_estate_backend.payload.RegisterRequest;
import com.fonet.real_estate_backend.payload.LoginRequest;
import com.fonet.real_estate_backend.repository.BusinessRepository;
import com.fonet.real_estate_backend.repository.CustomerRepository;
import com.fonet.real_estate_backend.repository.UserRepository;
import com.fonet.real_estate_backend.security.JwtUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service class for handling authentication-related business logic.
 * Manages user registration, login processes, and role-based profile creation.
 * Ensures data integrity through transactional operations.
 */
@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private BusinessRepository businessRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtils jwtUtils;

    /**
     * Registers a new user with role-based profile creation.
     * Creates user account and associated customer or business profile based on role.
     * Uses @Transactional to ensure data consistency across multiple table operations.
     *
     * @param request Registration request containing user details and role information
     * @throws IllegalArgumentException if email exists, passwords don't match, or role is invalid
     */
    @Transactional
    public void registerUser(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("This email address is already in use!");
        }

        if (!request.getPassword().equals(request.getConfirmPassword())) {
            throw new IllegalArgumentException("Passwords do not match!");
        }

        User user = new User();
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));

        try {
            Role userRole = Role.valueOf(request.getRole().toUpperCase());
            user.setRole(userRole);
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Invalid role specified!");
        }

        User savedUser = userRepository.save(user);

        if (savedUser.getRole() == Role.CUSTOMER) {
            Customer customer = new Customer();
            customer.setFirstName(request.getFirstName());
            customer.setLastName(request.getLastName());
            customer.setPhoneNumber(request.getPhoneNumber());
            customer.setAddress(request.getAddress());
            customer.setUser(savedUser);
            customerRepository.save(customer);
        } else if (savedUser.getRole() == Role.BUSINESS) {
            Business business = new Business();
            business.setBusinessName(request.getBusinessName());
            business.setFirstName(request.getFirstName());
            business.setLastName(request.getLastName());
            business.setPhoneNumber(request.getPhoneNumber());
            business.setAddress(request.getAddress());
            business.setUser(savedUser);
            businessRepository.save(business);
        }
    }

    /**
     * Authenticates user login credentials.
     * Validates email existence and password correctness using encoded password comparison.
     *
     * @param request Login request containing email and password
     * @return Authenticated User entity if credentials are valid
     * @throws IllegalArgumentException if email doesn't exist or password is incorrect
     */
    public User loginUser(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("Invalid username or password"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new IllegalArgumentException("Invalid username or password");
        }
        return user;
    }
}