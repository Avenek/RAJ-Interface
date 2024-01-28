class AppModel {
    constructor() {
      this.jsonData = new JsonDataModel()
      this.externalPropertiesButton = new ExternalPropertiesButtonModel(false)
      this.home = new HomeModel(this.jsonData, this.externalPropertiesButton)
    }
}