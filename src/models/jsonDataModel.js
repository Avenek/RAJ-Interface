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

    addObject = (container, name = "") => {
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
      params.objectId = params.hasList ? params.workingList.length - 1 : 0
    }

    cloneObject = (container, index) => {
      const params = this.getParams(container)
      params.workingObject = JSON.parse(JSON.stringify(params.workingList[index]))
      params.workingList.push(params.workingObject)
      params.objectId = params.workingList.length - 1
    }

    deleteObject = (container, index) => {
      const params = this.getParams(container)
      if(params.hasList){
        params.workingList.splice(index, 1)
        if(params.workingList.length === 0){
          params.workingObject = null
          params.workingList = null
          if(container === "module"){
            delete this.data[params.module]
          }
          else{
            delete this.modulePathParams.workingObject[params.module]
          }
        }
      }
      else{
        if(container === "module"){
          delete this.data[params.module]
        }
        else{
          delete this.modulePathParams.workingObject[params.module]
        }
      }
      
    }

    getValueFromObject = (obj, key) => {
      const keys = key.split('.');
      let value = obj
      for (const k of keys) {
        if (value && value.hasOwnProperty(k)) {
          value = value[k];
        } 
        else {
          return null;
        }
      }
      return value;
    }

    getValueFromWorkingObject = (container, key) => {
      const params = this.getParams(container)
      return this.getValueFromObject(params.workingObject, key);
    }

    setObjectKeyByPath = (container, path, value) => {
      const keys = path.split('.');
      const params = this.getParams(container)
      let currentObj = params.workingObject;
    
      for (let i = 0; i < keys.length - 1; i++) {
        const currentKey = keys[i];
        if (!currentObj[currentKey] || typeof currentObj[currentKey] !== 'object') {
          currentObj[currentKey] = {};
        }
        currentObj = currentObj[currentKey];
      }
      const lastKey = keys[keys.length - 1];
      currentObj[lastKey] = value;
    }

    removeObjectKeyByPath(container, path) {
      const params = this.getParams(container)
      let currentObj = params.workingObject;
      const keys = path.split('.');
      for (let i = 0; i < keys.length - 1; i++) {
        const currentKey = keys[i];
        if (!currentObj[currentKey] || typeof currentObj[currentKey] !== 'object') {
          return;
        }
        currentObj = currentObj[currentKey];
      }

      const lastKey = keys[keys.length - 1];
      if (currentObj && typeof currentObj === 'object' && lastKey in currentObj) {
        if(Object.keys(currentObj).length===1)
        {
          const lastDotIndex = path.lastIndexOf(".");
          const penultimate = path.substring(0, lastDotIndex);
          this.removeObjectKeyByPath(container, penultimate)
        }
        else{
          delete currentObj[lastKey];
        }
        
      }
    }

  }