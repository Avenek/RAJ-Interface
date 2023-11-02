class FormModel {
    constructor(jsonData) {
        this.jsonData = jsonData
        this.jsonDataBoxModel = new JsonDataBoxFormModel(jsonData)
        console.log(this.jsonData);
        this.headerPanelModel = new HeaderPanelModel(this.jsonData.modulePathParams.module)
        this.moduleObjectIdBoxModel = new ModuleObjectIdBoxModel(this.jsonData, "module", this.jsonDataBoxModel)
    }
}