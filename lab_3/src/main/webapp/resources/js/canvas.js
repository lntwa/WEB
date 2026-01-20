var scale = 50;
let centerX, centerY;

function renderGraph(currentR, points) {
    const canvas = document.getElementById("coordinate_plane");
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    const W = canvas.width;
    const H = canvas.height;
    centerX = W / 2;
    centerY = H / 2;

    initCanvas(ctx, currentR, W, H);

    if (points && Array.isArray(points)) {
        points.forEach(point => {
            drawPoint(ctx, point.x, point.y, point.hit);
        });
    }
}

function initCanvas(ctx, R, W, H) {
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, W, H);

    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.arc(centerX, centerY, scale * R / 2, -Math.PI / 2, 0, false);
    ctx.closePath();
    ctx.fillStyle = "rgba(26, 163, 149, 0.5)";
    ctx.fill();

    ctx.beginPath();
    ctx.rect(centerX - scale * R, centerY - scale * R / 2, scale * R, scale * R / 2);
    ctx.fillStyle = "rgba(26, 163, 149, 0.5)";
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(centerX + scale * R / 2, centerY);
    ctx.lineTo(centerX, centerY + scale * R / 2);
    ctx.closePath();
    ctx.fillStyle = "rgba(26, 163, 149, 0.5)";
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(0, centerY); ctx.lineTo(W, centerY);
    ctx.moveTo(centerX, 0); ctx.lineTo(centerX, H);
    ctx.strokeStyle = "black";
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.fillStyle = "black";
    ctx.font = "13px Arial";
    ctx.fillText("X", W - 20, centerY - 5);
    ctx.fillText("Y", centerX + 5, 20);

    ctx.fillText("R", centerX + scale * R, centerY - 5);
    ctx.fillText("R/2", centerX + scale * R / 2, centerY - 5);
    ctx.fillText("-R", centerX - scale * R, centerY - 5);
    ctx.fillText("-R/2", centerX - scale * R / 2, centerY - 5);

    ctx.fillText("R", centerX + 5, centerY - scale * R);
    ctx.fillText("R/2", centerX + 5, centerY - scale * R / 2);
    ctx.fillText("-R/2", centerX + 5, centerY + scale * R / 2);
    ctx.fillText("-R", centerX + 5, centerY + scale * R);

    for (let i = -R; i <= R; i += 0.5) {
        if (i === 0) continue;
        const x = centerX + i * scale;
        ctx.beginPath();
        ctx.moveTo(x, centerY - 5);
        ctx.lineTo(x, centerY + 5);
        ctx.stroke();
    }
}

function drawPoint(ctx, x, y, hit) {
    if (hit === true) {
        ctx.fillStyle = '#00ff00'; // Зеленый
    } else {
        ctx.fillStyle = '#ff0000'; // Красный
    }

    ctx.beginPath();
    let canvasX = centerX + x * scale;
    let canvasY = centerY - y * scale;

    ctx.arc(canvasX, canvasY, 4, 0, 2 * Math.PI);
    ctx.fill();

    ctx.strokeStyle = '#000';
    ctx.lineWidth = 1;
    ctx.stroke();
}