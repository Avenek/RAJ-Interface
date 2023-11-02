class JsonDataModel {
    constructor() {
      this.data = JSON.parse(localStorage.getItem('lastJson')) || {};
      this.moduleConfig = null
      this.fetchConfig()
      this.modulePathParams = {
        "module": null,
        "objectId": null,
        "hasList": true,
        "workingList": null,
        "workingObject": null
      }
      this.extraOptionPathParams = {
        "module": null,
        "objectId": null,
        "hasList": true,
        "workingList": null,
        "workingObject": null
      }
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
        try{
          if(this.modulePathParams.hasList){
            this.modulePathParams.workingList = this.data[module].list
            this.modulePathParams.workingObject = this.data[module].list[id]
          }
          else{
            this.modulePathParams.workingObject = this.data[module]
          }
        }
        catch{}
      }
      else{
        this.extraOptionPathParams.module = module
        this.extraOptionPathParams.objectId = id
        this.extraOptionPathParams.hasList = this.moduleConfig.modules.find(object => object.name === module).hasList
        try{
          if(this.extraOptionPathParams.hasList){
            this.extraOptionParams.workingList=  this.modulePathParams.workingObject[module].list
            this.extraOptionParams.workingObject =  this.modulePathParams.workingObject[module].list[id]
          }
          else{
            this.extraOptionParams.workingObject =  this.modulePathParams.workingObject[module]
          }
        }
        catch{}
      }
    }

    getParams = (container) => {
      if(container === "module"){
        return this.modulePathParams
      }
      return this.extraOptionPathParams
    }

    addObject(container, name = ""){
      const params = this.getParams(container)
      if(container === "module"){
        if(params.hasList){
          if(params.workingList === null){
            this.data[params.module]={}
            this.data[params.module].list=[]
            params.workingList = this.data[params.module].list
          }
          params.workingObject = new moduleDict[params.module](name)
          params.workingList.push(params.workingObject)
        }
        else{
          params.workingList = null
          params.workingObject = new moduleDict[params.module]()
          this.data[params.module] = params.workingObject
        }
      }
      else{
        if(params.hasList){
          if(params.workingList === null){
            this.modulePathParams.workingObject[params.module]={}
            this.modulePathParams.workingObject[params.module].list=[]
            params.workingList = this.modulePathParams.workingObject[params.module].list
          }
          params.workingObject = new moduleDict[params.module](name)
          params.workingList.push(params.workingObject)
        }
        else{
          params.workingList = null
          params.workingObject = new moduleDict[params.module]()
          this.modulePathParams.workingObject[params.module] = params.workingObject
        }
      }
    
      
    }
  }