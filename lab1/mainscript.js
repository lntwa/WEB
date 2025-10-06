import { initCanvas, drawPoint } from "./canvas";

const mainForm = document.getElementById("main_form");
const xInput = document.getElementById("select_x");
const yInput = document.getElementById("text_y");
const rInput = document.querySelectorAll("#choice_of_r input[type='button']");
const clearButton = document.getElementsByClassName("form_button");
const error = document.getElementById("error")

let currentR = 2

window.onload = function () {
    redraw(currentR);
}

const validateX = function () {
    const selectedX = xInput.value;
    if (selectedX === "" || selectedX === null) {
        showMessage(error, "Выберите координату Х!");
        return false;
    } else {
        showMessage(error, "");
        return true;
    }
}

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
}

const validateR = function () {
    const selectedR = document.getElementById('value_r').value;
    if (!selectedR) {
        showMessage(error, "Выберите координату R!");
        return false;
    } else {
        showMessage(error, "");
        return true;
    }
}

function changeR (event) {
    const selectedR = event.target;
    currentR = parseFloat(selectedR.value);
    redraw(currentR);
}

rInput.forEach(button => {
    button.addEventListener('change', changeR)
})

function redraw(R = currentR) {
    initCanvas(R);
    let history = JSON.parse(localStorage.getItem('results') || '[]');
    history.forEach(result => {
        drawPoint(parseFloat(result.x), parseFloat(result.y), result.hit);
    });
}

function clear() {
    localStorage.removeItem('results')
    const tbody = document.getElementById('body_for_table')
    tbody.innerHTML = ''
    mainForm.reset()
    redraw(currentR)
}

clearButton.addEventListener('click', clear);

