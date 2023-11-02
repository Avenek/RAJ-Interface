class JsonDataModel {
    constructor() {
      this.data = JSON.parse(localStorage.getItem('lastJson')) || {};
      this.modulePathParams = {
        "module": null,
        "objectID": null,
        "hasList": true
      }
      this.modulePath = ""
      this.extraOptionPathParams = {
        "module": null,
        "objectID": null,
        "hasList": true
      }
      this.extraOptionPath = ""
    }

  }