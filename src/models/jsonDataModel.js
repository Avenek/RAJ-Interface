class JsonDataModel {
    constructor() {
      this.data = JSON.parse(localStorage.getItem('lastJson')) || {};
      this.moduleConfig = null
      this.fetchConfig()
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

    fetchConfig = () => {
        fetch('config/modules.json')
        .then(response => response.json())
        .then(config => {
          this.moduleConfig = config
        })
        .catch(error => {
        console.error('Błąd pobierania:', error);
        })
    }

    setParams = (container, module, id) => {
      if(container === "module"){
        this.modulePathParams.module = module
        this.modulePathParams.objectId = id
        this.modulePathParams.hasList = this.moduleConfig.modules.find(object => object.name === module).hasList
      }
      else{
        this.extraOptionPathParams.module = module
        this.extraOptionPathParams.objectId = id
        this.extraOptionPathParams.hasList = this.moduleConfig.modules.find(object => object.name === module).hasList
      }
    }

    updatePaths = () => {
      this.modulePath = this.createPath(this.modulePathParams)
      this.extraOptionPath = this.createPath(this.extraOptionPathParams)
    }

    createPath = (params) => {
      let path = `${params.module}.`
      path += params.hasList ? "list" : ""
      path += `[${params.objectId}]`
      return path
    }

    getParams = (container) => {
      if(container === "module"){
        return this.modulePathParams
      }
      else{
        return this.extraOptionPathParams
      }
    }
  }