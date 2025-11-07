<%@ page import="org.example.model.HitResult" %>
<%@ page import="java.util.List" %>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html>
<head>
    <title>Результаты проверки</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Times New Roman', Times, serif;
            background-image: url('media/backimage.jpg');
            background-size: cover;
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            color: white;
        }

        .header_site {
            background-color: #034742;
            padding: 12px;
        }

        .container_header {
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 20px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .container_header img {
            height: 40px;
            width: auto;
        }

        .initials ul,
        .group_isu ul {
            list-style: none;
            display: flex;
            gap: 20px;
            color: white;
            font-size: 22px;
        }

        #table_container {
            margin: 40px auto;
            padding: 20px;
            max-width: 1200px;
            width: 90%;
        }

        #result_table {
            width: 100%;
            font-size: 20px;
            text-align: center;
            border: 2px solid antiquewhite;
            border-radius: 9px;
            border-collapse: collapse;
            margin-bottom: 30px;
        }

        #result_table th {
            background: white;
            border: 2px solid antiquewhite;
            color: #034742;
            padding: 10px;
        }

        #result_table td {
            background: white;
            border: 2px solid antiquewhite;
            color: #034742;
            padding: 10px;
        }

        .return-button {
            display: inline-block;
            padding: 12px 24px;
            font-size: 20px;
            background-color: #034742;
            color: white;
            text-decoration: none;
            border: 2px solid antiquewhite;
            border-radius: 5px;
            transition: all 0.3s ease;
            font-family: 'Times New Roman', Times, serif;
            margin-top: 20px;
        }

        .return-button:hover {
            background-color: #045a52;
            transform: translateY(-2px);
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        }

        h2 {
            text-align: center;
            margin: 20px 0;
            font-size: 28px;
        }

        .no-data {
            text-align: center;
            font-size: 24px;
            margin: 20px 0;
        }
    </style>
</head>
<body>
<header class="header_site">
    <div class="container_header">
        <a href="https://se.ifmo.ru/courses/web">
            <img src="media/logo_itmo.png" alt="ITMO">
        </a>
        <div class="initials">
            <ul>
                <li>Леонтьева</li>
                <li>Арина</li>
                <li>Николаевна</li>
            </ul>
        </div>
        <div class="group_isu">
            <ul>
                <li>P3213</li>
                <li>472157</li>
            </ul>
        </div>
    </div>
</header>

<h2>Результат проверки точки</h2>

<div id="table_container">
    <%
        List<HitResult> results = (List<HitResult>) application.getAttribute("results");
        if (results != null && !results.isEmpty()) {
            HitResult lastDot = results.get(0);
    %>
    <table id="result_table">
        <tr><th>X</th><td><%= lastDot.getX() %></td></tr>
        <tr><th>Y</th><td><%= lastDot.getY() %></td></tr>
        <tr><th>R</th><td><%= lastDot.getR() %></td></tr>
        <tr><th>Попадание</th><td><%= lastDot.isHit() ? "Да" : "Нет" %></td></tr>
        <tr><th>Время</th><td><%= lastDot.getCurrentTime() %></td></tr>
        <tr><th>Время выполнения (с)</th><td><%= lastDot.getExecutionTime() %></td></tr>
    </table>
    <%
    } else {
    %>
    <p class="no-data">Нет данных для отображения.</p>
    <%
        }
    %>

    <div style="text-align: center;">
        <a href="index.jsp" class="return-button">Отправить еще запрос!</a>
    </div>
</div>
</body>
</html>