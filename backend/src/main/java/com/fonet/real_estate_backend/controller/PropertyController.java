package com.fonet.real_estate_backend.controller;

import com.fonet.real_estate_backend.dto.PropertyDTO;
import com.fonet.real_estate_backend.model.*;
import com.fonet.real_estate_backend.repository.*;
import com.fonet.real_estate_backend.service.PropertyService;
import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

/**
 * REST Controller for managing property entities.
 * Handles property CRUD operations, file uploads, search functionality, and user-specific property listings.
 */
@RestController
@RequestMapping("/api/properties")
public class PropertyController {

    @Autowired
    private PropertyRepository propertyRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BusinessRepository businessRepository;

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private PropertyService propertyService;

    private static final String UPLOAD_DIR = "uploads/";

    /**
     * Retrieves all properties and converts them to DTOs for public display.
     *
     * @return List of PropertyDTO objects containing property information
     */
    @GetMapping
    public List<PropertyDTO> getAllProperties() {
        List<Property> properties = propertyRepository.findAll();
        return properties.stream()
                .map(propertyService::convertToDTO)
                .toList();
    }

    /**
     * Retrieves a specific property by its ID.
     *
     * @param id The ID of the property to retrieve
     * @return ResponseEntity containing the property if found, or 404 Not Found
     */
    @GetMapping("/{id}")
    public ResponseEntity<Property> getPropertyById(@PathVariable Long id) {
        return propertyRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Searches properties based on various criteria.
     * All parameters are optional for flexible filtering.
     *
     * @param propertyType Type of property (apartment, house, etc.)
     * @param propertyStatus Status of property (for sale, for rent, etc.)
     * @param address Location-based search
     * @param heatingType Heating system type
     * @param numberOfRooms Number of rooms
     * @param floor Floor number
     * @param minPrice Minimum price filter
     * @param maxPrice Maximum price filter
     * @param minArea Minimum area filter
     * @param maxArea Maximum area filter
     * @return List of PropertyDTO objects matching the search criteria
     */
    @GetMapping("/search")
    public List<PropertyDTO> searchProperties(
            @RequestParam(required = false) String propertyType,
            @RequestParam(required = false) String propertyStatus,
            @RequestParam(required = false) String address,
            @RequestParam(required = false) String heatingType,
            @RequestParam(required = false) String numberOfRooms,
            @RequestParam(required = false) Integer floor,
            @RequestParam(required = false) Double minPrice,
            @RequestParam(required = false) Double maxPrice,
            @RequestParam(required = false) Double minArea,
            @RequestParam(required = false) Double maxArea
    ) {
        return propertyService.searchProperties(propertyType, propertyStatus, address, heatingType,
                numberOfRooms, floor, minPrice, maxPrice, minArea, maxArea);
    }

    /**
     * Retrieves properties listed by the currently authenticated user.
     * Used for a user dashboard to show their own property listings.
     *
     * @return List of properties owned by the current user
     */
    @GetMapping("/my-properties")
    public List<Property> getMyProperties() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return new ArrayList<>();
        }

