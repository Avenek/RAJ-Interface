class HomeController {
    constructor(view, model) {
      this.view = view
      this.model = model
      this.dataObjectsBox = new DataObjectsBoxController(this.view.dataObjectsBoxView, this.model.dataObjectsBoxModel)
      //this.modulesBox = new ModulesBoxController(this.view.modulesBox, this.model.modulesBox)
    }
  }