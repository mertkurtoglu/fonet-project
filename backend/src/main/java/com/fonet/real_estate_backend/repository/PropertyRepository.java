package com.fonet.real_estate_backend.repository;

import com.fonet.real_estate_backend.model.Property;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repository interface for Property entity data access operations.
 */
@Repository
public interface PropertyRepository extends JpaRepository<Property, Long>, JpaSpecificationExecutor<Property> {
    /**
     * Finds all properties listed by a specific user.
     * Used to retrieve properties that belong to a particular lister.
     * Useful for user dashboards to show "My Properties" listings.
     *
     * @param listerId The ID of the user who listed the properties
     * @return List of properties listed by the specified user
     */
    List<Property> findByLister_Id(Long listerId);
}