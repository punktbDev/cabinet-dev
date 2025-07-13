// Фильтры
let filterClients = {
    filter: "date",
    from: "",
    to: "",
}

let filterArchive = {
    filter: "date",
    from: "",
    to: "",
}


// Выбраная вкладка для рендера клиенты или архив
function renderFilter(filterName) {
    // Если фильтер clients
    if (filterName === "clients") {
        // Если выбран фильтр даты, то ставим выбраным дату
        if (filterClients.filter === "date") {
            $("#filter-date").prop("checked", true)
            $("#filter-name").prop("checked", false)
        } else {
            $("#filter-date").prop("checked", false)
            $("#filter-name").prop("checked", true)
        }

        $("#filter-date-from").val(filterClients.from)
        $("#filter-date-to").val(filterClients.to)

        // Ставим что кнопка Применить сохранит в фильтр клиенов
        $("#filter-submit").unbind()
        $("#filter-submit").on("click tap", () => {
            filterClients.filter = $(`input[type="radio"][name="filter-type"]:checked`).val()
            filterClients.from = $("#filter-date-from").val()
            filterClients.to = $("#filter-date-to").val()

            // Рендерим список всех клиентов
            $("#filter-wrapper").css("display", "none")
            renderClients(clients)
        })

        // Кнопка ресета
        $("#filter-reset").unbind()
        $("#filter-reset").on("click tap", () => {
            filterClients.filter = "date"
            filterClients.from = ""
            filterClients.to = ""
            renderFilter("clients")
        })
        
    } else { // Фильтры архива
        // Если выбран фильтр даты, то ставим выбраным дату
        if (filterArchive.filter === "date") {
            $("#filter-date").prop("checked", true)
            $("#filter-name").prop("checked", false)
        } else {
            $("#filter-date").prop("checked", false)
            $("#filter-name").prop("checked", true)
        }

        $("#filter-date-from").val(filterArchive.from)
        $("#filter-date-to").val(filterArchive.to)

        // Ставим что кнопка Применить сохранит в фильтр архива
        $("#filter-submit").unbind()
        $("#filter-submit").on("click tap", () => {
            filterArchive.filter = $(`input[type="radio"][name="filter-type"]:checked`).val()
            filterArchive.from = $("#filter-date-from").val()
            filterArchive.to = $("#filter-date-to").val()

            // Рендерим список всех клиентов
            $("#filter-wrapper").css("display", "none")
            renderClients(clients)
        })

        // Кнопка ресета
        $("#filter-reset").unbind()
        $("#filter-reset").on("click tap", () => {
            filterArchive.filter = "date"
            filterArchive.from = ""
            filterArchive.to = ""
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