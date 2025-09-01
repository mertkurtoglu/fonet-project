package com.fonet.real_estate_backend.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Property {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    private PropertyType propertyType;

    @Positive(message = "The field must be a positive value")
    private double area;

    @Enumerated(EnumType.STRING)
    private NumberOfRooms numberOfRooms;

    @Positive(message = "The field must be a positive value")
    private int floor;

    @Enumerated(EnumType.STRING)
    private HeatingType heatingType;

    @NotBlank(message = "Address cannot be blank")
    @Size(min = 2, max = 50, message = "Address must be between 2 and 50 characters")
    private String address;

    @NotBlank(message = "Description cannot be blank")
    @Size(min = 2, max = 50, message = "Description must be between 2 and 50 characters")
    private String description;

    @Positive(message = "The field must be a positive value")
    private double price;

    @Enumerated(EnumType.STRING)
    private PropertyStatus propertyStatus;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "property_image_urls", joinColumns = @JoinColumn(name = "property_id"))
    @Column(name = "image_urls")
    private List<String> imageUrls;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "owner_id", nullable = false)
    @JsonIgnore
    private Customer owner;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "lister_id")
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private User lister;
}