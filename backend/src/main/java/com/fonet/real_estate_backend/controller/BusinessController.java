package com.fonet.real_estate_backend.controller;

import com.fonet.real_estate_backend.model.Business;
import com.fonet.real_estate_backend.repository.BusinessRepository;
import com.fonet.real_estate_backend.repository.UserRepository;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

/**
 * REST Controller for managing business entities.
 * Provides CRUD operations for business profiles in the application.
 */
@RestController
@RequestMapping("/api/business")
public class BusinessController {

    @Autowired
    private BusinessRepository businessRepository;
    @Autowired
    private UserRepository userRepository;

    /**
     * Retrieves all business entities from the database.
     *
     * @return List of all businesses
     */
    @GetMapping
    public List<Business> getAllBusinesses() {
        return businessRepository.findAll();
    }

    /**
     * Retrieves a specific business by user ID.
     *
     * @param userId The ID of the user associated with the business
     * @return ResponseEntity containing the business if found, or 404 Not Found
     */
    @GetMapping("/{id}")
    public ResponseEntity<Business> getBusinessByUserId(@PathVariable("id") Long userId) {
        return businessRepository.findByUserId(userId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Creates a new business entity.
     * Validates the business data before saving to the database.
     *
     * @param business The business entity to create (validated)
     * @return The created business entity
     */
    @PostMapping
    public Business createBusiness(@Valid @RequestBody Business business) {
        return businessRepository.save(business);
    }

    /**
     * Updates an existing business entity by ID.
     * Updates all business fields with the provided data.
     *
     * @param id The ID of the business to update
     * @param businessDetails The updated business data
     * @return ResponseEntity containing the updated business if found, or 404 Not Found
     */
    @PutMapping("/{id}")
    public ResponseEntity<Business> updateBusiness(@PathVariable Long id, @RequestBody Business businessDetails) {
        return businessRepository.findById(id)
                .map(business -> {
                    business.setBusinessName(businessDetails.getBusinessName());
                    business.setFirstName(businessDetails.getFirstName());
                    business.setLastName(businessDetails.getLastName());
                    business.setAddress(businessDetails.getAddress());
                    business.setPhoneNumber(businessDetails.getPhoneNumber());
                    return ResponseEntity.ok(businessRepository.save(business));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Deletes a business entity by ID.
     *
     * @param id The ID of the business to delete
     * @return ResponseEntity with 200 OK if deleted, or 404 Not Found if business doesn't exist
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBusiness(@PathVariable Long id) {
        return businessRepository.findById(id)
                .map(business -> {
                    businessRepository.delete(business);
                    return ResponseEntity.ok().<Void>build();
                })
                .orElse(ResponseEntity.notFound().build());
    }
}