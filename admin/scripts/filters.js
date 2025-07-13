// Фильтры
let filterClients = {
    filter: "date",
    from: "",
    to: "",
    manager: "1",
}

let filterArchive = {
    filter: "date",
    from: "",
    to: "",
    manager: "1",
}


// Выбранная вкладка для рендера клиенты или архив
function renderFilter(filterName) {
    // Если фильтр clients
    if (filterName === "clients") {
        // Если выбран фильтр даты, то ставим выбранную дату
        if (filterClients.filter === "date") {
            $("#filter-date").prop("checked", true)
            $("#filter-name").prop("checked", false)
        } else {
            $("#filter-date").prop("checked", false)
            $("#filter-name").prop("checked", true)
        }

        $("#filter-date-from").val(filterClients.from)
        $("#filter-date-to").val(filterClients.to)
        $("#manager-list").val(filterClients.manager).change()


        // Ставим что кнопка Применить сохранит в фильтр клиентов
        $("#filter-submit").unbind()
        $("#filter-submit").on("click tap", () => {
            filterClients.filter = $(`input[type="radio"][name="filter-type"]:checked`).val()
            filterClients.from = $("#filter-date-from").val()
            filterClients.to = $("#filter-date-to").val()
            filterClients.manager = $("#manager-list").val()

            // Рендерим список всех клиентов
            $("#filter-wrapper").css("display", "none")
            renderClients(clients)
        })

        // Кнопка reset
        $("#filter-reset").unbind()
        $("#filter-reset").on("click tap", () => {
            filterClients.filter = "date"
            filterClients.from = ""
            filterClients.to = ""
            filterClients.manager = "1"
            renderFilter("clients")
        })
        
    } else { // Фильтры архива
        // Если выбран фильтр даты, то ставим выбранную дату
        if (filterArchive.filter === "date") {
            $("#filter-date").prop("checked", true)
            $("#filter-name").prop("checked", false)
        } else {
            $("#filter-date").prop("checked", false)
            $("#filter-name").prop("checked", true)
        }

        $("#filter-date-from").val(filterArchive.from)
        $("#filter-date-to").val(filterArchive.to)
        $("#manager-list").val(filterArchive.manager).change()

        // Ставим что кнопка Применить сохранит в фильтр архива
        $("#filter-submit").unbind()
        $("#filter-submit").on("click tap", () => {
            filterArchive.filter = $(`input[type="radio"][name="filter-type"]:checked`).val()
            filterArchive.from = $("#filter-date-from").val()
            filterArchive.to = $("#filter-date-to").val()
            filterArchive.manager = $("#manager-list").val()

            // Рендерим список всех клиентов
            $("#filter-wrapper").css("display", "none")
            renderClients(clients)
        })

        // Кнопка reset
        $("#filter-reset").unbind()
        $("#filter-reset").on("click tap", () => {
            filterArchive.filter = "date"
            filterArchive.from = ""
            filterArchive.to = ""
            filterArchive.manager = "1"
            renderFilter("archive")
        })
    }
}


// Кнопка фильтры в клиентах
$("#filter-clients").on("click tap", (event) => {
    renderFilter("clients")
    $("#filter-wrapper").css("display", "flex")
})

// Кнопка фильтры в архиве
$("#filter-archive").on("click tap", (event) => {
    renderFilter("archive")
    $("#filter-wrapper").css("display", "flex")
})

// При нажатие на обвертку модальное окно закрывается
$("#filter-wrapper").on("click tap", (event) => {
    // Если клик непосредственно на обвертку
    if (event.target.id === "filter-wrapper") {
        $("#filter-wrapper").css("display", "none")
    }
})