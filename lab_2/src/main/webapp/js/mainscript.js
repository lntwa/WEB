import { initCanvas, drawPoint } from './canvas.js';

const buttons = document.querySelectorAll('button[name="r"]');
const hiddenForm = document.getElementById("canvas_form");
const hiddenX = document.getElementById("canvas_x");
const hiddenY = document.getElementById("canvas_y");
const hiddenR = document.getElementById("canvas_r");
const error = document.getElementById("error");
const canvas = document.getElementById("coordinate_plane");

let currentR = 2;

window.onload = function () {
    redraw(currentR);
};

buttons.forEach(cb => {
    cb.addEventListener('click', (event) => {
        buttons.forEach(b => b.classList.remove('active'));
        event.target.classList.add('active');
        currentR = parseFloat(event.target.value);
        redraw(currentR);
    });
});

function redraw(R = currentR) {
    initCanvas(R)
    const tableRows = document.querySelectorAll("#result_table tbody tr");
    tableRows.forEach(tableRow => {
        const cells = tableRow.querySelectorAll("td");
        const x = parseFloat(cells[0].textContent);
        const y = parseFloat(cells[1].textContent);
        const hit = cells[3].textContent === "Да";
        drawPoint(x, y, hit);
    });
}

function validateR() {
    if (currentR === null) {
        showMessage(error, "Необходимо выбрать R!");
        return null;
    }
    showMessage(error, "");
    return currentR;
}

canvas.addEventListener("click", (event) => {
    if (!validateR()) {
        showMessage(error, "Радиус не выбран! ");
        return;
    }
    const rect = canvas.getBoundingClientRect();
    const scale = 50;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    const x = +((event.clientX - rect.left - centerX) / scale).toFixed(6);
    const y = +(-(event.clientY - rect.top - centerY) / scale).toFixed(6);

    hiddenX.value = x;
    hiddenY.value = y;
    hiddenR.value = currentR;

    hiddenForm.submit();//отправка по клику
})

document.getElementById("submit").addEventListener("click", (event) => {
    if (!validateXY() || !validateR()) {
        event.preventDefault();
        return;
    }
});

const Y = document.getElementById('text_y')
const X = document.getElementById('text_x')

Y.addEventListener("input", validateXY);
X.addEventListener("input", validateXY);

Y.addEventListener('paste', (e) => {
    e.preventDefault();
});
X.addEventListener('paste', (e) => {
    e.preventDefault();
})

function validateXY(e) {

    console.log("Начало валидации значений");

    const input = e.target;
    input.value = input.value.replace(/[^0-9.-]/g, "");
    const selectionStart = input.selectionStart;
    let value = input.value;

    if (value === "" || value === "-" || value === ".") {
        return;
    }
    if (value.includes('.')) {
        const decimalPart = value.split('.')[1];

        if (decimalPart && decimalPart.length > 4) {
            input.value = value.substring(0, value.indexOf('.') + 5);
            input.setSelectionRange(selectionStart, selectionStart);
            return;
        }
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

document.getElementById("clear").addEventListener("click", () => {
    document.getElementById("text_x").value = "";
    document.getElementById("text_y").value = "";
    const rButtons = document.querySelectorAll('button[name="r"]');
    rButtons.forEach(btn => btn.classList.remove('active'));

    document.getElementById("hiddenR").value = "";

    currentR = null;

    const tbody = document.getElementById("t_body");
    tbody.innerHTML = "";

    redraw();
});

function showMessage(element, message) {
    element.onanimationend = null
    if (message) {
        element.hidden = false
        element.style.animation = 'fadeInAndFadeOut 3s'
        element.textContent = message
        element.onanimationend = () => {
            element.hidden = true
            element.textContent = ""
        }
    } else {
        element.hidden = true
        element.style.animation = 'none'
        element.textContent = ""
    }
}