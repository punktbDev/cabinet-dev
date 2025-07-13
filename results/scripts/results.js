// Все диагностики под их id
let diagnostics = {
    0: "43 Профессии",
    1: "10 Любимых дел (Детский)",
    2: "10 Любимых дел (Взрослый)",
    3: "Идеальная работа (Детский)",
    4: "Идеальная работа (Взрослый)",
    5: "Мои потребности (Детский)",
    6: "Мои потребности (Взрослый)",
    7: "Антирейтинг профессий (Детский)",
    8: "Антирейтинг профессий (Взрослый)",
    9: "Интервью (Дети, с пояснением к 43 проф.)",
    10: "Интервью (Для всех возрастов)",
    11: "8 Кадров (Детский)",
    12: "8 Кадров (Взрослый)",
    13: "Исследование ценностей",
    14: "Учебная мотивация",
    15: "Диагностика жизнестойкости",
    16: "10 вопросов",
    17: "Я на работе"
}

function renderError() {
    $("section").append(`<div><h3>Невозможно отобразить результаты!</h3><h3>Возможно вы перешли по неправильной ссылке.</h3></div>`)
}

// Получить данные о клиенте
function DBgetUserData(id, func, func_error) {
    $.ajax({
        url: API_URL + "/client/" + id,
        method: "GET",
        headers: {
            "Authorization": "Basic " + btoa(userData.login + ":" + userData.password)
        },
        success: func,
        error: func_error
    })
}

let URLParams = Object.fromEntries(new URLSearchParams(window.location.search))
if (URLParams["id"] !== undefined) {
    const _URLParams = URLParams["id"].split("_")
    const clientId = _URLParams[0]
    const resultId = _URLParams[1]

    DBgetUserData(clientId, (data) => {
        let results = data.results.reverse()

        // Если есть второй id - рендер конкретного результата клиента
        if (resultId !== undefined) {
            let result = 0
            if (resultId.length < 5) { // Поиск по порядковому номеру если id диагностики 4 цифры
                result = results[resultId] 
            } else { // Поиск по дате прохождения
                result = results.find(result => result.date == resultId)
            }
            
            if (!result) {
                renderError()
                return
            }
            
            result["name"] = data.name
            result["diagnostic-title"] = diagnostics[result["diagnostic-id"]]
            renderResult(result)
        } else {
            for (let i in results) {
                results[i]["name"] = data.name
                results[i]["diagnostic-title"] = diagnostics[results[i]["diagnostic-id"]]
            }
            
            results.forEach(element => {
                renderResult(element)
            })
        }
    }, (error) => {
        renderError()
    })
} else {
    renderError()
}


function getData(timestamp) {
    let date = new Date(Number(timestamp))

    let hours = date.getHours().toString()
    hours = hours.length === 1 ? "0" + hours : hours // В формат 00

    let minutes = date.getMinutes().toString()
    minutes = minutes.length === 1 ? "0" + minutes : minutes // В формат 00                
    
    let day = date.getDate().toString()
    day = day.length === 1 ? "0" + day : day // В формат 00

    let month = (date.getMonth() + 1).toString() // Месяц начинается с 0
    month = month.length === 1 ? "0" + month : month // В формат 00

    let year = date.getFullYear().toString()

    return `${day}.${month}.${year}  ${hours}:${minutes}`
}

