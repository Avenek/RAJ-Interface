class JsonDataBoxFormModel{
    constructor(jsonData){
        this.jsonData = jsonData
        this.isBeautified = true;
    }

    bindJsonDataChanged = (callback) => {
        this.jsonDataChanged = callback
    }

    beautifyJsonData = () => {
        this.isBeautified = true;
        this.jsonDataChanged(this.jsonData, this.isBeautified)
    }

    minifyJsonData = () => {
        this.isBeautified = false;
        this.jsonDataChanged(this.jsonData, this.isBeautified)
    }

    copyJsonData = () => {
        const textToCopy = this.isBeautified ? JSON.stringify(jsonData, null, 2) : JSON.stringify(jsonData)
        navigator.clipboard.writeText(textToCopy)
    }

    clearJsonData = () => {
        if (window.confirm("Czy na pewno chcesz wyczyścić pole Json?\nPS. Ctrl+z nie przywróci go już z powrotem.")) {
            this.jsonData.data = {}
            localStorage.setItem('lastJson', this.jsonData);
            this.jsonDataChanged(this.jsonData, this.isBeautified)
        }
    }
}