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
            this.createObjectFormList(this.config)
            console.log(this.objectFormList);
            //Sprawdzić wymagania - dodać hide
            //Zwalidować dane
            //Podświetlić extra-option
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
    }

    createObjectProperty = (property) => {
        for(const prop of property.properties){
            this.fillPropertyValue(prop)
            this.propertyValidation(prop)
        }






            /*
            if(propertyObject.extraOptions)
            {
                this.hightligthsUsedExtraOption(propertyObject)
            }
        propertyObject.isCollapsed = this.isPropertyCollapsed(propertyObject)
        propertyObject.hide = this.ifMeetsRequirements(propertyObject)*/
        
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

}