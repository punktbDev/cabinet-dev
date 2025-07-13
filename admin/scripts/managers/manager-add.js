// ------------------------ Открытие/Закрытие ------------------------
// Открытие модального окна с добавлением менеджера
$("#container-managers").on("click tap", "#manager-add-button", (event) => {
    $("#manager-add-wrapper").css("display", "flex")
    $("#manager-add-error").hide()
})

// При нажатие на обвертку модальное окно закрывается
$("#manager-add-wrapper").on("click tap", (event) => {
    // Если клик непосредственно на обвертку
    if (event.target.id === "manager-add-wrapper") {
        $("#manager-add-wrapper").css("display", "none")
    }
})

// При нажатие на кнопку закрытия или Отмены
$("#manager-add__close-button, #manager-add__cancel-button").on("click tap", (event) => {
    $("#manager-add-wrapper").css("display", "none")
})



// ------------------------ Функции формы ------------------------
// Вставить email
$("#manager-add__insert-email").on("click tap", async () => {
    const text = await navigator.clipboard.readText()
    $("#manager-add-email").val(text)
    $("#manager-add-error").hide()
})

// Генерация пароля
$("#manager-add__generate-password").on("click tap", () => {
    $("#manager-add-password").val(Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8))
    $("#manager-add-error").hide()
})

// Убираем ошибку при обновлении любого инпута
$("#manager-add-form").on("propertychange input", "input", () => {
    $("#manager-add-error").hide()
})

// Удаление пробелов
$("#manager-add-email, #manager-add-password").on("input", function () {
    this.value = this.value.replace(/\s+/g, "");
});


// ------------------------ Форма ------------------------
// Отправка формы добавления менеджера
const managerAddForm = document.querySelector("#manager-add-form")
managerAddForm.addEventListener("submit", (event) => {
    // Отключение базового перехода
    event.preventDefault()
    $("#manager-add-error").hide()

    // Получаем поля из фомы
    const formData = new FormData(managerAddForm)
    let formName = formData.get("manager-add-name").trim()
    let formEmail = formData.get("manager-add-email").trim()
    let formPass = formData.get("manager-add-password").trim()

    const showError = (selector, message) => {
        if (selector) inputError(selector);
        $("#manager-add-error").text(`Ошибка: ${message}`).show();
    };

    const reEmail = /^[\w-\.]+@[\w-]+\.[a-z]{2,4}$/i;
    if (!reEmail.test(formEmail)) {
        return showError("#manager-add-email", "Неверный email");
    }

    if (formPass.length < 8) {
        return showError("#manager-add-password", "Пароль меньше 8 символов");
    }

    // Тестируем на btoa email и пароль
    try {
        btoa(`${formEmail}:${formPass}`);
    } catch {
        // Если ошибка
        inputError("#manager-add-email");
        return showError("#manager-add-password", "Используйте только англ. буквы, цифры и спецсимволы");
    }

    const [managerName, ...rest] = formName.split(" ");
    const managerSurname = rest.join(" ");

    let newManager = {
        login: formEmail,
        password: formPass,
        name: managerName || "", // Если значение есть, то вставляем, иначе пустая строка
        surname: managerSurname || "", // Если значение есть, то вставляем, иначе пустая строка
        phone: "",
        is_full_access: false,
        is_active: true,
        is_admin: false
    }

    console.log(newManager);

    // Отключаем кнопку до окончания ответа
    const submitButton = $("#manager-add__submit-button");
    submitButton.attr("disabled", "disabled");

    DBaddManager(newManager, (data) => {
        // Включаем кнопку, выключаем модальное окно и рендерим менеджеров
        $("#manager-add-wrapper").css("display", "none")
        submitButton.removeAttr("disabled");
        renderManagers()
    }, (error) => {
        console.log(error);
        // Если в итоге email не уникальный
        submitButton.removeAttr("disabled");
        return showError("#manager-add-email", "Введенный email занят");
    })
})