package org.example.models;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
@JsonFormat(shape = JsonFormat.Shape.STRING)
public class Result {
    private Long id;
    private String x;
    private String y;
    private String r;
    private Boolean hit;
    private String currentTime;
}
