package com.fonet.real_estate_backend.dto;

import com.fonet.real_estate_backend.model.HeatingType;
import com.fonet.real_estate_backend.model.PropertyStatus;
import com.fonet.real_estate_backend.model.PropertyType;
import lombok.Data;
import java.util.List;

/**
 * Data Transfer Object (DTO) for Property entities.
 * Used to transfer property data between layers without exposing internal entity structure.
 * Provides a clean, simplified view of property information for API responses.
 */
@Data
public class PropertyDTO {
    private Long id;
    private PropertyType propertyType;
    private Double area;
    private String numberOfRooms;
    private Integer floor;
    private HeatingType heatingType;
    private String address;
    private String description;
    private Double price;
    private PropertyStatus propertyStatus;
    private List<String> imageUrls;


    private Long ownerId;
    private String ownerName;
}

