function formError() {
    inputError("#login-input")
    inputError("#password-input")

    // Ставим текст ошибки
    $("#login-error").addClass("show")
    setTimeout(() => {
        $("#login-error").removeClass("show")
    }, 2000)
}

// Ивент submit у формы входа
const form = document.querySelector('form')
form.addEventListener('submit', (event) => {
    // Отключение базового перехода
    event.preventDefault()
    
    // Отключаем кнопку на 2 секунды
    $("#login-submit").attr("disabled", "disabled")
    setTimeout(() => {
        $("#login-submit").removeAttr("disabled")
    }, 2000)

    // Получаем поля из фомы
    const formData = new FormData(form)
    const formLogin = formData.get("login").trim()
    const formPassword = formData.get("password").trim()

    let URLParams = Object.fromEntries(new URLSearchParams(window.location.search))

    let basicAuth
    try {
        basicAuth = "Basic " + btoa(formLogin + ":" + formPassword)
    } catch (error) {
        formError()

        if (URLParams.dev !== undefined) {
            $(".dev-error").remove()
            $("section form").append(`<p class="dev-error">Ошибка до отправки</p>`)
            $("section form").append(`<p class="dev-error">${typeof error === "object" ? JSON.stringify(error) : error}</p>`)
        }
        
        return
    }

    // Функция авторизации
    $.ajax({
        url: API_URL + "/login",
        method: "GET",
        headers: {
            "Authorization": basicAuth,
        },
        success: (data) => {
            data.login = formLogin
            data.password = formPassword

            // При успехе удаляем старые данные и сохраняем новые и переноси в кабинет
            localStorage.removeItem("userData")
            localStorage.setItem("userData", JSON.stringify(data))

            if (data.is_admin) {
                location.href = "/admin/"
            } else {
                location.href = "/"
            }
        },
        error: (error) => {
            if (URLParams.dev !== undefined) {
                $(".dev-error").remove()
                $("section form").append(`<p class="dev-error">Ошибка после отправки</p>`)
                $("section form").append(`<p class="dev-error">${typeof error === "object" ? JSON.stringify(error) : error}</p>`)
            }
            
            formError()
        }
    })
})


// Кнопка "забыли пароль"
$("#forgot-password").on("click tap", () => {
    window.open("/forgot-password/", "_blank")
})


// Просмотр пароля у поля пароль
$("#password-show").on("click tap", () => {
    // По нажатию проверка, если инпут внутри с типом "Пароль", то меняется картинка и тип на "Текст"
    if ($("#password-input").attr("type") === "password") {
        $("#password-show").attr("src", "https://sun9-9.userapi.com/impg/QUqWeT558rMWZb9qXEnFINCBw9GeXUP7kfOABA/ffmOtqJTi_Y.jpg?size=20x20&quality=96&sign=e04699c99774ca3b38a39f486aa17b1a&type=album")
        $("#password-input").attr("type", "text")
        return
    }

    // Если тип "Текст", то возвращаем пароль и иконку открытого глаза
    $("#password-show").attr("src", "https://sun9-22.userapi.com/impg/dxnTH0YfbX30oSu95YgdwUBfTKQTNre2pR4spQ/RX2l5PyoxX4.jpg?size=20x20&quality=96&sign=97393bbce30213c930243aa178f6fbec&type=album")
    $("#password-input").attr("type", "password")
})