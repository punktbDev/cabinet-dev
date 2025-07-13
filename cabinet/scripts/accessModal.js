function closeAccessModal() {
    $("article").removeClass("article-blur")
    $(".access-wrapper").css("display", "none")

    // Убираем прослушку клика
    $(document).unbind("click")
}

$("#access__close").on("click tap", closeAccessModal)

$("#open-card-conclusion").on("click tap", () => {
    // Если у пользователя нету полного доступа - показываем модальное окно с сообщением
    if (!userData.is_full_access) {
        $("article").addClass("article-blur")
        $(".access-wrapper").css("display", "flex")

        // Клик вне мадального окна закрывает его
        $(document).click((event) => {
            if ($(event.target).is(".access-wrapper")) {
                closeAccessModal()
            }
        })
        return
    }
    // Передаем данные для аутентификации
    window.open("https://conclusion.punkt-b.pro?auth=" + btoa(userData.login + ":" + userData.password), "_blank")
})