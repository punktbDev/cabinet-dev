// В начале прокрутка недоступна
$("body").toggleClass("no-scroll")

$("#nav-burger").on("click tap", () => {
    $("aside").toggleClass("show")
    $("body").toggleClass("no-scroll")

})

// Кнопка Мой профиль
$("#button-profile").on("click tap", () => {
    $("aside").toggleClass("show")
    $("body").toggleClass("no-scroll")

})

// Кнопка Клиенты
$("#button-clients").on("click tap", () => {
    $("aside").toggleClass("show")
    $("body").toggleClass("no-scroll")

})

// Кнопка Диагностики
$("#button-diagnostics").on("click tap", () => {
    $("aside").toggleClass("show")
    $("body").toggleClass("no-scroll")

})

// Кнопка Архив клиентов
$("#button-archive").on("click tap", () => {
    $("aside").toggleClass("show")
    $("body").toggleClass("no-scroll")

})

// Кнопка Профили специалистов
$("#button-managers").on("click tap", () => {
    $("aside").toggleClass("show")
    $("body").toggleClass("no-scroll")
})


// Кнопка Назад в моб. версии
$(".container-back").on("click tap", () => {
    $("aside").toggleClass("show")
    $("body").toggleClass("no-scroll")
})

// Не добавлял обработчик на кнопку выхода