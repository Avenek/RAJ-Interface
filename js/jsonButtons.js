function buttonClick(e) {
    switch(e.target.textContent){
        case "Beautify":
            beautifyJson()
            break;
        case "Minify":   
            minifyJson()
            break; 
        case "Copy":
            copyJson()
            break;
        case "Clear":
            clearJson()
            break;
        default:
            console.warn("Nieznany przycisk nad panelem Jsona!");
            break;
    }
}

function beautifyJson(){
    jsonText.classList.remove("wrap-json")
    jsonText.value = JSON.stringify(JSON.parse(jsonText.value), null, 2)
}

function minifyJson(){
    jsonText.classList.add("wrap-json")
    jsonText.value = JSON.stringify(JSON.parse(jsonText.value))

}

function copyJson() {
    const textToCopy = jsonText.value
    navigator.clipboard.writeText(textToCopy)
}

function clearJson(){
    if (window.confirm("Czy na pewno chcesz wyczyścić pole Json?\nPS. Ctrl+z nie przywróci go już z powrotem.")) {
        localStorage.setItem('clearedJson', jsonText.value);
        dynamicData = {}
        updateJson()
    }
}

function createJsonButtons()
{
    jsonButtonsNames = ["Beautify", "Minify", "Copy", "Clear"]
    html = ""
    jsonButtonsNames.forEach(buttonName => {
        html+= `<button class="json-buttons" type="button">${buttonName}</button>`
    })
    return html
}