package org.example.models;

import lombok.Data;

import com.fasterxml.jackson.annotation.JsonProperty;

@Data
public class RefreshTokenRequest {
    @JsonProperty("refreshToken")
    private String refresh;
}
