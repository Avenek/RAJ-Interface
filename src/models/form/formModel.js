class FormModel {
    constructor(jsonData, module, id) {
        this.jsonData = jsonData
        this.module = module
        this.objectId = id
        this.headerPanelModel = new HeaderPanelModel(this.module)
        this.moduleObjectIdBoxModel = new ModuleObjectIdBoxModel(this.jsonData, this.module, this.objectId)
    }
}