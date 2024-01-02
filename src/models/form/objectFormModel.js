class ObjectFormModel{
    constructor(jsonData, container, jsonDataBox){
        this.jsonData = jsonData
        this.container = container
        this.jsonDataBox = jsonDataBox
        this.objectFormList = []
        this.extraOptionIdBox = null
        this.fetchConfigAndCreateObjectFormList()
    }

    bindObjectFormChanged = (callback) => {
        this.objectFormChanged = callback
    }

    fetchConfigAndCreateObjectFormList = () => {
        const params = this.jsonData.getParams(this.container)
        fetch(`src/config/${params.fileName}.json`)
        .then(response => response.json())
        .then(config => {
            this.config = config
            this.configUtils = new ConfigUtils(config)
            this.createObjectFormList(this.config)
        })
        .catch(error => {
        console.error('Błąd pobierania:', error);
        })
    }

    createObjectFormList = (config) => {
        this.objectFormList = []
        for (const property of config.properties) {
            this.createObjectProperty(property)
            this.objectFormList.push(property)
        }
        this.requiredItems = this.findItemsByProperty(this.objectFormList, "require")
        this.hideAndRevealRequiredItems()
        this.hightligthsUsedExtraOption()
        this.objectFormChanged(this.objectFormList)
        localStorage.setItem('lastJson', JSON.stringify(this.jsonData.data));
    }

    createObjectProperty = (property) => {
        for(const prop of property.properties){
            if(prop.properties){
                this.createObjectProperty(prop)
            }
            prop.hide = false
            this.fillPropertyValue(prop)
            this.addExpandedKey(prop)
            this.propertyValidation(prop)
        } 
    }

    fillPropertyValue = (propertyObject) => {
        let keyValue = this.jsonData.getValueFromWorkingObject(this.container, propertyObject.name) || propertyObject.defaultSraj || propertyObject.defaultInput
        if(keyValue !== null && keyValue !== undefined){
            propertyObject.value = keyValue
        }
    }

    propertyValidation = (property) => {
        if(property.properties){
            for(let prop of property.properties){
                const dataValidation = new DataValidation(prop, this.jsonData, this.container, this.configUtils)
                const validateSummary = dataValidation.validateData()
                prop.isValid = validateSummary.isValid
                prop.errorMessage = validateSummary.errorMessage
            }
        }
        else{
            const dataValidation = new DataValidation(property, this.jsonData, this.container, this.configUtils)
            const validateSummary = dataValidation.validateData()
            property.isValid = validateSummary.isValid
            property.errorMessage = validateSummary.errorMessage
        }
        if(property.validation){
            property.validation.forEach(validate => {
                if(validate.value && typeof validate.value === "string"){
                    const property = this.configUtils.findObjectByProperty(this.objectFormList, validate.value, "name")
                    if(property){
                        const dataValidation = new DataValidation(property, this.jsonData, this.container, this.configUtils)
                        const validateSummary = dataValidation.validateData()
                        property.isValid = validateSummary.isValid
                        property.errorMessage = validateSummary.errorMessage
                    }
                }
            })
        }
    }

    findItemsByProperty = (objectFormList, property) => {
        let objectsWithProperty = [];
        if (typeof objectFormList === 'object') {
          if (objectFormList.hasOwnProperty(property)) {
            objectsWithProperty.push(objectFormList);
          }
          for (let key in objectFormList) {
            if (objectFormList.hasOwnProperty(key) && objectFormList[key] ) {
              objectsWithProperty = objectsWithProperty.concat(this.findItemsByProperty(objectFormList[key], property));
            }
          }
        }
        return objectsWithProperty
    }

    hideAndRevealRequiredItems = (targetProperty = null) => {
    const listToSet = []
      this.requiredItems.forEach(item => {
        let allConditionsAreMet = true
          for(let i = 0 ; i < item.require.length ; i++) {
            const requireItem = item.require[i]
            const valueInObject = this.jsonData.getValueFromWorkingObject(this.container, requireItem.name)
            const requireObject = this.configUtils.findObjectByProperty(this.config.properties, requireItem.name, "name")
            if(valueInObject && !requireItem.value.includes(valueInObject)){
                allConditionsAreMet = false
                break;
            }
            else if(requireObject && requireObject.defaultSraj && !requireItem.value.includes(requireObject.defaultSraj)){
              allConditionsAreMet = false
              break;
            }
            else if(valueInObject === null && requireObject && requireObject.defaultSraj === undefined){
                allConditionsAreMet = false
                break;
            }
        }
        item.hide = !allConditionsAreMet
        if(targetProperty === null || item.require.some(obj => obj.name === targetProperty.name))
        {
            if(allConditionsAreMet && this.jsonData.getValueFromWorkingObject(this.container, item.name) === null)
            {
                if(item.properties){
                    const valueObject = this.createObjectBaseOnConfig(item.properties)
                    this.jsonData.setObjectKeyByPath(this.container, item.name, valueObject)
                    listToSet.push({"name": item.name, "id": item.idInput, "value": valueObject})
                    item.value = valueObject
                }
                else {
                    this.jsonData.setObjectKeyByPath(this.container, item.name, item.defaultInput)
                    listToSet.push({"name": item.name,  "id": item.idInput, "value": item.defaultInput})
                    item.value = item.defaultInput
                }
            }
            else if(allConditionsAreMet){
                const value = this.jsonData.getValueFromWorkingObject(this.container, item.name)
                if(item.properties && this.isObjectCompatibleWithConfig(value, item.properties)){
                    const valueObject = this.createObjectBaseOnConfig(item.properties)
                    this.jsonData.setObjectKeyByPath(this.container, item.name, valueObject)
                    listToSet.push({"name": item.name, "id": item.idInput, "value": valueObject})
                    item.value = valueObject
                }
                else if(item.options && item.options.some(value => value.name === value)){
                    listToSet.push({"name": item.name, "id": item.idInput, "value": value})
                } 
                else{
                    listToSet.push({"name": item.name, "id": item.idInput, "value": item.defaultInput})
                } 
            } 
            else if(!allConditionsAreMet){
                this.jsonData.removeObjectKeyByPath(this.container, item.name)
                item.value = ""
            }
        }
      })
      listToSet.forEach(key => {
        this.jsonData.setObjectKeyByPath(this.container, key.name, key.value)
        const targetProperty = this.configUtils.findObjectByProperty(this.objectFormList, key.id, "idInput")
        targetProperty.value = key.value
        this.propertyValidation(targetProperty)
      })
      const params = this.jsonData.getParams(this.container)
      this.removeDefaultValuesFromJson(params.workingObject)
      this.jsonDataBox.jsonDataChanged()
    }

    isObjectCompatibleWithConfig = (object, config) => {
        let currentObj = object;
    
        for(let key in currentObj) {
            const currentKey = key;
            if (typeof currentObj[currentKey] == 'object') {
                this.isObjectCompatibleWithConfig(currentObj[currentKey], config)
            }
            else{
                if (!config.some(obj => obj.name.includes(key))){
                    return false
                }
            }
        }
        return true
    }


    createObjectBaseOnConfig = (config) => {
        let result = {};
        let currentObj = result;
        for (const property of config) {
          const key = this.configUtils.getLastPartOfTheName(property.name)
          if(property.hasOwnProperty("properties"))
          {
            const createdObject = this.createObjectBaseOnConfig(property.properties, this.container)
            currentObj[key] = createdObject
          }
          else if(property.inputType!=="empty" || property.hasOwnProperty("defaultInput")){
            const value = this.jsonData.getValueFromWorkingObject(this.container, property.name)
            if(value !== null){
              currentObj[key] = value
            }
            else{
              currentObj[key] = property.defaultInput !== undefined && property.defaultInput !== null ? property.defaultInput : '';
            }
            if(currentObj[key] === property.defaultSraj){
                delete currentObj[key]
              }
          
          }
        }
        return result
      }

    hightligthsUsedExtraOption = () => {
        const items = this.findItemsByProperty(this.objectFormList, "extraOptions")
        items.forEach(item => {
            item.extraOptions.forEach(extraOption => {
                const extraOptionName = this.configUtils.formatToCamelCase(extraOption.name)
                const fileName = (extraOptionName === "behavior" || extraOptionName === "randomFirstIndex" || extraOptionName === "master") ? this.jsonData.modulePathParams.module + extraOptionName.charAt(0).toUpperCase() + extraOptionName.slice(1) : extraOptionName
                const modulePath = this.jsonData.moduleConfig.modules.find(object => object.name === fileName).path
                const path = modulePath === "key" ? item.name + "." + extraOptionName : modulePath
                const extraOptionValue = this.jsonData.getValueFromWorkingObject("module", path)
                if(Array.isArray(extraOptionValue)){
                    extraOption.isUsed = extraOptionValue.length > 0
                }
                else{
                    extraOption.isUsed = extraOptionValue ? true : false
                }
            }) 
        })
    }

    collapseProperty = (id) => {
        const targetProperty = this.configUtils.findObjectByProperty(this.objectFormList, id, "idInput")
        let keyCollapsed
        if(targetProperty.isCollapsed){
            targetProperty.isCollapsed = ""
            keyCollapsed = ""
        }
        else{
            targetProperty.isCollapsed = " collapsed"
            keyCollapsed = " collapsed-key"
        }
        targetProperty.properties.forEach(property => {
            property.isCollapsed = keyCollapsed
            if(property.properties){
                this.collapseAllPropertiesInProperty(property, keyCollapsed)
            }
        })

        this.objectFormChanged(this.objectFormList)
    }

    collapseAllPropertiesInProperty = (property, isCollapsed) => {
        property.properties.forEach(prop => {
            prop.isCollapsed = isCollapsed
            if(prop.properties){
                this.collapseAllPropertiesInProperty(prop, isCollapsed)
            }
        })
    }

    addExpandedKey = (property) => {
        if(property.value){
            property.isExpanded = property.value.length > 30
        }
    }

    resizeIfIsTooLongValue = (id) => {
        const targetProperty = this.configUtils.findObjectByProperty(this.objectFormList, id, "idInput")
        this.addExpandedKey(targetProperty)
    }

    removeDefaultValuesFromJson(data, prefix = "") {
        for (const key in data) {
          const value = data[key];
          const fullKey = prefix + key;
          let foundObject
          if (Array.isArray(value)){}
          else if (typeof value === "object") {
            this.removeDefaultValuesFromJson(value, fullKey + ".");
            if(Object.keys(value).length ===0){
                delete data[key]
            }
          }
          else{
            foundObject = this.configUtils.findObjectByProperty(this.objectFormList, fullKey, "name")
            if(foundObject && foundObject.defaultSraj === data[key])
            {
              this.jsonData.removeObjectKeyByPath(this.container, fullKey)
            }
          }
        }
        this.jsonDataBox.jsonDataChanged()
      }

    enterValue = (id, value) => {
        const targetProperty = this.configUtils.findObjectByProperty(this.objectFormList, id, "idInput")
        const valueInGoodType = this.configUtils.getValueInGoodType(targetProperty.name, value)
        targetProperty.value = valueInGoodType
        if((targetProperty.inputType === "string" || targetProperty.inputType === "number") && targetProperty.extraOptions && this.extraOptionIdBox){
            targetProperty.extraOptions.forEach(option => option.isUsed = false)
            this.jsonData.extraOptionPathParams.workingObject = null
            this.extraOptionIdBox.clearBox(false)
            this.extraOptionIdBox.objectForm.clearForm()
        }
        this.updateValueInJson(targetProperty, valueInGoodType)
        this.jsonDataBox.jsonDataChanged()
        if(targetProperty.name === "id" || targetProperty.name === "name" || targetProperty.name === "kind" || targetProperty.name === "action"){
            this.objectIdBox.updateNameObjectId(this.container)
        }
    }

    unfocusInput = (id) => {
        const targetProperty = this.configUtils.findObjectByProperty(this.objectFormList, id, "idInput")
        this.propertyValidation(targetProperty)
        this.hideAndRevealRequiredItems(targetProperty)
        this.objectFormChanged(this.objectFormList)
    }

    checkOption = (id, value) => {
        const targetProperty = this.configUtils.findObjectByProperty(this.objectFormList, id, "idInput")
        targetProperty.options.forEach(option => option.isChecked = false)
        targetProperty.options.find(option => option.name === value).isChecked = true;
        this.updateValueInJson(targetProperty, value)
        targetProperty.value = value
        this.jsonDataBox.jsonDataChanged()
        this.hideAndRevealRequiredItems(targetProperty)
        this.objectFormChanged(this.objectFormList)
        if(targetProperty.name === "id" || targetProperty.name === "name" || targetProperty.name === "kind" || targetProperty.name === "action"){
            this.objectIdBox.updateNameObjectId(this.container)
        }
    }

    checkSlider = (id) => {
        const targetProperty = this.configUtils.findObjectByProperty(this.objectFormList, id, "idInput")
        targetProperty.value = !targetProperty.value
        this.updateValueInJson(targetProperty, targetProperty.value)
        this.jsonDataBox.jsonDataChanged()
        this.hideAndRevealRequiredItems(targetProperty)
        this.objectFormChanged(this.objectFormList)
    }

    chooseFile = (id, fileName) => {
        const targetProperty = this.configUtils.findObjectByProperty(this.objectFormList, id, "idInput")
        targetProperty.value = `${targetProperty.directory}${fileName}`
        this.updateValueInJson(targetProperty, targetProperty.value)
        this.jsonDataBox.jsonDataChanged()
        this.hideAndRevealRequiredItems(targetProperty)
        this.resizeIfIsTooLongValue(id)
        this.objectFormChanged(this.objectFormList)
    }

    changeStateExtraOption = () => {
        this.hightligthsUsedExtraOption()
        this.objectFormChanged(this.objectFormList)
    }

    updateValueInJson = (targetProperty, value) => {
        if(value !== targetProperty.defaultSraj){
            this.jsonData.setObjectKeyByPath(this.container, targetProperty.name, value)
        }
        else if(value === targetProperty.defaultSraj){
            this.jsonData.removeObjectKeyByPath(this.container, targetProperty.name)
        }
        this.makeKeyOrder()
        localStorage.setItem('lastJson', JSON.stringify(this.jsonData.data));
    }

    clearForm = () => {
        this.objectFormList = []
        this.objectFormChanged(this.objectFormList)
    }

    makeKeyOrder = () => {
        const params = this.jsonData.getParams("module")
        if(params.workingObject.hasOwnProperty("behavior")){
          this.moveToLastPlaceInJson("behavior", params.workingObject)
          if(params.workingObject.behavior.hasOwnProperty("list")){
            this.moveToLastPlaceInJson("behavior.list", params.workingObject)
          }
        }
        if(params.workingObject.hasOwnProperty("d")){
          this.moveToLastPlaceInJson("d", params.workingObject)
          if(params.workingObject.d.hasOwnProperty("light")){
            this.moveToLastPlaceInJson("d.light", params.workingObject)
            if(params.workingObject.d.light.hasOwnProperty("color")){
              this.moveToLastPlaceInJson("d.light.color", params.workingObject)
            }
          }
          if(params.workingObject.d.hasOwnProperty("behavior")){
            this.moveToLastPlaceInJson("d.behavior", params.workingObject)
            if(params.workingObject.d.behavior.hasOwnProperty("list")){
              this.moveToLastPlaceInJson("d.behavior.list", params.workingObject)
            }
          }
        }
        if(params.workingObject.hasOwnProperty("source")){
          this.moveToLastPlaceInJson("source", params.workingObject)
        }
      }
      
    moveToLastPlaceInJson = (path, workingObject) => {
        const keys = path.split('.');
        let currentObj = workingObject
      
        for (let i = 0; i < keys.length; i++) {
          const currentKey = keys[i];
          if (!currentObj[currentKey] || typeof currentObj[currentKey] !== 'object') {
            console.error("Podana ścieżka jest nieprawidłowa. Nie znaleziono podanego klucza. " + path);
            return
          }
          currentObj = currentObj[currentKey];
        }
        const temp = currentObj
        this.jsonData.removeObjectKeyByPath("module", path)
        this.jsonData.setObjectKeyByPath("module", path, temp)
    }
}