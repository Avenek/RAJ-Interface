class JsonDataBoxFormModel{
    constructor(jsonData){
        this.jsonData = jsonData
        this.isBeautified = true;
        this.objectIdBoxModel = null
        this.objectFormModel = null
        this.extraOptionObjectIdBoxModel = null
        this.extraOptionObjectFormModel = null
    }

    bindJsonDataChanged = (callback) => {
        this.jsonDataChanged = callback
    }

    beautifyJsonData = () => {
        this.isBeautified = true;
        this.jsonDataChanged()
    }

    minifyJsonData = () => {
        this.isBeautified = false;
        this.jsonDataChanged()
    }

    copyJsonData = () => {
        const textToCopy = this.isBeautified ? JSON.stringify(this.jsonData.data, null, 2) : JSON.stringify(this.jsonData.data)
        navigator.clipboard.writeText(textToCopy)
    }

    clearJsonData = () => {
        if (window.confirm("Czy na pewno chcesz wyczyścić pole Json?\nPS. Ctrl+z nie przywróci go już z powrotem.")) {
            this.jsonData.clearData()
            localStorage.setItem('lastJson', JSON.stringify(this.jsonData.data));
            this.jsonDataChanged()
            this.objectIdBoxModel.clearBox(true)
            this.objectFormModel.clearForm()
            if(this.extraOptionObjectFormModel && this.extraOptionObjectIdBoxModel){
                this.extraOptionObjectIdBoxModel.clearBox(false)
                this.extraOptionObjectFormModel.clearForm()
            }

        }
    }
}