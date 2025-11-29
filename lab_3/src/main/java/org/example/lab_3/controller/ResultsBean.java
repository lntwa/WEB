package org.example.lab_3.controller;

import org.example.lab_3.model.HibernateUtil;
import org.example.lab_3.model.ResultEntity;
import org.hibernate.Session;
import org.hibernate.Transaction;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

public class ResultsBean implements Serializable {

    private static final long serialVersionUID = 1L;

    private Double x = 0.0;
    private Double y = 0.0;
    private Double r = 0.0;

     private List<ResultEntity> results;

     public ResultsBean() {
         this.results = new ArrayList<>();
         loadResultsFromDb();
     }

     public void addResult() {
         long startTime = System.nanoTime();

         boolean isHit = HitCheck.checkHit(x, y, r);

         ResultEntity result = new ResultEntity();
         result.setX(x);
         result.setY(y);
         result.setR(r);
         result.setHit(isHit);
         result.setCurrentTime(LocalDateTime.now());
         result.setExecutionTime(System.nanoTime() - startTime);

         saveToDatabase(result);
         results.add(0, result);
     }

     private void saveToDatabase(ResultEntity result) {
         try (Session session = HibernateUtil.getSessionFactory().openSession()){
             Transaction transaction = null;
             try {
                 transaction = session.beginTransaction();
                 session.persist(result);
                 transaction.commmit();
             } catch (Exception e) {
                 if (transaction != null) {
                     transaction.roolback();
                 }
                 e.printStackTrace();
             }
         }
     }

     private void loadResultsFromDb() {
         try (Session session = HibernateUtil.getSessionFactory().openSession()) {
             results = session.createQuery("FROM ResultEntity ORDER BY id DESC", ResultEntity.class).list();
         } catch (Exception e) {
             e.printStackTrace();
             results = new ArrayList<>();
         }
     }

    public Double getX() {
        return x;
    }

    public void setX(Double x) {
        this.x = x;
    }

    public Double getY() {
        return y;
    }

    public void setY(Double y) {
        this.y = y;
    }

    public Double getR() {
        return r;
    }

    public void setR(Double r) {
        this.r = r;
    }

    public List<ResultEntity> getResults() {
        return results;
    }

    public void setResults(List<ResultEntity> results) {
        this.results = results;
    }
}