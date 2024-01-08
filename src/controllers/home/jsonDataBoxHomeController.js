class JsonDataBoxHomeController extends JsonDataBoxController{
    constructor(view, model, dataObjectsBox) {
        super(view, model)
        this.dataObjectsBox = dataObjectsBox
        this.view.displayJsonDataBox(this.model.jsonData, this.model.isBeautified, this.model.errorMode)
        this.model.bindJsonDataChanged(this.jsonDataChanged)
        this.view.bindModifyJsonData(this.handleModifyJsonData)
    }

    jsonDataChanged = (jsonData, isBeautified, errorMode) => {
        localStorage.setItem('lastJson', JSON.stringify(this.model.jsonData.data));
        this.view.updateJsonData(jsonData, isBeautified, errorMode)
        this.dataObjectsBox.model.jsonData = this.model.jsonData
        this.dataObjectsBox.model.dataObjectsListChanged()
    }

    handleModifyJsonData = (jsonData) => {
        this.model.modifyJsonData(jsonData)
    }
}