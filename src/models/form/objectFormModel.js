class ObjectFormModel{
    constructor(jsonData, container, jsonDataBox){
        this.jsonData = jsonData
        this.container = container
        this.jsonDataBox = jsonDataBox
        this.objectFormList = []
        this.fetchConfigAndCreateObjectFormList()
    }

    fetchConfigAndCreateObjectFormList = () => {
        const module = this.jsonData.modulePathParams.module
        fetch(`config/${module}.json`)
        .then(response => response.json())
        .then(config => {
            this.config = config
            this.createObjectFormList(this.config)
            //uzupełnić pola
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
            const propertyObject = this.createObjectProperty(property)
            this.objectFormList.push(propertyObject)
            if(propertyObject.hasOwnProperty("properties")){
                this.createObjectFormList(property)
            }
        }
    }

    createObjectProperty = (property) => {
        const propertyObject = JSON.parse(JSON.stringify(property))
        propertyObject.value = propertyObject.defaultInput
        delete propertyObject.defaultInput
        propertyObject.hide = false
        propertyObject.isError = false
        propertyObject.errorMessage = ""
        
        return propertyObject
    }

    bindObjectFormChanged = (callback) => {
        this.objectFormChanged = callback
    }

}