let workingObject = {}

function findObjectIndexOnList(module, objectId)
{
    const objectList = dynamicData[module].list
    for (let i = 0; i < objectList.length; i++) {
        if (objectList[i].id === objectId) {
          return i
        }
      }
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
    } else {
      return null;
    }
  }
  
  return value;
}

function updateObjectRadioButton(event)
{
  changeValueInJsonRadioButton(event)

  const targetKey = event.target.name
  
  requiredItems.forEach(item => {
    if(getValueFromObject(item, "require.name") === targetKey)
    {

      if(item.type === "subkey")
      {
        if(getValueFromObject(item, "require.value").includes(getValueFromObject(workingObject, targetKey)))
        {
          fullName = item.name
          const dotIndex = fullName.indexOf('.');
          const paramName = dotIndex !== -1 ? fullName.substring(dotIndex + 1) : fullName;
          newObject = createObjectBaseOnConfig(item.properties)
          setObjectKeyByPath(paramName, newObject)
        }
      }
      else {
        if(getValueFromObject(item, "require.value").includes(getValueFromObject(workingObject, targetKey)))
        {
          setObjectKeyByPath(item.name, item.default !== undefined && item.default !== null ? item.default : '')
        }
        else{
          removeObjectKeyByPath(item.name)
        }
      }
      
    }
  })
  updateDynamicDataAndJsonText()
}

function changeValueInJsonRadioButton(event){
  const key = event.target.name
  const newValue = event.target.parentNode.textContent
  changeValueInJson(key, newValue)

}

function changeValueInJsonInput(event){

  const key = event.target.name
  let newValue
  newValue = parseFloat(event.target.value)
  if (isNaN(newValue))
  {
    newValue = event.target.value
  }
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

function changeValueInJson(key, newValue, event)
{
  const keys = key.split('.');

  let currentObj = workingObject;

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
  let currentObj = workingObject;

  for (let i = 0; i < keys.length - 1; i++) {
    const currentKey = keys[i];
    if (!currentObj[currentKey] || typeof currentObj[currentKey] !== 'object') {
      console.log("Brak podanego klucza.");
      return;
    }
    currentObj = currentObj[currentKey];
  }

  const lastKey = keys[keys.length - 1];
  if (currentObj && typeof currentObj === 'object' && lastKey in currentObj) {
    delete currentObj[lastKey];
  }
}

function setObjectKeyByPath(path, value) {
  const keys = path.split('.');
  let currentObj = workingObject;

  for (let i = 0; i < keys.length - 1; i++) {
    const currentKey = keys[i];
    if (!currentObj[currentKey] || typeof currentObj[currentKey] !== 'object') {
      // Jeśli obiekt podrzędny nie istnieje lub nie jest obiektem, utwórz go.
      currentObj[currentKey] = {};
    }
    currentObj = currentObj[currentKey];
  }

  const lastKey = keys[keys.length - 1];
  currentObj[lastKey] = value;
}

function updateDynamicDataAndJsonText(){
  dynamicData[currentModule].list[objectIndex] = workingObject
  updateJsonTextArea()
}

function createObjectBaseOnConfig(config) {
  const result = {};

  for (const property of config) {
    const keys = property.name.split('.');
    const paramName = keys.pop(); // Pobierz ostatni segment jako nazwę parametru
    let currentObj = result;

    for (const key of keys) {
      if (!currentObj[key] || typeof currentObj[key] !== 'object') {
        currentObj[key] = {};
      }
      currentObj = currentObj[key];
    }
    if(property.hasOwnProperty("properties") && property.type !== "table")
    {
      currentObj[paramName] = createObjectBaseOnConfig(property.properties)
    }
    else{
    currentObj[paramName] = property.default !== undefined && property.default !== null ? property.default : '';
    }
  }
  const topLevelKeys = Object.keys(result);
  
  return result[topLevelKeys[0]];
}

