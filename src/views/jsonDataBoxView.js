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
}