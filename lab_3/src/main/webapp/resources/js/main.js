// Ждем загрузки страницы
document.addEventListener("DOMContentLoaded", function () {
    const canvas = document.getElementById("coordinate_plane");

    // Если канвас найден, вешаем обработчик клика
    if (canvas) {
        canvas.addEventListener("click", function (event) {
            handleCanvasClick(canvas, event);
        });
    }
});

/**
 * Обработка клика по графику
 */
function handleCanvasClick(canvas, event) {
    // 1. Получаем текущий R
    const r = getCurrentR();

    // Если R некорректен, не отправляем запрос (хотя валидация есть на сервере)
    // Можно добавить визуальное уведомление, но PrimeFaces и так покажет ошибку
    if (!isValidR(r)) {
        // Можно вызвать alert("Введите корректный R"), если хочется
        return;
    }

    // 2. Вычисляем координаты
    const rect = canvas.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const clickY = event.clientY - rect.top;

    const width = canvas.width;
    const height = canvas.height;

    // Центр и масштаб берем из глобальных переменных canvas.js
    // Если они там не объявлены как window.scale, используем хардкод 50
    const currentScale = (typeof scale !== 'undefined') ? scale : 50;
    const centerX = width / 2;
    const centerY = height / 2;

    // Математика: (клик - центр) / масштаб
    // Для Y инверсия: (центр - клик) / масштаб
    let mathX = (clickX - centerX) / currentScale;
    let mathY = (centerY - clickY) / currentScale;

    // 3. Заполняем скрытую форму JSF
    // ID элементов зависят от формы id="hiddenForm"
    document.getElementById("hiddenForm:x_hidden").value = mathX.toFixed(3);
    document.getElementById("hiddenForm:y_hidden").value = mathY.toFixed(3);
    document.getElementById("hiddenForm:r_hidden").value = r;

    // 4. Нажимаем скрытую кнопку, чтобы отправить AJAX запрос
    document.getElementById("hiddenForm:submit_hidden").click();
}

/**
 * Глобальная функция перерисовки.
 * Вызывается из main.xhtml (атрибуты onload, oncomplete, onchange)
 */
function drawCanvas() {
    let r = getCurrentR();

    // getPoints() генерируется в main.xhtml и возвращает массив объектов
    // Если функция еще не определена (например, при первой загрузке), берем пустой массив
    let points = (typeof getPoints === "function") ? getPoints() : [];

    // Вызываем функцию отрисовки из canvas.js
    if (typeof renderGraph === "function") {
        renderGraph(r, points);
    }
}

/**
 * Вспомогательная функция для получения R из поля ввода
 */
function getCurrentR() {
    // Ищем поле ввода PrimeFaces. ID = id_формы:id_компонента
    let rInput = document.getElementById('mainForm:r');

    if (rInput) {
        // Заменяем запятую на точку и парсим
        let val = parseFloat(rInput.value.replace(',', '.'));
        if (isValidR(val)) {
            return val;
        }
    }
    return 1.0; // Дефолтное значение для отрисовки, если R не введен
}

/**
 * Проверка R (соответствует валидации на сервере)
 */
function isValidR(val) {
    return !isNaN(val) && val >= 1 && val <= 4;
}