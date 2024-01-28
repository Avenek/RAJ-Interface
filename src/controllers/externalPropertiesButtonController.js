class ExternalPropertiesButtonController {
    constructor(view, model, app) {
        this.view = view
        this.model = model
        this.app = app
        this.displayButton(this.model.isExternalPropertiesActive)
        this.view.bindClickExternalPropertiesButton(this.handleClickExternalPropertiesButton)
        this.model.bindButtonStateChanged(this.buttonStateChanged)
    }
    
    buttonStateChanged = (isActive) => {
        this.displayButton(isActive)
    }
    
    displayButton = () => {
        this.view.displayButton(this.model.isExternalPropertiesActive)
    }

    handleClickExternalPropertiesButton = () => {
        this.model.isExternalPropertiesActive = false
        this.app.model.jsonData.workingData = this.app.model.jsonData.displayData
        this.app.handleClickHome()
    }
  }