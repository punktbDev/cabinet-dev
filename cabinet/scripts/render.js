// Рендер профиля
function renderUser(data) {
    // Имя профиля
    $("#user-name").text(data.name + " " + data.surname)

    $("#profile-name").val(data.name)
    $("#profile-surname").val(data.surname)
    $("#profile-phone").val(data.phone)
    $("#profile-email").val(data.login)
}

renderUser(userData) // Рендерим сразу и после загрузки актуальной информации

// Получение актуальной информации профиля
DBgetUserData((data) => {
    data.login = userData.login
    data.password = userData.password

    // Если информация есть - значит данные для входа прежние, сохраняем новую информацию
    localStorage.setItem("userData", JSON.stringify(data))
    userData = data
    renderUser(userData)
    
    // И включаем кнопки сохранения
    $("#profile-save").removeAttr("disabled")
    $("#password-save").removeAttr("disabled")

    // Рендер диагностик
    renderDiagnostics()
}, (error) => {
    // Если ошибка - это значит что данные для входа изменились. Удаляем старую информацию и переносим на вход
    localStorage.removeItem("userData")
    location.href = "./login"
})


// Отправка формы профиля
const profileForm = document.querySelector("#profile-form")
profileForm.addEventListener("submit", (event) => {
    // Отключение базового перехода
    event.preventDefault()

    // Отключаем кнопку на 2 секунды
    $("#profile-save").attr("disabled", "disabled")
    setTimeout(() => {
        $("#profile-save").removeAttr("disabled")
    }, 2000)


    // Получаем поля из фомы
    const formData = new FormData(profileForm)
    const formName = formData.get("profile-name")
    const formSurname = formData.get("profile-surname")
    const formPhone = formData.get("profile-phone")
    const formEmail = formData.get("profile-email")

    // Проверка поля Телефона на регулярном выражении
    let rePhone = /^[\d\+][\d\(\)\ -]{9,14}\d$/
    if (formPhone !== "" && !rePhone.test(formPhone)) {
        inputError("#profile-phone")
        return
    }

    // Проверка поля Почты на регулярном выражении
    let reEmail = /^[\w-\.]+@[\w-]+\.[a-z]{2,4}$/i
    if (!reEmail.test(formEmail)) {
        inputError("#profile-email")
        return
    }

    // Меняем поля на новые
    userData.name = formName
    userData.surname = formSurname
    userData.phone = formPhone

    let newUserData = Object.assign({}, userData)
    newUserData.login = formEmail

    // Отправляем изменения
    DBchangeUserData(newUserData, (data) => {
        // Меняем логин на новый
        userData.login = formEmail

        // Если ошибки нету, то сохраняем и обновляем страницу
        localStorage.setItem("userData", JSON.stringify(userData))
        
    }, (error) => {
        // Если есть где то ошибка то помечаем поля
        inputError("#profile-email")
    })
})


// Убираем ошибку при обновлении любого инпута с паролем
$("#password-new, #password-new-again").on("input", () => { // Удаление пробелов
    $(".change-password__error").hide()
})

