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
        this.objectFormChanged()
    }

    createObjectProperty = (property) => {
        for(const prop of property.properties){
            prop.hide = false
            this.fillPropertyValue(prop)
            this.propertyValidation(prop)
        } 
    }

    fillPropertyValue = (propertyObject) => {
        const value = this.jsonData.getValueFromWorkingObject(this.container, propertyObject.name) || propertyObject.defaultInput
        if(propertyObject.inputType === "options"){
            propertyObject.options.forEach(option => {
                option.isChecked = option.name === value
              });
        }
        else if(value){
            propertyObject.value = value
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
      let allConditionsAreMet
      this.requiredItems.forEach(item => {
        allConditionsAreMet = true
          for(let i = 0 ; i < item.require.length ; i++) {
            const valueInObject = this.jsonData.getValueFromWorkingObject(this.container, item.require[i].name)
            const requireObject = this.configUtils.findObjectByProperty(this.config.properties, item.require[i].name, "name")
            if(valueInObject){
                if(!item.require[i].value.includes(valueInObject)){
                allConditionsAreMet = false
                break;
                }
            }
            else if(requireObject && requireObject.defaultSraj && !item.require[i].value.includes(requireObject.defaultSraj)){
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

}