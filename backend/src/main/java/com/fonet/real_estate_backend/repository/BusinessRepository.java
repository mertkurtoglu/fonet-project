package com.fonet.real_estate_backend.repository;

import com.fonet.real_estate_backend.model.Business;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * Repository interface for Business entity data access operations.
 */
@Repository
public interface BusinessRepository extends JpaRepository<Business, Long> {
    /**
     * Finds a business entity by its associated user ID.
     * Used to retrieve business profile information for a specific user.
     *
     * @param id The user ID associated with the business
     * @return Optional containing the business if found, empty otherwise
     */
    Optional<Business> findByUserId(Long id);
}