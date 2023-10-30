class JsonDataBoxModel{
    constructor(jsonData){
        this.jsonData = jsonData
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
        const textToCopy = this.isBeautified ? JSON.stringify(jsonData, null, 2) : JSON.stringify(jsonData)
        navigator.clipboard.writeText(textToCopy)
    }

    clearJsonData = () => {
        if (window.confirm("Czy na pewno chcesz wyczyścić pole Json?\nPS. Ctrl+z nie przywróci go już z powrotem.")) {
            this.jsonData = {}
            localStorage.setItem('lastJson', jsonData);
            this.jsonDataChanged(this.jsonData, this.isBeautified, this.errorMode)
        }
    }

    modifyJsonData = (jsonData) => {
        try {
            this.jsonData = JSON.parse(jsonData)
            localStorage.setItem('lastJson', jsonData);
            this.errorMode = false
        }
        catch{
            this.jsonData = JSON.stringify(jsonData)
            this.errorMode = true
        }
        this.jsonDataChanged(this.jsonData, this.isBeautified, this.errorMode)
    }


}