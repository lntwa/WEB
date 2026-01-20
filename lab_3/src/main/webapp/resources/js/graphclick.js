document.addEventListener('DOMContentLoaded', function() {
    const canvas = document.getElementById('areaGraph');
    if (!canvas) return;

    canvas.addEventListener('click', function(e) {
        const rect = canvas.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const clickY = e.clientY - rect.top;

        const width = canvas.width;
        const height = canvas.height;
        const centerX = width / 2;
        const centerY = height / 2;
        const scale = 50;

        const xInput = document.getElementById('check_form:xInput_input');
        const yInput = document.getElementById('check_form:yInput');
        const rInput = document.getElementById('check_form:rInput');

        let rNum;

        if (rInput) {
            const existingR = parseFloat(rInput.value.replace(',', '.'));

            if (!isNaN(existingR) && existingR >= 0.1 && existingR <= 3.0) {
                rNum = existingR;
            } else {
                const rValue = prompt("Введите R (0.1-3.0) для проверки точки:", "1.0");
                if (!rValue) return;

                rNum = parseFloat(rValue.replace(',', '.'));
                if (isNaN(rNum) || rNum < 0.1 || rNum > 3.0) {
                    alert("R должен быть числом от 0.1 до 3.0");
                    return;
                }
                rInput.value = rNum;
            }
        } else {
            alert("Ошибка: Не найдено поле R");
            return;
        }

        const x = ((clickX - centerX) / (scale * 4)) * rNum;
        const y = ((centerY - clickY) / (scale * 4)) * rNum;

        const xFormatted = Math.round(x);
        const yFormatted = parseFloat(y.toFixed(3));

        if (xInput) xInput.value = xFormatted;
        if (yInput) yInput.value = yFormatted;

        setTimeout(() => {
            const button = document.querySelector('#check_form input[type="submit"]');
            if (button) {
                button.click();
            } else {
                console.error("Кнопка отправки не найдена");
            }
        }, 150);
    });
});