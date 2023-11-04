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
}