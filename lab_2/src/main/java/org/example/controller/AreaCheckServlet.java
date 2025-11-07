package org.example.controller;

import jakarta.servlet.ServletContext;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.example.model.HitResult;
import org.example.utilities.HitCheck;
import org.example.utilities.Validation;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;


@WebServlet("/check")
public class AreaCheckServlet extends HttpServlet {

    @Override
    public void doGet(HttpServletRequest req, HttpServletResponse resp) throws IOException, ServletException {
        resp.setContentType("text/html;charset=UTF-8");
        Validation validation = new Validation();
        HitCheck hitCheck = new HitCheck();
        long startTime = System.nanoTime();

        try {
            double x = Double.parseDouble(req.getParameter("x"));
            double y = Double.parseDouble(req.getParameter("y"));
            double r = Double.parseDouble(req.getParameter("r"));

            if (!validation.validateXYR(x, y, r)) {
                resp.getWriter().println("<h3>Значение не входит в диапазон!</h3>");
                return;
            }

            boolean hit = hitCheck.checkHit(x, y, r);

            long endTime = System.nanoTime();
            long executionTime = (endTime - startTime) / 1_000_000;
            LocalDateTime currentTime = LocalDateTime.now();

            HitResult dot = new HitResult(x, y, r, hit, currentTime, executionTime);

            ServletContext context = getServletContext();
            List<HitResult> results = (List<HitResult>) context.getAttribute("results");

            if (results == null) {
                results = new ArrayList<>();
            }

            results.add(0, dot);
            context.setAttribute("results", results);

            req.setAttribute("dot", dot);
            req.getRequestDispatcher("/result.jsp").forward(req, resp);

        } catch (NumberFormatException e) {
            resp.getWriter().println("<h3>Ошибка: неверный формат числа!</h3>");
        } catch (Exception e) {
            resp.getWriter().println("<h3>Ошибка: " + e.getMessage() + "</h3>");
        }
    }
}
