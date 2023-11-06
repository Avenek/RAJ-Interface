class ObjectFormController {
    constructor(view, model) {
        this.view = view
        this.model = model
        this.model.bindObjectFormChanged(this.objectFormChanged)
        this.view.bindCollapseProperty(this.handleCollapseProperty)
        this.view.binbdResizeIfIsTooLongValue(this.handleResizeIfIsTooLongValue)
    }
    
    objectFormChanged = (objectFormList) => {
        this.view.displayObjectForm(objectFormList)
    }

    handleCollapseProperty = (id) => {
        this.model.collapseProperty(id)
    }

  }