// Отправка формы пароля профиля
const passwordForm = document.querySelector("#password-form")
passwordForm.addEventListener("submit", (event) => {
    // Отключение базового перехода
    event.preventDefault()

    // Отключаем кнопку на 2 секунды
    $("#password-save").attr("disabled", "disabled")
    setTimeout(() => {
        $("#password-save").removeAttr("disabled")
    }, 2000)


    // Получаем поля из фомы
    const formData = new FormData(passwordForm)
    const oldPass = formData.get("password-old")
    const newPass = formData.get("password-new")
    const newPassAgain = formData.get("password-new-again")

    // Если старый пароль не совпадает с текущим
    if (oldPass !== userData.password) {
        inputError("#password-old")
        $(".change-password__error").text(`Ошибка: Пароль не совпадает с текущим`)
        $(".change-password__error").show()
        return
    }

    // Если новый пароль менее 8 символов
    if (newPass.length < 8) {
        inputError("#password-new")
        $(".change-password__error").text(`Ошибка: Пароль меньше 8 символов`)
        $(".change-password__error").show()
        return
    }

    // Если новый пароль не совпадает с повтором
    if (newPass !== newPassAgain) {
        inputError("#password-new")
        inputError("#password-new-again")
        $(".change-password__error").text(`Ошибка: Подтверждение пароля не совпадает с новым паролем`)
        $(".change-password__error").show()
        return
    }


    try {
        // Тестируем на btoa
        btoa(newPass)
    } catch {
        // Если ошибка
        inputError("#password-new")
        inputError("#password-new-again")
        $(".change-password__error").text(`Ошибка: Используйте только англ. буквы, цифры и спецсимволы`)
        $(".change-password__error").show()
        return
    }

    let newUserData = Object.assign({}, userData)
    newUserData.password = newPass

    // Отправляем изменения
    DBchangeUserData(newUserData, (data) => {
        // Меняем пароль на новый
        userData.password = newPass

        // Если ошибки нету, то сохраняем и обновляем страницу
        localStorage.setItem("userData", JSON.stringify(userData))
        $("#password-form").trigger("reset")
    
    }, (error) => {
        // Если есть где то ошибка то помечаем поля
        inputError("#password-old")
        inputError("#password-new")
        inputError("#password-new-again")
    })
})

// Все диагностики (Для отображения в карточках)
let diagnostics = [
    {id: 0, title: "43 Профессии", link: DIAGNOSTICS_URL + "/43-professions.html?manager-id="},
    {id: 1, title: "10 Любимых дел (Детский)", link: DIAGNOSTICS_URL + "/10-favorite-things-kid.html?manager-id="},
    {id: 2, title: "10 Любимых дел (Взрослый)", link: DIAGNOSTICS_URL + "/10-favorite-things.html?manager-id="},
    {id: 3, title: "Идеальная работа (Детский)", link: DIAGNOSTICS_URL + "/perfect-job-kid.html?manager-id="},
    {id: 4, title: "Идеальная работа (Взрослый)", link: DIAGNOSTICS_URL + "/perfect-job.html?manager-id="},
    {id: 5, title: "Мои потребности (Детский)", link: DIAGNOSTICS_URL + "/my-needs-kid.html?manager-id="},
    {id: 6, title: "Мои потребности (Взрослый)", link: DIAGNOSTICS_URL + "/my-needs.html?manager-id="},
    {id: 7, title: "Антирейтинг профессий (Детский)", link: DIAGNOSTICS_URL + "/antirating-of-professions-kid.html?manager-id="},
    {id: 8, title: "Антирейтинг профессий (Взрослый)", link: DIAGNOSTICS_URL + "/antirating-of-professions.html?manager-id="},
    {id: 9, title: "Интервью (Дети, с пояснением к 43 проф.)", link: DIAGNOSTICS_URL + "/interview-kid.html?manager-id="},
    {id: 10, title: "Интервью (Для всех возрастов)", link: DIAGNOSTICS_URL + "/interview.html?manager-id="},
    {id: 11, title: "8 Кадров (Детский)", link: DIAGNOSTICS_URL + "/8-frames-kid.html?manager-id="},
    {id: 12, title: "8 Кадров (Взрослый)", link: DIAGNOSTICS_URL + "/8-frames.html?manager-id="},
    {id: 13, title: "Исследование ценностей", link: DIAGNOSTICS_URL + "/exploring-values.html?manager-id="},
    {id: 14, title: "Учебная мотивация", link: DIAGNOSTICS_URL + "/learning-motivation.html?manager-id="},
    {id: 15, title: "Диагностика жизнестойкости", link: DIAGNOSTICS_URL + "/viability.html?manager-id="},
    {id: 16, title: "10 вопросов", link: DIAGNOSTICS_URL + "/10-questions.html?manager-id="},
    {id: 17, title: "Я на работе", link: DIAGNOSTICS_URL + "/im-at-work.html?manager-id="}
]

