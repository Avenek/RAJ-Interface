class HomeModel {
    constructor(jsonData, externalPropertiesButton) {
      this.jsonData = jsonData
      this.dataObjectsBoxModel = new DataObjectsBoxModel(jsonData)
      this.modulesBoxModel = new ModulesBoxModel()
      this.jsonDataBoxModel = new JsonDataBoxHomeModel(jsonData, externalPropertiesButton)
    }
}