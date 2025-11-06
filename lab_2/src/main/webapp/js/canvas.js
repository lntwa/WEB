const canvasSize = 400;
let currentR = 2;

function initCanvas(R = currentR) {
    const canvas = document.getElementById('coordinate_plane');
    const ctx = canvas.getContext('2d');
    
    // Очистка canvas
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    const W = canvas.width;
    const H = canvas.height;
    const centerX = W / 2;
    const centerY = H / 2;
    const scale = 50;

    // Оси координат
    ctx.beginPath();
    ctx.moveTo(0, centerY);
    ctx.lineTo(W, centerY);
    ctx.moveTo(centerX, 0);
    ctx.lineTo(centerX, H);
    ctx.strokeStyle = "black";
    ctx.lineWidth = 1;
    ctx.stroke();

    // Прямоугольник — в 2-й четверти
    ctx.beginPath();
    ctx.rect(centerX - scale * R, centerY - scale * R, scale * R / 2, scale * R);
    ctx.fillStyle = "rgba(26, 163, 149, 0.5)";
    ctx.fill();

    // Сектор круга — в 4
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.arc(centerX, centerY, scale * R / 2, 0, Math.PI / 2, false);
    ctx.closePath();
    ctx.fillStyle = "rgba(26, 163, 149, 0.5)";
    ctx.fill();

    // Треугольник — в 3
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(centerX - scale * R / 2, centerY);
    ctx.lineTo(centerX, centerY + scale * R / 2);
    ctx.closePath();
    ctx.fillStyle = "rgba(26, 163, 149, 0.5)";
    ctx.fill();

    // Подписи осей
    ctx.fillStyle = "black";
    ctx.font = "12px Arial";
    ctx.fillText("X", W - 10, centerY - 10);
    ctx.fillText("Y", centerX + 10, 10);

    // Подписи для X
    ctx.fillText("R", centerX + scale * R - 5, centerY + 15);
    ctx.fillText("R/2", centerX + scale * R/2 - 10, centerY + 15);
    ctx.fillText("-R", centerX - scale * R - 5, centerY + 15);
    ctx.fillText("-R/2", centerX - scale * R/2 - 10, centerY + 15);

    // Подписи для Y
    ctx.fillText("R", centerX - 15, centerY - scale * R + 5);
    ctx.fillText("R/2", centerX - 20, centerY - scale * R/2 + 5);
    ctx.fillText("-R", centerX - 15, centerY + scale * R + 5);
    ctx.fillText("-R/2", centerX - 20, centerY + scale * R/2 + 5);

    // Засечки на оси X
    for (let i = -R; i <= R; i += 0.5) {
        if (i === 0) continue;
        const x = centerX + i * scale;
        ctx.beginPath();
        ctx.moveTo(x, centerY - 5);
        ctx.lineTo(x, centerY + 5);
        ctx.stroke();
    }

    // Засечки на оси Y
    for (let i = -R; i <= R; i += 0.5) {
        if (i === 0) continue;
        const y = centerY + i * scale;
        ctx.beginPath();
        ctx.moveTo(centerX - 5, y);
        ctx.lineTo(centerX + 5, y);
        ctx.stroke();
    }

    // Стрелка для оси X
    ctx.beginPath();
    ctx.moveTo(W - 10, centerY - 5);
    ctx.lineTo(W, centerY);
    ctx.lineTo(W - 10, centerY + 5);
    ctx.closePath();
    ctx.fillStyle = "black";
    ctx.fill();

    // Стрелка для оси Y
    ctx.beginPath();
    ctx.moveTo(centerX - 5, 10);
    ctx.lineTo(centerX, 0);
    ctx.lineTo(centerX + 5, 10);
    ctx.closePath();
    ctx.fillStyle = "black";
    ctx.fill();
}

function convertIntoCanvasCoordinates(x, y, R = currentR) {
    const canvas = document.getElementById('coordinate_plane');
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const scale = 50;
    return [centerX + x * scale, centerY - y * scale];
}

function drawPoint(x, y, hit) {
    const canvas = document.getElementById("coordinate_plane"); // Исправлен ID
    const ctx = canvas.getContext("2d");
    
    if (hit) {
        ctx.fillStyle = "#000000";
    } else {
        ctx.fillStyle = "#D14545";
    }
    
    ctx.beginPath();
    let [newX, newY] = convertIntoCanvasCoordinates(x, y);
    ctx.arc(newX, newY, 3, 0, 2 * Math.PI); // Исправлено
    ctx.fill();
}

export { initCanvas, drawPoint };