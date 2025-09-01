package com.fonet.real_estate_backend.security;

import com.fonet.real_estate_backend.model.User;
import com.fonet.real_estate_backend.repository.UserRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

/**
 * JWT Authentication Filter that intercepts HTTP requests to validate JWT tokens.
 * Extends OncePerRequestFilter to ensure the filter is executed only once per request.
 * Validates JWT tokens from Authorization header and sets up Spring Security context.
 */
@Component
public class JwtAuthFilter extends OncePerRequestFilter {

    private final JwtUtils jwtUtils;
    private final UserRepository userRepository;

    /**
     * Constructor for dependency injection.
     *
     * @param jwtUtils Utility class for JWT token operations
     * @param userRepository Repository for accessing user data
     */
    public JwtAuthFilter(JwtUtils jwtUtils, UserRepository userRepository) {
        this.jwtUtils = jwtUtils;
        this.userRepository = userRepository;
    }

    /**
     * Main filter method that processes each HTTP request for JWT authentication.
     * Extracts a JWT token from the Authorization header, validates it, and sets up the authentication context.
     *
     * @param request HTTP request containing a potential JWT token
     * @param response HTTP response object
     * @param filterChain Filter chain to continue request processing
     * @throws ServletException if servlet processing fails
     * @throws IOException if I/O operation fails
     */
    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {

        String authHeader = request.getHeader("Authorization");

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);

            if (jwtUtils.validateJwtToken(token)) {
                String email = jwtUtils.getUserEmailFromJwtToken(token);
                User user = userRepository.findByEmail(email).orElse(null);

                if (user != null) {
                    List<GrantedAuthority> authorities = List.of(
                            new SimpleGrantedAuthority(user.getRole().name())
                    );

                    UsernamePasswordAuthenticationToken auth =
                            new UsernamePasswordAuthenticationToken(user.getEmail(), null, authorities);

                    SecurityContextHolder.getContext().setAuthentication(auth);
                }
            }
        }

        filterChain.doFilter(request, response);
    }
}
