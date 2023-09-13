

function findObjectIndexOnList(objectId, container)
{
    const objectList = container.list
    switch(container.name){
      case "case":
        for (let i = 0; i < objectList.length; i++) {
          if (objectList[i].kind === objectId) {
            return i
          }
        }
        break;
      default:
        for (let i = 0; i < objectList.length; i++) {
          if (objectList[i].id === objectId) {
            return i
          }
        }
        for (let i = 0; i < objectList.length; i++) {
          if (objectList[i].name === objectId) {
            return i
          }
        }
    }
    return null     
}

function removeObjectFromJson(objectId, list, container)
{
    const objectList = list
    const index = findObjectIndexOnList(objectId, container)
    objectList.splice(index, 1);
}

function getValueFromObject(obj, key) {
  const keys = key.split('.');
  let value = obj;
  
  for (const k of keys) {
    if (value && value.hasOwnProperty(k)) {
      value = value[k];
    } 
    else {
      return null;
    }
  }
  return value;
}

function updateObjectRadioButton(event, container)
{
  const objects = document.querySelectorAll(`input[name='${event.target.name}']`)
      objects.forEach(object => {
          object.checked = false;
      })
    event.target.checked = true;

  changeValueInJsonRadioButton(event, container)

  const targetKey = event.target.name
  const listToSet = []
  container.requiredItems.forEach(item => {
    if(getValueFromObject(item, "require.name") === targetKey)
    {
      if(isItemIncluded(item, "require.value", container.workingObject, targetKey)) {

        if(item.inputType === "subkey"){
          const paramName = getLastPartOfTheName(item.name)
          newObject = createObjectBaseOnConfig(item.properties)
          container.setObjectKeyByPath(paramName, newObject)
          removeDefaultValuesFromJson(container.workingObject, container.jsonConfig.properties, container)
        }
        else {
          listToSet.push(item)
        }
      }
      else {
        container.removeObjectKeyByPath(item.name)
      }
    }
  })
  listToSet.forEach(item => container.setObjectKeyByPath(item.name, item.defaultInput !== undefined && item.defaultInput !== null ? item.defaultInput : ''))
  updateDynamicDataAndJsonText()
}

function isItemIncluded(item, path, object, key){
  return getValueFromObject(item, path).includes(getValueFromObject(object, key))
}

function getLastPartOfTheName(fullName){
  const dotIndex = fullName.indexOf('.');
  const paramName = dotIndex !== -1 ? fullName.substring(dotIndex + 1) : fullName;

  return paramName
}

function changeValueInJsonRadioButton(event, container){
  const key = event.target.name
  const newValue = event.target.parentNode.textContent
  changeValueInJson(key, newValue, container)
}

function changeValueInJsonInput(event, container){
  const key = event.target.name
  let newValue = event.target.value

  if(newValue !== null & newValue !== undefined)
  {
    newValue = getValueInGoodType(key, newValue, container)
    changeValueInJson(key, newValue, container)
  }
  else{
    container.removeObjectKeyByPath(key)
  }
  updateDynamicDataAndJsonText()
}

function changeValueInJsonCheckbox(event, container){
  const key = event.target.nextElementSibling.name
  const newValue = event.target.classList.contains("checkbox-checked") ? true : false
  changeValueInJson(key, newValue, container)
  updateDynamicDataAndJsonText()
}

function getValueInGoodType(key, value, container){
  const configObject = findObjectByName(container.jsonConfig.properties, key)
  let newValue = value
  if(configObject.varType === "number")
  {
    newValue = parseFloat(value)
    if (isNaN(newValue))
    {
      newValue = value
      console.error("Podana wartość nie jest liczbą!");
    }
  }
  return newValue
}

function changeValueInJson(key, newValue, container)
{
  const keys = key.split('.');
  let currentObj = container.workingObject;
  for (let i = 0; i < keys.length - 1; i++) {
    const currentKey = keys[i];
    if (!currentObj[currentKey] || typeof currentObj[currentKey] !== 'object') {
      currentObj[currentKey] = {};
    }
    currentObj = currentObj[currentKey];
  }

  const lastKey = keys[keys.length - 1];
  if(Array.isArray(currentObj[lastKey]))
  {
    valuesArray = []
    newValue = newValue.toString()
    const splittedValue = newValue.split(";")
    splittedValue.forEach(value => {
      parsedValue = getValueInGoodType(keys, value, container)
      valuesArray.push(parsedValue)
      })
    currentObj[lastKey] = valuesArray  
  }
  else{
    currentObj[lastKey] = newValue;
  }
}

function updateDynamicDataAndJsonText(){
  if(objectContainer.workingObject){
    if(objectContainer.hasList && dynamicData[currentModule]) {
      dynamicData[currentModule].list = objectContainer.list
    }
    else {
      dynamicData[currentModule] = objectContainer.workingObject
    }
  }
  updateJsonTextArea()
}

function createObjectBaseOnConfig(config) {
  const result = {};

  for (const property of config) {
    const keys = property.name.split('.');
    const paramName = keys.pop();
    let currentObj = result;

    for (const key of keys) {
      if (!currentObj[key] || typeof currentObj[key] !== 'object') {
        currentObj[key] = {};
      }
      currentObj = currentObj[key];
    }
    if(property.hasOwnProperty("properties") && property.inputType !== "table")
    {
      const createdObject = createObjectBaseOnConfig(property.properties)
      const topLevelKeys = Object.keys(createdObject);
      if(topLevelKeys.length>0){
        currentObj[paramName] = createdObject[topLevelKeys[0]]
      }
      else{
      currentObj[paramName] = createdObject
      }
    }
    else{
    currentObj[paramName] = property.defaultInput !== undefined && property.defaultInput !== null ? property.defaultInput : '';
    }
  }
  const topLevelKeys = Object.keys(result);
  return result[topLevelKeys[0]];
}

function removeDefaultValuesFromJson(data, config, container, prefix = "") {
  for (const key in data) {
    const value = data[key];
    const fullKey = prefix + key;
    let foundObject
    if(key==="case")
    {
      continue
    }
    else if (typeof value === "object") {
      removeDefaultValuesFromJson(value, config, container, fullKey + ".");
    } else if(config) {
      foundObject = findObjectByName(config, fullKey)
      if(foundObject && foundObject.defaultSraj == data[key] && foundObject.inputType!=="options")
      {
        container.removeObjectKeyByPath(fullKey)
      }
    }
  }
  updateDynamicDataAndJsonText()
}

function findObjectByName(properties, targetName) {
  for (const prop of properties) {
    if (prop.name === targetName) {
      return prop;
    }
    if (prop.properties) {
      const foundProp = findObjectByName(prop.properties, targetName);
      if (foundProp) {
        return foundProp;
      }
    }
  }
}

function findObjectByPath(object, path){
  if(path)
  {
    const keys = path.split('.');
      let currentObj = object;

      for (let i = 0; i < keys.length - 1; i++) {
        const currentKey = keys[i];
        if (!currentObj[currentKey] || typeof currentObj[currentKey] !== 'object') {
          currentObj[currentKey] = {};
        }
        currentObj = currentObj[currentKey];
      }
      const lastKey = keys[keys.length - 1];
      return currentObj[lastKey]
  }
  return currentObj

}