package org.example.utilities;

public class HitCheck {
    public boolean checkHit(double x, double y, double r) {
        if ((x <= 0) && (y >= 0) && (y <= r) && (x >= -r/2)) {
            return true;
        }
        if ((x <= 0) && (y <= 0) && (x >= -r/2) && (y >= -r/2) && (y >= -x -r/2)) {
            return true;
        }
        if ((x >= 0) && (y <= 0) && (x <= r/2) && (y >= -r/2) && (x * x + y * y <= (r/2) * (r/2))) {
            return true;
        }
        return false;
    }
}
