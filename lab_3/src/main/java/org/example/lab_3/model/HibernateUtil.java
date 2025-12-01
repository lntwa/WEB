package org.example.lab_3.model;

import org.hibernate.HibernateException;
import org.hibernate.SessionFactory;

import org.hibernate.cfg.Configuration;

public class HibernateUtil {

    private static final SessionFactory sessionFactory;

    static {
        try {
            Configuration config = new Configuration().configure();

            sessionFactory = config.buildSessionFactory();
        } catch (Throwable e) {
            System.err.println("При инициации сессии возникла ошибка :(" + e);
            throw new ExceptionInInitializerError(e);
        }
    }

    public static SessionFactory getSessionFactory() {
        return sessionFactory;
    }
}
