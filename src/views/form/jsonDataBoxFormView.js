class JsonDataBoxFormView extends JsonDataBoxView{
    constructor(jsonDataBox){
        super(jsonDataBox)
    }

    displayJsonDataBox = (jsonData, isBeautified) => {
        this.beautifyButton.textContent = "Beautify"
        this.minifyButton.textContent = "Minify"
        this.copyButton.textContent = "Copy"
        this.clearButton.textContent = "Clear"
        if(isBeautified){
            this.jsonDataArea.classList.remove("wrap-json")
            this.jsonDataArea.value = JSON.stringify(jsonData.data, null, 2)
        }
        else{
            this.jsonDataArea.classList.add("wrap-json")
            this.jsonDataArea.value = JSON.stringify(jsonData.data)
        }
        this.buttonsContainer.append(this.beautifyButton, this.minifyButton, this.copyButton, this.clearButton)
        this.jsonDataContainer.append(this.jsonDataArea)
        this.jsonDataBox.append(this.buttonsContainer, this.jsonDataContainer)
    }

    updateJsonData = (jsonData, isBeautified) => {
        if(isBeautified){
            this.jsonDataArea.classList.remove("wrap-json")
            this.jsonDataArea.value = JSON.stringify(jsonData.data, null, 2)
            }
        else{
            this.jsonDataArea.classList.add("wrap-json")
            this.jsonDataArea.value = JSON.stringify(jsonData.data)
        }
    }
}