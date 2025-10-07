import { initCanvas, drawPoint } from "./canvas.js";

const mainForm = document.getElementById("main_form");
const xInput = document.getElementById("select_x");
const yInput = document.getElementById("text_y");
const rButtons = document.querySelectorAll(".button_r"); // Исправлено
const clearButtons = document.querySelectorAll(".form_button"); // Исправлено
const error = document.getElementById("error");
const hiddenRInput = document.getElementById("value_r");

let currentR = 2;

window.onload = function () {
    redraw(currentR);
    // Устанавливаем начальное значение R
    hiddenRInput.value = currentR;
};

// Исправленная функция для выбора R
function selectR(event) {
    // Снимаем выделение со всех кнопок
    rButtons.forEach(button => {
        button.classList.remove('selected');
    });
    
    // Выделяем нажатую кнопку
    event.target.classList.add('selected');
    
    // Устанавливаем значение R
    currentR = parseFloat(event.target.value);
    hiddenRInput.value = currentR;
    
    redraw(currentR);
}

// Назначаем обработчики для кнопок R
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
    selectedY = checkNumber(selectedY);
    if (selectedY === '') {
        showMessage(error, "Выберите координату Y!");
        return false;
    }
    if (selectedY.includes('.')) {
        
        const decimalPart = selectedY.split('.')[1];

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

function redraw(R = currentR) {
    initCanvas(R);
    let history = JSON.parse(localStorage.getItem('results') || '[]');
    history.forEach(result => {
        drawPoint(parseFloat(result.x), parseFloat(result.y), result.hit);
    });
}

function clear() {
    localStorage.removeItem('results');
    const tbody = document.getElementById('body_for_table');
    tbody.innerHTML = '';
    mainForm.reset();
    redraw(currentR);
}

// Назначаем обработчики для кнопок очистки
clearButtons.forEach((button, index) => {
    if (index === 1) { // Кнопка "Очистить форму"
        button.addEventListener('click', clear);
    } else if (index === 2) { // Кнопка "Очистить таблицу"
        button.addEventListener('click', function() {
            localStorage.removeItem('results');
            const tbody = document.getElementById('body_for_table');
            tbody.innerHTML = '';
            redraw(currentR);
        });
    }
});

// Обработчик для кнопки "Подтвердить"
document.querySelector('.form_button').addEventListener('click', function(event) {
    event.preventDefault();
    handleSubmit(event);
});

async function handleSubmit(event) {
    const x = xInput.value;
    const y = checkNumber(yInput.value);
    const r = hiddenRInput.value;

    if (!validateX() || !validateY() || !validateR()) return;

    await sendRequest(x, y, r);
}

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
        const data = { x, y, r };
        
        const response = await fetch('/fcgi-bin/server.jar', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });
        
        if (!response.ok) {
            throw Error(response.statusText);
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
    } catch (err) {
        console.error(err);
        showMessage(error, "Server error!");
    }
}