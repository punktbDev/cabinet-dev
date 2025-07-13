// ------------------------ Открытие/Закрытие ------------------------
let editableManagerId = null

function renderEditManager(manager) {
    console.log(manager);
    $("#manager-edit-name").val(`${manager.name} ${manager.surname}`)
    $("#manager-edit-email").val(manager.login)

    $("#manager-edit__copy-password").hide()
    $("#manager-edit__show-password").show()
    $("#manager-edit-password").val("************") // Далее по нажатию кнопки отобразится пароль

    $("#manager-edit-access").prop("checked", manager.is_full_access); // Если галочка стоит - есть полный доступ
    $("#manager-edit-active").prop("checked", !manager.is_active); // Если галочка стоит - заблокирован
}

// Открытие модального окна с изменением менеджера
$("#container-managers").on("click tap", ".manager-edit-button", (event) => {
    const managerContainer = $(event.currentTarget).closest(".manager-container");
    const fullId = managerContainer.attr("id");
    editableManagerId = fullId.split("-").pop(); // Извлекаем id
    const editableManager = managers.find(item => item.id === Number(editableManagerId))
    renderEditManager(editableManager)
    $("#manager-edit-wrapper").css("display", "flex")
})

// При нажатие на обвертку модальное окно закрывается
$("#manager-edit-wrapper").on("click tap", (event) => {
    // Если клик непосредственно на обвертку
    if (event.target.id === "manager-edit-wrapper") {
        $("#manager-edit-wrapper").css("display", "none")
    }
})

// При нажатие на кнопку закрытия или Отмены
$("#manager-edit__close-button, #manager-edit__cancel-button").on("click tap", (event) => {
    $("#manager-edit-wrapper").css("display", "none")
})



// ------------------------ Функции формы ------------------------
// Копировать имя
$("#manager-edit__copy-name").on("click tap", () => {
    const text = $("#manager-edit-name").val()
    navigator.clipboard.writeText(text)
})

// Копировать email
$("#manager-edit__copy-email").on("click tap", () => {
    const text = $("#manager-edit-email").val()
    navigator.clipboard.writeText(text)
})

// Показать пароль
$("#manager-edit__show-password").on("click tap", () => {
    $("#manager-edit__show-password").hide()
    $("#manager-edit__copy-password").show()
    const editableManager = managers.find(item => item.id === Number(editableManagerId))
    $("#manager-edit-password").val(editableManager.password)
})

// Копировать пароль
$("#manager-edit__copy-password").on("click tap", () => {
    const text = $("#manager-edit-password").val()
    navigator.clipboard.writeText(text)
})

// Убираем ошибку при обновлении любого инпута
$("#manager-edit-form").on("propertychange input", "input", () => {
    $("#manager-edit-error").hide()
})

// Удаление пробелов
$("#manager-edit-email, #manager-edit-password, #manager-edit-new-password, #manager-edit-password-again").on("input", function () {
    this.value = this.value.replace(/\s+/g, "");
});



// ------------------------ Форма ------------------------
// Отправка формы добавления менеджера
const managerEditForm = document.querySelector("#manager-edit-form")
managerEditForm.addEventListener("submit", (event) => {
    // Отключение базового перехода
    event.preventDefault()
    $("#manager-edit-error").hide()

    // Изменяемый менеджер (Делаем копию)
    let editableManager = { ...managers.find(item => item.id === Number(editableManagerId)) };

    // Получаем поля из фомы
    const formData = new FormData(managerEditForm)
    let formName = formData.get("manager-edit-name").trim()
    let formEmail = formData.get("manager-edit-email").trim()
    // let formPass = formData.get("manager-edit-password").trim()
    let formPassNew = formData.get("manager-edit-new-password").trim()
    let formPassAgain = formData.get("manager-edit-password-again").trim()

    const showError = (selector, message) => {
        if (selector) inputError(selector);
        $("#manager-edit-error").text(`Ошибка: ${message}`).show();
    };

    const reEmail = /^[\w-\.]+@[\w-]+\.[a-z]{2,4}$/i;
    if (!reEmail.test(formEmail)) {
        return showError("#manager-edit-email", "Неверный email");
    }

    // Тестируем email на btoa 
    try {
        btoa(formEmail);
    } catch {
        // Если ошибка
        return showError("#manager-edit-email", "Используйте только англ. буквы, цифры и спецсимволы");
    }
    editableManager.login = formEmail // Сохраняем старый или новый email

    if (formPassNew) {
        if (formPassNew.length < 8) {
            return showError("#manager-edit-new-password", "Новый пароль меньше 8 символов");
        }

        if (formPassNew !== formPassAgain) {
            inputError("#manager-edit-new-password");
            return showError("#manager-edit-password-again", "Пароли не совпадают");
        }

        // Тестируем новый пароль на btoa
        try {
            btoa(formPassNew);
        } catch {
            return showError("#manager-edit-new-password", "Используйте только англ. буквы, цифры и спецсимволы");
        }

        editableManager.password = formPassNew // Если все ок меняем пароль
    }

    // Если изменили имя
    if (formName !== `${editableManager.name} ${editableManager.surname}`) {
        const [managerName, ...rest] = formName.split(" ");
        const managerSurname = rest.join(" ");
        editableManager.name = managerName
        editableManager.surname = managerSurname
    }
    
    editableManager.is_full_access = $("#manager-edit-access").is(":checked"); // Если галочка стоит - есть полный доступ
    editableManager.is_active = !$("#manager-edit-active").is(":checked"); // Если галочка стоит - заблокирован

    console.log(editableManager);

    // Отключаем кнопку до окончания ответа
    const submitButton = $("#manager-edit__submit-button");
    submitButton.attr("disabled", "disabled");

    DBeditManager(editableManager, (data) => {
        // Включаем кнопку, выключаем модальное окно и рендерим менеджеров
        $("#manager-edit-wrapper").css("display", "none")
        submitButton.removeAttr("disabled")
        renderManagers()
    }, (error) => {
        console.log(error);
        
        // Если в итоге email не уникальный
        submitButton.removeAttr("disabled")
        return showError("#manager-edit-email", "Введенный email занят");
    })
})