function findObjectIndexOnList(object, container)
{
  const objectListContainer = document.querySelector(`.${container.listClassName}`)
    const objects = objectListContainer.querySelectorAll(".object-list-element")
   for(let i = 0 ; i < objects.length ; i ++){
    if(object === objects[i]){
      return i
    }
   }
   return null
}

function findObjectIndexOnListById(objectId, container)
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

function removeObjectFromJson(object, list, container)
{
  if(container.hasList){
    const objectList = list
    const index = findObjectIndexOnList(object, container)
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
  removeAndAddKeysByRequirements(event, container, event.target.type)
  changeValueInJsonRadioButton(event, container)
  removeDefaultValuesFromJson(container.workingObject, container.jsonConfig.properties, container)
  fillFormFields(container)
  hightligthsUsedExtraOption(container)
  const button = document.querySelector(".menu-active")
  if(button){
    const isUsed = isExtraButtonUsed(button, container)
    if(!isUsed){
      clearKeyContainers()
    }
  }
  updateDynamicDataAndJsonText()
  container.hideAndRevealRequiredItems()
  container.inputList.forEach(input => isDataValid(container, input))
}

function removeAndAddKeysByRequirements(event, container, inputType){
  const targetKey = event.target.name
  const listToSet = []
  let allConditionsAreMet
  container.requiredItems.forEach(item => {
    if(inputType === "radio"){
      changeValueInJsonRadioButton(event, container)
    }
    else if(inputType === "checkbox"){
      const key = event.target.nextElementSibling.name
      const newValue = event.target.classList.contains("checkbox-checked") ? true : false
      changeValueInJson(key, newValue, container)
    }
    let idInput 
    if(event.target.getAttribute('data-name')){
      idInput = event.target.getAttribute('data-name')
    }
    else if(event.target.parentNode.firstChild.nextElementSibling.nextElementSibling.getAttribute('id')){
     idInput = event.target.parentNode.firstChild.nextElementSibling.nextElementSibling.getAttribute('id')
    }
    if(idInput !== item.idInput){
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
          const newObject = createObjectBaseOnConfig(item.properties, container)
          listToSet.push({"name": paramName, "value": newObject})
          container.setObjectKeyByPath(paramName, newObject)
        }
        else if(!listToSet.includes(item) && item.inputType !== "empty"){
          let isValueCorrect = false
          let value = getValueFromObject(container.workingObject, item.name)
          if(item.inputType === "options")
          {
            for(let i = 0 ; i < item.options.length ; i++){
              if(item.options[i].name === value){
                isValueCorrect = true
                break;
              }
              else{
                isValueCorrect = false
              }
            }
          }
          if(value === null || !isValueCorrect){
            value = item.defaultInput !== undefined && item.defaultInput !== null ? item.defaultInput : ''
          }
          listToSet.push({"name": item.name, "value": value})
          container.setObjectKeyByPath(item.name, value)
        }
      }
      else {
        container.removeObjectKeyByPath(item.name)
      }
    }
  })
  listToSet.forEach(item => container.setObjectKeyByPath(item.name, item.value))
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
  const key = event.target.name
  let newValue = event.target.value

  if(newValue !== null && newValue !== undefined)
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
  removeAndAddKeysByRequirements(event, container, event.target.type)
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
  debugger
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
  makeKeyOrder()
}

function makeKeyOrder(){
  if(objectContainer.workingObject.hasOwnProperty("behavior")){
    moveToLastPlaceInJson("behavior")
    if(objectContainer.workingObject.behavior.hasOwnProperty("list")){
      moveToLastPlaceInJson("behavior.list")
    }
  }
  if(objectContainer.workingObject.hasOwnProperty("d")){
    moveToLastPlaceInJson("d")
    if(objectContainer.workingObject.d.hasOwnProperty("light")){
      moveToLastPlaceInJson("d.light")
      if(objectContainer.workingObject.d.light.hasOwnProperty("color")){
        moveToLastPlaceInJson("d.light.color")
      }
    }
    if(objectContainer.workingObject.d.hasOwnProperty("behavior")){
      moveToLastPlaceInJson("d.behavior")
      if(objectContainer.workingObject.d.behavior.hasOwnProperty("list")){
        moveToLastPlaceInJson("d.behavior.list")
      }
    }
  }
  if(objectContainer.workingObject.hasOwnProperty("source")){
    moveToLastPlaceInJson("source")
  }
  if(keyContainer && keyContainer.workingObject.hasOwnProperty("external_properties")){
    moveToLastPlaceInJson("external_properties", keyContainer)
  }
}

function moveToLastPlaceInJson(path, container = objectContainer){
  const keys = path.split('.');
  let currentObj = container.workingObject

  for (let i = 0; i < keys.length - 1; i++) {
    const currentKey = keys[i];
    if (!currentObj[currentKey] || typeof currentObj[currentKey] !== 'object') {
      console.error("Podana ścieżka jest nieprawidłowa. Nie znaleziono podanego klucza. " + path);
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

function createObjectBaseOnConfig(config, container) {
  let result = {};
  let currentObj = result;
  for (const property of config) {
    const key = getLastPartOfTheName(property.name)
    if(property.hasOwnProperty("properties"))
    {
      const createdObject = createObjectBaseOnConfig(property.properties, container)
      currentObj[key] = createdObject
    }
    else if(property.inputType!=="empty" || property.hasOwnProperty("defaultInput")){
      const value = getValueFromObject(container.workingObject, property.name)
      if(value !== null){
        currentObj[key] = value
      }
      else{
        currentObj[key] = property.defaultInput !== undefined && property.defaultInput !== null ? property.defaultInput : '';
      }
    
    }
  }
  return result
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
