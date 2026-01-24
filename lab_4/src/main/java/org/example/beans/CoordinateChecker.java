package org.example.beans;

import org.example.models.Coordinates;

import javax.ejb.Stateless;
import java.math.BigDecimal;

@Stateless
public class CoordinateChecker {
    public Boolean check (Coordinates coordinates){
        BigDecimal x = new BigDecimal(String.valueOf(coordinates.getX()).replace(',','.'));
        BigDecimal y = new BigDecimal(String.valueOf(coordinates.getY()).replace(',','.'));
        BigDecimal r = new BigDecimal(String.valueOf(coordinates.getR()).replace(',','.'));

        BigDecimal absR = r.abs();
        BigDecimal halfR = r.divide(BigDecimal.valueOf(2));

        if (r.compareTo(BigDecimal.ZERO) >= 0) {
            boolean rectangle = x.compareTo(BigDecimal.ZERO) >= 0
                    && x.compareTo(r) <= 0
                    && y.compareTo(BigDecimal.ZERO) >= 0
                    && y.compareTo(halfR) <= 0;

            boolean triangle = x.compareTo(BigDecimal.ZERO) <= 0
                    && x.compareTo(halfR.negate()) >= 0
                    && y.compareTo(BigDecimal.ZERO) >= 0
                    && y.compareTo(x.add(halfR)) <= 0;

            boolean circle = x.compareTo(BigDecimal.ZERO) >= 0
                    && y.compareTo(BigDecimal.ZERO) <= 0
                    && x.pow(2).add(y.pow(2)).compareTo(halfR.pow(2)) <= 0;

            return rectangle || triangle || circle;
        } else {
            boolean rectangle = x.compareTo(r) >= 0
                    && x.compareTo(BigDecimal.ZERO) <= 0
                    && y.compareTo(halfR) >= 0
                    && y.compareTo(BigDecimal.ZERO) <= 0;

            boolean triangle = x.compareTo(BigDecimal.ZERO) >= 0
                    && x.compareTo(halfR.negate()) <= 0
                    && y.compareTo(BigDecimal.ZERO) <= 0
                    && y.compareTo(x.add(halfR)) >= 0;

            boolean circle = x.compareTo(BigDecimal.ZERO) <= 0
                    && y.compareTo(BigDecimal.ZERO) >= 0
                    && x.pow(2).add(y.pow(2)).compareTo(halfR.pow(2)) <= 0;

            return rectangle || triangle || circle;
        }
    }
}
