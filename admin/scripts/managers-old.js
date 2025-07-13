let managers = {};
let blockManagerId = null;
let accessManagerId = null;

function renderManagers() {
    DBgetAllManagers((data) => {
        managers = data.data;
        $("#manager-list").html("");
        $("#container-managers .content").html("");
        containerManagersHtml = "";

        managers = managers.sort((x, y) => x.id - y.id);

        for (manager of managers) {
            if (!manager.is_admin) {
                $("#manager-list").append(
                    $('<option>', {
                        value: manager.id.toString(),
                        text: manager.name + " " + manager.surname
                    })
                );

                $("#container-managers .content").append(`
                    <div class="manager-container" id="manager-container-${manager.id}">
                        <div class="input-block">
                            <p class="p1-strong">Специалист
                                <img class="full-access-manager" id="full-access-manager-${manager.id}" src="https://sun9-34.userapi.com/impg/gG51WJutAI3RFzxuq1EiCru1wFPpgOlvrnfCTg/qyBcDhdxLHY.jpg?size=23x14&quality=96&sign=707242a5da634fab01df9a0225506022&type=album" alt="block">
                                <img class="block-manager" id="block-manager-${manager.id}" src="https://sun9-23.userapi.com/impg/JV9hb7LRRbf-1P2DuqoS_74teV7VlbZvoINl0g/hpx-E9ZxEj0.jpg?size=12x12&quality=96&sign=bef4f2fa82c0b1a9a1a2f774c37ed9c1&type=album" alt="block">
                            </p>
                            <input class="p1 input-manager js-input-name" readonly value="${manager.name} ${manager.surname}">
                        </div>
                        <div class="input-block">
                            <p>Пароль</p>
                            <input class="p1 input-manager" readonly value="${manager.password}">
                            <input class="hidden js-input-password" readonly value="${manager.password}">
                        </div>
                        <div class="input-block">
                            <p>Email</p>
                            <input class="p1 input-manager js-input-email" readonly value="${manager.login}">
                        </div>
                    </div>
                `);

                if (!manager.is_active) {
                    $("#manager-container-" + manager.id).addClass("blocked");
                }

                if (!manager.is_full_access) {
                    $("#full-access-manager-" + manager.id).addClass("off");
                }

            } else {
                $("#manager-list").append(
                    $('<option>', {
                        value: "1",
                        text: "Все специалисты"
                    })
                );
            }
        }
    });
}

renderManagers();

$("#container-managers .content").on("click tap", ".block-manager", (event) => {
    $("#managers-block-wrapper").css("display", "flex");
    blockManagerId = parseInt(event.currentTarget.id.split("-")[2]);
    let manager = managers.find(el => el.id === blockManagerId);

    if (manager.is_active) {
        $("#managers-block-text").text("Вы уверены, что хотите заблокировать специалиста?");
    } else {
        $("#managers-block-text").text("Вы уверены, что хотите разблокировать специалиста?");
    }
});

$("#container-managers .content").on("click tap", ".full-access-manager", (event) => {
    $("#managers-access-wrapper").css("display", "flex");
    accessManagerId = parseInt(event.currentTarget.id.split("-")[3]);
    let manager = managers.find(el => el.id === accessManagerId);

    if (manager.is_full_access) {
        $("#managers-access-text").text("Выключить полную версию для специалиста?");
    } else {
        $("#managers-access-text").text("Включить полную версию для специалиста?");
    }
});
