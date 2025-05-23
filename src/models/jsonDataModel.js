class ObjectParams {
  constructor(){
    this.module = null,
    this.objectId = null,
    this.form = null
    this.hasList = true,
    this.workingList = null,
    this.workingObject = null,
    this.path = null,
    this.fileName = null
    this.type = null
    this.config = null
  }
}

class JsonDataModel {
    constructor() {
      this.displayData = JSON.parse(localStorage.getItem('lastJson')) || {};
      this.workingData = this.displayData
      this.moduleConfig = null
      this.configUtils = new ConfigUtils()
      this.fetchConfig()
      this.objectsParams = []
    }

    fetchConfig = () => {
        fetch('src/config/classesConfig/modules.json')
        .then(response => response.json())
        .then(config => {
          this.moduleConfig = config
        })
        .catch(error => {
        console.error('Błąd pobierania:', error);
        })
    }

    clearData = () => {
      this.displayData = {}
      this.workingData = this.displayData
      this.objectsParams.splice(1);
      this.objectsParams[0].workingObject = null;
      this.objectsParams[0].workingList = null;
    }

    setParams = (container, module, fileName, id, type, form, key = "") => {
      const params = new ObjectParams()
      this.objectsParams.push(params)
      params.workingObject = null
      params.workingList = null
      params.fileName = fileName
      params.module = module
      params.objectId = id
      params.type = type
      params.form = form
      const propertyConfig = this.moduleConfig.modules.find(object => object.name === fileName && object.type === type)
      if(container === "module"){
        params.path = propertyConfig.path || "object"
        params.hasList = propertyConfig.hasList
        try{
          if(params.hasList){
            params.workingList = this.workingData[module].list
            params.workingObject = this.workingData[module].list[id]
          }
          else{
            params.workingObject = this.workingData[module]
          }
        }
        catch{}
      }
      else{
        const configPath = propertyConfig.path
        params.path = (() => {
          switch (configPath) {
              case 'key':
                  return key + "." + module
              case 'fromId':
                  return key;
              default:
                  return configPath;
            }
          })()
        params.hasList = propertyConfig.hasList
        try{
          if(params.hasList){
            const object = this.getValueFromWorkingObject("module", params.path)
            params.workingList = Array.isArray(object) ? object : object.list
            params.workingObject = params.workingList[id]
          }
          else{
            const value = this.getValueFromWorkingObject("module", params.path)
            params.workingObject = typeof value == "object" ? value : null
          }
        }
        catch{}
      }
    }

    getParams = (container) => {
      if(container === "module"){
        if(this.objectsParams.length === 0){
          return null
        }
        else if (this.objectsParams.length === 1) {
          return this.objectsParams[0];
        } 
        else {
            return this.objectsParams[this.objectsParams.length - 2];
        }
      }
      else if(container === "parent"){
        return this.getParentParams("module")
      }
      else{
        if(this.objectsParams.length === 1){
          return null
        }
        return this.objectsParams[this.objectsParams.length - 1]
      }
    }

    getParentParams = (container) => {
      if(container === "module"){
        if(this.objectsParams.length === 0){
          return null
        }
        else if (this.objectsParams.length === 1) {
          null
        } 
        else if (this.objectsParams.length === 2){
            return this.objectsParams[0];
        }
        else{
          return this.objectsParams[this.objectsParams.length - 3];
        }
      }
      else{
        return this.getParams("module")
      }
    }

    deleteParams = () => {
      if(this.objectsParams.length < 2){
        this.objectsParams[0].workingList = null
        this.objectsParams[0].workingObject = null
      }
      else{
        this.objectsParams.splice(this.objectsParams.length - 1, 1)
      }

    }

    addParams = () => {
      const params = new ObjectParams()
      this.objectsParams.push(params)
      return params
    }

    addObject = (container, name = "") => {
      const params = this.getParams(container)
      if(container === "module" && this.objectsParams.length < 3){
        if(params.hasList){
          if(params.workingList === null){
            this.workingData[params.module]={}
            this.workingData[params.module].list=[]
            params.workingList = this.workingData[params.module].list
          }
          params.workingObject = new moduleDict[params.fileName](name)
          params.workingList.push(params.workingObject)
        }
        else{
          params.workingList = null
          params.workingObject = new moduleDict[params.module](name)
          this.workingData[params.module] = params.workingObject
        }
      }
      else if(container === "module"){
        if(params.module === "getCharacterData"){
          name = this.getPenultimateKeyFromPath(params.path)
        }
        params.workingObject = new moduleDict[params.fileName](name)
        let path = params.path
        this.setObjectKeyByPath("parent", path, params.workingObject)
        const listObject = this.getValueFromWorkingObject("parent", path)
        params.workingList = Array.isArray(listObject) ? listObject : null 
      }
      else{
        params.workingList = null
        if(params.module === "getCharacterData"){
          name = this.getPenultimateKeyFromPath(params.path)
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
            if(this.objectsParams.length > 2){
              const parentObject = this.getParentParams(container).workingObject
              delete parentObject[params.module]
            }
            else{
              delete this.workingData[params.module]
            }
          }
          else if(params.module !== "behavior"){
            this.removeObjectKeyByPath("module", params.path)
          }
        }
      }
      else{
        if(container === "module"){
          if(this.objectsParams.length > 2){
            const parentObject = this.getParentParams(container).workingObject
            delete parentObject[params.module]
          }
          else{
            delete this.workingData[params.module]
          }
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
      if(key){
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
      return obj
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

    getPenultimateKeyFromPath = (key) => {
      const parts = key.split('.');
      return parts.length > 1 ? parts[parts.length - 2] : parts[0];
    }

    setObjectKeyByPath = (container, path, value) => {
      const keys = path.split('.');
      const params = this.getParams(container)
      let currentObj = params.workingObject;
    
      for (let i = 0; i < keys.length - 1; i++) {
        const currentKey = keys[i];
        if (!currentObj[currentKey] || typeof currentObj[currentKey] !== 'object') {
          if(currentKey === "list" || currentKey === "holes" || currentKey === "vals" || currentKey === "options"|| currentKey === "require" || (currentKey === "params" && params.fileName === "case")){
            currentObj[currentKey] = [];
          }
          else{
            currentObj[currentKey] = {};
          }
        }
        currentObj = currentObj[currentKey];
      }
      const lastKey = keys[keys.length - 1];
      if(lastKey === "list" || lastKey === "holes" || lastKey === "vals" || lastKey === "options" || lastKey === "require"|| (lastKey === "params" && params.fileName === "case")){
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
        if(Object.keys(currentObj).length===1 && path.lastIndexOf(".")>0)
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