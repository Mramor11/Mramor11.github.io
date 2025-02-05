document.addEventListener("DOMContentLoaded", function () {
    console.log("DOM загружен!");

    // Разворачиваем приложение в Telegram
    if (window.Telegram && Telegram.WebApp) {
        Telegram.WebApp.expand();
        console.log("Telegram WebApp API загружен!");
    }

    // Получаем элементы
    const weightInput = document.getElementById('weight');
    const repsInput = document.getElementById('reps');
    const resultElement = document.getElementById('result');
    const toggleRecommendations = document.getElementById('toggle-recommendations');
    const recommendationsElement = document.getElementById('recommendations');

    // Проверяем, существуют ли элементы
    if (!weightInput || !repsInput || !resultElement || !toggleRecommendations || !recommendationsElement) {
        console.error("Ошибка: один или несколько элементов не найдены!");
        return;
    }

    console.log("Все элементы найдены, инициализация...");

    // Устанавливаем начальное состояние
    resultElement.innerHTML = `<strong>Your estimated 1RM:</strong> <span id="rm-value" class="blurred-text">???</span>`;

    // Добавляем обработчики событий
    weightInput.addEventListener('input', updateValues);
    repsInput.addEventListener('input', updateValues);
    toggleRecommendations.addEventListener('change', toggleRecommendationsHandler);
});

let hasUserInteracted = false;

function updateValues() {
    const weightInput = document.getElementById('weight');
    const repsInput = document.getElementById('reps');
    const weightValueElement = document.getElementById('weight-value');
    const repsValueElement = document.getElementById('reps-value');
    const rmValueElement = document.getElementById('rm-value');

    if (!weightInput || !repsInput || !weightValueElement || !repsValueElement || !rmValueElement) {
        console.warn("Один из элементов не найден в updateValues()");
        return;
    }

    weightValueElement.innerText = weightInput.value;
    repsValueElement.innerText = repsInput.value;

    if (!hasUserInteracted) {
        hasUserInteracted = true;
        rmValueElement.classList.remove("blurred-text");
        rmValueElement.classList.add("visible-text");
    }

    calculate1RM();
}

function calculate1RM() {
    const weightInput = document.getElementById('weight');
    const repsInput = document.getElementById('reps');
    const rmValueElement = document.getElementById('rm-value');

    if (!weightInput || !repsInput || !rmValueElement) {
        console.warn("Один из элементов не найден в calculate1RM()");
        return;
    }

    const weight = parseFloat(weightInput.value);
    const reps = parseFloat(repsInput.value);

    if (isNaN(weight) || isNaN(reps) || reps < 1) {
        rmValueElement.innerText = "???";
        return;
    }

    let oneRepMax = weight / (1.0278 - (0.0278 * reps));

    if (hasUserInteracted) {
        rmValueElement.innerText = `${oneRepMax.toFixed(2)}`;
        rmValueElement.classList.add("visible-text");
    }

    if (document.getElementById('toggle-recommendations').checked) {
        generateRecommendations(oneRepMax);
    }
}

function generateRecommendations(oneRepMax) {
    const recommendationsElement = document.getElementById('recommendations');
    if (!recommendationsElement) return;

    const recommendations = [
        { label: "Warm-up (60% 1RM)", percent: 0.6 },
        { label: "Hypertrophy (75% 1RM)", percent: 0.75 },
        { label: "Strength (85% 1RM)", percent: 0.85 },
        { label: "Max Attempt (95% 1RM)", percent: 0.95 }
    ];

    let recommendationsHTML = "<h3>💪 Recommended Weights:</h3>";

    recommendations.forEach(rec => {
        let weightValue = (oneRepMax * rec.percent).toFixed(2);
        recommendationsHTML += `<div class="recommendation-item">${rec.label}: <span class="blurred-text rec-value">???</span></div>`;
    });

    recommendationsElement.innerHTML = recommendationsHTML;

    // Добавляем эффект появления после первого взаимодействия
    if (hasUserInteracted) {
        document.querySelectorAll(".rec-value").forEach((el, index) => {
            el.innerText = `${(oneRepMax * recommendations[index].percent).toFixed(2)}`;
            el.classList.remove("blurred-text");
            el.classList.add("visible-text");
        });
    }
}

function toggleRecommendationsHandler() {
    const recommendationsElement = document.getElementById('recommendations');
    if (!recommendationsElement) return;

    if (this.checked) {
        recommendationsElement.classList.remove("hidden");
        recommendationsElement.classList.add("recommendations-show");
        calculate1RM();
    } else {
        recommendationsElement.classList.add("hidden");
        recommendationsElement.classList.remove("recommendations-show");
        recommendationsElement.innerHTML = "";
    }
}