function renderDiagnostics() {
    // Очищаем контент перед рендером
    $("#container-diagnostics .content").html("")

    // Если пришло с сервера что доступные диагностики null - то просто делаем пустой массив
    if (userData.available_diagnostics === null) {
        userData.available_diagnostics = []
    }

    for (let i = 0; i < diagnostics.length; i++) {
        if (!userData.available_diagnostics.includes(diagnostics[i].id)) {
            diagnostics[i].link = "Недоступно"
        }
    }

    // Вставка диагностик с вк видео и добавление постфикса "(Ютуб)"
    const additionalDiagnostics = [
        {id: 9.1, title: "Интервью (Дети, с пояснением к 43 проф.) (Вк-видео)", link: DIAGNOSTICS_URL + "/interview-kid.html?vk&manager-id="},
        {id: 10.1, title: "Интервью (Для всех возрастов) (Вк-видео)", link: DIAGNOSTICS_URL + "/interview.html?vk&manager-id="}
    ];

    const updatedDiagnostics = diagnostics.flatMap(item => {
        if (item.id === 9 && userData.available_diagnostics.includes(9)) {
            const updatedItem = {...item, title: item.title + " (Ютуб)"};
            return [updatedItem, additionalDiagnostics[0]];
        }

        if (item.id === 10 && userData.available_diagnostics.includes(10)) {
            const updatedItem = {...item, title: item.title + " (Ютуб)"};
            return [updatedItem, additionalDiagnostics[1]];
        }

        return [item];
    });

    for (let diagnostic of updatedDiagnostics) {
        if (diagnostic.link !== "Недоступно") {
            $("#container-diagnostics .content").append(`
                <div class="diagnostic" id="diagnostic-${diagnostic.id}">
                    <div class="diagnostic-title">
                        <p>${diagnostic.title}</p>
                    </div>
                    <div class="diagnostic-link">
                        <p class="p-gray js-diagnostic diagnostic-link-available">${diagnostic.link}</p>
                        <img class="diagnostic-copy" title="Скопировать ссылку" src="https://sun9-54.userapi.com/impg/hNzRqGDB45kAe-TNFRmDtaf5-clvzUpmbCuY7g/33mFLRPkVBg.jpg?size=100x100&quality=96&sign=885fd1bbdd660008cf291115c997226a&type=album" alt="copy-link">
                    </div>
                </div>
            `)
        } else {
            $("#container-diagnostics .content").append(`
                <div class="diagnostic" id="diagnostic-${diagnostic.id}">
                    <div class="diagnostic-title">
                        <p>${diagnostic.title}</p>
                    </div>
                    <div class="diagnostic-link">
                        <p class="p-gray js-diagnostic">${diagnostic.link}</p>
                    </div>
                </div>
            `)
        }
    }

    // Для всех диагностик ставим id менеджера в конце
    $(".js-diagnostic").each((i, obj) => {
        // И ставим id менеджера в конец
        if ($(obj).text().endsWith("manager-id=")) {
            $(obj).text($(obj).text() + userData.id)
        }
    })
    
    // Копировании ссылки
    $(".diagnostic-copy").on("click tap", (event) => {
        let diagnosticLink = $(event.target).prev() // Предыдущий элемент перед кнопкой это ссылка
        let diagnosticLinkText = diagnosticLink.text()
        if (diagnosticLinkText.startsWith("http")) {
            navigator.clipboard.writeText(diagnosticLinkText)
            diagnosticLink.text("Скопировано")
            setTimeout(() => {
                diagnosticLink.text(diagnosticLinkText)
            }, 2000)
        }
    })

    // Триггерим поиск диагностик после загрузки
    $("#search-diagnostics").trigger("input")
}

// Рендер диагностик
// renderDiagnostics()


// Поиск по диагностикам срабатывает при обновления поля Поиска
$("#search-diagnostics").on("input", () => {
    if ($("#search-diagnostics").val() === "") {
        $(".diagnostic").css("display", "flex")
    } else {
        $(".diagnostic").css("display", "none")
        $(".diagnostic").each((i, element) => { 
            // Если есть совпадение в поле Title, то отображается
            if ($(element).find(".diagnostic-title").text().toLowerCase().includes($("#search-diagnostics").val().toLowerCase())) {
                $(element).css("display", "flex")
            }
        })
    }
})


