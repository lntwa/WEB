<%@ page import="org.example.model.HitResult" %>
<%@ page import="java.util.List" %>
<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<!DOCTYPE html>
<html>
<head>
  <title>Лабораторная работа №2</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: 'Times New Roman', Times, serif;
      background-image: url('backimage.jpg');
      background-size: cover;
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

    #main_form {
      margin: 40px 40px;
      padding: 20px;
      color: antiquewhite;
      font-size: 25px;
      line-height: 35px;
    }

    #text_y, #text_x {
      margin-left: 20px;
      font-size: 20px;
      border: 2px solid antiquewhite;
      border-radius: 5px;
      width: 100%;
      max-width: 100px;
      font-family: 'Times New Roman', Times, serif;
      color: #034742;
    }

    .button_r {
      margin-left: 20px;
      font-size: 20px;
      border: 2px solid antiquewhite;
      border-radius: 5px;
      width: 100%;
      max-width: 70px;
      font-family: 'Times New Roman', Times, serif;
      color: #034742;
      transition: all 0.3s ease;
    }

    .button_r:hover {
      background-color: #f1f8f1;
      transform: translateY(-2px);
      box-shadow: 0 4px 8px rgba(76, 175, 80, 0.2);
    }

    .button_r.active {
      background-color: #4CAF50;
      color: white;
      border-color: #45a049;
      transform: translateY(0);
      box-shadow: 0 2px 4px rgba(76, 175, 80, 0.3);
    }

    #submit {
      margin-left: 20px;
      font-size: 25px;
      border: 2px solid antiquewhite;
      border-radius: 5px;
      font-family: 'Times New Roman', Times, serif;
      color: #034742;
      margin-top: 20px;
    }

    #clear {
      margin-left: 20px;
      font-size: 25px;
      border: 2px solid antiquewhite;
      border-radius: 5px;
      font-family: 'Times New Roman', Times, serif;
      color: #034742;
      margin-top: 20px;
    }

    #result_table {
      background-color: white;
      margin: 20px;
      font-size: 25px;
      border: 2px solid antiquewhite;
      border-radius: 5px;
      font-family: 'Times New Roman', Times, serif;
      color: #034742;
      width: 95%;
    }

    #result_table th {
      border: 2px solid bisque;
    }

    #main_canvas {
      width: 34%;
      margin-bottom: 60px;
      display: flex;
      justify-content: right;
      align-items: flex-start;
    }

    #error {
      color: rgb(24, 100, 200);
      background: white;
      border: 1px solid rgb(25, 153, 204);
      width: 40%;
      margin-top: 10px;
    }
  </style>
</head>
<body>
<header class="header_site">
  <div class="container_header">
    <a href="https://se.ifmo.ru/courses/web">
      <img src="logo_itmo.png" alt="ITMO">
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

<div id="form_canvas_container">
    <form id="main_form">
      <div id="choice_of_x">
        <label for="text_x" class="label_name">Выберите координату Х:</label>
        <input type="text" name="x" id="text_x" placeholder="От -3 до 3" required>
      </div>

      <div id="choice_of_y">
        <label for="text_y" class="label_name">Выберите координату Y: </label>
        <input type="text" name="y" id="text_y" placeholder="От -5 до 5" required>
      </div>

      <div id="choice_of_r">
        <div class="label_name">Выберите R:</div>
        <button type="button" class="button_r" name="r" value="1">1</button>
        <button type="button" class="button_r" name="r" value="1.5">1.5</button>
        <button type="button" class="button_r" name="r" value="2">2</button>
        <button type="button" class="button_r" name="r" value="2.5">2.5</button>
        <button type="button" class="button_r" name="r" value="3">3</button>
        <input type="hidden" id="hiddenR" value="0" name="r" required>
      </div>

      <div id="button_container">
        <button id="submit" type="button">Подтвердить</button>
        <button id="clear" type="button">Очистить</button>
      </div>

      <div id="error" hidden></div>
    </form>

  <div id="main_canvas">
    <canvas id="coordinate_plane" width="400" height="400"></canvas>
  </div>

  <form id="canvas_form" method="get" action="controller" style="display:none;">
    <input type="hidden" id="canvas_x" name="x">
    <input type="hidden" id="canvas_y" name="y">
    <input type="hidden" id="canvas_r" name="r">
  </form>

  <div id="table_container">
    <table id="result_table">
      <thead>
      <tr>
        <th>Радиус R</th>
        <th>X</th>
        <th>Y</th>
        <th>Статус</th>
        <th>Дата и время</th>
        <th>Продолжительность обработки</th>
      </tr>
      </thead>
      <tbody id="t_body">
      <%
        List<HitResult> results = (List<HitResult>) application.getAttribute("results");

        if (results != null && !results.isEmpty()) {
          for (HitResult result : results) {
      %>
      <tr>
        <td><%= result.getX() %></td>
        <td><%= result.getY() %></td>
        <td><%= result.getR() %></td>
        <td><%= result.isHit() ? "Да" : "Нет" %></td>
        <td><%= result.getCurrentTime() %></td>
        <td><%= result.getExecutionTime() %></td>
      </tr>
      <%
        }
      } else {
      %>
      <tr>
        <td colspan="6">Нет данных для отображения.</td>
      </tr>
      <%
        }
      %>
      </tbody>
    </table>
  </div>
</div>
</body>
<script type="module" src="js/mainscript.js"></script>
</html>