        String email = authentication.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + email));

        return propertyRepository.findByLister_Id(user.getId());
    }

    /**
     * Creates a new property with file uploads (images).
     * Handles role-based logic for property ownership and listing assignments.
     *
     * @param property The property data to create
     * @param files Optional array of image files to upload
     * @param listerId ID of the user who will list the property
     * @param ownerId ID of the customer who owns the property
     * @return The created property entity
     * @throws IOException if file upload fails
     */
    @PostMapping(consumes = {"multipart/form-data"})
    public Property createProperty(@Valid @RequestPart("property") Property property,
                                   @RequestPart(value = "files", required = false) MultipartFile[] files,
                                   @RequestParam(value = "listerId", required = false) Long listerId,
                                   @RequestParam(value = "ownerId", required = false) Long ownerId) throws IOException {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + email));

        if (!Role.BUSINESS.equals(user.getRole()) && !Role.CUSTOMER.equals(user.getRole())) {
            throw new IllegalArgumentException("Only customer or business accounts can create properties.");
        }

        List<String> imageUrls = new ArrayList<>();
        if (files != null) {
            Path uploadPath = Paths.get(UPLOAD_DIR);
            if (!Files.exists(uploadPath)) Files.createDirectories(uploadPath);

            for (MultipartFile file : files) {
                String fileName = UUID.randomUUID() + "_" + file.getOriginalFilename();
                Path filePath = uploadPath.resolve(fileName);
                Files.copy(file.getInputStream(), filePath);
                imageUrls.add("/" + UPLOAD_DIR + fileName);
            }
        }
        property.setImageUrls(imageUrls);

        if (Role.BUSINESS.equals(user.getRole())) {
            Customer owner = customerRepository.findById(ownerId)
                    .orElseThrow(() -> new EntityNotFoundException("Customer not found"));
            property.setOwner(owner);

            Business lister = businessRepository.findByUserId(listerId)
                    .orElseThrow(() -> new EntityNotFoundException("Lister not found"));
            property.setLister(lister.getUser());
        } else {
            Customer owner = customerRepository.findByUserId(user.getId())
                    .orElseThrow(() -> new IllegalStateException("Customer profile not found"));
            property.setOwner(owner);

            Customer lister = customerRepository.findByUserId(listerId)
                    .orElseThrow(() -> new EntityNotFoundException("Lister not found"));
            property.setLister(lister.getUser());
        }

        property.setLister(user);

        return propertyRepository.save(property);
    }

    /**
     * Updates an existing property with optional new image uploads.
     *
     * @param id The ID of the property to update
     * @param propertyDetails The updated property information
     * @param files Optional new image files to replace existing ones
     * @return ResponseEntity containing the updated property if found, or 404 Not Found
     * @throws IOException if file upload fails
     */
    @PutMapping(value = "/{id}", consumes = {"multipart/form-data"})
    public ResponseEntity<Property> updateProperty(@PathVariable Long id,
                                                   @RequestPart("property") Property propertyDetails,
                                                   @RequestPart(value = "files", required = false) MultipartFile[] files) throws IOException {

        return propertyRepository.findById(id)
                .map(existingProperty -> {
                    existingProperty.setPropertyType(propertyDetails.getPropertyType());
                    existingProperty.setArea(propertyDetails.getArea());
                    existingProperty.setNumberOfRooms(propertyDetails.getNumberOfRooms());
                    existingProperty.setFloor(propertyDetails.getFloor());
                    existingProperty.setHeatingType(propertyDetails.getHeatingType());
                    existingProperty.setAddress(propertyDetails.getAddress());
                    existingProperty.setDescription(propertyDetails.getDescription());
                    existingProperty.setPrice(propertyDetails.getPrice());

                    if (files != null && files.length > 0) {
                        List<String> newImageUrls = new ArrayList<>();
                        try {
                            Path uploadPath = Paths.get(UPLOAD_DIR);
                            if (!Files.exists(uploadPath)) {
                                Files.createDirectories(uploadPath);
                            }

                            for (MultipartFile file : files) {
                                String fileName = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
                                Path filePath = uploadPath.resolve(fileName);
                                Files.copy(file.getInputStream(), filePath);
                                newImageUrls.add("/" + UPLOAD_DIR + fileName);
                            }
                        } catch (IOException e) {
                            e.printStackTrace();
                        }
                        existingProperty.setImageUrls(newImageUrls);
                    }
                    return ResponseEntity.ok(propertyRepository.save(existingProperty));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Deletes a property by its ID.
     *
     * @param id The ID of the property to delete
     * @return ResponseEntity with 200 OK if deleted, or 404 Not Found if the property doesn't exist
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProperty(@PathVariable Long id) {
        return propertyRepository.findById(id)
                .map(property -> {
                    propertyRepository.delete(property);
                    return ResponseEntity.ok().<Void>build();
                })
                .orElse(ResponseEntity.notFound().build());
    }
}