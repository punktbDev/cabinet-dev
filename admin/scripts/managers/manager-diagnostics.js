// Рендер всех диагностик внутри прокручиваемого окна
function renderManagerModalDiagnostics() {
    // Отчищаем контейнер перед отрисовкой
    $(".manager-modal__diagnostics-container").html("")

    diagnostics.forEach(element => {
        $(".manager-modal__diagnostics-container").append(`
            <div class="manager-input__checkbox-wrapper">
                <input type="checkbox" id="manager-diagnostics-${element.id}" name="manager-diagnostics-${element.id}">
                <div class="manager-input-checkbox"></div>
                <label for="manager-diagnostics-${element.id}" class="p1">${element.title}</label>
            </div>
        `);
    });
}
renderManagerModalDiagnostics() // И сразу отрисовываем

// Открытие модального окна с диагностиками
function openManagerModalDiagnostics(availableDiagnostics) {
    $(`.manager-modal__diagnostics-container input[type="checkbox"]`).each(function() {
        let idAttr = this.id
        let id = Number(idAttr.split("-")[2])
        $(this).prop("checked", availableDiagnostics.includes(id));
    });

    $("#manager-diagnostics-wrapper").css("display", "flex")
}

// Открытие модального окна с изменением менеджера
$("#container-managers").on("click tap", ".manager-diagnostics-button", () => {
    // Сбрасываем значение фильтра
    managerModalFilterAllActive = false 

    // Сюда нужно будет передавать какие диагностики УЖЕ доступны клиенту
    openManagerModalDiagnostics([0, 1, 5, 8,, 7, 17])
})

// При нажатие на обвертку модальное окно закрывается
$("#manager-diagnostics-wrapper").on("click tap", (event) => {
    // Если клик непосредственно на обвертку
    if (event.target.id === "manager-diagnostics-wrapper") {
        $("#manager-diagnostics-wrapper").css("display", "none")
    }
})

// При нажатие на кнопку закрытия или Отмены
$("#manager-diagnostics__close-button, #manager-diagnostics__cancel-button").on("click tap", () => {
    $("#manager-diagnostics-wrapper").css("display", "none")
})


// Выбрать все
let managerModalFilterAllActive = false // Ставим по умолчанию false что бы при первом клике оно выбрало все, при повторном клике будет снимать все
$("#manager-modal__filter-all").on("click tap", () => {
    managerModalFilterAllActive = !managerModalFilterAllActive
    $(`.manager-modal__diagnostics-container input[type="checkbox"]`).prop("checked", managerModalFilterAllActive);
})

// При клике на имитацию чекбокса будет активироваться сам чекбокс
$(".manager-input-checkbox").on("click", function () {
    $(this).siblings(`input[type="checkbox"]`).trigger("click");
});


// Сохранение доступных диагностик
$("#manager-diagnostics__submit-button").on("click tap", () => {
    let availableDiagnostics = []
    $(`.manager-modal__diagnostics-container input[type="checkbox"]:checked`).each(function() {
        let idAttr = this.id;
        availableDiagnostics.push(Number(idAttr.split("-")[2]))
    });

    // Отправляем новые доступные диагностики
    console.log(availableDiagnostics);
    
    // ... Описать API

    // И закрываем окно после успеха
    $("#manager-diagnostics-wrapper").css("display", "none")
})

