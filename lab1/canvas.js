const canvasSize = 400;
const W = canvas.width;
const H = canvas.height;
const centerX = W / 2;
const centerY = H / 2;

function initCanvas(R) {
    const canvas = document.getElementById('coordinate_plane');
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.beginPath();
    ctx.moveTo(0, centerY);
    ctx.lineTo(W, centerY);
    ctx.moveTo(centerX, 0);
    ctx.lineTo(centerX, H);
    ctx.strokeStyle = "black"; 
    ctx.lineWidth = 1; 
    ctx.stroke();

    ctx.beginPath();
    ctx.rect(centerX - scale * R/2, centerY - scale * R, scale * R/2, scale * R);
    ctx.fillStyle = "rgb(26, 163, 149, 0.5)";
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(centerX, centerY); 
    ctx.lineTo(centerX + scale * R/2, centerY); 
    ctx.lineTo(centerX, centerY - scale * R/2); 
    ctx.closePath();
    ctx.fillStyle = "rgb(26, 163, 149, 0.5)"
    ctx.fill();

    
}