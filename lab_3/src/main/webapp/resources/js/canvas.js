// Константы делаем глобальными, чтобы их видел и main.js
const scale = 50; // Масштаб: 50 пикселей = 1 единица
let centerX, centerY;

/**
 * Главная функция отрисовки.
 * Вызывается из main.xhtml и main.js
 * @param currentR - текущий радиус (число)
 * @param points - массив объектов [{x,y,r,hit}, ...]
 */
function renderGraph(currentR, points) {
    const canvas = document.getElementById("coordinate_plane");
    if (!canvas) return;

    // Инициализация размеров
    const ctx = canvas.getContext("2d");
    const W = canvas.width;
    const H = canvas.height;
    centerX = W / 2;
    centerY = H / 2;

    // 1. Очистка и отрисовка областей (используем твою функцию initCanvas)
    initCanvas(ctx, currentR, W, H);

    // 2. Отрисовка точек из истории
    if (points && Array.isArray(points)) {
        points.forEach(point => {
            drawPoint(ctx, point.x, point.y, point.hit);
        });
    }
}

function initCanvas(ctx, R, W, H) {
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, W, H);

    // --- ФИГУРЫ ---

    // 1. Сектор круга — в 1-й четверти (Top-Right)
    // Радиус R/2
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    // Рисуем дугу от "Верха" (-PI/2) до "Справа" (0)
    ctx.arc(centerX, centerY, scale * R / 2, -Math.PI / 2, 0, false);
    ctx.closePath();
    ctx.fillStyle = "rgba(26, 163, 149, 0.5)";
    ctx.fill();

    // 2. Прямоугольник — во 2-й четверти (Top-Left)
    // X от -R до 0, Y от 0 до R/2
    ctx.beginPath();
    // (x, y, width, height)
    // Canvas Y идет вниз, поэтому "вверх" от центра это centerY - ...
    ctx.rect(centerX - scale * R, centerY - scale * R / 2, scale * R, scale * R / 2);
    ctx.fillStyle = "rgba(26, 163, 149, 0.5)";
    ctx.fill();

    // 3. Треугольник — в 4-й четверти (Bottom-Right)
    // Вершины: (0,0), (R/2, 0), (0, -R/2)
    ctx.beginPath();
    ctx.moveTo(centerX, centerY); // (0,0)
    ctx.lineTo(centerX + scale * R / 2, centerY); // (R/2, 0)
    ctx.lineTo(centerX, centerY + scale * R / 2); // (0, -R/2) — Y вниз это плюс в канвасе
    ctx.closePath();
    ctx.fillStyle = "rgba(26, 163, 149, 0.5)";
    ctx.fill();

    // --- ОСИ И РАЗМЕТКА (Оставляем как было) ---
    ctx.beginPath();
    ctx.moveTo(0, centerY);
    ctx.lineTo(W, centerY);
    ctx.moveTo(centerX, 0);
    ctx.lineTo(centerX, H);
    ctx.strokeStyle = "black";
    ctx.lineWidth = 1;
    ctx.stroke();

    // Стрелочки
    ctx.beginPath();
    ctx.moveTo(W - 10, centerY - 5);
    ctx.lineTo(W, centerY);
    ctx.lineTo(W - 10, centerY + 5);
    ctx.fillStyle = "black";
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(centerX - 5, 10);
    ctx.lineTo(centerX, 0);
    ctx.lineTo(centerX + 5, 10);
    ctx.fill();

    // Текст
    ctx.fillStyle = "black";
    ctx.font = "13px Arial";
    ctx.fillText("X", W - 20, centerY - 20);
    ctx.fillText("Y", centerX + 10, 20);

    // Рисочки
    // Ось X
    drawTick(ctx, centerX + scale * R, centerY, "R");
    drawTick(ctx, centerX + scale * R / 2, centerY, "R/2");
    drawTick(ctx, centerX - scale * R, centerY, "-R");
    drawTick(ctx, centerX - scale * R / 2, centerY, "-R/2");

    // Ось Y
    drawTick(ctx, centerX, centerY - scale * R, "R");
    drawTick(ctx, centerX, centerY - scale * R / 2, "R/2");
    drawTick(ctx, centerX, centerY + scale * R / 2, "-R/2");
    drawTick(ctx, centerX, centerY + scale * R, "-R");
}

// Вспомогательная функция для рисочек
function drawTick(ctx, x, y, label) {
    const tickSize = 5;
    ctx.beginPath();
    if (y === centerY) { // Ось X
        ctx.moveTo(x, y - tickSize);
        ctx.lineTo(x, y + tickSize);
        ctx.fillText(label, x - 5, y + 20);
    } else { // Ось Y
        ctx.moveTo(x - tickSize, y);
        ctx.lineTo(x + tickSize, y);
        ctx.fillText(label, x + 10, y + 5);
    }
    ctx.stroke();
}

function convertIntoCanvasCoordinates(x, y) {
    return [centerX + x * scale, centerY - y * scale];
}

function drawPoint(ctx, x, y, hit) {
    if (hit) {
        ctx.fillStyle = '#00ff00'; // Зеленый для попадания
    } else {
        ctx.fillStyle = '#ff0000'; // Красный для промаха
    }
    ctx.beginPath();
    let [newX, newY] = convertIntoCanvasCoordinates(x, y);
    ctx.arc(newX, newY, 4, 0, 2 * Math.PI); // Чуть увеличил размер точки
    ctx.closePath();
    ctx.fill();

    // Обводка точки для красоты
    ctx.strokeStyle = '#000';
    ctx.stroke();
}