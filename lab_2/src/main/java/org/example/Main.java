package org.example;

import java.util.Arrays;
import java.util.Properties;
import java.nio.ByteBuffer;
import com.fastcgi.FCGIInterface;
import java.io.IOException;
import java.util.logging.Logger;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

public class Main {
    private static Logger logger;

    public static void main(String[] args) throws IOException {
        logger = ServerLogger.getInstance();
        HitCheck hitCheck = new HitCheck();
        Validation validation = new Validation();
        FCGIInterface fcgi = new FCGIInterface();
        logger.info("Server starts . . .");
        while (fcgi.FCGIaccept() >= 0) {

            long start = System.nanoTime();
            String method = FCGIInterface.request.params.getProperty("REQUEST_METHOD");

            if (method == null) {
                System.out.println(errorResult("Unsupported HTTP method: null"));
                continue;
            }

            if (method.equals("POST")) {
                logger.info("POST request processing.");
                String contentType = FCGIInterface.request.params.getProperty("CONTENT_TYPE");
                if (contentType == null) {
                    System.out.println(errorResult("Content-Type is null"));
                    continue;
                }
                if (!contentType.equals("application/x-www-form-urlencoded")) {
                    System.out.println(errorResult("Content-Type's format is not supported"));
                    continue;
                }

                Properties requestBody = formParser(readRequestBody());

                if (requestBody == null) {
                    System.out.println(errorResult("No items in Content-Type"));
                    continue;
                }

                var rStr = requestBody.get("R");
                var xStr = requestBody.get("X");
                var yStr = requestBody.get("Y");

                if (rStr == null || xStr == null || yStr == null) {
                    System.out.println(errorResult("R, X and Y must be provided as x-www-form-urlencoded params."));
                    continue;
                }

                int x;
                float y, r;

                try {
                    r = Float.parseFloat(rStr.toString());
                    x = Integer.parseInt(xStr.toString());
                    y = Float.parseFloat(yStr.toString());
                } catch (NumberFormatException e) {
                    System.out.println(errorResult("Parameters must be numbers!"));
                    continue;
                }
                boolean hit = false;
                if (!validation.validateXYR(x, y, r)) {
                    System.out.println(errorResult("Invalid parameters!"));
                } else {
                    hit = hitCheck.checkHit(x, y, r);
                }

                result(r, x, y, hit, (System.nanoTime() - start) / 1_000);
                continue;
            }
            System.out.println(errorResult("Unsupported HTTP method: " + method));
        }
    }

    private static void result(float r, int x, float y, boolean result, long nano) {
        String content = """
                <tr>
                    <td>%s</td>
                    <td>%s</td>
                    <td>%s</td>
                    <td>%s</td>
                    <td>%s</td>
                    <td>%sμs</td>
                </tr>
                """.formatted(r, x, y, result ? "Попадание" : "Промах",
                LocalDateTime.now().format(DateTimeFormatter.ofPattern("HH:mm:ss dd.MM.yyyy")), nano);
        logger.info(("Success request! R = %s, X = %s, Y = %s. Result: %s").formatted(r, x, y, result ? "Попадание" : "Промах"));
        System.out.print(echoPage(content));
    }

    private static String echoPage(String echo) {
        String content = """
                %s
                """.formatted(echo);
        return """
                HTTP/1.1 200 OK
                Content-Type: text/html
                Access-Control-Allow-Origin: *
                Content-Length: %d


                %s
                """.formatted(content.getBytes(StandardCharsets.UTF_8).length, content);
    }

    private static String errorResult(String error) {
        String content = """
                <h1>Error</h1>
                <p>%s</p>
                """.formatted(error);
        logger.info("Error: \n%s\n".formatted(error));
        return """
                HTTP/1.1 400 Bad Request
                Content-Type: text/html
                Access-Control-Allow-Origin: *
                Content-Length: %d

                %s
                """.formatted(content.getBytes(StandardCharsets.UTF_8).length, content);
    }


    private static Properties formParser(String requestBodyStr) {
        var props = new Properties();
        try {
            Arrays.stream(requestBodyStr.split("&"))
                    .forEach(keyValue -> props.setProperty(keyValue.split("=")[0], keyValue.split("=")[1]));
            return props;
        } catch (Exception e) {
            return null;
        }
    }

    private static String readRequestBody() throws IOException {
        FCGIInterface.request.inStream.fill();
        int contentLength = FCGIInterface.request.inStream.available();
        ByteBuffer buf = ByteBuffer.allocate(contentLength);
        var readBytes = FCGIInterface.request.inStream.read(buf.array(), 0, contentLength);

        byte[] requestBodyRaw = new byte[readBytes];
        buf.get(requestBodyRaw);
        buf.clear();
        return new String(requestBodyRaw, StandardCharsets.UTF_8);
    }

}