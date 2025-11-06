package org.example.model;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.Objects;

public class HitResult implements Serializable {

    private static final long serialVersionUID = 1L;

    private double x;
    private double y;
    private double r;
    private boolean hit;
    private LocalDateTime currentTime;
    private long executionTime;

    public HitResult() {
        this.currentTime = currentTime.now();
    }

    public HitResult(double x, double y, double r, boolean hit, LocalDateTime currentTime, long executionTime) {
        this.x = x;
        this.y = y;
        this.r = r;
        this.hit = hit;
        this.currentTime = currentTime;
        this.executionTime = executionTime;
    }

    public double getX() {
        return x;
    }

    public void setX(double x) {
        this.x = x;
    }

    public double getY() {
        return y;
    }

    public void setY(double y) {
        this.y = y;
    }

    public double getR() {
        return r;
    }

    public void setR(double r) {
        this.r = r;
    }

    public boolean isHit() {
        return hit;
    }

    public void setHit(boolean hit) {
        this.hit = hit;
    }

    public LocalDateTime getCurrentTime() {
        return currentTime;
    }

    public void setCurrentTime(LocalDateTime currentTime) {
        this.currentTime = currentTime;
    }

    public long getExecutionTime() {
        return executionTime;
    }

    public void setExecutionTime(long executionTime) {
        this.executionTime = executionTime;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        HitResult that = (HitResult) o;
        return Double.compare(that.x, x) == 0 &&
                Double.compare(that.y, y) == 0 &&
                Double.compare(that.r, r) == 0 &&
                hit == that.hit &&
                executionTime == that.executionTime &&
                Objects.equals(currentTime, that.currentTime);
    }

    @Override
    public int hashCode() {
        return Objects.hash(x, y, r, hit, currentTime, executionTime);
    }

    @Override
    public String toString() {
        return "HitResult{" +
                "x=" + x +
                ", y=" + y +
                ", r=" + r +
                ", hit=" + hit +
                ", currentTime=" + currentTime +
                ", executionTime=" + executionTime +
                '}';
    }
}
