// Получить актуальную информацию о профиле
function DBgetUserData(func, func_error) {
    $.ajax({
        url: API_URL + "/manager",
        method: "GET",
        headers: {
            "Authorization": "Basic " + btoa(userData.login + ":" + userData.password)
        },
        success: func,
        error: func_error
    })
}    

// Обновить информацию о пользователе
function DBchangeUserData(data, func, func_error) {
    $.ajax({
        url: API_URL + "/manager/" + data.id,
        method: "PUT",
        headers: {
            "Authorization": "Basic " + btoa(userData.login + ":" + userData.password)
        },
        data: JSON.stringify(data),
        success: func,
        error: func_error
    })
}

// Получить актуальную информацию о клиентах менеджера
function DBgetClients(func, func_error) {
    $.ajax({
        url: API_URL + "/clients",
        method: "GET",
        headers: {
            "Authorization": "Basic " + btoa(userData.login + ":" + userData.password)
        },
        timeout: 60000,
        success: func,
        error: func_error
    })
}

// Установить клиента просмотренным
function DBsetClientChecked(data, func) {
    $.ajax({
        url: API_URL + "/client/is-new",
        method: "POST",
        headers: {
            "Authorization": "Basic " + btoa(userData.login + ":" + userData.password)
        },
        data: JSON.stringify(data),
        success: func
    })
}

// Установить клиента в архив или обратно
function DBsetClientArchive(data, func) {
    $.ajax({
        url: API_URL + "/client/is-archive",
        method: "POST",
        headers: {
            "Authorization": "Basic " + btoa(userData.login + ":" + userData.password)
        },
        data: JSON.stringify(data),
        success: func
    })
}