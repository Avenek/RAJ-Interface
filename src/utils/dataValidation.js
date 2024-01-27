class DataValidation{
    constructor(property, jsonData, container, configUtils) {
        this.property = property
        this.jsonData = jsonData
        this.container = container
        this.configUtils = configUtils
    }

    validateData = () => {
        const value = this.property.value
        let validSummary = {"isValid": true, "errorMessage": ""}
        if(this.property.inputType === "string" || this.property.inputType === "number"){
            if(!this.property.canBeEmpty && value.length === 0){
                validSummary.isValid = false
                validSummary.errorMessage = "Wartość tego pola nie może być pusta!"
                return validSummary
            }
            else if(!this.property.canBeEmpty || this.property.validation){
                let valuesArray = this.convertValueToArray(value)
                valuesArray.forEach(value => {
                    let valueType = this.checkValueType(value)
                    if(this.property.varType.includes(valueType) && valueType !== "object" && this.property.validation){
                        for(const valid of this.property.validation){
                            validSummary = this.checkCondition(valid, this.property, value)
                            if(!validSummary.isValid){
                                return validSummary
                            }
                        }
                    }
                    else if(valueType !== "object" && !this.property.varType.includes(valueType) && !this.property.canBeEmpty){
                        validSummary.isValid = false
                        validSummary.errorMessage = `Wartość tego pola posiada zły typ! Dozwolone typy dla tego pola to: ${this.property.varType.join(", ")}`
                        return validSummary
                    }
                })
            }
        }
        return validSummary
    }

    convertValueToArray = (value) => {
        let valuesArray = []
        if(value.length > 0 && Array.isArray(value)){
            valuesArray = value
        }
        else{
            valuesArray.push(value)
        }

        return valuesArray
    }

    checkValueType = (value) => {
        let valueType = typeof value
        if(valueType === "number"){
          valueType =  this.isInteger(value) ? "int" : "float"
        }
        return valueType
    }

    isInteger = (value) => {
        return value === Math.floor(value);
    }

    checkCondition = (valid, property, value) => {
        const valueType = this.checkValueType(value)
        let validSummary = {"isValid": true, "errorMessage": ""}
        if(valid.forType === valueType){
            switch(valid.name){
              case "minMax":
                validSummary = this.minMaxValid(value)
                break;
              case "unique":
                validSummary = this.uniqueValid(value, property.name)
                break;
              case "notEqual":
                validSummary = this.notEqualValid(valid, value)
                break;
              case "equal":
                validSummary = this.equalValid(valid, value)
                break;
              case "moreThan":
                validSummary = this.moreThanValid(valid, value)
                  break;
              case "lessThan":
                validSummary = this.lessThanValid(valid, value)
                  break;
              default:
                break;
            } 
          } 
          return validSummary
    }

    minMaxValid = (value) => {
        const isValid = value >= this.property.min && value <= this.property.max
        const errorMessage = isValid ? "" : `Wartość powinna zawierać się w przedziale od ${this.property.min} do ${this.property.max}!` 
        return {"isValid": isValid, "errorMessage": errorMessage}
    }
      
    uniqueValid = (value, key) => {
        const jsonDataParams = this.jsonData.getParams(this.container)
        for(let i=0 ; i < jsonDataParams.workingList.length ; i++){
            let objectValue = this.jsonData.getValueFromObject(jsonDataParams.workingList[i], key)
            if(objectValue === value && i != jsonDataParams.objectId){
              return {"isValid": false, "errorMessage": "Wartość tego pola powinna być unikalna i nie może się powtarzać w innych obiektach!"}
            }
        }
        return {"isValid": true, "errorMessage": ""}
    }
      
    notEqualValid = (validObject, value) => {
        const isValid = !validObject.value.includes(value)
        const errorMessage = isValid ? "" : `Wartość tego pola powinna być różna od ${validObject.value.join(", ")}!`   
        return {"isValid": isValid, "errorMessage": errorMessage}
    }
      
    equalValid = (validObject, value) => {
        const isValid = validObject.value.includes(value)
        const errorMessage = isValid ? "" : `Wartość tego pola powinna być równa jednej z podanych wartości: ${validObject.value.join(", ")}!`   
        return {"isValid": isValid, "errorMessage": errorMessage}
    }
    
    moreThanValid = (validObject, value) => {
        let errorMessage = ""
        let isValid
        if(typeof validObject.value === "number"){
            isValid = value > validObject.value
            errorMessage = isValid ? "" : `Wartość tego pola powinna być większa od wartości ${validObject.value}!`
        }
        else{
            let validValue = this.jsonData.getValueFromWorkingObject(this.container, validObject.value)
            if(validValue === null || validValue === NaN || validValue === undefined){
                validValue = this.configUtils.findObjectByProperty(this.configUtils.config.properties, validObject.value, "name").defaultSraj
            }
            isValid = value > validValue
            errorMessage = isValid ? "" : `Wartość tego pola powinna być większa od wartości klucza ${validObject.value}!`
        }

        return {"isValid": isValid, "errorMessage": errorMessage}
    }
    
    lessThanValid = (validObject, value) => {
        let errorMessage = ""
        let isValid
        if(typeof validObject.value === "number"){
            isValid = value < validObject.value
            errorMessage = isValid ? "" : `Wartość tego pola powinna być mniejsza od wartości ${validObject.value}!`
        }
        else{
            let validValue = this.jsonData.getValueFromWorkingObject(this.container, validObject.value)
            if(validValue === null || validValue === NaN || validValue === undefined){
                validValue = this.configUtils.findObjectByProperty(this.configUtils.config.properties, validObject.value, "name").defaultSraj
            }
            isValid = value < validValue
            errorMessage = isValid ? "" : `Wartość tego pola powinna być mniejsza od wartości klucza ${validObject.value}!`
        }
        return {"isValid": isValid, "errorMessage": errorMessage}
    }
}