function renderResult(result) {
    console.log("Рендер " + result["diagnostic-title"])

    let diagnosticId = result["diagnostic-id"]

    if (diagnosticId === 0) {
        // 43 Профессии

        $("section").append(`
            <div class="container-table">
                <div class="d-table-info">
                    <div class="d-table-input-block">
                        <p><strong>Клиент</strong></p>
                        <input type="text" value="${result.name}" readonly>
                    </div>
                    <div class="d-table-input-block">
                        <p><strong>Название диагностики</strong></p>
                        <input type="text" value="${result["diagnostic-title"]}" readonly>
                    </div>
                    <div class="d-table-input-block">
                        <p>Дата прохождения</p>
                        <input type="text" value="${getData(result.date)}" readonly>
                    </div>
                </div>

                <div class="d-table-row d-table-row_first">
                    <p class="centered centered-text upper">Вид деятельности</p>
                    <p class="centered upper">Вес<br><small class="weight-max-pc">(максимум — «1»)</small><small class="weight-max-phone">(макc. — «1»)</small></p>
                    <p class="centered centered-text upper">Рекомендуемые профессии и сферы<br>при больших значениях "веса"</p>
                </div>
                
                <div class="d-table-row">
                    <p class="ver-center upper"><strong>Реалистичная</strong> - работа с механизмами и объектами, ручной труд</p>
                    <p class="centered">${result.data.realism}</p>
                    <p class="centered">Профессии, предполагающие работу с конкретными объектами, задачами и/или требующие моторных навыков: инженер, робототехника, летчик, сетевой администратор, ученый-лаборант, стоматолог и пр.</p>
                </div>

                <div class="d-table-row">
                    <p class="ver-center upper"><strong>Интеллектуальная</strong> - решение задач, исследования, анализ</p>
                    <p class="centered">${result.data.intelligence}</p>
                    <p class="centered">Профессии, предполагающие решение сложных интеллектуальных задач, сложные исследования и анализ: сфера науки, инноваций и исследований (генетик, физик, математик, климатолог, бизнес-аналитик и пр.)</p>
                </div>
        
                <div class="d-table-row">
                    <p class="ver-center upper"><strong>Социальная</strong> - работа с людьми</p>
                    <p class="centered">${result.data.sociality}</p>
                    <p class="centered">Профессии, требующие социальных умений (общения с людьми): психология, медицина, педагогика, связи с общественностью, продажи и пр.</p>
                </div>
        
                <div class="d-table-row">
                    <p class="ver-center upper"><strong>Конвенциальная</strong> - работа по алгоритму, инструкции, стандарту</p>
                    <p class="centered">${result.data.conventionality}</p>
                    <p class="centered">В основе профессии структурированная деятельность, определяемая алгоритмами, инструкциями, правилами : программирование, финансы, аудит, госслужба, юриспруденция, логистика и пр.</p>
                </div>
        
                <div class="d-table-row">
                    <p class="ver-center upper"><strong>Предпринимательская</strong> - инициатива и лидерство в работе</p>
                    <p class="centered">${result.data.enterprise}</p>
                    <p class="centered">Профессии, позволяющие проявить лидерство, предприимчивость и энергию в делах: предприниматель, брокер, бизнес-тренер, менеджер по продажам и пр.</p>
                </div>
        
                <div class="d-table-row">
                    <p class="centered upper"><strong>Творческая</strong></p>
                    <p class="centered">${result.data.artistry}</p>
                    <p class="centered">Профессии, требующие творческих навыков:художник игр, звукорежиссер, дизайнер, актер</p>
                </div>

                <div class="d-table-doublerow">
                    <p class="ver-center"><strong>Ты сейчас узнал о 86 профессиях.</strong> Вспомни и запиши ниже 3 профессии, которые тебе запомнились как самые интересные. И, возможно, именно про них ты подумал "это может мне подойти". Или захотел узнать о них подробнее.</p>
                    <p class="ver-center"><strong>Ответ:</strong> ${result.openAnswer}</p>
                </div>
            </div>
        `)
    } else if (diagnosticId === 1 || diagnosticId === 2 || diagnosticId === 3 || diagnosticId === 4) {
        // 10 Любимых дел (Детский / взрослый)
        // Идеальная работа (Детский / взрослый)

        $("section").append(`
            <div class="container">
                <p class="title centered upper">${result.name}</p>
                <div class="d-values-row">
                    <div class="d-values-input-block">
                        <p><strong>Название диагностики</strong></p>
                        <input type="text" value="${result["diagnostic-title"]}" readonly>
                    </div>
                    <div class="d-values-input-block">
                        <p>Дата прохождения</p>
                        <input type="text" value="${getData(result.date)}" readonly>
                    </div>
                </div>
                
                <div class="d-values-content">
                    <div class="d-values-input-wrapper">
                        <h3>${result.data["input-1"]}</h3>
                        <p>1.</p>
                    </div>
                    <div class="d-values-input-wrapper">
                        <h3>${result.data["input-2"]}</h3>
                        <p>2.</p>
                    </div>
                    <div class="d-values-input-wrapper">
                        <h3>${result.data["input-3"]}</h3>
                        <p>3.</p>
                    </div>
                    <div class="d-values-input-wrapper">
                        <h3>${result.data["input-4"]}</h3>
                        <p>4.</p>
                    </div>
                    <div class="d-values-input-wrapper">
                        <h3>${result.data["input-5"]}</h3>
                        <p>5.</p>
                    </div>
                    <div class="d-values-input-wrapper">
                        <h3>${result.data["input-6"]}</h3>
                        <p>6.</p>
                    </div>
                    <div class="d-values-input-wrapper">
                        <h3>${result.data["input-7"]}</h3>
                        <p>7.</p>
                    </div>
                    <div class="d-values-input-wrapper">
                        <h3>${result.data["input-8"]}</h3>
                        <p>8.</p>
                    </div>
                    <div class="d-values-input-wrapper">
                        <h3>${result.data["input-9"]}</h3>
                        <p>9.</p>
                    </div>
                    <div class="d-values-input-wrapper">
                        <h3>${result.data["input-10"]}</h3>
                        <p>10.</p>
                    </div>
                </div>
            </div>
        `)
    } else if (diagnosticId === 5 || diagnosticId === 6) {
        // Мои потребности (Детский / взрослый)

        $("section").append(`
            <div class="container-table">
                <div class="d-table-info">
                    <div class="d-table-input-block">
                        <p><strong>Клиент</strong></p>
                        <input type="text" value="${result.name}" readonly>
                    </div>
                    <div class="d-table-input-block">
                        <p><strong>Название диагностики</strong></p>
                        <input type="text" value="${result["diagnostic-title"]}" readonly>
                    </div>
                    <div class="d-table-input-block">
                        <p>Дата прохождения</p>
                        <input type="text" value="${getData(result.date)}" readonly>
                    </div>
                </div>

                <div class="d-table-row d-table-row_first">
                    <p class="centered centered-text upper">Карьерная ориентация</p>
                    <p class="centered upper">Баллы<br><small class="weight-max-pc">(максимум — «10»)</small><small class="weight-max-phone">(макc. — «10»)</small></small></p>
                    <p class="centered upper">Описание</p>
                </div>
                
                <div class="d-table-row">
                    <p class="centered centered-text">Профессиональная компетентность</p>
                    <p class="centered">${result.data.сompetence}</p>
                    <p class="centered">Эта ориентация выражена у тех, кому важно быть мастером своего дела. Такие люди счастливы, когда достигают успеха в профессиональной сфере. Управление само по себе не представляет для них интереса, но они могут управлять другими в пределах своей компетентности.</p>
                </div>

                <div class="d-table-row">
                    <p class="centered centered-text">Менеджмент</p>
                    <p class="centered">${result.data.management}</p>
                    <p class="centered">Люди с этой потребностью ориентированы на управление другими людьми. Это работа, которая требует аналитических навыков, навыков межличностного и группового общения, эмоциональной уравновешенности, чтобы нести бремя ответственности.</p>
                </div>
        
                <div class="d-table-row">
                    <p class="centered centered-text">Автономия (независимость)</p>
                    <p class="centered">${result.data.autonomy}</p>
                    <p class="centered">Люди с такой ориентацией стремятся к освобождению от правил, предписаний, ограничений. У них ярко выражена потребность делать все по-своему. Люди, у которых выражена эта ориентация, готовы отказаться от продвижения по службе ради сохранения своей независимости.</p>
                </div>
        
                <div class="d-table-row">
                    <p class="centered centered-text">Стабильность места работы</p>
                    <p class="centered">${result.data.jobStability}</p>
                    <p class="centered">Такие люди часто ищут работу в организации, которая обеспечивает определенные условия, выглядит надежной в своей отрасли. </p>
                </div>

                <div class="d-table-row">
                    <p class="centered centered-text">Стабильность места жительства</p>
                    <p class="centered">${result.data.residenceStability}</p>
                    <p class="centered">Это люди, ориентированные на работу без переездов. Они пускают корни в определенном месте и не любят менять место проживания.</p>
                </div>
        
                <div class="d-table-row">
                    <p class="centered centered-text">Служение</p>
                    <p class="centered">${result.data.service}</p>
                    <p class="centered">Такие люди выбирают "работу с людьми", "служение человечеству", "помощь людям" и т. д. Они легко отказываются от продвижения или перевода на другую работу, если при этом не смогут помогать людям.</p>
                </div>
        
                <div class="d-table-row">
                    <p class="centered centered-text">Вызов</p>
                    <p class="centered">${result.data.challenge}</p>
                    <p class="centered">Человек с этой карьерной ориентацией стремится к к соревнованию, не боится конкуренции. Любит одерживать победы, преодолевать препятствия, решать трудные задачи. Конкретная область деятельности или квалификация второстепенны для них. Любую ситуацию такие люди рассматривают с позиции "выигрыша-проигрыша".</p>
                </div>

                <div class="d-table-row">
                    <p class="centered centered-text">Интеграция стилей жизни</p>
                    <p class="centered">${result.data.lifestyle}</p>
                    <p class="centered">Для людей с этой ориентацией важен баланс в жизни. Они не хотят, чтобы у них доминировала одна из сторон жизни. Для них важно гармонично совмещать семью, карьеру и собственные интересы.</p>
                </div>

                <div class="d-table-row d-table-row_last">
                    <p class="centered centered-text">Предпринимательство</p>
                    <p class="centered">${result.data.entrepreneurship}</p>
                    <p class="centered">Эти люди хотят создавать что-то новое, преодолевать препятствия, готовы к риску. Они не желают работать на других, хотят иметь свое дело, финансовое богатство. Собственное дело для них - возможность продолжения самих себя, они вкладывают в него свою душу</p>
                </div>
            </div>
        `)
    } else if (diagnosticId === 7 || diagnosticId === 8) {
        // Антирейтинг профессий (Детский / взрослый)

        $("section").append(`
            <div class="container">
                <p class="title centered upper">${result.name}</p>
                <div class="d-values-row">
                    <div class="d-values-input-block">
                        <p><strong>Название диагностики</strong></p>
                        <input type="text" value="${result["diagnostic-title"]}" readonly>
                    </div>
                    <div class="d-values-input-block">
                        <p>Дата прохождения</p>
                        <input type="text" value="${getData(result.date)}" readonly>
                    </div>
                </div>
                
                <div class="d-values-content">
                    <div class="d-values-input-wrapper">
                        <h3>${result.data["input-1"]}</h3>
                        <p>1.</p>
                    </div>
                    <div class="d-values-input-wrapper">
                        <h3>${result.data["input-2"]}</h3>
                        <p>2.</p>
                    </div>
                    <div class="d-values-input-wrapper">
                        <h3>${result.data["input-3"]}</h3>
                        <p>3.</p>
                    </div>
                    <div class="d-values-input-wrapper">
                        <h3>${result.data["input-4"]}</h3>
                        <p>4.</p>
                    </div>
                    <div class="d-values-input-wrapper">
                        <h3>${result.data["input-5"]}</h3>
                        <p>5.</p>
                    </div>
                    <div class="d-values-input-wrapper">
                        <h3>${result.data["input-6"]}</h3>
                        <p>6.</p>
                    </div>
                    <div class="d-values-input-wrapper">
                        <h3>${result.data["input-7"]}</h3>
                        <p>7.</p>
                    </div>
                    <div class="d-values-input-wrapper">
                        <h3>${result.data["input-8"]}</h3>
                        <p>8.</p>
                    </div>
                    <div class="d-values-input-wrapper">
                        <h3>${result.data["input-9"]}</h3>
                        <p>9.</p>
                    </div>
                    <div class="d-values-input-wrapper">
                        <h3>${result.data["input-10"]}</h3>
                        <p>10.</p>
                    </div>
                </div>
            </div>
        `)
    } else if (diagnosticId === 9 || diagnosticId === 10) {
        // Интервью (Детский / взрослый)

        $("section").append(`
            <div class="container">
                <p class="title centered upper">${result.name}</p>
                <div class="d-values-row">
                    <div class="d-values-input-block">
                        <p><strong>Название диагностики</strong></p>
                        <input type="text" value="${result["diagnostic-title"]}" readonly>
                    </div>
                    <div class="d-values-input-block">
                        <p>Дата прохождения</p>
                        <input type="text" value="${getData(result.date)}" readonly>
                    </div>
                </div>
                
                <div class="d-values-content">
                    <div class="d-values-input-wrapper">
                        <h3>${result.data["input-1"]}</h3>
                        <p>1.</p>
                    </div>
                    <div class="d-values-input-wrapper">
                        <h3>${result.data["input-2"]}</h3>
                        <p>2.</p>
                    </div>
                    <div class="d-values-input-wrapper">
                        <h3>${result.data["input-3"]}</h3>
                        <p>3.</p>
                    </div>
                </div>
            </div>
        `)
    } else if (diagnosticId === 11 || diagnosticId === 12) {
        // 8 Кадров (Детский / взрослый)

        $("section").append(`
            <div class="container">
                <p class="title centered upper">${result.name}</p>
                <div class="d-values-row">
                    <div class="d-values-input-block">
                        <p><strong>Название диагностики</strong></p>
                        <input type="text" value="${result["diagnostic-title"]}" readonly>
                    </div>
                    <div class="d-values-input-block">
                        <p>Дата прохождения</p>
                        <input type="text" value="${getData(result.date)}" readonly>
                    </div>
                </div>
                
                <div class="d-values-content">
                    <div class="d-values-input-wrapper">
                        <h3>${result.data["input-1"]}</h3>
                        <p>1.</p>
                    </div>
                    <div class="d-values-input-wrapper">
                        <h3>${result.data["input-2"]}</h3>
                        <p>2.</p>
                    </div>
                    <div class="d-values-input-wrapper">
                        <h3>${result.data["input-3"]}</h3>
                        <p>3.</p>
                    </div>
                    <div class="d-values-input-wrapper">
                        <h3>${result.data["input-4"]}</h3>
                        <p>4.</p>
                    </div>
                    <div class="d-values-input-wrapper">
                        <h3>${result.data["input-5"]}</h3>
                        <p>5.</p>
                    </div>
                    <div class="d-values-input-wrapper">
                        <h3>${result.data["input-6"]}</h3>
                        <p>6.</p>
                    </div>
                    <div class="d-values-input-wrapper">
                        <h3>${result.data["input-7"]}</h3>
                        <p>7.</p>
                    </div>
                    <div class="d-values-input-wrapper">
                        <h3>${result.data["input-8"]}</h3>
                        <p>8.</p>
                    </div>
                </div>
            </div>
        `)
    } else if (diagnosticId === 13) {
        // Исследование ценностей

        $("section").append(`
            <div class="container-table">
                <div class="d-table-info">
                    <div class="d-table-input-block">
                        <p><strong>Клиент</strong></p>
                        <input type="text" value="${result.name}" readonly>
                    </div>
                    <div class="d-table-input-block">
                        <p><strong>Название диагностики</strong></p>
                        <input type="text" value="${result["diagnostic-title"]}" readonly>
                    </div>
                    <div class="d-table-input-block">
                        <p>Дата прохождения</p>
                        <input type="text" value="${getData(result.date)}" readonly>
                    </div>
                </div>
                
                <div class="d-table-row d-table-row_first">
                    <p class="centered centered-text upper">Карьерная ориентация</p>
                    <p class="centered upper">Баллы<br><small class="weight-max-pc">(максимум — «50»)</small><small class="weight-max-phone">(макc. — «50»)</small></p>
                    <p class="centered upper">Описание</p>
                </div>
                
                <div class="d-table-row">
                    <p class="centered centered-text">Собственный престиж</p>
                    <p class="centered">${result.data.ownPrestige}</p>
                    <p class="centered">Высокий балл по данному показателю отражает стремление человека к признанию и уважению со стороны других, как правило, наиболее значимых для него лиц. Таким людям важно иметь работу или профессию, которая высоко ценится в обществе. И считается «престижной».</p>
                </div>

                <div class="d-table-row">
                    <p class="centered centered-text">Высокое материальное положение</p>
                    <p class="centered">${result.data.financialPosition}</p>
                    <p class="centered">Высокий балл по данному показателю отражает стремление человека к высокому уровню материального благосостояния. Выражается в стремлении иметь работу и профессию, гарантирующие высокую заработную плату и другие виды материальных благ.</p>
                </div>
        
                <div class="d-table-row">
                    <p class="centered centered-text">Креативность</p>
                    <p class="centered">${result.data.creativity}</p>
                    <p class="centered">Высокий балл отражает стремление человека к реализации творческих возможностей, внесению различных изменений во все сферы. Таким людям быстро становится скучно от привычных способов работы и рутины. Им важно иметь возможность вносить в работу изменения и усовершенствования.</p>
                </div>
        
                <div class="d-table-row">
                    <p class="centered centered-text">Активные социальные контакты</p>
                    <p class="centered">${result.data.socialContacts}</p>
                    <p class="centered">Для этих людей самое ценное в жизни — это отношения с другими. Выражается в стремлении к коллегиальности в работе и работе в коллективе, установлении благоприятных взаимоотношений. И склонности к профессиям, где важны общение и отношения с другими.</p>
                </div>

                <div class="d-table-row">
                    <p class="centered centered-text">Развитие себя</p>
                    <p class="centered">${result.data.selfDevelopment}</p>
                    <p class="centered"> Такие люди стремятся к самосовершенствованию, считая, что в первую очередь в жизни необходимо добиваться наиболее полной реализации своих способностей. Для них важна возможность постоянного профессионального развития, роста, обучения и самосовершенствования в профессии.</p>
                </div>
        
                <div class="d-table-row">
                    <p class="centered centered-text">Достижения</p>
                    <p class="centered">${result.data.achievements}</p>
                    <p class="centered">Высокий балл говорит о стремлении человека к достижению конкретных и ощутимых результатов. Этим людям важен результат, а не процесс. Для них характерно тщательное планирование своей работы и им нравится работа, в которой ставятся амбициозные цели.</p>
                </div>
        
                <div class="d-table-row">
                    <p class="centered centered-text">Духовное удовлетворение</p>
                    <p class="centered">${result.data.spiritualSatisfaction}</p>
                    <p class="centered">Такие люди, как правило, считают, что главное — это делать то, что интересно и что приносит внутреннее удовлетворение. Для них важно иметь интересную и содержательную профессию, в которой можно глубоко познавать предмет. И в которой сам процесс работы - интересен и приносит удовлетворение.</p>
                </div>

                <div class="d-table-row d-table-row_last">
                    <p class="centered centered-text">Сохранение собственной индивидуальности</p>
                    <p class="centered">${result.data.ownIndividuality}</p>
                    <p class="centered">Для этих людей самое важное в жизни — это неповторимость и своеобразие своей личности, своих взглядов, убеждений, своего стиля жизни. Им важно в профессии выделяться из толпы. Поэтому часто нравятся редкие и необычные профессии, дающие возможность проявить индивидуальность.</p>
                </div>
            </div>
        `)
    } else if (diagnosticId === 14) {
        // Учебная мотивация

        let textLevel = ""
        if (result.data.levelOfMotivation !== undefined) {
            let level = parseInt(result.data.levelOfMotivation)
            if (level >= 45) {
                textLevel = `I - уровень учебной мотивации – выраженное преобладание мотивации и положительное эмоциональное отношение к учению. При существенном преобладании познавательной мотивации она имеет продуктивный характер. При доминировании мотивации достижения ученик может слишком болезненно переживать неудачи в учебе. В некотором смысле, I уровень - это гипермотивация.`
            } else if (level >= 29 && level <= 44) {
                textLevel = `II - уровень учебной мотивации – продуктивная мотивация, позитивное отношение к учебе (самый ресурсный уровень мотивации из всех возможных, без излишней "зацикленности" на учебе).`
            } else if (level >= 13 && level <= 28) {
                textLevel = `III - уровень учебной мотивации – средний уровень, примерно равное выражение позитивной и негативной мотивации к учению, амбивалентное отношение к учению (при таком уровне мотивации, возможно, учеба сейчас находится вне фокуса внимания из-за более актуальных задач и занятий в жизни).`
            } else if (level >= -2 && level <= 12) {
                textLevel = `IV - уровень учебной мотивации – сниженная мотивация, ощущение "школьной скуки", отрицательное эмоциональное отношение к учению.`
            } else if (level <= -3) {
                textLevel = `V - уровень учебной мотивации – резко отрицательное отношение к учению, которое может быть связано, в том числе, с обстановкой в месте обучения или слишком большой нагрузкой в учебе (уровень мотивации, при котором необходима поддержка, помощь специалиста и выяснение причин такого негативного отношения).`
            } else {
                textLevel = "Неверное значение уровня"
            }
        }

        $("section").append(`
            <div class="container-table">
                <div class="d-table-info">
                    <div class="d-table-input-block">
                        <p><strong>Клиент</strong></p>
                        <input type="text" value="${result.name}" readonly>
                    </div>
                    <div class="d-table-input-block">
                        <p><strong>Название диагностики</strong></p>
                        <input type="text" value="${result["diagnostic-title"]}" readonly>
                    </div>
                    <div class="d-table-input-block">
                        <p>Дата прохождения</p>
                        <input type="text" value="${getData(result.date)}" readonly>
                    </div>
                </div>
                
                <div class="d-table-two-column d-table-row_first">
                    <p class="centered centered-text upper">Эмоциональное отношение</p>
                    <p class="centered upper">Баллы<br><small class="weight-max-pc">(максимум — «60»)</small><small class="weight-max-phone">(макc. — «60»)</small></p>
                </div>
                
                <div class="d-table-two-column">
                    <p class="centered centered-text">Познавательная активность</p>
                    <p class="centered">${result.data.сognitiveActivity}</p>
                </div>

                <div class="d-table-two-column">
                    <p class="centered centered-text">Мотивация достижения</p>
                    <p class="centered">${result.data.achievementMotivation}</p>
                </div>
        
                <div class="d-table-two-column">
                    <p class="centered centered-text">Тревожность</p>
                    <p class="centered">${result.data.anxiety}</p>
                </div>
        
                <div class="d-table-two-column">
                    <p class="centered centered-text">Гнев</p>
                    <p class="centered">${result.data.anger}</p>
                </div>

                <div class="d-table-two-column d-table-row_last">
                    <p class="centered centered-text">Общий уровень мотивации</p>
                    <p class="learning-motivation-level centered">${textLevel}</p>
                </div>
            </div>
        `)
    } else if (diagnosticId === 15) {
        // Диагностика жизнестойкости

        $("section").append(`
            <div class="container-table">
                <div class="d-table-info">
                    <div class="d-table-input-block">
                        <p><strong>Клиент</strong></p>
                        <input type="text" value="${result.name}" readonly>
                    </div>
                    <div class="d-table-input-block">
                        <p><strong>Название диагностики</strong></p>
                        <input type="text" value="${result["diagnostic-title"]}" readonly>
                    </div>
                    <div class="d-table-input-block">
                        <p>Дата прохождения</p>
                        <input type="text" value="${getData(result.date)}" readonly>
                    </div>
                </div>

                <div class="d-table-row d-table-row_first">
                    <p class="centered centered-text upper">Название</p>
                    <p class="centered upper">Вес</p>
                    <p class="centered centered-text upper">Описание</p>
                </div>
                
                <div class="d-table-row">
                    <p class="ver-center centered-text">Вовлечённость</p>
                    <p class="centered">${result.data.involvement}</p>
                    <p class="centered">• Низкие значения (менее 30 баллов) отражают низкую убеждённость в том, что активное участие в жизни приносит смысл и удовольствие, что может приводить к отстранённости и потере интереса к происходящему.
<span>&nbsp;</span>• Средние значения примерно в диапазоне 30–45 баллов свидетельствуют о умеренной вовлечённости, когда человек испытывает некоторый интерес к жизни, но не всегда активно вовлечён в происходящее, возможно, с колебаниями мотивации и эмоционального участия.
<span>&nbsp;</span>• Высокие значения (46 и более баллов) говорят о высокой вовлечённости, когда человек ощущает себя частью окружающего мира, активно участвует в событиях и получает удовлетворение от своей деятельности.
                    </p>
                </div>

                <div class="d-table-row">
                    <p class="ver-center centered-text">Контроль</p>
                    <p class="centered">${result.data.control}</p>
                    <p class="centered">• Низкие значения (менее 20,5 баллов) указывают на низкую веру в возможность влиять на события и достигать поставленных целей, что может вызывать чувство беспомощности и потерю уверенности в себе.
<span>&nbsp;</span>• Средние значения в диапазоне примерно 20,5–37,4 баллов отражают умеренный уровень контроля, когда человек иногда чувствует влияние на ситуацию, но не всегда уверен в своих силах и результатах.
<span>&nbsp;</span>• Высокие значения (37,5 и более баллов) свидетельствуют о высоком уровне контроля, когда человек верит в свою способность управлять ситуацией и добиваться желаемых результатов.
                    </p>
                </div>
        
                <div class="d-table-row">
                    <p class="ver-center centered-text">Принятие риска</p>
                    <p class="centered">${result.data.riskAcceptance}</p>
                    <p class="centered">• Низкие значения (менее 9,6 баллов) отражают низкую готовность воспринимать жизненные трудности как опыт и возможность для развития, что может приводить к избеганию сложных ситуаций и страху перед переменами.
<span>&nbsp;</span>• Средние значения в диапазоне 9,6–18,3 баллов свидетельствуют о умеренной готовности к риску, когда человек иногда готов принимать вызовы, но предпочитает избегать неопределённости и больших изменений.
<span>&nbsp;</span>• Высокие значения (18,4 и более баллов) говорят о высокой готовности к риску, когда человек видит в трудностях шанс для роста и развития, не боится пробовать новое и извлекает уроки из неудач.
                    </p>
                </div>
        
                <div class="d-table-row d-table-row_last">
                    <p class="ver-center centered-text">Жизнестойкость</p>
                    <p class="centered">${result.data.vitalityScore}</p>
                    <p class="centered">• Низкие значения (менее 62 баллов) указывают на низкий уровень психологической устойчивости, что может проявляться в пассивности, тревожности и ощущении беспомощности перед лицом жизненных трудностей.
<span>&nbsp;</span>• Средние значения примерно в диапазоне 62–97 баллов отражают средний уровень жизнестойкости, когда человек способен справляться с трудностями, но иногда испытывает стресс и сомнения в своих силах.
<span>&nbsp;</span>• Высокие значения (98 и более баллов) свидетельствуют о высоком уровне жизнестойкости, характеризующемся активным и адаптивным поведением в стрессовых ситуациях, а также уверенностью в своих силах.
                    </p>
                </div>
            </div>
        `)
    } else if (diagnosticId === 16) {
        // 10 вопросов

        let textLevel = ""
        if (result.data.sum !== undefined) {
            let level = result.data.sum
            if (level >= 8) {
                textLevel = `Выраженное эмоциональное выгорание, необходима профессиональная помощь и серьезная коррекция ситуации`
            } else if (level >= 5 && level <= 7) {
                textLevel = `Начинающееся эмоциональное выгорание, требующее внимания (стоит взять отпуск, отдохнуть, организовать свою работу более комфортно)`
            } else if (level <= 4) {
                textLevel = `Эмоциональное выгорание отсутствует или выражено слабо`
            } else {
                textLevel = "Неверное значение суммы"
            }
        }

        $("section").append(`
            <div class="container-table">
                <div class="d-table-info">
                    <div class="d-table-input-block">
                        <p><strong>Клиент</strong></p>
                        <input type="text" value="${result.name}" readonly>
                    </div>
                    <div class="d-table-input-block">
                        <p><strong>Название диагностики</strong></p>
                        <input type="text" value="${result["diagnostic-title"]}" readonly>
                    </div>
                    <div class="d-table-input-block">
                        <p>Дата прохождения</p>
                        <input type="text" value="${getData(result.date)}" readonly>
                    </div>
                </div>
                
                <div class="d-table-two-column d-table-row_first">
                    <p class="centered centered-text upper">Название</p>
                    <p class="centered upper">Баллы</p>
                </div>
                
                <div class="d-table-two-column">
                    <p class="centered centered-text">Итоговый балл</p>
                    <p class="centered">${result.data.sum}</p>
                </div>

                <div class="d-table-two-column d-table-row_last">
                    <p class="centered centered-text">Интерпретация</p>
                    <p class="learning-motivation-level centered">${textLevel}</p>
                </div>
            </div>
        `)
    } else if (diagnosticId === 17) {
        // Я на работе

        $("section").append(`
            <div class="container-table">
                <div class="d-table-info">
                    <div class="d-table-input-block">
                        <p><strong>Клиент</strong></p>
                        <input type="text" value="${result.name}" readonly>
                    </div>
                    <div class="d-table-input-block">
                        <p><strong>Название диагностики</strong></p>
                        <input type="text" value="${result["diagnostic-title"]}" readonly>
                    </div>
                    <div class="d-table-input-block">
                        <p>Дата прохождения</p>
                        <input type="text" value="${getData(result.date)}" readonly>
                    </div>
                </div>

                <div class="d-table-row d-table-row_first">
                    <p class="centered centered-text upper">Название</p>
                    <p class="centered upper">Вес</p>
                    <p class="centered centered-text upper">Описание</p>
                </div>
                
                <div class="d-table-row">
                    <p class="ver-center centered-text">Эмоциональное истощение</p>
                    <p class="centered">${result.data.emotionalExhaustion}</p>
                    <p class="centered">Это основная составляющая выгорания. Чем выше этот показатель, тем больше выражено эмоциональное истощение (максимальное значение показателя - 54 балла). Значения от 0 до 15 баллов - низкий уровень эмоционального истощения, от 16 до 24 - средний, от 25 и выше -  высокий уровень. Проявляется в переживаниях сниженного эмоционального тонуса, повышенной психической истощаемости, утрате интереса и позитивных чувств к окружающим, ощущении «пресыщенности» работой, неудовлетворенностью жизнью в целом.</p>
                </div>

                <div class="d-table-row">
                    <p class="ver-center centered-text">Деперсонализация</p>
                    <p class="centered">${result.data.depersonalization}</p>
                    <p class="centered">Чем выше этот показатель, тем больше выражена деперсонализация (максимальное значение показателя - 30 баллов). Значения от 0 до 5 баллов - низкая деперсонализация, от 6 до 10 - средняя, от 11 до 30 -  высокий уровень деперсонализации. Деперсонализация проявляется в эмоциональном отстранении и безразличии, в уменьшении количества контактов по работе, формальном выполнении профессиональных обязанностей без личностной включенности и сопереживания, в раздражительности и холодности по отношению к окружающим.</p>
                </div>
        
                <div class="d-table-row">
                    <p class="ver-center centered-text">Редукция профессиональных достижений</p>
                    <p class="centered">${result.data.reductionProfessionalism}</p>
                    <p class="centered">Отражает степень удовлетворенности человека собой как личностью и как профессионалом. Чем меньше данный показатель, тем хуже (здесь работает обратная зависимость в отличие от других показателей). Неудовлетворительное значение этого показателя (это значения  до 30 баллов) отражает тенденцию к негативной оценке своей компетентности и продуктивности, недовольству собой, к снижению профессиональной мотивации и уверенности в себе. Если значения этого показателя 37 баллов и больше, то можно говорить о том, что редукции профессиональных достижений нет. Значения от 31 до 36 говорят о среднем уровне редукции своих достижений.</p>
                </div>
        
                <div class="d-table-row d-table-row_last">
                    <p class="ver-center centered-text">Общий индекс выгорания</p>
                    <p class="centered">${result.data.burnout}</p>
                    <p class="centered">Данный показатель может принимать значения от 0 (нет выгорания) до 1 (максимально выраженное выгорание). Чем ближе значение к 1, тем более выражено выгорание.</p>
                </div>
            </div>
        `)
    }
}