// Рендер карточек
function renderClient(card) {
    let date = new Date(Number(card.date))

    let cardHours = date.getHours().toString()
    cardHours = cardHours.length === 1 ? "0" + cardHours : cardHours // В формат 00

    let cardMinutes = date.getMinutes().toString()
    cardMinutes = cardMinutes.length === 1 ? "0" + cardMinutes : cardMinutes // В формат 00                
    
    let cardDay = date.getDate().toString()
    cardDay = cardDay.length === 1 ? "0" + cardDay : cardDay // В формат 00

    let cardMonth = (date.getMonth() + 1).toString() // Месяц начинается с 0
    cardMonth = cardMonth.length === 1 ? "0" + cardMonth : cardMonth // В формат 00

    let cardYear = date.getFullYear().toString()

    // Если карточка не в архиве
    if (!card.in_archive) {
        $("#container-clients .content").append(`
            <div class="card" id="card-${card.id}">
                <div class="card-left">
                    <div class="card-left__dot-wrapper">
                        <div class="card-left__dot ${!card.new && "hidden"}"></div>
                    </div>
                    <div class="card-left__content">
                        <p class="p-gray p-cut js-card-id hidden">${card.id}</p>
                        <p class="p-cut js-card-name">${card.name}</p>
                        <p class="hidden js-card-phone">${card.phone}</p>
                        <p class="hidden js-card-email">${card.email}</p>
                    </div>
                </div>
                <div class="card-right__content">
                    <p class="p-gray">${cardDay}.${cardMonth}.${cardYear}</p>
                    <p class="p-gray">${cardHours}:${cardMinutes}</p>
                </div>
            </div>
        `)
    } else {
        $("#container-archive .content").append(`
            <div class="card" id="card-${card.id}">
                <div class="card-left">
                    <div class="card-left__dot-wrapper">
                        <div class="card-left__dot hidden"></div>
                    </div>
                    <div class="card-left__content">
                        <p class="p-gray p-cut js-card-id hidden">${card.id}</p>
                        <p class="p-cut js-card-name">${card.name}</p>
                        <p class="hidden js-card-phone">${card.phone}</p>
                        <p class="hidden js-card-email">${card.email}</p>
                    </div>
                </div>
                <div class="card-right__content">
                    <p class="p-gray">${cardDay}.${cardMonth}.${cardYear}</p>
                    <p class="p-gray">${cardHours}:${cardMinutes}</p>
                </div>
            </div>
        `)
    }
}

// Функция рендера всех карточек
function renderClients(data) {
    // Очищаем контент
    $("#container-clients .content").html("") // Очищаем контент
    $("#container-archive .content").html("") // Очищаем контент

    // Карточки сортированные по дате от новых к старым
    let clientsData = data.sort((x, y) => x.date - y.date).reverse()

    // Отделяем обычные от архивных чтобы применить разные фильтры
    let cardsClients = clientsData.filter(item => !item.in_archive)
    let cardsArchive = clientsData.filter(item => item.in_archive)

    // Утилита для фильтрации от, до и сортировки по имени
    function applyFilters(cards, cfg) {
        if (cfg.from !== "") {  
            cards = cards.filter(card => new Date(cfg.from) < card.date)
        }
        // Фильтр До
        if (cfg.to !== "") {
            cards = cards.filter(card => card.date < new Date(cfg.to))
        }
        // Сортировка по имени
        if (cfg.filter === "name") {
            cards.sort((a, b) => a.name.localeCompare(b.name))
        }
        return cards
    }

    // Применяем фильтры
    cardsClients = applyFilters(cardsClients, filterClients)
    cardsArchive = applyFilters(cardsArchive, filterArchive)

    // Рендер обычных карточек
    for (let card of cardsClients) {
        renderClient(card)
    }

    // Рендер архивных карточек
    for (let card of cardsArchive) {
        renderClient(card)
    }
    
    // По нажатию на карточку рендер открытой карточки
    $(".card").unbind()
    $(".card").on("click tap", event => {
        renderOpenCard(event.currentTarget.id.split("-")[1]) // Передаем id карточки на которую нажали
    })

    // Триггерим поиск после рендера
    $("#search-clients").trigger("input")
    $("#search-archive").trigger("input")
}


