class JsonDataModel {
    constructor() {
      this.data = JSON.parse(localStorage.getItem('lastJson')) || {};
      this.moduleConfig = null
      this.configUtils = new ConfigUtils()
      this.fetchConfig()
      this.modulePathParams = {
        "module": null,
        "objectId": null,
        "hasList": true,
        "workingList": null,
        "workingObject": null,
        "path": null,
        "fileName": null
      }
      this.extraOptionPathParams = {
        "module": null,
        "objectId": null,
        "hasList": true,
        "workingList": null,
        "workingObject": null,
        "path": null,
        "fileName": null
      }
    }

    fetchConfig = () => {
        fetch('src/config/modules.json')
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
        "path": null,
        "fileName": null
      }
    }

    setParams = (container, module, fileName, id, key = "") => {
      const params = this.getParams(container)
      params.workingObject = null
      params.workingList = null
      params.fileName = fileName
      if(container === "module"){
        this.modulePathParams.module = module
        this.modulePathParams.objectId = id
        this.modulePathParams.path = this.moduleConfig.modules.find(object => object.name === module).path || "object"
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
        const configPath = this.moduleConfig.modules.find(object => object.name === fileName).path
        this.extraOptionPathParams.path = (() => {
          switch (configPath) {
              case 'key':
                  return key + "." + module
              case 'fromId':
                  return key;
              default:
                  return configPath;
            }
          })()
        this.extraOptionPathParams.hasList = this.moduleConfig.modules.find(object => object.name === fileName).hasList
        try{
          if(this.extraOptionPathParams.hasList){
            const object = this.getValueFromWorkingObject("module", params.path)
            this.extraOptionPathParams.workingList = Array.isArray(object) ? object : object.list
            this.extraOptionPathParams.workingObject = this.extraOptionPathParams.workingList[id]
          }
          else{
            const value = this.getValueFromWorkingObject("module", this.extraOptionPathParams.path)
            this.extraOptionPathParams.workingObject = typeof value == "object" ? value : null
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
          params.workingObject = new moduleDict[params.module](name)
          this.data[params.module] = params.workingObject
        }
      }
      else{
        params.workingList = null
        if(params.module === "getCharacterData"){
          name = this.getPathToKey(params.path)
        }
        params.workingObject = new moduleDict[params.fileName](name)
        let path = params.path
        this.setObjectKeyByPath("module", path, params.workingObject)
        const listObject = this.getValueFromWorkingObject("module", path)
        params.workingList = Array.isArray(listObject) ? listObject : null
          
      }
      params.objectId = params.hasList ? params.workingList.length - 1 : 0
    }

    cloneObject = (container, index) => {
      const params = this.getParams(container)
      params.workingObject = JSON.parse(JSON.stringify(params.workingList[index]))
      params.workingList.push(params.workingObject)
      params.objectId = params.workingList.length - 1
    }

    deleteObject = (container, index, defaultInput) => {
      const params = this.getParams(container)
      if(params.hasList){
        params.workingList.splice(index, 1)
        if(params.workingList.length === 0){
          params.workingObject = null
          params.workingList = null
          if(container === "module"){
            delete this.data[params.module]
          }
          else if(params.module !== "behavior"){
            this.removeObjectKeyByPath("module", params.path)
          }
        }
      }
      else{
        if(container === "module"){
          delete this.data[params.module]
        }
        else if(defaultInput !== null && defaultInput !== undefined){
          const path = this.configUtils.getKeyNameFromPath(params.path)
          this.setObjectKeyByPath("module", path, defaultInput)
        }
        else{
          this.removeObjectKeyByPath("module", params.path)
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
          if(currentKey === "list"){
            currentObj[currentKey] = [];
          }
          else{
            currentObj[currentKey] = {};
          }
        }
        currentObj = currentObj[currentKey];
      }
      const lastKey = keys[keys.length - 1];
      if(lastKey === "list"){
        if(!Array.isArray(currentObj[lastKey])){
          currentObj[lastKey] = []
        }
        if(!Array.isArray(value)){
          currentObj[lastKey].push(value);
        }
        else{
          currentObj[lastKey] = value;
        }
      }
      else{
        currentObj[lastKey] = value;
      }
      
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