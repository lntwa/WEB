package org.example.beans;

import lombok.extern.java.Log;
import org.example.DBmodels.ResultDB;
import org.example.DBmodels.UserDB;
import org.example.models.CheckResponse;
import org.example.models.Coordinates;

import javax.ejb.EJB;
import javax.ejb.Stateless;
import javax.persistence.*;

import org.example.models.Result;
import org.example.rest.authFilter.UserPrincipal;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

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
            log.info(success.toString());
            log.info(coordinates.toString());

            ResultDB result = ResultDB.builder()
                    .x(coordinates.getX())
                    .y(coordinates.getY())
                    .r(coordinates.getR())
                    .hit(success)
                    .currentTime(LocalDateTime.now())
                    .owner(user)
                    .build();

            entityManager.persist(result);

            return new CheckResponse(success);
        } catch (NoResultException ignored) {
            return null;
        }
    }

    public List<Result> getResults(UserPrincipal userPrincipal) {
        try {
            Query namedQuery = entityManager.createNamedQuery("UserDB.findByIDWithResults");
            namedQuery.setParameter("id", userPrincipal.getId());
            UserDB user = (UserDB) namedQuery.getSingleResult();

            return user.getResults().stream()
                    .sorted(Comparator.comparing(ResultDB::getCurrentTime))
                    .map(ResultsBean::transformToResult)
                    .collect(Collectors.toList());
        } catch (PersistenceException exception) {
            return new ArrayList<>();
        }
    }

    public boolean clearResults(UserPrincipal userPrincipal) {
        try {
            Query namedQuery = entityManager.createNamedQuery("UserDB.findByIDWithResults");
            namedQuery.setParameter("id", userPrincipal.getId());
            UserDB user = (UserDB) namedQuery.getSingleResult();
            for (ResultDB result : user.getResults()) {
                entityManager.remove(result);
            }
            return true;
        } catch (NoResultException e) {
            return true;
        } catch (PersistenceException exception) {
            log.warning("Error clearing results: " + exception.getMessage());
            return false;
        }
    }

    private static Result transformToResult(ResultDB db) {
        return new Result(
                db.getId(),
                String.valueOf(db.getX()),
                String.valueOf(db.getY()),
                String.valueOf(db.getR()),
                db.getHit(),
                db.getCurrentTime().toString()
        );
    }
}
