class FormModel {
    constructor(jsonData) {
        this.jsonData = jsonData
        this.jsonDataBoxModel = new JsonDataBoxFormModel(jsonData)
        this.headerPanelModel = new HeaderPanelModel(this.jsonData.modulePathParams.module)
        this.moduleObjectIdBoxModel = new ObjectIdBoxModel(this.jsonData, "module", this.jsonDataBoxModel)
        console.log("TEST");
        this.moduleObjectFormModel = new ObjectFormModel(this.jsonData, "module", this.jsonDataBoxModel)
    }
}