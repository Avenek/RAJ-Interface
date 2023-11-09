class ObjectFormModel{
    constructor(jsonData, container, jsonDataBox){
        this.jsonData = jsonData
        this.container = container
        this.jsonDataBox = jsonDataBox
        this.objectFormList = []
        this.fetchConfigAndCreateObjectFormList()
    }

    bindObjectFormChanged = (callback) => {
        this.objectFormChanged = callback
    }

    fetchConfigAndCreateObjectFormList = () => {
        const module = this.jsonData.modulePathParams.module
        fetch(`config/${module}.json`)
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
    }

    createObjectProperty = (property) => {
        for(const prop of property.properties){
            if(prop.properties){
                this.createObjectProperty(prop)
            }
            prop.hide = false
            this.fillPropertyValue(prop)
            this.addExpandedKey(prop)
            if(prop.validation){
                this.propertyValidation(prop)
            }
        } 
    }

    fillPropertyValue = (propertyObject) => {
        let keyValue = this.jsonData.getValueFromWorkingObject(this.container, propertyObject.name) || propertyObject.defaultSraj || propertyObject.defaultInput
        if(keyValue !== null && keyValue !== undefined){
            propertyObject.value = keyValue
        }
        
    }

    propertyValidation = (property) => {
        const dataValidation = new DataValidation(property, this.jsonData, this.container, this.configUtils)
        const validateSummary = dataValidation.validateData()
        property.isValid = validateSummary.isValid
        property.errorMessage = validateSummary.errorMessage
    }

    findItemsByProperty = (objectFormList, property) => {
        let objectsWithRequire = [];
        if (typeof objectFormList === 'object') {
          if (objectFormList.hasOwnProperty(property)) {
            objectsWithRequire.push(objectFormList);
          }
          for (let key in objectFormList) {
            if (objectFormList.hasOwnProperty(key) && objectFormList[key] ) {
              objectsWithRequire = objectsWithRequire.concat(this.findItemsByProperty(objectFormList[key], property));
            }
          }
        }
        return objectsWithRequire
    }

    hideAndRevealRequiredItems = () => {
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
        if(allConditionsAreMet && this.jsonData.getValueFromWorkingObject(this.container, item.name) === null)
        {
            if(item.properties){
                const valueObject = this.createObjectBaseOnConfig(item.properties)
                this.jsonData.setObjectKeyByPath(this.container, item.name, valueObject)
                listToSet.push({"name": item.name, "id": item.idInput, "value": valueObject})
            }
            else{
                this.jsonData.setObjectKeyByPath(this.container, item.name, item.defaultInput)
                listToSet.push({"name": item.name,  "id": item.idInput, "value": item.defaultInput})
            }
            
        }
        else if(allConditionsAreMet){
            const value = this.jsonData.getValueFromWorkingObject(this.container, item.name)
            listToSet.push({"name": item.name, "id": item.idInput, "value": value})
        } 
        else if(!allConditionsAreMet){
            this.jsonData.removeObjectKeyByPath(this.container, item.name)
            const targetProperty = this.configUtils.findObjectByProperty(this.objectFormList, item.idInput, "idInput")
            targetProperty.value = ""
        }
      })
      listToSet.forEach(key => {
        this.jsonData.setObjectKeyByPath(this.container, key.name, key.value)
        const targetProperty = this.configUtils.findObjectByProperty(this.objectFormList, key.id, "idInput")
        targetProperty.value = key.value
      })
      this.jsonDataBox.jsonDataChanged()
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
                let path = item.inputType === "empty" ? item.name + "." + extraOption.name : extraOption.name
                const extraOptionValue = this.jsonData.getValueFromWorkingObject(this.container, path)
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

    enterValue = (id, value) => {
        const targetProperty = this.configUtils.findObjectByProperty(this.objectFormList, id, "idInput")
        const valueInGoodType = this.configUtils.getValueInGoodType(targetProperty.name, value)
        targetProperty.value = valueInGoodType
        this.updateValueInJson(targetProperty, valueInGoodType)
        targetProperty.value = valueInGoodType
        this.jsonDataBox.jsonDataChanged()
    }

    unfocusInput = (id) => {
        const targetProperty = this.configUtils.findObjectByProperty(this.objectFormList, id, "idInput")
        if(targetProperty.validation){
            this.propertyValidation(targetProperty)
        }
        this.hideAndRevealRequiredItems()
        this.objectFormChanged(this.objectFormList)
    }

    checkOption = (id, value) => {
        const targetProperty = this.configUtils.findObjectByProperty(this.objectFormList, id, "idInput")
        targetProperty.options.forEach(option => option.isChecked = false)
        targetProperty.options.find(option => option.name === value).isChecked = true;
        this.updateValueInJson(targetProperty, value)
        targetProperty.value = value
        this.jsonDataBox.jsonDataChanged()
        this.hideAndRevealRequiredItems()
        this.objectFormChanged(this.objectFormList)
    }

    checkSlider = (id) => {
        const targetProperty = this.configUtils.findObjectByProperty(this.objectFormList, id, "idInput")
        targetProperty.value = !targetProperty.value
        this.updateValueInJson(targetProperty, targetProperty.value)
        this.jsonDataBox.jsonDataChanged()
        this.hideAndRevealRequiredItems()
        this.objectFormChanged(this.objectFormList)
    }

    updateValueInJson = (targetProperty, value) => {
        if(value !== targetProperty.defaultSraj){
            this.jsonData.setObjectKeyByPath(this.container, targetProperty.name, value)
        }
        else if(value === targetProperty.defaultSraj){
            this.jsonData.removeObjectKeyByPath(this.container, targetProperty.name)
        }
    }

    clearForm = () => {
        this.objectFormList = []
        this.objectFormChanged(this.objectFormList)
    }
}