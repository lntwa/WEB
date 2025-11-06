<%--
  Created by IntelliJ IDEA.
  User: Arina
  Date: 06.11.2025
  Time: 19:53
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ page import="org.example.model.HitResult" %>
<%@ page import="java.util.List" %>
<html>
<head>
    <title>Результаты проверки</title>
    <style>
        body {
            text-align: center;
            margin: 0;
            font-family: fantasy;
            background-image: url(backimage.jpg);
            background-size: 100% auto;
            background-repeat: no-repeat;
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            color: rgb(2, 92, 166);
        }

        header {
            color: rgb(2, 92, 166);
            background-color: rgb(15, 135, 158);
            padding: 20px 0;
        }
        #table_container {
            margin: auto 25px 20px;
        }

        #result_table {
            width: 100%;
            font-size: 20px;
            text-align: center;
            border: 2px solid rgb(2, 92, 166);
            border-radius: 9px;
            border-collapse: collapse;
            height: 10%;
        }

        #result_table th {
            background: rgb(117, 187, 236);
            border: 2px solid rgb(2, 92, 166);
            width: 16.66%;
        }

        #result_table td {
            background: #bcfdf8;
            border: 2px solid rgb(2, 92, 166);
            width: 16.66%;
        }
    </style>
</head>
<body>
<header>
    <h1 id="name">Леонтьева Арина Николаевна P3213</h1>
    <h1 id="variant">Вариант 472157</h1>
</header>
<h2 style="text-align:center;">Результат проверки точки</h2>

<%
    List<HitResult> results = (List<HitResult>) application.getAttribute("results");

    if (results != null && !results.isEmpty()) {
        HitResult lastDot = results.get(0);
%>
<div id="table_container">
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
    <p>Нет данных для отображения.</p>
    <%
        }
    %>

    <div style="margin-top: 20px;">
        <a href="index.jsp"> Отправить еще запрос ! </a>
    </div>
</div>
</body>
</html>