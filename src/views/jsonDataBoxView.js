class JsonDataBoxView extends View{
    constructor(jsonDataBox){
        super()
       this.jsonDataBox = jsonDataBox
       this.buttonsContainer = this.createElement("div", "buttons-container")
       this.jsonDataContainer = this.createElement("div", "json-data-container")
       this.jsonDataArea = this.createElement("textarea", "json-data-text")
       this.jsonDataArea.setAttribute("spellcheck", false)
       this.beautifyButton = this.createElement("div", "json-button")
       this.minifyButton = this.createElement("div", "json-button")
       this.copyButton = this.createElement("div", "json-button")
       this.clearButton = this.createElement("div", "json-button")
    }

    displayJsonDataBox = (jsonData, isBeautified, errorMode) => {
        this.beautifyButton.textContent = "Beautify"
        this.minifyButton.textContent = "Minify"
        this.copyButton.textContent = "Copy"
        this.clearButton.textContent = "Clear"
        if(!errorMode){
            this.jsonDataArea.classList.remove("error-json")
            if(isBeautified){
                this.jsonDataArea.classList.remove("wrap-json")
                this.jsonDataArea.value = JSON.stringify(jsonData, null, 2)
            }
            else{
                this.jsonDataArea.classList.add("wrap-json")
                this.jsonDataArea.value = JSON.stringify(jsonData)
            }
        }
        else{
            this.jsonDataArea.classList.add("error-json")
        }
        this.buttonsContainer.append(this.beautifyButton, this.minifyButton, this.copyButton, this.clearButton)
        this.jsonDataContainer.append(this.jsonDataArea)
        this.jsonDataBox.append(this.buttonsContainer, this.jsonDataContainer)
    }

    bindBeautifyJsonData = (handler) => {
        this.beautifyButton.addEventListener("click", event => {
          event.preventDefault()
            handler()
        })
    }

    bindMinifyJsonData = (handler) => {
        this.minifyButton.addEventListener("click", event => {
          event.preventDefault()
            handler()
        })
    }

    bindCopyJsonData = (handler) => {
        this.copyButton.addEventListener("click", event => {
          event.preventDefault()
            handler()
        })
    }

    bindClearJsonData = (handler) => {
        this.clearButton.addEventListener("click", event => {
          event.preventDefault()
            handler()
        })
    }

    bindModifyJsonData = (handler) => {
        this.jsonDataArea.addEventListener("keyup", event => {
            event.preventDefault()
            handler(this.jsonDataArea.value)
        })
    }
}