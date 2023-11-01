class JsonDataModel {
    constructor() {
      this.data = JSON.parse(localStorage.getItem('lastJson')) || {};
    }
  }