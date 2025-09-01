package com.fonet.real_estate_backend.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;

/**
 * Utility class for JWT (JSON Web Token) operations.
 * Handles token generation, validation, and claim extraction for authentication purposes.
 * Uses HMAC-SHA256 algorithm for token signing and verification.
 */
@Component
public class JwtUtils {

    @Value("${fonet.app.jwtSecret}")
    private String jwtSecret;

    @Value("${fonet.app.jwtExpirationMs}")
    private int jwtExpirationMs;

    /**
     * Creates and returns the signing key for JWT operations.
     * Decodes the Base64-encoded secret and creates HMAC-SHA key.
     *
     * @return HMAC-SHA256 signing key
     */
    private Key key() {
        return Keys.hmacShaKeyFor(Decoders.BASE64.decode(jwtSecret));
    }

    /**
     * Generates a JWT token for authenticated user.
     * Includes user email as subject, role as custom claim, and expiration time.
     *
     * @param email User's email address (used as token subject)
     * @param role User's role in the system (added as custom claim)
     * @return Generated JWT token as string
     */
    public String generateJwtToken(String email, String role) {
        return Jwts.builder()
                .setSubject(email)
                .claim("role", role)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + jwtExpirationMs))
                .signWith(key(), SignatureAlgorithm.HS256)
                .compact();
    }

    /**
     * Extracts user email from JWT token.
     *
     * @param token JWT token to extract email from
     * @return User's email address from token subject
     */
    public String getUserEmailFromJwtToken(String token) {
        return parseClaims(token).getSubject();
    }

    /**
     * Extracts user role from JWT token.
     *
     * @param token JWT token to extract role from
     * @return User's role from custom claim
     */
    public String getRoleFromJwtToken(String token) {
        return parseClaims(token).get("role", String.class);
    }

    /**
     * Validates JWT token signature and expiration.
     * Returns true for valid tokens, false for invalid or expired tokens.
     *
     * @param authToken JWT token to validate
     * @return true if token is valid, false otherwise
     */
    public boolean validateJwtToken(String authToken) {
        try {
            Jwts.parser().setSigningKey(key()).build().parseClaimsJws(authToken);
            return true;
        } catch (JwtException e) {
            return false;
        }
    }

    /**
     * Parses JWT token and extracts all claims.
     * Used internally by other methods to extract specific claim values.
     *
     * @param token JWT token to parse
     * @return Claims object containing all token claims
     */
    private Claims parseClaims(String token) {
        return Jwts.parser().setSigningKey(key()).build().parseClaimsJws(token).getBody();
    }
}
