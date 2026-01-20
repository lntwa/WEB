document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('check_form');

    const xInput = document.getElementById('check_form:xInput_input');
    const yInput = document.getElementById('check_form:yInput');
    const rInput = document.getElementById('check_form:rInput');

    const errorMessageDiv = document.getElementById('errorMessage');

    function showErrorMessage(message) {
        if (errorMessageDiv) {
            errorMessageDiv.textContent = message;
            errorMessageDiv.style.display = 'block';
        } else {
            alert("Ошибка валидации:\n" + message);
        }
    }

    function hideErrorMessage() {
        if (errorMessageDiv) {
            errorMessageDiv.style.display = 'none';
            errorMessageDiv.textContent = '';
        }
    }

    if (!form) return;

    form.addEventListener('submit', function (e) {
        let isValid = true;
        let errorMessage = "";

        let x = "";
        if (xInput) {
            x = xInput.value.trim();
        }

        if (x === "") {
            errorMessage += "Поле X не должно быть пустым.\n";
            isValid = false;
        } else {
            x = x.replace(',', '.');
            const numberRegex = /^-?\d*\.?\d+$/;

            if (!numberRegex.test(x)) {
                errorMessage += "X должен быть числом.\n";
                isValid = false;
            } else {
                const xNum = parseFloat(x);
                if (xNum < -5 || xNum > 5) {
                    errorMessage += "X должен быть в диапазоне от -5 до 5.\n";
                    isValid = false;
                }
            }
        }

        const y = yInput.value.trim().replace(',', '.');

        if (y === "") {
            errorMessage += "Поле Y не должно быть пустым.\n";
            isValid = false;
        } else {
            const numberRegex = /^-?\d*\.?\d+$/;
            if (!numberRegex.test(y)) {
                errorMessage += "Y должен быть числом.\n";
                isValid = false;
            } else {
                const yNum = parseFloat(y);
                if (yNum < -3 || yNum > 5) {
                    errorMessage += "Y должен быть в диапазоне от -3 до 5.\n";
                    isValid = false;
                }
            }
        }

        const r = rInput.value.trim().replace(',', '.');

        if (r === "") {
            errorMessage += "Поле R не должно быть пустым.\n";
            isValid = false;
        } else {
            const numberRegex = /^-?\d*\.?\d+$/;
            if (!numberRegex.test(r)) {
                errorMessage += "R должен быть числом.\n";
                isValid = false;
            } else {
                const rNum = parseFloat(r);
                if (rNum < 0.1 || rNum > 3.0) {
                    errorMessage += "R должен быть в диапазоне от 0.1 до 3.0.\n";
                    isValid = false;
                }
            }
        }

        if (!isValid) {
            e.preventDefault();
            showErrorMessage(errorMessage.trim());
        } else {
            hideErrorMessage();
        }
    });

    if (xInput) xInput.addEventListener('input', hideErrorMessage);
    if (yInput) yInput.addEventListener('input', hideErrorMessage);
    if (rInput) rInput.addEventListener('input', hideErrorMessage);
});
