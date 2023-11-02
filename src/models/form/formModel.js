class FormModel {
    constructor(jsonData) {
        this.jsonData = jsonData
        this.jsonDataBoxModel = new JsonDataBoxFormModel(jsonData)
        this.headerPanelModel = new HeaderPanelModel(this.jsonData.module)
        this.moduleObjectIdBoxModel = new ModuleObjectIdBoxModel(this.jsonData, "module", this.jsonDataBoxModel)
    }
}