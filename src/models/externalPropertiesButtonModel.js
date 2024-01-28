class ExternalPropertiesButtonModel{
    constructor(isExternalPropertiesActive){
        this.isExternalPropertiesActive = isExternalPropertiesActive
    }

    bindButtonStateChanged = (callback) => {
        this.buttonStateChanged = callback
      }

    changeButtonState = (isActive) => {
        this.isExternalPropertiesActive = isActive
        this.buttonStateChanged(this.isExternalPropertiesActive)
    }
}