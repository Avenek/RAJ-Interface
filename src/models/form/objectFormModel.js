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
            if(prop.validation){
                this.propertyValidation(prop)
            }
        } 
    }

    fillPropertyValue = (propertyObject) => {
        let keyValue = this.jsonData.getValueFromWorkingObject(this.container, propertyObject.name) || propertyObject.defaultSraj || propertyObject.defaultInput
        if(propertyObject.inputType === "options"){
            propertyObject.options.forEach(option => {
                option.isChecked = option.name === keyValue
              });
        }
        else if(keyValue !== null && keyValue !== undefined){
            propertyObject.value = keyValue
        }
        
    }

    propertyValidation = (property) => {
        const dataValidation = new DataValidation(property, this.jsonData, this.container)
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
        }
        item.hide = !allConditionsAreMet
      })
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
        const configUtils = new ConfigUtils(this.config)
        const targetProperty = configUtils.findObjectByProperty(this.objectFormList, id, "idInput")
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

}