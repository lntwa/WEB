import { initCanvas, drawPoint } from "./canvas.js";

const mainForm = document.getElementById("main_form");
const xInput = document.getElementById("select_x");
const yInput = document.getElementById("text_y");
const rButtons = document.querySelectorAll(".button_r");
const clearButton = document.getElementById("clear");
const error = document.getElementById("error");
const hiddenRInput = document.getElementById("value_r");

let currentR = 2;

window.onload = function () {
    redraw(currentR);
    hiddenRInput.value = currentR;
};

function selectR(event) {
    rButtons.forEach(button => {
        button.classList.remove('selected');
    }); // очищаем предыдущую визуальную подсветку
    event.target.classList.add('selected'); // подсвечиваем кнопку, на которую тыкнули
    currentR = parseFloat(event.target.value); // парсим значение с кнопки в текущий радиус
    hiddenRInput.value = currentR; //записываем

    redraw(currentR); // перерисовываем
}

// присваиваем каждой кнопке поведение при клике, вызываем selectR, чтобы обработать выбор значения радиуса
rButtons.forEach(button => {
    button.addEventListener('click', selectR);
});

const validateX = function () {
    const selectedX = xInput.value;
    if (selectedX === "" || selectedX === null) {
        showMessage(error, "Выберите координату Х!");
        return false;
    } else {
        showMessage(error, "");
        return true;
    }
};

const validateY = function () {
    let selectedY = yInput.value.trim();
    selectedY = checkNumber(selectedY); // меняем все запятые на точки, оставляем только одну точку, удаляем недопустимые символы, корректируем минус
    if (selectedY === '') {
        showMessage(error, "Выберите координату Y!");
        return false;
    }
    if (selectedY.includes('.')) {
        const decimalPart = selectedY.split('.')[1]; // проверяем длину дробной части

        if (decimalPart && decimalPart.length > 6) {
            showMessage(error, "Слишком много знаков после запятой! Макс. 6");
            return false;
        }
    }
    const numY = parseFloat(selectedY);
    if (isNaN(numY)) {
        showMessage(error, "Вводимое значение Y должно быть числом!");
        return false;
    }
    if (numY < -5 || numY > 5) {
        showMessage(error, "Вводимое значение Y не входит в диапазон!");
        return false;
    }
    showMessage(error, "");
    return true;
};

const validateR = function () {
    const selectedR = hiddenRInput.value;
    if (!selectedR) {
        showMessage(error, "Выберите координату R!");
        return false;
    } else {
        showMessage(error, "");
        return true;
    }
};

function redraw(R = currentR) { //под вопросом, если оставляю так, то html страницу уже не передать
    initCanvas(R);
    let history = JSON.parse(localStorage.getItem('results') || '[]');
    history.forEach(result => {
        drawPoint(parseFloat(result.x), parseFloat(result.y), result.hit);
    });
}

function clear() { // сейм здесь
    localStorage.removeItem('results');
    const tbody = document.getElementById('body_for_table');
    tbody.innerHTML = '';
    mainForm.reset();
    redraw(currentR);
}

clearButton.addEventListener('click', clear)

async function handleSubmit(event) {
    const x = xInput.value;
    const y = checkNumber(yInput.value);
    const r = hiddenRInput.value;

    console.log('handleSubmit: x=', x, 'y=', y, 'r=', r, 'hiddenRElement=', hiddenRInput)
    if (!validateX() || !validateY() || !validateR()) return;

    await sendRequest(x, y, r);
}

mainForm.addEventListener('submit', handleSubmit);

function addRow(data) {
    const { x, y, r, hit, time, scriptTime } = data;
    const tbody = document.getElementById('body_for_table');
    let row = tbody.insertRow(-1);
    row.insertCell(0).textContent = x;
    row.insertCell(1).textContent = y;
    row.insertCell(2).textContent = r;
    row.insertCell(3).textContent = hit ? 'Да' : 'Нет';
    row.insertCell(4).textContent = time;
    row.insertCell(5).textContent = scriptTime;
}

function showMessage(element, message) {
    element.onanimationend = null;
    if (message) {
        element.hidden = false;
        element.style.animation = 'fadeInAndFadeOut 3s';
        element.textContent = message;
        element.onanimationend = () => {
            element.hidden = true;
            element.textContent = "";
        };
    } else {
        element.hidden = true;
        element.style.animation = 'none';
        element.textContent = "";
    }
}

function checkNumber(value) {
    if (!value) return '';
    let normalized = value.trim();
    normalized = normalized.replace(/[^0-9.,-]/g, '');
    normalized = normalized.replace(/,/g, '.');
    const dotIndex = normalized.indexOf('.');
    if (dotIndex !== -1) {
        normalized = normalized.substring(0, dotIndex + 1) +
            normalized.substring(dotIndex + 1).replace(/\./g, '');
    }
    const minusCount = (normalized.match(/-/g) || []).length;
    if (minusCount > 1) {
        normalized = '-' + normalized.replace(/-/g, '');
    } else if (minusCount === 1 && normalized.indexOf('-') !== 0) {
        normalized = '-' + normalized.replace(/-/g, '');
    }
    return normalized;
}

async function sendRequest(x, y, r) {
    try {
        const body = new URLSearchParams({ x, y, r });
        if (body == null) {
            return;
        }

        const response = await fetch('fcgi-bin/server-all.jar', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: body
        });
        if (!response.ok) {
            throw new Error(`HTTP error, status ${response.status}`);
        }
        const result = await response.json();
        if (result.error) {
            showMessage(error, result.error);
            return;
        }
        let history = JSON.parse(localStorage.getItem('results') || '[]');
        history.push(result);
        localStorage.setItem('results', JSON.stringify(history));
        addRow(result);
        drawPoint(parseFloat(result.x), parseFloat(result.y), result.hit);
    } catch (e) {
        console.error(e)
        showMessage(error, "Send request error")
    }
}