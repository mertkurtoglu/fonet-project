package com.fonet.real_estate_backend.controller;

import com.fonet.real_estate_backend.model.Customer;
import com.fonet.real_estate_backend.repository.CustomerRepository;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

/**
 * REST Controller for managing customer entities.
 * Provides CRUD operations and search functionality for customer profiles.
 */
@RestController
@RequestMapping("/api/customers")
public class CustomerController {

    @Autowired
    private CustomerRepository customerRepository;

    /**
     * Retrieves all customer entities from the database.
     *
     * @return List of all customers
     */
    @GetMapping
    public List<Customer> getAllCustomers() {
        return customerRepository.findAll();
    }

    /**
     * Retrieves a specific customer by user ID.
     *
     * @param userId The ID of the user associated with the customer
     * @return ResponseEntity containing the customer if found, or 404 Not Found
     */
    @GetMapping("/{id}")
    public ResponseEntity<Customer> getCustomerByUserId(@PathVariable("id") Long userId) {
        return customerRepository.findByUserId(userId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Searches customers by first name or last name (case-insensitive).
     * Useful for finding customers during property management or communication.
     *
     * @param query The search term to match against first name or last name
     * @return List of customers matching the search criteria
     */
    @GetMapping("/search")
    public List<Customer> searchCustomers(@RequestParam String query) {
        return customerRepository.findByFirstNameContainingIgnoreCaseOrLastNameContainingIgnoreCase(query, query);
    }

    /**
     * Creates a new customer entity.
     * Validates the customer data before saving to the database.
     *
     * @param customer The customer entity to create (validated)
     * @return The created customer entity
     */
    @PostMapping
    public Customer createCustomer(@Valid @RequestBody Customer customer) {
        return customerRepository.save(customer);
    }

    /**
     * Updates an existing customer entity by ID.
     * Updates all customer fields with the provided data.
     *
     * @param id The ID of the customer to update
     * @param customerDetails The updated customer data
     * @return ResponseEntity containing the updated customer if found, or 404 Not Found
     */
    @PutMapping("/{id}")
    public ResponseEntity<Customer> updateCustomer(@PathVariable Long id, @RequestBody Customer customerDetails) {
        return customerRepository.findById(id)
                .map(customer -> {
                    customer.setFirstName(customerDetails.getFirstName());
                    customer.setLastName(customerDetails.getLastName());
                    customer.setPhoneNumber(customerDetails.getPhoneNumber());
                    customer.setAddress(customerDetails.getAddress());
                    return ResponseEntity.ok(customerRepository.save(customer));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Deletes a customer entity by ID.
     *
     * @param id The ID of the customer to delete
     * @return ResponseEntity with 200 OK if deleted, or 404 Not Found if customer doesn't exist
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCustomer(@PathVariable Long id) {
        return customerRepository.findById(id)
                .map(customer -> {
                    customerRepository.delete(customer);
                    return ResponseEntity.ok().<Void>build();
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
