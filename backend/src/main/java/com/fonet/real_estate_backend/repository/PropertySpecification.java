package com.fonet.real_estate_backend.repository;

import com.fonet.real_estate_backend.model.Property;
import com.fonet.real_estate_backend.model.PropertyType;
import com.fonet.real_estate_backend.model.HeatingType;
import com.fonet.real_estate_backend.model.PropertyStatus;
import org.springframework.data.jpa.domain.Specification;

/**
 * Specification class for building dynamic JPA queries for Property entities.
 * Provides static methods to create individual search criteria that can be combined
 * for complex property search functionality using JPA Criteria API.
 */
public class PropertySpecification {
    public static Specification<Property> hasPropertyType(String propertyType) {
        return (root, query, criteriaBuilder) -> {
            if (propertyType == null || propertyType.isEmpty()) {
                return criteriaBuilder.conjunction();
            }
            try {
                PropertyType enumValue = PropertyType.valueOf(propertyType.toUpperCase());
                return criteriaBuilder.equal(root.get("propertyType"), enumValue);
            } catch (IllegalArgumentException e) {
                return criteriaBuilder.disjunction();
            }
        };
    }

    public static Specification<Property> hasHeatingType(String heatingType) {
        return (root, query, criteriaBuilder) -> {
            if (heatingType == null || heatingType.isEmpty()) {
                return criteriaBuilder.conjunction();
            }
            try {
                HeatingType enumValue = HeatingType.valueOf(heatingType.toUpperCase());
                return criteriaBuilder.equal(root.get("heatingType"), enumValue);
            } catch (IllegalArgumentException e) {
                return criteriaBuilder.disjunction();
            }
        };
    }

    public static Specification<Property> hasPropertyStatus(String propertyStatus) {
        return (root, query, criteriaBuilder) -> {
            if (propertyStatus == null || propertyStatus.isEmpty()) {
                return criteriaBuilder.conjunction();
            }
            try {
                PropertyStatus enumValue = PropertyStatus.valueOf(propertyStatus.toUpperCase());
                return criteriaBuilder.equal(root.get("propertyStatus"), enumValue);
            } catch (IllegalArgumentException e) {
                return criteriaBuilder.disjunction();
            }
        };
    }

    public static Specification<Property> hasMinPrice(Double minPrice) {
        return (root, query, criteriaBuilder) ->
                minPrice != null ? criteriaBuilder.greaterThanOrEqualTo(root.get("price"), minPrice) : criteriaBuilder.conjunction();
    }

    public static Specification<Property> hasMaxPrice(Double maxPrice) {
        return (root, query, criteriaBuilder) ->
                maxPrice != null ? criteriaBuilder.lessThanOrEqualTo(root.get("price"), maxPrice) : criteriaBuilder.conjunction();
    }

    public static Specification<Property> hasMinArea(Double minArea) {
        return (root, query, criteriaBuilder) ->
                minArea != null ? criteriaBuilder.greaterThanOrEqualTo(root.get("area"), minArea) : criteriaBuilder.conjunction();
    }

    public static Specification<Property> hasMaxArea(Double maxArea) {
        return (root, query, criteriaBuilder) ->
                maxArea != null ? criteriaBuilder.lessThanOrEqualTo(root.get("area"), maxArea) : criteriaBuilder.conjunction();
    }

    public static Specification<Property> hasNumberOfRooms(String numberOfRooms) {
        return (root, query, criteriaBuilder) ->
                numberOfRooms != null ? criteriaBuilder.equal(root.get("numberOfRooms"), numberOfRooms) : criteriaBuilder.conjunction();
    }

    public static Specification<Property> hasFloor(Integer floor) {
        return (root, query, criteriaBuilder) ->
                floor != null ? criteriaBuilder.equal(root.get("floor"), floor) : criteriaBuilder.conjunction();
    }

    public static Specification<Property> addressContains(String address) {
        return (root, query, criteriaBuilder) ->
                address != null && !address.isEmpty() ?
                        criteriaBuilder.like(criteriaBuilder.lower(root.get("address")),
                                "%" + address.toLowerCase() + "%") : criteriaBuilder.conjunction();
    }
}