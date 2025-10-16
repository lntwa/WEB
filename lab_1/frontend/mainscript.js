const buttons = document.querySelectorAll('button[name="r"]');
const button = document.querySelector('.submit');
const canvas = document.getElementById('coordinate_plane');
const ctx = canvas.getContext("2d");


buttons.forEach(button => {
    button.addEventListener('click', function (){
        buttons.forEach(btn => btn.classList.remove('selected'));
        this.classList.add('selected');
        const selectedValue = this.getAttribute('value');
        document.getElementById('hiddenR').value = selectedValue;
    });
});

button.addEventListener('click', () => {
    const body = makeForm();
    if (body == null) return;

    fetch('/fcgi-bin/server-all.jar', {
        method: 'POST',
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        body: body
    }).then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status ${response.status}`);
        }
        return response.text();
    }).then(htmlRow => {
        const tbody = document.getElementById('body_for_table');
        tbody.insertAdjacentHTML('beforeend', htmlRow);
        return htmlRow;
    }).catch(error => {
        console.error('Fetch failed: ', {
            message: error.message,
            stack: error.stack,
            name: error.name
        });
        console.log('Ошибка при отправке запроса:\n' + error.message);
    })
});

const R = document.getElementById('hiddenR')
const Y = document.getElementById('text_y')
const X = document.getElementById('select_x')

Y.addEventListener("input", validateY);

Y.addEventListener('paste', (e) => {
    e.preventDefault();
});

function validateY(e) {
    console.log("Start of validating Y");

    e.target.value = e.target.value.replace(/[^0-9.-]/g, "");
    const input = e.target;
    const selectionStart = input.selectionStart;
    let value = input.value;

    if (value === "" || value === "-" || value === ".") {
        return;
    }

    if (isNaN(Number(value))) {
        input.value = value.slice(0, selectionStart - 1) + value.slice(selectionStart);
        input.setSelectionRange(selectionStart - 1, selectionStart - 1);
    }
    if (Number(value) > 5) {
        input.value = value.slice(0, selectionStart - 1) + value.slice(selectionStart);
        input.setSelectionRange(selectionStart - 1, selectionStart - 1);
    }
    if (Number(value) < -5) {
        input.value = value.slice(0, selectionStart - 1) + value.slice(selectionStart);
        input.setSelectionRange(selectionStart - 1, selectionStart - 1);
    }
}

function makeForm() {
    if (!checkForm()) {
        return null;
    }

    let R = document.getElementById("hiddenR");
    let Y = document.getElementById("text_y");
    let X = document.getElementById("select_x");

    const formData = new URLSearchParams();
    formData.append('X', X.value);
    formData.append('Y', Y.value);
    formData.append('R', R.value);

    return formData;
}

function checkForm() {

    let R = document.getElementById("hiddenR").value;
    let Y = document.getElementById("text_y").value;
    let X = document.getElementById("select_x").value;
    console.log("R:", R, "X:", X, "Y:", Y);

    if (!R) {
        alert("R не выбран!");
        return false;
    }
    if (!Y) {
        alert("Поле Y не заполнено!");
        return false;
    }
    if (Y < -5 || Y > 5) {
        console.log(Y);
        alert("Значение Y должно быть от -5 до 5");
        return false;
    }
    if (!X) {
        alert("X не выбран!");
        return false;
    }
    console.log("Form is completed.");
    return true;
}

function drawPoint() {
    const scale = 30;
    let x = Number(X.value)*scale + 190;
    let y = -Number(Y.value)*scale + 190;

    ctx.beginPath();
    ctx.strokeStyle = "#4c835a";
    ctx.fillStyle = "#4c835a";

    moveTo(x, y);
    ctx.arc(x, y, 3, 0, Math.PI*2, false);
    ctx.fill();

    ctx.closePath();
    ctx.stroke();
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    draw_I();    // 1-я четверть: сектор круга радиусом R/2
    draw_III();  // 3-я четверть: прямоугольник
    draw_IV();   // 4-я четверть: треугольник
    makeXOY();   // Оси координат и разметка
    drawPoint(); // Точка
}

function draw_I() {
    let r = R.value;
    const scale = 30;

    ctx.beginPath();
    ctx.strokeStyle = "#b3dbbd";
    ctx.fillStyle = "#b3dbbde5";
    ctx.lineWidth = 0.8;

    // Сектор круга в 1-й четверти (радиус R/2)
    ctx.moveTo(190, 190);
    ctx.arc(190, 190, r*scale/2, -Math.PI/2, 0, false); // От -90° до 0°
    ctx.lineTo(190, 190);
    ctx.fill();

    ctx.closePath();
    ctx.stroke();
}

function draw_III() {
    let r = R.value;
    const scale = 30;

    ctx.beginPath();
    ctx.strokeStyle = "#b3dbbd";
    ctx.fillStyle = "#b3dbbde5";
    ctx.lineWidth = 0.8;

    // Прямоугольник в 3-й четверти: x = [-r/2, 0], y = [-r, 0]
    // x от -r/2 до 0, y от -r до 0
    const x1 = 190 - (r * scale / 2);  // x = -r/2
    const y1 = 190 + (r * scale);      // y = -r (в canvas координатах)

    ctx.fillRect(x1, 190, r*scale/2, r*scale);

    ctx.closePath();
    ctx.stroke();
}

function draw_IV() {
    let r = R.value;
    const scale = 30;

    ctx.beginPath();
    ctx.strokeStyle = "#b3dbbd";
    ctx.fillStyle = "#b3dbbde5";
    ctx.lineWidth = 0.8;

    // Треугольник в 4-й четверти, ограниченный линией y = x - r/2
    // Вершины:
    // (0, -r/2) - пересечение с осью Y
    // (r/2, 0)  - пересечение с осью X
    // (0, 0)     - начало координат

    const xRight = 190 + (r * scale / 2);  // x = r/2
    const yBottom = 190 + (r * scale / 2); // y = -r/2 (в canvas координатах)

    ctx.moveTo(190, 190);                  // (0, 0)
    ctx.lineTo(xRight, 190);               // (r/2, 0)
    ctx.lineTo(190, yBottom);              // (0, -r/2)
    ctx.lineTo(190, 190);                  // назад к началу
    ctx.fill();

    ctx.closePath();
    ctx.stroke();
}

function makeXOY() {

    ctx.beginPath();
    ctx.strokeStyle = "#000000ff";
    ctx.fillStyle = "#000000ff";
    ctx.lineWidth = 0.8

    ctx.moveTo(190, 190);
    ctx.lineTo(190, 380);
    ctx.moveTo(190, 190);
    ctx.lineTo(190, 0);
    ctx.lineTo(198, 7);
    ctx.moveTo(190, 0);
    ctx.lineTo(182, 7);
    ctx.fillText("Y", 210, 9);

    ctx.moveTo(190, 190);
    ctx.lineTo(0, 190);
    ctx.moveTo(190, 190);
    ctx.lineTo(380, 190);
    ctx.lineTo(373, 198);
    ctx.moveTo(380, 190);
    ctx.lineTo(373, 182);
    ctx.fillText("X", 371, 170);

    ctx.closePath();
    ctx.stroke();

    for (let i = 30; i < 180; i += 30) {
        makeOX(i/30, 190 + i, 190);
        makeOX(-i/30, 190 - i, 190);
    }

    for (let i = 30; i < 180; i += 30) {
        makeOY(-i/30, 190, 190 + i);
        makeOY(i/30, 190, 190 - i);
    }
}

function makeOX(i, x, y) {
    ctx.beginPath();
    ctx.strokeStyle = "#000000ff";
    ctx.fillStyle = "#000000ff";
    ctx.lineWidth = 0.8

    ctx.moveTo(x, y);
    ctx.lineTo(x, y+5);
    ctx.moveTo(x, y);
    ctx.lineTo(x, y-5);
    ctx.moveTo(x, y);
    ctx.fillText(i, x-3, y+17);

    ctx.closePath();
    ctx.stroke();
}

function makeOY(i, x, y) {
    ctx.beginPath();
    ctx.strokeStyle = "#000000ff";
    ctx.fillStyle = "#000000ff";
    ctx.lineWidth = 0.8

    ctx.moveTo(x, y);
    ctx.lineTo(x+5, y);
    ctx.moveTo(x, y);
    ctx.lineTo(x-5, y);
    ctx.moveTo(x, y);
    ctx.fillText(i, x+12, y+4);

    ctx.closePath();
    ctx.stroke();
}

draw();
document.getElementById("text_y").addEventListener("input", draw);

buttons.forEach(button => {
    button.addEventListener('click', draw);
});
