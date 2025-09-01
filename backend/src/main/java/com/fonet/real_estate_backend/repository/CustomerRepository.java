package com.fonet.real_estate_backend.repository;

import com.fonet.real_estate_backend.model.Customer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repository interface for Customer entity data access operations.
 */
@Repository
public interface CustomerRepository extends JpaRepository<Customer, Long> {
    /**
     * Finds a customer entity by its associated user ID.
     * Used to retrieve customer profile information for a specific user.
     *
     * @param userId The user ID associated with the customer
     * @return Optional containing the customer if found, empty otherwise
     */
    Optional<Customer> findByUserId(Long userId);

    /**
     * Searches customers by first name or last name (case-insensitive).
     * Performs a partial match search on both first and last name fields.
     *
     * @param firstName Search term to match against first name
     * @param lastName Search term to match against last name
     * @return List of customers matching the search criteria
     */
    List<Customer> findByFirstNameContainingIgnoreCaseOrLastNameContainingIgnoreCase(String firstName, String lastName);
}