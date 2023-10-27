class JsonDataBoxController {
    constructor(view, model, dataObjectsBox) {
        this.view = view
        this.model = model
        this.dataObjectsBox = dataObjectsBox
        this.jsonDataChanged(this.model.jsonData, this.model.isBeautified, this.model.errorMode)
        this.model.bindJsonDataChanged(this.jsonDataChanged)
        this.view.bindBeautifyJsonData(this.handleBeautifyJsonData)
        this.view.bindMinifyJsonData(this.handleMinifyJsonData)
        this.view.bindCopyJsonData(this.handleCopyJsonData)
        this.view.bindClearJsonData(this.handleClearJsonData)
        this.view.bindModifyJsonData(this.handleModifyJsonData)
    }

    jsonDataChanged = (jsonData, isBeautified, errorMode) => {
        this.view.displayJsonDataBox(jsonData, isBeautified, errorMode)
        this.dataObjectsBox.model.jsonData = this.model.jsonData
        this.dataObjectsBox.model.modulesListChanged()
    }

    handleBeautifyJsonData = () => {
        this.model.beautifyJsonData()
    }

    handleMinifyJsonData = () => {
        this.model.minifyJsonData()
    }

    handleCopyJsonData = () => {
        this.model.copyJsonData()
    }

    handleClearJsonData = () => {
        this.model.clearJsonData()
    }

    handleModifyJsonData = (jsonData) => {
        this.model.modifyJsonData(jsonData)
    }
}