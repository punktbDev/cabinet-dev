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
        url: API_URL + "/manager",
        method: "PUT",
        headers: {
            "Authorization": "Basic " + btoa(userData.login + ":" + userData.password)
        },
        data: JSON.stringify(data),
        success: func,
        error: func_error
    })
}

// Получить актуальную информацию о всех менеджерах
function DBgetAllManagers(func) {
    $.ajax({
        url: API_URL + "/managers",
        method: "GET",
        headers: {
            "Authorization": "Basic " + btoa(userData.login + ":" + userData.password)
        },
        success: func
    })
}

// Получить актуальную информацию о всех клиентах
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

// Добавить менеджера
function DBaddManager(data, func, func_error) {
    $.ajax({
        url: API_URL + "/manager/add",
        method: "POST",
        headers: {
            "Authorization": "Basic " + btoa(userData.login + ":" + userData.password)
        },
        data: JSON.stringify(data),
        success: func,
        error: func_error
    })
}

// Изменить доступ менеджера
function DBsetManagerActive(id, func) {
    $.ajax({
        url: API_URL + "/manager/is-active/" + id,
        method: "PUT",
        headers: {
            "Authorization": "Basic " + btoa(userData.login + ":" + userData.password)
        },
        success: func
    })
}

// Изменить access менеджера
function DBsetManagerAccess(id, func) {
    $.ajax({
        url: API_URL + "/manager/full-access/" + id,
        method: "PUT",
        headers: {
            "Authorization": "Basic " + btoa(userData.login + ":" + userData.password)
        },
        success: func
    })
}