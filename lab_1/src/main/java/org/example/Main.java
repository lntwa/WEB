package org.example;

import com.fastcgi.FCGIInterface;

import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.LinkedHashMap;

public class Main {
    public static void main(String[] args) {
        FCGIInterface fcgiInterface = new FCGIInterface();
        Validation validation = new Validation();
        HitCheck hitCheck = new HitCheck();

        while (fcgiInterface.FCGIaccept() >= 0) {
            String method = FCGIInterface.request.params.getProperty("REQUEST_METHOD");

            if (method == null) {
                System.out.println(error("Unsupported HTTP method: null"));
                continue;
            }

            if (method.equals("POST")) {
                long startTime = System.nanoTime();

                String body;
                try {
                    body = new String(FCGIInterface.request.inStream.readAllBytes(), StandardCharsets.UTF_8);
                } catch (Exception e) {
                    System.out.println(error("Failed to read POST body"));
                    continue;
                }

                if (body == null || body.isEmpty()) {
                    System.out.println(error("Empty POST request"));
                    continue;
                }

                LinkedHashMap<String, String> params;
                try {
                    params = parse(body);
                } catch (Exception e) {
                    System.out.println(error("Invalid POST request format"));
                    continue;
                }

                if (!params.containsKey("x") || !params.containsKey("y") || !params.containsKey("r")) {
                    System.out.println(error("Missing parameters x, y or r"));
                    continue;
                }

                String xStr = params.get("x");
                String yStr = params.get("y");
                String rStr = params.get("r");

                int x;
                float y, r;

                try {
                    x = Integer.parseInt(xStr);
                    y = Float.parseFloat(yStr.replace(',', '.'));
                    r = Float.parseFloat(rStr);
                } catch (NumberFormatException e) {
                    System.out.println(error("Parameters must be numbers!"));
                    continue;
                }

                if (!validation.validateXYR(x, y, r)) {
                    System.out.println(error("Invalid parameters!"));
                } else {
                    boolean hit = hitCheck.checkHit(x, y, r);
                    System.out.println(response(xStr, yStr, rStr, hit, startTime));
                }

            } else {
                System.out.println(error("Method not allowed. Only POST supported."));
            }
        }
    }

    private static String error(String msg) {
        String content = "{\"error\":\"" + msg + "\"}";
        return """
               HTTP/1.1 400 Bad Request
               Content-Type: application/json; charset=utf-8
               Content-Length: %d

               %s
               """.formatted(content.getBytes(StandardCharsets.UTF_8).length, content);
    }

    private static LinkedHashMap<String, String> parse(String query) {
        LinkedHashMap<String, String> result = new LinkedHashMap<>();
        for (String pair : query.split("&")) {
            String[] parts = pair.split("=");
            if (parts.length == 2)
                result.put(parts[0], parts[1]);
        }
        return result;
    }

    private static String response(String x, String y, String r, boolean hit, long startTime) {
        String content = String.format(
                "{\"x\":\"%s\",\"y\":\"%s\",\"r\":\"%s\",\"hit\":%s,\"time\":\"%s\",\"scriptTime\":%.3f}",
                x, y, r, hit,
                LocalDateTime.now().format(DateTimeFormatter.ofPattern("HH:mm:ss")),
                (System.nanoTime() - startTime) / 1_000_000.0
        );

        return """
               HTTP/1.1 200 OK
               Content-Type: application/json; charset=utf-8
               Content-Length: %d

               %s
               """.formatted(content.getBytes(StandardCharsets.UTF_8).length, content);
    }
}
