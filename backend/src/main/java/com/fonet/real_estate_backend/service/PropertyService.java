package com.fonet.real_estate_backend.service;

import com.fonet.real_estate_backend.dto.PropertyDTO;
import com.fonet.real_estate_backend.model.Property;
import com.fonet.real_estate_backend.repository.PropertyRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import static com.fonet.real_estate_backend.repository.PropertySpecification.*;
import java.util.List;

/**
 * Service class for property-related business logic operations.
 * Handles complex property search functionality using JPA Specifications
 * and entity-to-DTO conversion for API responses.
 */
@Service
public class PropertyService {

    @Autowired
    private PropertyRepository propertyRepository;

    /**
     * Performs advanced property search using multiple criteria.
     * Combines various search specifications to create a dynamic query
     * and converts results to DTOs for API response.
     *
     * @param propertyType Type of property (apartment, house, etc.)
     * @param propertyStatus Status of property (for sale, for rent, etc.)
     * @param address Location-based search term
     * @param heatingType Type of heating system
     * @param numberOfRooms Number of rooms in the property
     * @param floor Floor number
     * @param minPrice Minimum price filter
     * @param maxPrice Maximum price filter
     * @param minArea Minimum area filter in square meters
     * @param maxArea Maximum area filter in square meters
     * @return List of PropertyDTO objects matching the search criteria
     */
    public List<PropertyDTO> searchProperties(String propertyType,
                                              String propertyStatus,
                                              String address,
                                              String heatingType,
                                              String numberOfRooms,
                                              Integer floor,
                                              Double minPrice,
                                              Double maxPrice,
                                              Double minArea,
                                              Double maxArea) {

        Specification<Property> spec = Specification
                .where(hasPropertyType(propertyType))
                .and(hasPropertyStatus(propertyStatus))
                .and(addressContains(address))
                .and(hasHeatingType(heatingType))
                .and(hasNumberOfRooms(numberOfRooms))
                .and(hasFloor(floor))
                .and(hasMinPrice(minPrice))
                .and(hasMaxPrice(maxPrice))
                .and(hasMinArea(minArea))
                .and(hasMaxArea(maxArea));

        List<Property> properties = propertyRepository.findAll(spec);

        return properties.stream()
                .map(this::convertToDTO)
                .toList();
    }

    /**
     * Converts Property entity to PropertyDTO for API responses.
     * Maps entity fields to DTO fields and handles null safety for related objects.
     * Provides a clean, simplified view of property data for frontend consumption.
     *
     * @param p Property entity to convert
     * @return PropertyDTO containing mapped property information
     */
    public PropertyDTO convertToDTO(Property p) {
        PropertyDTO dto = new PropertyDTO();
        dto.setId(p.getId());
        dto.setPropertyType(p.getPropertyType());
        dto.setArea(p.getArea());
        dto.setNumberOfRooms(String.valueOf(p.getNumberOfRooms()));
        dto.setFloor(p.getFloor());
        dto.setHeatingType(p.getHeatingType());
        dto.setAddress(p.getAddress());
        dto.setDescription(p.getDescription());
        dto.setPrice(p.getPrice());
        dto.setPropertyStatus(p.getPropertyStatus());

        if (p.getOwner() != null) {
            dto.setOwnerId(p.getOwner().getId());
            dto.setOwnerName(p.getOwner().getFirstName() + " " + p.getOwner().getLastName());
        }

        if (p.getImageUrls() != null) {
            dto.setImageUrls(p.getImageUrls());
        }

        return dto;
    }
}
