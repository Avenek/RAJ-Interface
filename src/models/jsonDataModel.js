class JsonDataModel {
    constructor() {
      this.data = JSON.parse(localStorage.getItem('lastJson')) || {};
      this.modulePathParams = {
        "module": null,
        "objectId": null,
        "hasList": true
      }
      this.modulePath = ""
      this.extraOptionPathParams = {
        "module": null,
        "objectId": null,
        "hasList": true
      }
      this.extraOptionPath = ""
    }

  }