class ObjectFormModel{
    constructor(jsonData, container, jsonDataBox){
        this.jsonData = jsonData
        this.container = container
        this.jsonDataBox = jsonDataBox
        this.objectFormList = []
        this.extraOptionIdBox = null
        this.extraOptionWords = ['external_properties', 'getCharacterData', "getRandom", "case", "getFor", "getFunc", "getRandom", "light", "master", "randomFirstIndex", "source", "parent", "target", "color"]
    }

    bindObjectFormChanged = (callback) => {
        this.objectFormChanged = callback
    }

    fetchConfigAndCreateObjectFormList = () => {
        const params = this.jsonData.getParams(this.container)
        if(params == null){
            this.clearForm()
            return
        }
        fetch(`src/config/${params.fileName}.json`)
        .then(response => response.json())
        .then(config => {
            params.config = config
            this.configUtils = new ConfigUtils(config)
            this.createObjectFormList(config)
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
        this.requiredItems.sort(this.sortRequirementsList);
        this.validationItems = this.findItemsByProperty(this.objectFormList, "validation")
        this.hideAndRevealRequiredItems()
        this.hightligthsUsedExtraOption()
        this.makeKeyOrder()
        this.objectFormChanged(this.objectFormList)
    }

    sortRequirementsList = (a, b) => {
        var aIsObject = typeof a.value === 'object';
        var bIsObject = typeof b.value === 'object';
        
        if (aIsObject && !bIsObject) {
            return 1;
        }
        else if (!aIsObject && bIsObject) {
            return -1;
        }
        else {
            return 0;
        }
    }

    createObjectProperty = (property) => {
        for(const prop of property.properties){
            if(prop.properties){
                this.createObjectProperty(prop)
            }
            prop.hide = false
            this.fillPropertyValue(prop, property)
            this.addExpandedKey(prop)
            this.propertyValidation(prop)
        } 
        
    }

    fillPropertyValue = (propertyObject, parentProperty) => {
        if(propertyObject.inputType !== "color"){
            let keyValue = this.jsonData.getValueFromWorkingObject(this.container, propertyObject.name) || propertyObject.defaultSraj || propertyObject.defaultInput
            if(keyValue !== null && keyValue !== undefined){
                propertyObject.value = keyValue
            }
        }
        else{
            const r = parentProperty.properties[0].value
            const g = parentProperty.properties[1].value
            const b = parentProperty.properties[2].value
            const hexColor = this.rgbToHex(r, g, b);
            propertyObject.value = hexColor
        }
    }

    rgbToHex = (r, g, b) => {
        const toHex = (value) => {
          const hex = value.toString(16);
          return hex.length === 1 ? '0' + hex : hex;
        };
        if(typeof r != "object" && typeof g != "object" && typeof b != "object"){
            const hexR = toHex(r)
            const hexG = toHex(g)
            const hexB = toHex(b)
            return `#${hexR}${hexG}${hexB}`
        }
        return ""
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
        const params = this.jsonData.getParams(this.container)
        let listToSet = []
        const listToRemove = []
        this.requiredItems.forEach(item => {
        const allConditionsAreMet = this.checkIfPropertyMeetsRequirements(item)
        item.hide = !allConditionsAreMet
        if(targetProperty === null || item.require.some(obj => obj.name === targetProperty.name))
        {
            const value = this.jsonData.getValueFromWorkingObject(this.container, item.name)
            if(allConditionsAreMet && value === null)
            {
                if(item.properties){
                    const valueObject = this.createObjectBaseOnConfig(item.properties)
                    listToSet.push({"name": item.name, "id": item.idInput, "value": valueObject})
                }
                else {
                    this.jsonData.setObjectKeyByPath(this.container, item.name, item.defaultInput)
                    listToSet.push({"name": item.name,  "id": item.idInput, "value": item.defaultInput})
                    item.value = item.defaultInput
                }
            }
            else if(allConditionsAreMet){
                if(item.properties){
                    let valueObject = value
                    if(!this.isObjectCompatibleWithConfig(value, item)){
                        valueObject = this.createObjectBaseOnConfig(item.properties)
                    }
                    listToSet.push({"name": item.name, "id": item.idInput, "value": valueObject})
                    this.jsonData.setObjectKeyByPath(this.container, item.name, valueObject)
                }
                else if((item.options && item.options.some(value => value.name === value)) || value !== null && (!Array.isArray(value) || Array.isArray(value) && this.isObjectCompatibleWithConfig(value, item))){
                    listToSet.push({"name": item.name, "id": item.idInput, "value": value})
                    this.jsonData.setObjectKeyByPath(this.container, item.name, value)
                    item.value = value
                } 
                else{
                    listToSet.push({"name": item.name, "id": item.idInput, "value": item.defaultInput})
                    this.jsonData.setObjectKeyByPath(this.container, item.name, item.defaultInput)
                    item.value = item.defaultInput
                } 
            } 
            else if(!allConditionsAreMet){
                if(value != null && value != undefined && typeof value == "object"){
                    if(this.isObjectCompatibleWithConfig(value, item)){
                        listToRemove.push({"name": item.name, "id": item.idInput})
                        this.jsonData.removeObjectKeyByPath(this.container,item.name)
                    }
                }
                else{
                    listToRemove.push({"name": item.name, "id": item.idInput})
                    this.jsonData.removeObjectKeyByPath(this.container,item.name)
                }
                
            }
        }
      })
      listToRemove.forEach(key => {
        const targetProperty = this.configUtils.findObjectByProperty(this.objectFormList, key.id, "idInput")
        this.jsonData.removeObjectKeyByPath(this.container, key.name)
        targetProperty.value = ""
      })
      listToSet.forEach(key => {
        this.jsonData.setObjectKeyByPath(this.container, key.name, key.value)
        const targetProperty = this.configUtils.findObjectByProperty(this.objectFormList, key.id, "idInput")
        targetProperty.value = key.value
      })
      listToSet.forEach(key => {
        const targetProperty = this.configUtils.findObjectByProperty(this.objectFormList, key.id, "idInput")
        this.propertyValidation(targetProperty)
      })
      this.removeDefaultValuesFromJson(params.workingObject)
      this.makeKeyOrder()
      this.jsonDataBox.jsonDataChanged()
    }

    checkIfPropertyMeetsRequirements = (property) => {
        const params = this.jsonData.getParams(this.container)
        for(let i = 0 ; i < property.require.length ; i++) {
          const requireItem = property.require[i]
          const valueInObject = this.jsonData.getValueFromWorkingObject(this.container, requireItem.name)
          const requireObject = this.configUtils.findObjectByProperty(params.config.properties, requireItem.name, "name")
          if((valueInObject && !requireItem.value.includes(valueInObject)) || (requireObject && requireObject.defaultSraj && !requireItem.value.includes(requireObject.defaultSraj)) 
            || (valueInObject === null && requireObject && requireObject.defaultSraj === undefined) ){
              return false
          }
      }
      return true
    }

    isObjectCompatibleWithConfig = (object, config) => {
        const propertiesConfig = config.properties
        if(Array.isArray(object) && object.length > 0 && (typeof object[0] === "object" && config.varType.includes("list") || typeof object[0] !== "object" && !config.varType.includes("list"))){
            return true;
        }
        if(object == null || object == undefined || propertiesConfig == null || propertiesConfig== undefined)
        {
            if(propertiesConfig == undefined && Object.keys(object)[0] == "r" && Object.keys(object)[1] == "g"){
                return true
            } 
            return false
        }
        let currentObj = object;
        for(let key in currentObj) {
            const currentKey = key;
            if(this.extraOptionWords.includes(key)) continue
            else if (!Array.isArray(currentObj[currentKey]) && typeof currentObj[currentKey] == 'object') {
                let newConfig = propertiesConfig.find(obj => obj.name.endsWith(currentKey))
                if(newConfig){
                    newConfig = newConfig.properties || config.properties
                }
                if(!this.isObjectCompatibleWithConfig(currentObj[currentKey], newConfig)){
                    return false
                }
            }
            else if (!config.properties.some(obj => obj.name.includes("."+key))){
                return false
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
            const createdObject = this.createObjectBaseOnConfig(property.properties)
            currentObj[key] = createdObject
          }
          else if((property.inputType!=="empty" || property.hasOwnProperty("defaultInput"))){
            if(property.hasOwnProperty("require") && !this.checkIfPropertyMeetsRequirements(property)){
                break;
            }
            const value = this.jsonData.getValueFromWorkingObject(this.container, property.name)
            if(value !== null){
                const targetProperty = this.configUtils.findObjectByProperty(config, property.name, "name")
                targetProperty.value = value
                currentObj[key] = value
            }
            else{
              currentObj[key] = property.defaultInput !== undefined && property.defaultInput !== null ? property.defaultInput : '';
              const targetProperty = this.configUtils.findObjectByProperty(config, property.name, "name")
              targetProperty.value = currentObj[key]
            }
            if(currentObj[key] === property.defaultSraj){
                delete currentObj[key]
                const targetProperty = this.configUtils.findObjectByProperty(config, property.name, "name")
                targetProperty.value = property.defaultSraj
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
                const params = this.jsonData.getParams(this.container)
                const fileName = (extraOptionName === "behavior" || extraOptionName === "randomFirstIndex" || extraOptionName === "master") ? params.module + extraOptionName.charAt(0).toUpperCase() + extraOptionName.slice(1) : extraOptionName
                const modulePath = extraOption.type ? this.jsonData.moduleConfig.modules.find(object => object.name === fileName && object.type === extraOption.type).path : this.jsonData.moduleConfig.modules.find(object => object.name === fileName).path
                const path = (() => {
                    switch (modulePath) {
                        case 'key':
                            return item.name;
                        case 'fromId':
                            return item.name;

                        default:
                            return modulePath;
                    }
                })()
                const extraOptionValue = this.jsonData.getValueFromWorkingObject(this.container, path)
                extraOption.isUsed = false
                if(Array.isArray(extraOptionValue)){
                    extraOption.isUsed = extraOptionValue.length > 0
                    item.value = extraOptionValue
                }
                else if(extraOptionValue){
                    extraOption.isUsed = typeof extraOptionValue === "object" ? true : false
                    item.value = extraOptionValue
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
            targetProperty.isCollapsed = "collapsed"
            keyCollapsed = "collapsed-key"
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
          let value = data[key];
          const fullKey = prefix + key;
          let foundObject = this.configUtils.findObjectByProperty(this.objectFormList, fullKey, "name")
          if(Array.isArray(value))
          {
            if (value.length === 0 && foundObject && Array.isArray(foundObject.defaultSraj)){
                this.jsonData.removeObjectKeyByPath(this.container, fullKey)
            }
            else{
                value = value.filter(function(value) {
                    return value !== "";
                  });
                  this.jsonData.setObjectKeyByPath(this.container, fullKey, value)
            }
          }
          else if (typeof value === "object" && !Array.isArray(value)) {
            this.removeDefaultValuesFromJson(value, fullKey + ".");
            if(Object.keys(value).length ===0){
                delete data[key]
            }
          }
          else{
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
        if(targetProperty.specialAction){
            this.handleSpecialAction(targetProperty.specialAction, value)
            return
        }
        if(targetProperty.varType.includes("color")){
            const dotIndex = id.lastIndexOf('.');
            const prefix = dotIndex !== -1 ? id.substring(0, dotIndex + 1) : ""
            const r = this.configUtils.findObjectByProperty(this.objectFormList, prefix + "r", "idInput").value
            const g = this.configUtils.findObjectByProperty(this.objectFormList, prefix + "g", "idInput").value
            const b = this.configUtils.findObjectByProperty(this.objectFormList, prefix + "b", "idInput").value
            const hexColor = this.rgbToHex(r, g, b);
            const colorProperty = this.configUtils.findObjectByProperty(this.objectFormList, prefix + "colorPicker" || "colorPicker", "idInput")
            colorProperty.value = hexColor
        }
        this.updateValueInJson(targetProperty, valueInGoodType)
        const params = this.jsonData.getParams("extraOption")
        if((targetProperty.inputType === "string" || targetProperty.inputType === "number") && targetProperty.extraOptions && this.extraOptionIdBox && params && this.configUtils.getKeyNameFromPath(params.path).startsWith(this.configUtils.getKeyNameFromPath(targetProperty.name))){
            this.extraOptionIdBox.clearBox(false)
            this.extraOptionIdBox.objectForm.clearForm()
            targetProperty.extraOptions.forEach(option => option.isUsed = false)
            this.jsonData.deleteParams("extraOption")
        }
        this.jsonDataBox.jsonDataChanged()
        this.objectIdBox.updateNameObjectId(this.container)
    }

    unfocusInput = (id) => {
        const targetProperty = this.configUtils.findObjectByProperty(this.objectFormList, id, "idInput")
        const validationProperty = this.validationItems.find(property => property.validation.some(validate => validate.value === targetProperty.name))
        this.propertyValidation(targetProperty)
        if(validationProperty){
            this.propertyValidation(validationProperty)
        }
        this.hideAndRevealRequiredItems(targetProperty)
        this.objectFormChanged(this.objectFormList)
    }

    checkOption = (id, value) => {
        const targetProperty = this.configUtils.findObjectByProperty(this.objectFormList, id, "idInput")
        targetProperty.options.forEach(option => option.isChecked = false)
        targetProperty.options.find(option => option.name === value).isChecked = true;
        this.updateValueInJson(targetProperty, value)
        targetProperty.value = value
        this.hideAndRevealRequiredItems(targetProperty)
        this.jsonDataBox.jsonDataChanged()
        this.objectFormChanged(this.objectFormList)
        if(targetProperty.name === "id" || targetProperty.name === "name" || targetProperty.name.includes("kind") || targetProperty.name === "action"){
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

    pickColor = (id, color) => {
        const bigint = parseInt(color.substring(1), 16)
        const r = (bigint >> 16) & 255
        const g = (bigint >> 8) & 255
        const b = bigint & 255
        const dotIndex = id.lastIndexOf('.');
        const prefix = dotIndex !== -1 ? id.substring(0, dotIndex) : "color"
        const targetProperty = this.configUtils.findObjectByProperty(this.objectFormList, prefix, "idInput")
        targetProperty.properties[0].value = r,
        targetProperty.properties[1].value = g,
        targetProperty.properties[2].value = b,
        targetProperty.properties[4].value = color,
        this.updateValueInJson(targetProperty.properties[0], targetProperty.properties[0].value)
        this.updateValueInJson(targetProperty.properties[1], targetProperty.properties[1].value)
        this.updateValueInJson(targetProperty.properties[2], targetProperty.properties[2].value)
        const params = this.jsonData.getParams("extraOption")
        if(params && this.configUtils.getKeyNameFromPath(params.path).startsWith(this.configUtils.getKeyNameFromPath(targetProperty.name))){
            targetProperty.properties[0].extraOptions.forEach(option => option.isUsed = false)
            targetProperty.properties[1].extraOptions.forEach(option => option.isUsed = false)
            targetProperty.properties[2].extraOptions.forEach(option => option.isUsed = false)
            this.jsonData.deleteParams("extraOption")
            this.extraOptionIdBox.clearBox(false)
            this.extraOptionIdBox.objectForm.clearForm()
        }
        this.jsonDataBox.jsonDataChanged()
        this.hideAndRevealRequiredItems(targetProperty)
        this.objectFormChanged(this.objectFormList)
    }

    changeStateExtraOption = () => {
        this.objectIdBox.updateNameObjectId(this.container)
        this.hightligthsUsedExtraOption()
        this.hideAndRevealRequiredItems()
        this.objectFormChanged(this.objectFormList)
    }

    updateValueInJson = (targetProperty, value) => {
        if(this.container == "module" && this.extraOptionIdBox){
            this.extraOptionIdBox.clearBox(false)
            this.extraOptionIdBox.objectForm.clearForm()
        }
        if(value !== targetProperty.defaultSraj){
            this.jsonData.setObjectKeyByPath(this.container, targetProperty.name, value)
        }
        else if(value === targetProperty.defaultSraj){
            this.jsonData.removeObjectKeyByPath(this.container, targetProperty.name)
        }
        this.makeKeyOrder()
    }

    clearForm = () => {
        this.objectFormList = []
        this.objectFormChanged(this.objectFormList)
    }

    makeKeyOrder = () => {
        const params = this.jsonData.getParams("module")
        if(params.workingObject.hasOwnProperty("params")){
            this.moveToLastPlaceInJson("params", params.workingObject)
            if(params.workingObject.params.hasOwnProperty("color")){
              this.moveToLastPlaceInJson("params.color", params.workingObject)
            }
          }
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
        if(params.workingObject.hasOwnProperty("data")){
            this.moveToLastPlaceInJson("data", params.workingObject)
            if(params.workingObject.data.hasOwnProperty("holes")){
                this.moveToLastPlaceInJson("data.holes", params.workingObject)
            }   
        }
        if(params.workingObject.hasOwnProperty("case")){
            this.moveToLastPlaceInJson("case", params.workingObject)
        }
        if(params.workingObject.hasOwnProperty("start")){
            this.moveToLastPlaceInJson("start", params.workingObject)
        }
        if(params.workingObject.hasOwnProperty("end")){
            this.moveToLastPlaceInJson("end", params.workingObject)
        }
        if(params.workingObject.hasOwnProperty("list")){
            this.moveToLastPlaceInJson("list", params.workingObject)
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

    handleSpecialAction = async (metaAction, value) => {
        switch (metaAction){
          case "night":
            const nightController = new NightUtils(this, value)
            nightController.fetchConfigAndSetLightPointList()
            break;
        }
      }
}