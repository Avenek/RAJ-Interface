class ObjectFormController {
    constructor(view, model) {
        this.view = view
        this.model = model
        this.model.bindObjectFormChanged(this.objectFormChanged)
        this.model.objectFormChanged(this.model.objectFormList)
    }
    
    objectFormChanged = (objectFormList) => {
        this.view.displayObjectForm(objectFormList)
    }

    
  }