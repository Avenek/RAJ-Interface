class JsonDataBoxHomeController extends JsonDataBoxController{
    constructor(view, model, dataObjectsBox) {
        super(view, model)
        this.dataObjectsBox = dataObjectsBox
        this.view.displayJsonDataBox(this.model.jsonData, this.model.isBeautified, this.model.errorMode, this.model.externalPropertiesButton.isExternalPropertiesActive)
        this.model.bindJsonDataChanged(this.jsonDataChanged)
        this.view.bindModifyJsonData(this.handleModifyJsonData)
    }

    jsonDataChanged = (jsonData, isBeautified, errorMode) => {
        localStorage.setItem('lastJson', JSON.stringify(this.model.jsonData.displayData));
        this.view.updateJsonData(jsonData, isBeautified, errorMode, this.model.externalPropertiesButton.isExternalPropertiesActive)
        this.dataObjectsBox.model.jsonData = this.model.jsonData
        this.dataObjectsBox.model.dataObjectsListChanged()
    }

    handleModifyJsonData = (jsonData) => {
        this.model.modifyJsonData(jsonData)
    }
}