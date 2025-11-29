import { initCanvas, drawPoint } from './canvas.js';

const buttons = document.querySelectorAll('button[name="r"]');
const hiddenForm = document.getElementById("canvas_form");
const hiddenX = document.getElementById("canvas_x");
const hiddenY = document.getElementById("canvas_y");
const hiddenR = document.getElementById("canvas_r");
const error = document.getElementById("error");
const canvas = document.getElementById("coordinate_plane");

let currentR = 2;
let yInput = document.getElementById("text_y");
let xInput = document.getElementById("text_x");

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
    })
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

    hiddenForm.submit();
})

document.getElementById("main_form").addEventListener("submit", (event) => {
    // Обновляем hiddenR перед отправкой
    document.getElementById("hiddenR").value = currentR;

    // Проверяем валидность
    if (!validateX() || !validateY() || !validateR()) {
        event.preventDefault(); // Отменяем отправку если ошибка
    }
});

const validateY = function () {
    const raw = yInput.value;
    const yStr = normalizeNumber(raw);
    yInput.value = yStr;

    const y = parseFloat(yStr);

    if (yStr === '') {
        showMessage(error, "Введите координату Y!");
        return false;
    }
    if (isNaN(y)) {
        showMessage(error, "Y должен быть числом!");
        return false;
    }
    if (y < -5 || y > 5) {
        showMessage(error, "Не входит в диапазон от -5 до 5!");
        return false;
    }

    const dot = yStr.indexOf('.');
    if (dot !== -1 && yStr.length - dot - 1 > 6) {
        showMessage(error, "Слишком много знаков после запятой (макс. 6)");
        return false;
    }
    showMessage(error, "");
    return true;
}

const validateX = function () {
    const raw = xInput.value;
    const xStr = normalizeNumber(raw);
    xInput.value = xStr;

    const x = parseFloat(xStr);

    if (xStr === '') {
        showMessage(error, "Введите координату X!");
        return false;
    }
    if (isNaN(x)) {
        showMessage(error, "X должен быть числом!");
        return false;
    }
    if (x < -3 || x > 3) {
        showMessage(error, "Не входит в диапазон от -3 до 3!");
        return false;
    }

    const dot = xStr.indexOf('.');
    if (dot !== -1 && xStr.length - dot - 1 > 6) {
        showMessage(error, "Слишком много знаков после запятой (макс. 6)");
        return false;
    }
    showMessage(error, "");
    return true;
}

function normalizeNumber(value) {
    if (!value) return '';

    let v = value.trim()
        .replace(/[^0-9.,-]/g, '')
        .replace(/,/g, '.');

    const dotIndex = v.indexOf('.');
    if (dotIndex !== -1) {
        v = v.slice(0, dotIndex + 1) + v.slice(dotIndex + 1).replace(/\./g, '');
        // Ограничиваем до 6 знаков после запятой
        v = v.slice(0, dotIndex + 7);
    }

    const minusCount = (v.match(/-/g) || []).length;
    if (minusCount > 1 || (minusCount === 1 && v[0] !== '-'))
        v = '-' + v.replace(/-/g, '');

    return v;
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