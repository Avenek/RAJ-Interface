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
  if(container.hasList){
    const objectList = list
    const index = findObjectIndexOnList(objectId, container)
    objectList.splice(index, 1);
  }   
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

  const targetKey = event.target.name
  const listToSet = []
  let allConditionsAreMet
  container.requiredItems.forEach(item => {
    changeValueInJsonRadioButton(event, container)
    allConditionsAreMet = true
    for(let i = 0 ; i < item.require.length ; i++) {
      
      if(getValueFromObject(item.require[i], "name") === targetKey)
      { 
        allConditionsAreMet = true
        if(!(isItemIncluded(item.require[i], "value", container.workingObject, targetKey)))
        {
          allConditionsAreMet = false
          break
        }
      }
      else if((isItemIncluded(item.require[i], "value", container.workingObject, item.require[i].name))){
        allConditionsAreMet = true
      }
      else{
        allConditionsAreMet = false
        break;
      }
    }
      if(allConditionsAreMet) {
        if(item.inputType === "subkey"){
          const paramName = item.name
          const isKeyContainerWithNoList = (container === keyContainer && !container.hasList)
          const newObject = createObjectBaseOnConfig(item.properties, isKeyContainerWithNoList)
          listToSet.push({"name": paramName, "value": newObject})
          container.setObjectKeyByPath(paramName, newObject)
        }
        else if(!listToSet.includes(item)){
          listToSet.push({"name": item.name, "value": item.defaultInput !== undefined && item.defaultInput !== null ? item.defaultInput : ''})
          container.setObjectKeyByPath(item.name, item.defaultInput !== undefined && item.defaultInput !== null ? item.defaultInput : '')
        }
      }
      else {
        container.removeObjectKeyByPath(item.name)
      }
  })
  listToSet.forEach(item => container.setObjectKeyByPath(item.name, item.value))
  changeValueInJsonRadioButton(event, container)
  fillFormFields(container.workingObject)
  removeDefaultValuesFromJson(container.workingObject, container.jsonConfig.properties, container)
  updateDynamicDataAndJsonText()
  container.hideAndRevealRequiredItems()
}

function isItemIncluded(item, path, object, key){
  return getValueFromObject(item, path).includes(getValueFromObject(object, key))
}

function getLastPartOfTheName(fullName){
  const dotIndex = fullName.lastIndexOf('.');
  const paramName = dotIndex !== -1 ? fullName.substring(dotIndex + 1) : fullName;

  return paramName
}

function changeValueInJsonRadioButton(event, container){
  const key = event.target.name
  const newValue = event.target.parentNode.textContent
  changeValueInJson(key, newValue, container)
}

function changeValueInJsonInput(event, container){
  debugger
  const key = event.target.name
  let newValue = event.target.value

  if(newValue !== null & newValue !== undefined)
  {
    changeValueInJson(key, newValue, container)
  }
  else{
    container.removeObjectKeyByPath(key)
  }
  updateDynamicDataAndJsonText()
  container.hideAndRevealRequiredItems()
}

function changeValueInJsonCheckbox(event, container){
  const key = event.target.nextElementSibling.name
  const newValue = event.target.classList.contains("checkbox-checked") ? true : false
  changeValueInJson(key, newValue, container)
  updateDynamicDataAndJsonText()
  container.hideAndRevealRequiredItems()
}

function getValueInGoodType(key, value, container){
  const configObject = findObjectByProperty(container.jsonConfig.properties, key, "name")
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

  return newValue
}


function isInteger(num) {
  return num === Math.floor(num);
}


function changeValueInJson(key, newValue, container){
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
      parsedValue = getValueInGoodType(key, value, container)
      valuesArray.push(parsedValue)
      })
    currentObj[lastKey] = valuesArray  
  }
  else{
    newValue = getValueInGoodType(key, newValue, container)
    currentObj[lastKey] = newValue;
  }
  makeKeyOrder(container)
}

function makeKeyOrder(container){
  if(objectContainer.workingObject.hasOwnProperty("behavior")){
    moveToLastPlaceInJson(container, "behavior")
    if(objectContainer.workingObject.behavior.hasOwnProperty("list")){
      moveToLastPlaceInJson(container, "behavior.list")
    }
  }
  if(objectContainer.workingObject.hasOwnProperty("d")){
    moveToLastPlaceInJson(objectContainer, "d")
    if(objectContainer.workingObject.d.hasOwnProperty("light")){
      moveToLastPlaceInJson(objectContainer, "d.light")
      if(objectContainer.workingObject.d.light.hasOwnProperty("color")){
        moveToLastPlaceInJson(objectContainer, "d.light.color")
      }
    }
  }
}

function moveToLastPlaceInJson(container, path){
  const keys = path.split('.');
  let currentObj = container.workingObject;

  for (let i = 0; i < keys.length - 1; i++) {
    const currentKey = keys[i];
    if (!currentObj[currentKey] || typeof currentObj[currentKey] !== 'object') {
      console.error("Podana ścieżka jest nieprawidłowa. Nie znaleziono podanego klucza. " + path + " " + currentObj);
      return
    }
    currentObj = currentObj[currentKey];
  }
    const lastKey = keys[keys.length - 1];
    currentObj = currentObj[lastKey]
    const temp = currentObj
    container.removeObjectKeyByPath(path)
    container.setObjectKeyByPath(path, temp)
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
  saveJsonState()
}

function createObjectBaseOnConfig(config, isKeyContainerWithNoList) {
  let result = {};

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
  let topLevelKeys = Object.keys(result);
  if(isKeyContainerWithNoList){
    result = result[topLevelKeys[0]]
    topLevelKeys = Object.keys(result);
  }
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
      foundObject = findObjectByProperty(config, fullKey, "name")
      if(foundObject && foundObject.defaultSraj === data[key])
      {
        container.removeObjectKeyByPath(fullKey)
      }
    }
  }
  updateDynamicDataAndJsonText()
}

function findObjectByProperty(properties, targetName, property) {
  for (const prop of properties) {
    if (prop[property] === targetName) {
      return prop;
    }
    if (prop.properties) {
      const foundProp = findObjectByProperty(prop.properties, targetName, property);
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
          //currentObj[currentKey] = {};
          return
        }
        currentObj = currentObj[currentKey];
      }
      const lastKey = keys[keys.length - 1];
      return currentObj[lastKey]
  }
  return currentObj
} 
