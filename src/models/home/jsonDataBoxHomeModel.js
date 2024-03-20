class JsonDataBoxHomeModel{
    constructor(jsonData, externalPropertiesButton){
        this.jsonData = jsonData
        this.externalPropertiesButton = externalPropertiesButton
        this.isBeautified = true;
        this.errorMode = false;
    }

    bindJsonDataChanged = (callback) => {
        this.jsonDataChanged = callback
    }

    beautifyJsonData = () => {
        this.isBeautified = true;
        this.jsonDataChanged(this.jsonData, this.isBeautified, this.errorMode)
    }

    minifyJsonData = () => {
        this.isBeautified = false;
        this.jsonDataChanged(this.jsonData, this.isBeautified, this.errorMode)
    }

    copyJsonData = () => {
        const textToCopy = this.isBeautified ? JSON.stringify(this.jsonData.displayData, null, 2) : JSON.stringify(this.jsonData.displayData)
        navigator.clipboard.writeText(textToCopy)
    }

    clearJsonData = () => {
        if (window.confirm("Czy na pewno chcesz wyczyścić pole Json?\nPS. Ctrl+z nie przywróci go już z powrotem.")) {
            this.externalPropertiesButton.isExternalPropertiesActive = false
            this.jsonData.displayData = {}
            this.jsonData.workingData = this.jsonData.displayData
            this.jsonDataChanged(this.jsonData, this.isBeautified, this.errorMode)
        }
    }

    modifyJsonData = (jsonData) => {
        try {
            this.jsonData.displayData = JSON.parse(jsonData)
            this.jsonData.workingData = JSON.parse(jsonData)
            this.errorMode = false
        }
        catch{
            this.jsonData.displayData = JSON.stringify(jsonData)
            this.errorMode = true
        }
        this.jsonDataChanged(this.jsonData, this.isBeautified, this.errorMode)
    }

}