let managers = {}

// Получаем всех клиентов
function renderManagers() {
    DBgetAllManagers((data) => {
        managers = data.data

        // Обнуляем
        $("#manager-list").html("")
        $("#container-managers .content").html("")
        containerManagersHtml = "" // Отчищаем отрендеренный код, что бы загрузить актуальную информацию

        // Фильтр менеджеров по id
        managers = managers.sort((x,y) => {return x.id - y.id})

        for (let manager of managers) {
            // Пропускаем админа
            if (!manager.is_admin) {
                $("#manager-list").append(
                    $('<option>', {
                        value: manager.id.toString(),
                        text: manager.name + " " + manager.surname
                    })
                )


                $("#container-managers .content").append(`
                    <div class="manager-container" id="manager-container-${manager.id}">
                        <p>${manager.name} ${manager.surname}</p>
                        <input class="hidden js-input-name" readonly value="${manager.name} ${manager.surname}">
                        <input class="hidden js-input-login" readonly value="${manager.login}">
                        <div class="manager-buttons">
                            <button class="manager-edit-button">
                                <img src="./assets/manager-edit.svg" alt="manager-edit">
                                Редактировать
                            </button>
                            <button class="manager-diagnostics-button">Диагностики</button>
                        </div>
                    </div>
                `)


                // Если менеджер заблокирован, то добавляем класс
                if (!manager.is_active) {
                    $("#manager-container-" + manager.id).addClass("blocked")
                }

            } else { // Нулевой пункт это все специалисты
                $("#manager-list").append(
                    $('<option>', {
                        value: "1",
                        text: "Все специалисты"
                    })
                )
            }
        }
    })
}

// Обвернул в функцию что бы рендерить позже в добавлении менеджера
renderManagers()