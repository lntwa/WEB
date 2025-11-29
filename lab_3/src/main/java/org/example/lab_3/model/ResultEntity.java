package org.example.lab_3.model;

import jakarta.persistence.*;
import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.Objects;

@Entity
@Table(name = "results")
public class ResultEntity implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "x", nullable = false)
    private double x;

    @Column(name = "y", nullable = false)
    private double y;

    @Column(name = "r", nullable = false)
    private double r;

    @Column(name = "is_hit", nullable = false)
    private boolean hit;

    @Column(name = "request_time", nullable = false)
    private LocalDateTime currentTime;

    @Column(name = "execution_time", nullable = false)
    private long executionTime;

    // пустой конструктор
    public ResultEntity() {
    }

    public ResultEntity(double x, double y, double r, boolean hit, LocalDateTime currentTime, long executionTime) {
        this.x = x;
        this.y = y;
        this.r = r;
        this.hit = hit;
        this.currentTime = currentTime;
        this.executionTime = executionTime;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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
        ResultEntity that = (ResultEntity) o;
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
        return "ResultEntity{" +
                "id=" + id +
                ", x=" + x +
                ", y=" + y +
                ", r=" + r +
                ", hit=" + hit +
                ", currentTime=" + currentTime +
                ", executionTime=" + executionTime +
                '}';
    }
}