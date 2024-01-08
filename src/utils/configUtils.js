class ConfigUtils{
    constructor(config){
        this.config = config
    }

    findObjectByProperty = (properties, targetName, property) => {
        for (const prop of properties) {
          if (prop[property] === targetName) {
            return prop;
          }
          if (prop.properties) {
            const foundProp = this.findObjectByProperty(prop.properties, targetName, property);
            if (foundProp) {
              return foundProp;
            }
          }
        }
      }

    getValueInGoodType = (key, value, isArray = true) => {
      const configObject = this.findObjectByProperty(this.config.properties, key, "name")
      if(configObject.inputType === "empty"){
        return
      }
      let newValue = value
      if(Array.isArray(configObject.defaultInput) && isArray){
        newValue = value.split(";")
        for(let i=0; i<newValue.length ; i++) {
          newValue[i] = this.getValueInGoodType(key, newValue[i], false)
        }
          return newValue
      }
      if(configObject.varType.includes("boolean")){
        if(newValue === "false")
        {
          newValue = false
          return newValue
        }
        else if(newValue==="true")
        {
          newValue = true
          return newValue
        }
      }
    
      if(configObject.varType.includes("float")){
        newValue = parseFloat(value)
          if (isNaN(newValue))
          {
            newValue = value
          }
          return newValue
      }
    
      if(configObject.varType.includes("int")){
        newValue = parseInt(value)
        if (isNaN(newValue))
        {
          newValue = value
        }
        return newValue
      }
      return newValue
    }

    formatToCamelCase = (inputString) => {
      if (inputString.includes(' ')) {
          const formattedArray = inputString.split(' ')
          for(let i = 1; i< formattedArray.length ; i++){
            formattedArray[i] = formattedArray[i].charAt(0).toUpperCase() + formattedArray[i].slice(1);
          }
          const formattedString = formattedArray.join('');
  
          return formattedString;
      } 
      else {
          return inputString;
      }
  }

    getLastPartOfTheName = (fullName) => {
      const dotIndex = fullName.lastIndexOf('.');
      const paramName = dotIndex !== -1 ? fullName.substring(dotIndex + 1) : fullName;
    
      return paramName
    }

    getKeyNameFromPath = (fullName) => {
      const dotIndex = fullName.lastIndexOf('.');
      const paramName = dotIndex !== -1 ? fullName.substring(0, dotIndex) : fullName;
    
      return paramName
    }
}