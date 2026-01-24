package org.example.DBmodels;

import lombok.*;

import javax.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "results")
public class ResultDB {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "id")
    private Long id;

    @Column(name = "coordinate_x")
    private BigDecimal x;

    @Column(name = "coordinate_y")
    private BigDecimal y;

    @Column(name = "coordinate_r")
    private BigDecimal r;

    @Column(name = "is_hit")
    private Boolean hit;

    @Column(name = "current_time")
    private LocalDateTime currentTime;

    @ManyToOne
    @JoinColumn(name = "owner_id")
    private UserDB owner;
}
