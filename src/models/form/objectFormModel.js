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
            this.objectFormChanged()
        })
        .catch(error => {
        console.error('Błąd pobierania:', error);
        })
    }

    createObjectFormList = (config) => {
        for (const property of config.properties) {
            this.createObjectProperty(property)
            this.objectFormList.push(property)
        }
        this.requiredItems = this.findReuqiredItems(this.objectFormList)
        this.hideAndRevealRequiredItems()
        console.log(this.objectFormList);
    }

    createObjectProperty = (property) => {
        for(const prop of property.properties){
            prop.hide = false
            this.fillPropertyValue(prop)
            this.propertyValidation(prop)
            if(prop.extraOptions)
            {
                this.hightligthsUsedExtraOption(prop)
            }
            propertyObject.isCollapsed = prop.defaultCollapsed ? true : false
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

    findReuqiredItems = (objectFormList) => {
        let objectsWithRequire = [];
        if (typeof objectFormList === 'object') {
          if (objectFormList.hasOwnProperty('require')) {
            objectsWithRequire.push(objectFormList);
          }
      
          for (let key in objectFormList) {
            if (objectFormList.hasOwnProperty(key) && objectFormList[key] ) {
              objectsWithRequire = objectsWithRequire.concat(this.findReuqiredItems(objectFormList[key]));
            }
          }
        }
        return objectsWithRequire
    }

    hideAndRevealRequiredItems()
    {
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

}