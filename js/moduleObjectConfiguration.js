

function findObjectIndexOnList(module, objectId)
{
    const objectList = dynamicData[module].list
    for (let i = 0; i < objectList.length; i++) {
        if (objectList[i].id === objectId) {
          return i
        }
      }
      return null
}

function removeObjectFromJson(module, objectId)
{
    const objectList = dynamicData[module].list
    const index = findObjectIndexOnList(module, objectId)
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

function updateObjectRadioButton(event)
{
  changeValueInJsonRadioButton(event)

  const targetKey = event.target.name
  
  objectContainer.requiredItems.forEach(item => {
    if(getValueFromObject(item, "require.name") === targetKey)
    {
      if(isItemIncluded(item, "require.value", objectContainer.workingObject, targetKey)) {
        if(item.type === "subkey"){
          const paramName = getLastPartOfTheName(item.name)
          newObject = createObjectBaseOnConfig(item.properties)
          setObjectKeyByPath(paramName, newObject)
          removeDefaultValuesFromJson(objectContainer.workingObject, objectContainer.jsonConfig.properties)
        }
        else {
          setObjectKeyByPath(item.name, item.defaultInput !== undefined && item.defaultInput !== null ? item.defaultInput : '')
        }
      }
      else {
        removeObjectKeyByPath(item.name)
      }
    }
  })
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

function changeValueInJsonRadioButton(event){
  const key = event.target.name
  const newValue = event.target.parentNode.textContent
  changeValueInJson(key, newValue)
}

function changeValueInJsonInput(event){

  const key = event.target.name
  const newValue = getValueInGoodType(event.target.value)

  if(newValue !== null & newValue !== undefined)
  {
    changeValueInJson(key, newValue, event)
  }
  else{
    removeObjectKeyByPath(key)
  }
  updateDynamicDataAndJsonText()
}

function changeValueInJsonCheckbox(event){
  const key = event.target.nextElementSibling.name
  const newValue = event.target.classList.contains("checkbox-checked") ? true : false
  changeValueInJson(key, newValue, event)
  updateDynamicDataAndJsonText()
}

function getValueInGoodType(value){
  newValue = parseFloat(value)
  if (isNaN(newValue))
  {
    newValue = value
  }
  return newValue
}

function changeValueInJson(key, newValue, event)
{
  const keys = key.split('.');

  let currentObj = objectContainer.workingObject;

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
    if(event.target.type==="text")
    {
      const splittedValue = newValue.split(";")
      splittedValue.forEach(value => {
        valuesArray.push(value)
      })
    }
    else{
      const splittedValue = newValue.split(";")
      splittedValue.forEach(value => {
        parsedValue = parseFloat(value)
        valuesArray.push(parsedValue)
      })
    }
    currentObj[lastKey] = valuesArray  
  }
  else{
    currentObj[lastKey] = newValue;
  }
}

function removeObjectKeyByPath(path) {
  const keys = path.split('.');
  let currentObj = objectContainer.workingObject;

  for (let i = 0; i < keys.length - 1; i++) {
    const currentKey = keys[i];
    if (!currentObj[currentKey] || typeof currentObj[currentKey] !== 'object') {
      return;
    }
    currentObj = currentObj[currentKey];
  }

  const lastKey = keys[keys.length - 1];
  if (currentObj && typeof currentObj === 'object' && lastKey in currentObj) {
    if(Object.keys(currentObj).length===1)
    {
      const lastDotIndex = path.lastIndexOf(".");
      const penultimate = path.substring(0, lastDotIndex);
      removeObjectKeyByPath(penultimate)
    }
    else{
      delete currentObj[lastKey];
    }
    
  }
}

function setObjectKeyByPath(path, value) {
  const keys = path.split('.');
  let currentObj = objectContainer.workingObject;

  for (let i = 0; i < keys.length - 1; i++) {
    const currentKey = keys[i];
    if (!currentObj[currentKey] || typeof currentObj[currentKey] !== 'object') {
      currentObj[currentKey] = {};
    }
    currentObj = currentObj[currentKey];
  }

  const lastKey = keys[keys.length - 1];
  currentObj[lastKey] = value;
}

function updateDynamicDataAndJsonText(){
  try{
  dynamicData[currentModule].list[objectContainer.currentIndex] = objectContainer.workingObject
  }
  catch{}
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
    if(property.hasOwnProperty("properties") && property.type !== "table")
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

function removeDefaultValuesFromJson(data, config, prefix = "") {
  for (const key in data) {
    const value = data[key];
    const fullKey = prefix + key;
    let foundObject
    if(key==="case")
    {
      continue
    }
    else if (typeof value === "object") {
      removeDefaultValuesFromJson(value, config, fullKey + ".");
    } else {
      foundObject = findObjectByName(config, fullKey)
      if(foundObject.defaultSraj == data[key] && foundObject.type!=="options")
      {
        removeObjectKeyByPath(fullKey)
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