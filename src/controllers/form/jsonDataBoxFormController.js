class JsonDataBoxFormController extends JsonDataBoxController{
    constructor(view, model) {
        super(view, model)
        this.view.displayJsonDataBox(this.model.jsonData, this.model.isBeautified)
        this.model.bindJsonDataChanged(this.jsonDataChanged)
    }

    jsonDataChanged = () => {
        this.view.updateJsonData(this.model.jsonData, this.model.isBeautified)
    }
}