class FormModel {
    constructor(jsonData) {
        this.jsonData = jsonData
        this.jsonDataBoxModel = new JsonDataBoxFormModel(jsonData)
        this.headerPanelModel = new HeaderPanelModel(this.jsonData.getParams("module").module)
        this.moduleObjectFormModel = new ObjectFormModel(this.jsonData, "module", this.jsonDataBoxModel)
        this.moduleObjectIdBoxModel = new ObjectIdBoxModel(this.jsonData, "module", this.jsonDataBoxModel, this.moduleObjectFormModel)
        this.moduleObjectFormModel.objectIdBox = this.moduleObjectIdBoxModel
    }
}