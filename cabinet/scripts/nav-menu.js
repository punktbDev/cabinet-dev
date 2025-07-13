// В начале прокрутка недоступна
$("body").toggleClass("no-scroll")


$("#nav-burger").on("click tap", () => {
    $("aside").toggleClass("show")
    $("body").toggleClass("no-scroll")
})

// Кнпока Мой профиль
$("#button-profile").on("click tap", () => {
    $("aside").toggleClass("show")
    $("body").toggleClass("no-scroll")
})

// Кнпока Клиенты
$("#button-clients").on("click tap", () => {
    $("aside").toggleClass("show")
    $("body").toggleClass("no-scroll")
})

// Кнпока Диагностики
$("#button-diagnostics").on("click tap", () => {
    $("aside").toggleClass("show")
    $("body").toggleClass("no-scroll")
})

// Кнпока Архив клиентов
$("#button-archive").on("click tap", () => {
    $("aside").toggleClass("show")
    $("body").toggleClass("no-scroll")
})


// Кнпока Назад в моб. версии
$(".container-back").on("click tap", () => {
    $("aside").toggleClass("show")
    $("body").toggleClass("no-scroll")
})

// Не добавлял обработчик на кнопку выхода