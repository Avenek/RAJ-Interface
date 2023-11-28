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
        "workingObject": null,
        "path": null
      }
      this.extraOptionPathParams = {
        "module": null,
        "objectId": null,
        "hasList": true,
        "workingList": null,
        "workingObject": null,
        "path": null
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

    clearData = () => {
      this.data = {}
      this.modulePathParams.workingObject = null
      this.modulePathParams.workingList = null
      this.extraOptionPathParams = {
        "module": null,
        "objectId": null,
        "hasList": true,
        "workingList": null,
        "workingObject": null,
        "path": null
      }
    }

    setParams = (container, module, id, key = "") => {
      this.modulePathParams.workingObject = null
      this.modulePathParams.workingList = null
      if(container === "module"){
        this.modulePathParams.module = module
        this.modulePathParams.objectId = id
        this.modulePathParams.path = this.moduleConfig.modules.find(object => object.name === module).path || "object"
        this.modulePathParams.key = key
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
        this.extraOptionPathParams.path = this.moduleConfig.modules.find(object => object.name === module).path || "object"
        this.extraOptionPathParams.key = key
        this.extraOptionPathParams.hasList = this.moduleConfig.modules.find(object => object.name === module).hasList
        if(module.endsWith("Behavior")){
          module = "behavior"
        }
        else if(module.endsWith("RandomFirstIndex")){
          module = "randomFirstIndex"
        }
        try{
          if(this.extraOptionPathParams.hasList){
            this.extraOptionPathParams.workingList = this.modulePathParams.workingObject[module].list
            this.extraOptionPathParams.workingObject = this.modulePathParams.workingObject[module].list[id]
          }
          else{
            if(this.extraOptionPathParams.path === "object"){
              const path = this.getPathToKey(key)
              this.extraOptionPathParams.workingObject = this.getValueFromWorkingObject("module", path+`.${module}`)
            }
            else{
              this.extraOptionPathParams.workingObject = this.getValueFromWorkingObject("module", key)
            }
            
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
        let keyName = params.module
        if(keyName.endsWith("Behavior")){
          keyName = "behavior"
        }
        else if(keyName.endsWith("RandomFirstIndex")){
          keyName = "randomFirstIndex"
        }
        if(params.hasList){
          if(params.workingList === null){
            if(this.modulePathParams.workingObject[keyName] === undefined){
              this.modulePathParams.workingObject[keyName]={}
            }
            if(this.modulePathParams.workingObject[keyName].list === undefined){
              this.modulePathParams.workingObject[keyName].list=[]
            }
            params.workingList = this.modulePathParams.workingObject[keyName].list
          }
          params.workingObject = new moduleDict[params.module](name)
          params.workingList.push(params.workingObject)
        }
        else{
          params.workingList = null
          if(this.extraOptionPathParams.path === "object"){
            params.workingObject = new moduleDict[params.module]()
            let path = this.getPathToKey(params.key) + "." + keyName
            this.setObjectKeyByPath("module", path, params.workingObject)
          }
          else{
            params.workingObject = new moduleDict[params.module](params.key)
            this.setObjectKeyByPath("module", params.key, params.workingObject)
          }
        
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

    getPathToKey = (key) => {
      const dotIndex = key.lastIndexOf('.');
      const path = dotIndex !== -1 ? key.substring(0, dotIndex) : key;
      return path
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