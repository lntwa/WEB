package org.example;

import java.util.Set;

public class Validation {
    private final Set<Integer> xValues = Set.of(-4, -3, -2, -1, 0, 1, 2, 3, 4);
    private final Set<Float> rValues = Set.of(1F, 1.5F, 2F, 2.5F, 3F);

    private boolean validateX(int x) {
        return xValues.contains(x);
    }

    private boolean validateR(float r) {
        return rValues.contains(r);
    }

    private boolean validateY(float y) {
        return y >= -5 && y <= 5;
    }

    public boolean validateXYR(int x, float y, float r) {
        return validateX(x) && validateY(y) && validateR(r);
    }
}