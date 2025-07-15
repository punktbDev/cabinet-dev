// Выход из профиля
$("#profile-exit").on("click tap", () => {
    localStorage.removeItem("userData")
    location.href = "./login"
})


// Кнопка Мой профиль
$("#button-profile").on("click tap", () => {
    $(".nav-button").removeClass("active") // Снимаем эффект активной кнопки со всех
    $("#button-profile").addClass("active") // И ставим только на профиль

    $(".container").addClass("hidden") // Отключаем все контейнеры
    $("#container-profile").removeClass("hidden") // И включаем только профиль
})

// Кнопка Клиенты
$("#button-clients").on("click tap", () => {
    $(".nav-button").removeClass("active")
    $("#button-clients").addClass("active")

    $(".container").addClass("hidden")
    $("#container-clients").removeClass("hidden")
})

// Кнопка Диагностики
$("#button-diagnostics").on("click tap", () => {
    $(".nav-button").removeClass("active")
    $("#button-diagnostics").addClass("active")

    $(".container").addClass("hidden")
    $("#container-diagnostics").removeClass("hidden")
})

// Кнопка Архив клиентов
$("#button-archive").on("click tap", () => {
    $(".nav-button").removeClass("active")
    $("#button-archive").addClass("active")

    $(".container").addClass("hidden")
    $("#container-archive").removeClass("hidden")
})


// Просмотр пароля у поля старый пароль
$("#password-old-show").on("click tap", () => {
    // По нажатию проверка, если инпут внутри с типом "Пароль", то меняется картинка и тип на "Текст"
    if ($("#password-old").attr("type") === "password") {
        $("#password-old-show").attr("src", "https://sun9-9.userapi.com/impg/QUqWeT558rMWZb9qXEnFINCBw9GeXUP7kfOABA/ffmOtqJTi_Y.jpg?size=20x20&quality=96&sign=e04699c99774ca3b38a39f486aa17b1a&type=album")
        $("#password-old").attr("type", "text")
        return
    }

    // Если тип "Текст", то возвращаем пароль и иконку открытого глаза
    $("#password-old-show").attr("src", "https://sun9-22.userapi.com/impg/dxnTH0YfbX30oSu95YgdwUBfTKQTNre2pR4spQ/RX2l5PyoxX4.jpg?size=20x20&quality=96&sign=97393bbce30213c930243aa178f6fbec&type=album")
    $("#password-old").attr("type", "password")
})


// Просмотр пароля у поля новый пароль
$("#password-new-show").on("click tap", () => {
    // По нажатию проверка, если инпут внутри с типом "Пароль", то меняется картинка и тип на "Текст"
    if ($("#password-new").attr("type") === "password") {
        $("#password-new-show").attr("src", "https://sun9-9.userapi.com/impg/QUqWeT558rMWZb9qXEnFINCBw9GeXUP7kfOABA/ffmOtqJTi_Y.jpg?size=20x20&quality=96&sign=e04699c99774ca3b38a39f486aa17b1a&type=album")
        $("#password-new").attr("type", "text")
        return
    }

    // Если тип "Текст", то возвращаем пароль и иконку открытого глаза
    $("#password-new-show").attr("src", "https://sun9-22.userapi.com/impg/dxnTH0YfbX30oSu95YgdwUBfTKQTNre2pR4spQ/RX2l5PyoxX4.jpg?size=20x20&quality=96&sign=97393bbce30213c930243aa178f6fbec&type=album")
    $("#password-new").attr("type", "password")
})


// Просмотр пароля у поля повторить пароль
$("#password-new-again-show").on("click tap", () => {
    // По нажатию проверка, если инпут внутри с типом "Пароль", то меняется картинка и тип на "Текст"
    if ($("#password-new-again").attr("type") === "password") {
        $("#password-new-again-show").attr("src", "https://sun9-9.userapi.com/impg/QUqWeT558rMWZb9qXEnFINCBw9GeXUP7kfOABA/ffmOtqJTi_Y.jpg?size=20x20&quality=96&sign=e04699c99774ca3b38a39f486aa17b1a&type=album")
        $("#password-new-again").attr("type", "text")
        return
    }

    // Если тип "Текст", то возвращаем пароль и иконку открытого глаза
    $("#password-new-again-show").attr("src", "https://sun9-22.userapi.com/impg/dxnTH0YfbX30oSu95YgdwUBfTKQTNre2pR4spQ/RX2l5PyoxX4.jpg?size=20x20&quality=96&sign=97393bbce30213c930243aa178f6fbec&type=album")
    $("#password-new-again").attr("type", "password")
})