// id открытой карточки
let openedCardId = null

function renderOpenCard(cardId) {
    openedCardId = cardId
    
    // Находим в списке нужную карточку
    let card = clients.find(el => el.id === parseInt(cardId))

    // Заполняем открытую карточку
    $("#open-card-name").text(card.name)
    $("#open-card-phone").val(card.phone)
    $("#open-card-email").val(card.email)

    // Меняем лейбл у инпута если телефон родителя
    if (card["is_phone_adult"]) {
        $("#open-card-phone-label").text("Телефон родителя")
    } else {
        $("#open-card-phone-label").text("Телефон")
    }

    // Открываем карточку
    $(".container").addClass("hidden")
    $("#container-open-card").removeClass("hidden")

    $(".results-container").html("") // Очищаем контент перед рендером
    let results = [...card.results] // Копирование массива
    for (i in results.reverse()) { // С конца
        // Получаем название пройденной диагностики
        let diagnostic = diagnostics.find(el => el.id === results[i]["diagnostic-id"])

        let date = new Date(Number(results[i].date))

        let resultHours = date.getHours().toString()
        resultHours = resultHours.length === 1 ? "0" + resultHours : resultHours // В формат 00

        let resultMinutes = date.getMinutes().toString()
        resultMinutes = resultMinutes.length === 1 ? "0" + resultMinutes : resultMinutes // В формат 00                
        
        let resultDay = date.getDate().toString()
        resultDay = resultDay.length === 1 ? "0" + resultDay : resultDay // В формат 00

        let resultMonth = (date.getMonth() + 1).toString() // Месяц начинается с 0
        resultMonth = resultMonth.length === 1 ? "0" + resultMonth : resultMonth // В формат 00

        let resultYear = date.getFullYear().toString()

        let resultDate = resultDay + "." + resultMonth + "." + resultYear + "   " + resultHours + ":" + resultMinutes

        // Добавляем результат в открытую карточку
        $(".results-container").append(`
            <div class="result" id="result-${i}">
                <div class="input-block">
                    <p class="p1-strong">Название диагностики</p>
                    <input class="p1 input-open-card" readonly value="${diagnostic.title}">
                </div>
                <div class="input-block">
                    <p>Дата прохождения</p>
                    <input class="p1 input-open-card" readonly value="${resultDate}">
                </div>
                <div class="input-block">
                    <button class="p1 open-result" id="card-${card.id}-result-${results[i].date}">Узнать результаты</button>
                </div>
            </div>
        `);
    }

    // По нажатию на Узнать результаты
    $(`.open-result`).unbind()
    $(`.open-result`).on("click tap", (event) => {
        openResults(event.currentTarget.id) // Передаем id кнопки результатов на которую нажали
    })


    // Ставим карточку просмотренной
    if (card.new) {
        clients[clients.findIndex(el => el.id === card.id)].new = false // Находим индекс карточки и ставим ее просмотренной

        $(`#card-${card.id}`).find(".card-left__dot").addClass("hidden")
        newCardCount--
        $("#clients-count").text(newCardCount);

        // Устанавливаем карточку просмотренной в базе данных
        DBsetClientChecked({id: card.id}, (data) => {})
    }

    // Меняем title у кнопки "В архив"
    if (!card.in_archive) {
        $("#container-open-card-archive").attr("title", "В архив")
    } else {
        $("#container-open-card-archive").attr("title", "Вернуть из архива")
    }

    // Кнопка назад в открытой карточке
    $("#container-open-card-back").unbind()
    $("#container-open-card-back").on("click tap", () => {
        $(".container").addClass("hidden")

        // Если карточка из общего списка, то открываем его
        if (!card.in_archive) {
            $(".nav-button").removeClass("active")
            $("#button-clients").addClass("active")
            $("#container-clients").removeClass("hidden")
        } else { // Иначе открываем архивы
            $(".nav-button").removeClass("active")
            $("#button-archive").addClass("active")
            $("#container-archive").removeClass("hidden")
        }
    })


    $("#container-open-card-archive").css("display", "block")

    // Кнопка в архив
    $("#container-open-card-archive").unbind()
    if (!card.in_archive) {
        $("#container-open-card-archive").on("click tap", () => {
            $("#container-open-card-archive").css("display", "none")
            DBsetClientArchive({id: card.id}, (data) => {
                clients[clients.findIndex(el => el.id === card.id)].in_archive = true // Находим индекс карточки и ставим ее в архив
                renderClients(clients)
            })
        })

    } else { // Иначе возвращаем кнопку из архива
        $("#container-open-card-archive").on("click tap", () => {
            $("#container-open-card-archive").css("display", "none")
            DBsetClientArchive({id: card.id}, (data) => {
                clients[clients.findIndex(el => el.id === card.id)].in_archive = false
                renderClients(clients)
            })
        })
    }
}


