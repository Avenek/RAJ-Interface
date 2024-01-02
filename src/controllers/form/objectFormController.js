class ObjectFormController {
    constructor(view, model) {
        this.view = view
        this.model = model
        this.model.bindObjectFormChanged(this.objectFormChanged)
        this.view.bindCollapseProperty(this.handleCollapseProperty)
        this.view.bindResizeIfIsTooLongValue(this.handleResizeIfIsTooLongValue)
        this.view.bindEnterValueInInput(this.handleEnterValueInInput)
        this.view.bindUnfocusInput(this.handleUnfocusInput)
        this.view.bindCheckOption(this.handleCheckOption)
        this.view.bindCheckSlider(this.handleCheckSlider)
        this.view.bindChooseFile(this.handleChooseFile)
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
        this.model.enterValue(id, value)
    }

    handleUnfocusInput = (id) => {
        this.model.unfocusInput(id)
    }
    
    handleCheckOption = (id, value) => {
        this.model.checkOption(id, value)
    }

    handleCheckSlider = (id) => {
        this.model.checkSlider(id)
    }

    handleChooseFile = (id, fileName) => {
        this.model.chooseFile(id, fileName)
    }
  }