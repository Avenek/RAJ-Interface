class AppModel {
    constructor() {
      this.jsonData = JSON.parse(localStorage.getItem('lastJson')) || {}
      this.home = new HomeModel(this.jsonData)
    }
}