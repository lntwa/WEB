import { initCanvas, drawPoint } from './canvas.js';

const buttons = document.querySelectorAll('button[name="r"]');
const button = document.querySelector('.submit');
const mainForm = document.getElementById('main_form')
const clearButton = document.getElementById("clear")

let currentR = 2;

window.onload = function () {
    initCanvas(currentR);

    const clearButton = document.getElementById("clear");
    clearButton.addEventListener('click', clear);
};

buttons.forEach(button => {
    button.addEventListener('click', function () {
        buttons.forEach(btn => btn.classList.remove('selected'));

        this.classList.add('selected');

        const rValue = parseFloat(this.getAttribute('value'));
        document.getElementById('hiddenR').value = rValue;

        currentR = rValue;
        initCanvas(currentR);
    });
});


button.addEventListener('click', () => {
    const body = makeForm();
    if (body == null) return;

    const x = document.getElementById("select_x").value;
    const y = document.getElementById("text_y").value;

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
        const tbody = document.getElementById('#result_table tbody');
        tbody.insertAdjacentHTML('beforeend', htmlRow);
        drawPoint(parseFloat(x), parseFloat(y), true);
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

//const R = document.getElementById('hiddenR')
const Y = document.getElementById('text_y')
//const X = document.getElementById('select_x')

Y.addEventListener("input", validateY);

Y.addEventListener('paste', (e) => {
    e.preventDefault();
});

function validateY(e) {

    console.log("Start of validating Y");

    const input = e.target;
    input.value = input.value.replace(/[^0-9.-]/g, "");
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

function clear() {
    const tbody = document.getElementById('body_table');
    if (tbody) tbody.innerHTML = '';

    const mainForm = document.getElementById('main_form');
    if (mainForm) mainForm.reset();

    const hiddenR = document.getElementById('hiddenR');
    if (hiddenR) hiddenR.value = '';

    buttons.forEach(btn => btn.classList.remove('selected'));

    initCanvas(currentR);
}