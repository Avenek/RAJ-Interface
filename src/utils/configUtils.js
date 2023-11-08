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

    getValueInGoodType = (key, value) => {
      const configObject = this.findObjectByProperty(this.config.properties, key, "name")
      if(configObject.inputType === "empty"){
        return
      }
      let newValue = value
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

      if(Array.isArray(configObject.defaultInput)){
        newValue = value.split(";")
        if(configObject.varType.includes("int")){
          newValue.forEach(value => parseInt(value))
        }
        else if(configObject.varType.includes("float")){
          newValue.forEach(value => parseFloat(value))
        }
      }
      return newValue
    }

    getLastPartOfTheName = (fullName) => {
      const dotIndex = fullName.lastIndexOf('.');
      const paramName = dotIndex !== -1 ? fullName.substring(dotIndex + 1) : fullName;
    
      return paramName
    }
}