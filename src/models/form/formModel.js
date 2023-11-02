class FormModel {
    constructor(jsonData) {
        this.jsonData = jsonData
        this.headerPanelModel = new HeaderPanelModel(this.jsonData.module)
        this.moduleObjectIdBoxModel = new ModuleObjectIdBoxModel(this.jsonData)
    }
}