package org.example.models;

import lombok.AllArgsConstructor;
import lombok.Data;
import com.fasterxml.jackson.annotation.JsonProperty;

@Data
@AllArgsConstructor
public class Tokens {
    @JsonProperty("accessToken")
    private String access;

    @JsonProperty("refreshToken")
    private String refresh;
}