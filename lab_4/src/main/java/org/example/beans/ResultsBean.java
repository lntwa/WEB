package org.example.beans;

import lombok.extern.java.Log;
import org.example.DBmodels.UserDB;
import org.example.models.CheckResponse;
import org.example.models.Coordinates;

import javax.ejb.EJB;
import javax.ejb.Stateless;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.Query;
import org.example.rest.authFilter.UserPrincipal;

@Log
@Stateless
public class ResultsBean {

    @PersistenceContext(unitName = "persistence-unit")
    private EntityManager entityManager;

    @EJB
    private CoordinateChecker coordinateChecker;

    public CheckResponse check(Coordinates coordinates, UserPrincipal userPrincipal) {
        try {
            Query namedQuery = entityManager.createNamedQuery("UserDB.findByID");
            namedQuery.setParameter("id", userPrincipal.getId());
            UserDB user = (UserDB) namedQuery.getSingleResult();

            Boolean success = coordinateChecker.check(coordinates);
        }
    }
}
