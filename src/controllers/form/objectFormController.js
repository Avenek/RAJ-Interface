class ObjectFormController {
    constructor(view, model) {
        this.view = view
        this.model = model
        this.model.bindObjectFormChanged(this.objectFormChanged)
        this.view.bindCollapseProperty(this.handleCollapseProperty)
        this.view.bindResizeIfIsTooLongValue(this.handleResizeIfIsTooLongValue)
        this.view.bindEnterValueInInput(this.handleEnterValueInInput)
    }
    
    objectFormChanged = (objectFormList) => {
        this.view.displayObjectForm(objectFormList)
    }

    handleCollapseProperty = (id) => {
        this.model.collapseProperty(id)
    }

    handleResizeIfIsTooLongValue = (id, isTooLong) => {
        this.model.resizeIfIsTooLongValue(id, isTooLong)
    }

    handleEnterValueInInput = (id, value) => {
        this.model.enterValueInInput(id, value)
    }
    
  }