$("#open-card-conclusion").on("click tap", () => {
    // Передаем данные для аутентификации
    window.open("https://conclusion.punkt-b.pro?auth=" + btoa(userData.login + ":" + userData.password), "_blank")
})