// Поиск по клиентам срабатывает при обновления поля Поиска
$("#search-clients").on("input", () => {
    if ($("#search-clients").val() === "") {
        $("#container-clients .content .card").css("display", "flex")
    } else {
        $("#container-clients .content .card").css("display", "none")
        $("#container-clients .content .card").each((i, element) => { 
            // Если есть совпадение в поле Имя карточки, то отображается
            if ($(element).find(".js-card-name").text().toLowerCase().includes($("#search-clients").val().toLowerCase())) {
                $(element).css("display", "flex")
            }

            // Поиск по номеру карточки
            if ($(element).find(".js-card-id").text().toLowerCase().includes($("#search-clients").val().toLowerCase())) {
                $(element).css("display", "flex")
            }

            // Поиск по номеру
            if ($(element).find(".js-card-phone").text().toLowerCase().includes($("#search-clients").val().toLowerCase())) {
                $(element).css("display", "flex")
            }

            // Поиск по почте
            if ($(element).find(".js-card-email").text().toLowerCase().includes($("#search-clients").val().toLowerCase())) {
                $(element).css("display", "flex")
            }
        })
    }
})


// Поиск по Архиву клиентам срабатывает при обновления поля Поиска
$("#search-archive").on("input", () => {
    if ($("#search-archive").val() === "") {
        $("#container-archive .content .card").css("display", "flex")
    } else {
        $("#container-archive .content .card").css("display", "none")
        $("#container-archive .content .card").each((i, element) => { 
            // Если есть совпадение в поле Имя карточки, то отображается
            if ($(element).find(".js-card-name").text().toLowerCase().includes($("#search-archive").val().toLowerCase())) {
                $(element).css("display", "flex")
            }

            // Поиск по номеру карточки
            if ($(element).find(".js-card-id").text().toLowerCase().includes($("#search-archive").val().toLowerCase())) {
                $(element).css("display", "flex")
            }

            // Поиск по номеру
            if ($(element).find(".js-card-phone").text().toLowerCase().includes($("#search-archive").val().toLowerCase())) {
                $(element).css("display", "flex")
            }

            // Поиск по почте
            if ($(element).find(".js-card-email").text().toLowerCase().includes($("#search-archive").val().toLowerCase())) {
                $(element).css("display", "flex")
            }
        })
    }
})


let clients = {}
let newCardCount = 0 // Количество новых карточек

// Получаем всех клиентов
DBgetClients((data) => {
    // Если data === undefined (Нету клиентов), то пустой массив | Иначе преобразуем массив массивов в плоский массив
    clients = data === undefined ? [] : data.flat()

    // Ставим количество новых карточек
    newCardCount = clients.filter(item => item.new && !item.in_archive).length
    $("#clients-count").text(newCardCount);

    // Рендерим список
    renderClients(clients)
}), (error) => {
    console.log("DBgetClients => error: " + error);
}
