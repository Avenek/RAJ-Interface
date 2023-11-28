class JsonDataBoxFormController extends JsonDataBoxController{
    constructor(view, model, objectIdBoxModel, objectFormModel) {
        super(view, model)
        this.model.objectIdBoxModel = objectIdBoxModel
        this.model.objectFormModel = objectFormModel
        this.view.displayJsonDataBox(this.model.jsonData, this.model.isBeautified)
        this.model.bindJsonDataChanged(this.jsonDataChanged)
    }

    jsonDataChanged = () => {
        this.view.updateJsonData(this.model.jsonData, this.model.isBeautified)
    }
}