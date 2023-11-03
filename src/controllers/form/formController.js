class FormController {
    constructor(view, model) {
      this.model = model
      this.view = view
      this.view.render()
      this.headerPanel = new HeaderPanelController(this.view.headerPanelView, this.model.headerPanelModel)
      this.moduleObjectIdBox = new ObjectIdBoxController(this.view.moduleObjectIdBoxView, this.model.moduleObjectIdBoxModel)
      this.jsonDataBox = new JsonDataBoxFormController(this.view.jsonDataBoxView, this.model.jsonDataBoxModel)
      this.moduleObjectForm = new ObjectFormController(this.view.moduleObjectFormView, this.model.moduleObjectFormModel)
    }
  }