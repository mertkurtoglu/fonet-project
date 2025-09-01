package com.fonet.real_estate_backend.model;

import lombok.Getter;

@Getter
public enum NumberOfRooms {
    ONE_PLUS_ONE("1+1"),
    TWO_PLUS_ONE("2+1"),
    THREE_PLUS_ONE("3+1"),
    FOUR_PLUS_ONE("4+1"),
    FIVE_PLUS_ONE("5+1"),
    SIX_PLUS_ONE("6+1"),
    SEVEN_PLUS_ONE("7+1"),
    EIGHT_PLUS_ONE("8+1"),
    NINE_PLUS_ONE("9+1"),
    TEN_PLUS_ONE("10+1");

    private final String label;

    NumberOfRooms(String label) {
        this.label = label;
    }

}
