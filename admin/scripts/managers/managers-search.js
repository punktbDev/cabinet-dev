let containerManagersHtml = "" // Уже отрендеренный код контейнера

// Поиск по менеджерам срабатывает при обновления поля Поиска
$("#managers-search").on("input", () => { 
    if ($("#managers-search").val() === "") {
        renderManagers()
    } else {
        if (!containerManagersHtml) { // Если поиск первый раз, то просто сохраняем код всего контейнера что бы потом по нему иска, а не рендерить заново
            containerManagersHtml = $("#container-managers .content").html()
        } else {
            $("#container-managers .content").html(containerManagersHtml)
        }
    
        $(".manager-container").addClass("hide")
        $(".manager-container").each((i, element) => { 
            // Если есть совпадение в поле Name, то отображается
            if ($(element).find(".js-input-name").val().toLowerCase().includes($("#managers-search").val().toLowerCase())) {
                $(element).removeClass("hide")
            }
    
            // Если есть совпадение в поле Email, то отображается
            if ($(element).find(".js-input-login").val().toLowerCase().includes($("#managers-search").val().toLowerCase())) {
                $(element).removeClass("hide")
            }
        })
    
        // Удаляем все не подходящие элементы
        $(".manager-container.hide").remove()
    }
})