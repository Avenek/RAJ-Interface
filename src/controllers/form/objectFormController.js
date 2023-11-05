class ObjectFormController {
    constructor(view, model) {
        this.view = view
        this.model = model
        this.model.bindObjectFormChanged(this.objectFormChanged)
    }
    
    objectFormChanged = (objectFormList) => {
        this.view.displayObjectForm(objectFormList)
    }

    
  }