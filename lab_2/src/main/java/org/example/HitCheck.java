package org.example;

public class HitCheck {

    private boolean triangle(int x, float y, float r) {
        return x >= 0 && y <= 0 && y >= x - r / 2;
    }

    private boolean rectangle(int x, float y, float r) {
        return x <= 0 && x >= -r / 2 && y <= 0 && y >= -r;
    }

    private boolean circle(int x, float y, float r) {
        return (x >= 0 && x <= r / 2) && (y >= 0 && y <= r / 2) && (x * x + y * y <= (r / 2) * (r / 2));
    }

    public boolean checkHit(int x, float y, float r) {
        return triangle(x, y, r) || rectangle(x, y, r) || circle(x, y, r);
    }
}