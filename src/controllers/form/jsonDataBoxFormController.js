class JsonDataBoxFormController extends JsonDataBoxController{
    constructor(view, model) {
        super(view, model)
        this.view.displayJsonDataBox(this.model.jsonData, this.model.isBeautified)
        this.model.bindJsonDataChanged(this.jsonDataChanged)
    }

    jsonDataChanged = (jsonData, isBeautified) => {
        this.view.updateJsonData(jsonData, isBeautified)
    }
}