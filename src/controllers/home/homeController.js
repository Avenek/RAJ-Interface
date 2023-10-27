class HomeController {
    constructor(view, model) {
      this.view = view
      this.model = model
      this.dataObjectsBox = new DataObjectsBoxController(this.view.dataObjectsBoxView, this.model.dataObjectsBoxModel)
      this.modulesBox = new ModulesBoxController(this.view.modulesBoxView, this.model.modulesBoxModel)
      this.jsonDataBox = new JsonDataBoxController(this.view.jsonDataBoxView, this.model.jsonDataBoxModel, this.dataObjectsBox)

    }
  }