package org.example.utilities;

import java.util.Set;

public class Validation {
    private final Set<Double> rValues = Set.of(1.0, 1.5, 2.0, 2.5, 3.0);
    private static final double EPSILON = 0.0001;

    private boolean validateX(double x) {
        return x >= -3 && x <= 3;
    }

    private boolean validateR(double r) {
        return rValues.stream().anyMatch(validR -> Math.abs(validR - r) < EPSILON);
    }

    private boolean validateY(double y) {
        return y >= -5 && y <= 5;
    }

    public boolean validateXYR(double x, double y, double r) {
        return validateX(x) && validateY(y) && validateR(r);
    }
}