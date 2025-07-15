// Открытие результатов
function openResults(resultId) {
    resultId = resultId.split("-")
    window.open(`./results/?id=${resultId[1]}_${resultId[3]}`, "_blank")
}

// Открытие всех результатов
$("#open-all-results").on("click tap", () => {
    window.open(`./results/?id=${openedCardId}`, "_blank")
})