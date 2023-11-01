class AppModel {
    constructor() {
      this.jsonData = new JsonDataModel()
      this.home = new HomeModel(this.jsonData)
    }
}