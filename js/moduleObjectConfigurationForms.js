function createObjectConfigurationContainer(config)
{
    let html = ''
    for (const property of config.properties) {
        if(property.inputType === "key" || property.inputType === "subkey" || property.inputType === "subSubkey"){
        html += `<div class="${property.inputType}">
        <header data-name="${property.name}">${property.name.substring(property.name.indexOf(".")+1).toUpperCase()}</header></div><div class="key-menu">`
        html+=createObjectConfigurationContainer(property)
        continue;
        }
        else if (property.inputType === 'options') {
            html+=`<div class="key-value"><header class="property-name">${property.name.substring(property.name.indexOf(".")+1)}:</header>`
            for (const option of property.options) {
              const checkedClass = property.defaultInput===option.name ? 'radio-checked' : '';
              const checked =  property.defaultInput===option.name ? 'checked' : '';
              html += `<label class="radio-button ${checkedClass}"><input type="radio" data-name="${property.idInput}" name="${property.name}" class="radio-input" ${checked}>${option.name}</label>`;
            }
          } 
        else if (property.inputType === 'string') {
          const placeholder = property.inputPlaceholder || ""
          html += `<div class="key-value"><label for="${property.idInput}"><span class="property-name">${property.name.substring(property.name.lastIndexOf(".")+1)}:</span></label><input type="text" id="${property.idInput}" value="${property.defaultInput}" name="${property.name}" placeholder="${placeholder}"><span class="error-info hide"></span>`;
        }
        else if(property.inputType === 'number'){
          html += `<div class="key-value"><label for="${property.idInput}"><span class="property-name">${property.name.substring(property.name.lastIndexOf(".")+1)}:</span></label><input type="number" step=${property.step} min=${property.min} max=${property.max} value=${property.defaultInput} id="${property.idInput}" name="${property.name}"><span class="error-info hide"></span>`;
        }
        else if(property.inputType === 'bool'){
          const checked =  property.defaultInput ? "checkbox-checked" : ""
          html += `<div class="key-value"><label for="${property.idInput}"><span class="property-name">${property.name.substring(property.name.lastIndexOf(".")+1)}:</span><span class="slider round ${checked}"></span><input checked type="checkbox" id="${property.idInput}" name="${property.name}" class="hide"></label>`;
        }
        else if(property.inputType === 'table'){
          html += `<div class="key-value"><span class="property-name">${property.name.substring(property.name.lastIndexOf(".")+1)}:</span>`;
        }
        else{
          continue;
        }
        
        if (property.extraOptions) {
          for (const option of property.extraOptions) {
            let color;
            switch(option.name){
              case "case":
                color = "#FF3131"
                break;
              case "table":
                color = "#0FF0FC"
                break;
              case "random":
                color = "#FFF01F"
                break;
              case "random first index":
                color = "#CCFF00"
                break;
              case "behavior":
                color = "#0096FF"
                break;
              default:
                color= "#8A2BE2"
                break
            }
            html += `<button class="extra-option" style="--clr:${color}"><span>${option.name}</span><i></i></button>`;
            }
          }
        if (property['tool-tip']) {
          html += addToolTip(property)
        }
        html+='</div>'
      }
    html += `</div>`;
    return html;
}

function addToolTip(property)
{
  let requirementsInfo = "";
  let message
  if(property.hasOwnProperty('validation')){
    property['validation'].forEach(valid => {
      switch(valid.name){
        case "minMax":
          message = `Wartość powinna zawierać się w przedziale od ${property.min} do ${property.max}!`
          if(!requirementsInfo.includes(message)){
            requirementsInfo += '<br>'+ message
          }
          break;
        case "unique":
          message = "Wartość tego pola powinna być unikalna i nie może się powtarzać w innych obiektach!"
           if(!requirementsInfo.includes(message)){
            requirementsInfo += '<br>'+ message
          }
          break;
        case "notEqual":
          message = `Wartość tego pola dla typu ${valid.forType} powinna być różna od ${valid.value}!`
           if(!requirementsInfo.includes(message)){
            requirementsInfo += '<br>'+ message
          }
          break;
        case "equal":
          message = `Wartość tego pola dla typu ${valid.forType} powinna być równa ${valid.value}!`
           if(!requirementsInfo.includes(message)){
            requirementsInfo += '<br>'+ message
          }
          break;
        case "moreThan":
          message = `Wartość tego pola powinna być większa od `
          if(typeof valid.value === "number"){
            message +=  `wartości ${valid.value}!`
            }
           else{
            message += `wartości klucza ${valid.value}!`
           }
           if(!requirementsInfo.includes(message)){
            requirementsInfo += '<br>'+ message
          }
            break;
        case "lessThan":
          message = `Wartość tego pola powinna być większa od `
          if(typeof valid.value === "number"){
            message +=  `wartości ${valid.value}!`
           }
         else{
             message += `wartości klucza ${valid.value}!`
           }
          if(!requirementsInfo.includes(message)){
            requirementsInfo += '<br>'+ message
          }
            break;
        default:
          break;
     }
    })
  }

   return `<div class="tool-tip">
     <i class="tool-tip__icon">i</i>
     <p class="tool-tip__info"><b>Typ zmiennej</b>: ${property.varType.join(", ")}<br><b>Wymagania</b>: ${requirementsInfo.substring(4) || "brak"}<br><b>Opis</b>: ${property['tool-tip']}</p>
   </div>`
}

function fillFormFields(data, prefix = "") {
    for (let key in data) {
      const value = data[key];
      const fullKey = prefix + key;
  
      if (typeof value === "object" && !Array.isArray(value)) {
        fillFormFields(value, fullKey + ".");
      } 
      else {
        let inputElements = document.querySelectorAll('input[name="' + fullKey + '"]');
        if (inputElements.length > 0) {
          if (inputElements[0].type === "radio") {
            for (let i = 0; i < inputElements.length; i++) {
              const inputElement = inputElements[i];
              if (inputElement.parentNode.textContent === value.toString()) {
                    inputElement.parentNode.classList.add("radio-checked");
                    inputElement.checked = true;
              }
              else{
                inputElement.parentNode.classList.remove("radio-checked");
                inputElement.checked = false;
              }
            }
          } 
          else if(inputElements[0].type === "checkbox")
          {
           const inputElement = inputElements[0];
            if (value) {
               inputElement.previousElementSibling.classList.add("checkbox-checked");
              }
              else{
                inputElement.previousElementSibling.classList.remove("checkbox-checked");
              }
          }
          else {
            for (let i = 0; i < inputElements.length; i++) {
              const inputElement = inputElements[i];
              if(Array.isArray(value)){
                inputElement.value = value.join(";")
              }
              else {
              inputElement.value = value;
              }
              
            }       
          }
        }
      }
    }
  }
  
  function findReuqiredItems(config)
  {
    let objectsWithRequire = [];
    if (typeof config === 'object') {
      if (config.hasOwnProperty('require')) {
        objectsWithRequire.push(config);
      }
  
      for (let key in config) {
        if (config.hasOwnProperty(key)) {
          objectsWithRequire = objectsWithRequire.concat(findReuqiredItems(config[key]));
        }
      }
    }
  
    return objectsWithRequire
  }
  
  function findHeadersByName(name, containerClassName) {
    const container = document.querySelector(`.${containerClassName}`)
    return Array.from(container.querySelectorAll('header[data-name="' + name + '"]'));
  }
  
  function findInputsById(name, containerClassName) {
    const container = document.querySelector(`.${containerClassName}`)
    return Array.from(container.querySelectorAll('input[id="' + name + '"], input[data-name="' + name + '"]'));
  }

function collapseObjectKeys(event){
  event.target.classList.toggle("collapsed")
  const keyMenu = event.target.nextElementSibling
  const keyValues = keyMenu.querySelectorAll(".key-menu, .key-value, .subkey, .subSubkey")
  if(event.target.classList.contains("collapsed")){
    keyValues.forEach(value => value.classList.add("collapsed-key"))
  }
  else{
    keyValues.forEach(value => value.classList.remove("collapsed-key"))
  }
}

function resizeIfIsTooLongValue(event){
  if (event.target.value.length > 30) {
    event.target.classList.add('expanded');
  } else {
    event.target.classList.remove('expanded');
  }
}

function handleExtraOptionButtonClick(event){
  const container = document.querySelector(".key-configuration")
  const listContainer = document.querySelector(".object-list-key")
  container.innerHTML = ""
  listContainer.innerHTML = '<div class="container-title">Menu obiektów</div>'
  event.target.classList.add("extra-option-active")
  event.target.classList.toggle("menu-active")
  if(keyContainer && keyContainer.event && keyContainer.event!== event.target){
    keyContainer.event.classList.remove("menu-active")
  }
  let fullHtml=""
  if(event.target.classList.contains("menu-active"))
  {
    switch(event.target.textContent)
    {
      case "CASE":
        fetch(`config/case.json`)
        .then(response => response.json())
        .then(config => {
            
            fullHtml += createObjectConfigurationContainer(config) 
            container.innerHTML = fullHtml
            keyContainer = new ConfigurationContainer(0, "key-configuration", "object-list-key", "case")
            keyContainer.requiredItems = findReuqiredItems(config)
            keyContainer.hasList = true
            keyContainer.jsonConfig = config
            keyContainer.name = "case"
            keyContainer.event = event.target
            if(!objectContainer.workingObject["case"])
            {
              objectContainer.workingObject["case"] = {}
              objectContainer.workingObject["case"].list = []
              keyContainer.workingObject = new Case()
              objectContainer.workingObject["case"].list.push(keyContainer.workingObject)
             
            }
            else{
              keyContainer.workingObject = objectContainer.workingObject["case"].list[0]
            }
            keyContainer.list = objectContainer.workingObject["case"].list
            keyContainer.createObjectList()
            getModuleElements(container, listContainer)
            createModuleDOMEvents(keyContainer)
            updateDynamicDataAndJsonText()
            fillFormFields(keyContainer.workingObject);
            keyContainer.hideAndRevealRequiredItems() 
            saveJsonState()   
            inputList.forEach(input => isDataValid(keyContainer, input))   
            
        })
        .catch(error => {
        console.error('Błąd pobierania:', error);
        })
        break;
        case "RANDOM":
          fetch(`config/random.json`)
          .then(response => response.json())
          .then(config => {
              
              fullHtml += createObjectConfigurationContainer(config) 
              container.innerHTML = fullHtml
              keyContainer = new ConfigurationContainer(0, "key-configuration", "object-list-key", "random")
              keyContainer.requiredItems = findReuqiredItems(config)
              keyContainer.hasList = false
              keyContainer.jsonConfig = config
              keyContainer.name = "random"
              keyContainer.event = event.target
              const path = keyContainer.event.previousElementSibling.previousElementSibling.name
             if(!getValueFromObject(objectContainer.workingObject, path).hasOwnProperty("getRandom"))
              {
                keyContainer.workingObject = {"getRandom":{}}
                keyContainer.workingObject.getRandom = new GetRandom()
                objectContainer.setObjectKeyByPath(path, keyContainer.workingObject)
              }
              else{
                keyContainer.workingObject = getValueFromObject(objectContainer.workingObject, path)
              }
              keyContainer.createObjectList()
              getModuleElements(container, listContainer)
              createModuleDOMEvents(keyContainer)
              updateDynamicDataAndJsonText()
              fillFormFields(keyContainer.workingObject);
              keyContainer.hideAndRevealRequiredItems() 
              saveJsonState()
              inputList.forEach(input => isDataValid(keyContainer, input))   
          })
          .catch(error => {
          console.error('Błąd pobierania:', error);
          })
          break;

      case "TABLE":
        break;
      default:
        break; 
    }
  }
  else{
    container.innerHTML = fullHtml
    listContainer.innerHTML = '<div class="container-title">Menu obiektów</div>'
  }
}

function hideFullForm(container, withPlusButton){
  const formToHide = document.querySelector(`.${container.className}`)
  formToHide.firstChild.classList.add("hide")
  formToHide.firstChild.nextElementSibling.classList.add("hide")
  if(withPlusButton){
    const objectList = document.querySelector(`.${container.listClassName}`)
    const plus = objectList.querySelector(".add-object")
    plus.remove()
  }
}

function revealFullForm(container){
  const formToHide = document.querySelector(`.${container.className}`)
  formToHide.firstChild.classList.remove("hide")
  formToHide.firstChild.nextElementSibling.classList.remove("hide")
}

function  hightligthsUsedExtraOption(container){
  const configurationContainer = document.querySelector(`.${container.className}`)
  const extraOptions = configurationContainer.querySelectorAll('.extra-option')
  let path
  let object;
  extraOptions.forEach(button =>{
    switch(button.textContent){
      case "CASE":
        object = container.workingObject
        path = button.parentElement.firstChild.nextElementSibling.firstChild.name   
        if(path.indexOf(".")===-1){
          path = ""
        }
        else{
          path = path.substring(0, path.lastIndexOf("."))
        }
        if(path) {
          object = findObjectByPath(object, path)
        }
        if(object && object.hasOwnProperty("case")){
          button.classList.add("extra-option-active")
        }
        else{
          button.classList.remove("extra-option-active")
        }
        break;
      case "RANDOM":
        object = container.workingObject
        path = button.parentElement.firstChild.nextElementSibling.name
        if(path.indexOf(".")===-1){
          path = ""
        }
        if(path) {
          object = findObjectByPath(object, path)
        }
        if(object && object.hasOwnProperty("getRandom")){
          button.classList.add("extra-option-active")
        }
        else{
          button.classList.remove("extra-option-active")
        }
        break;
      default:
        break;
    }
  })
}

function removeActiveExtraOption(event, config){
  const input = event.target
  const configObject = findObjectByProperty(config, input.id, "idInput")
  if(configObject.hasOwnProperty("extraOptions")){
    const extraOptionButton = input.nextElementSibling.nextElementSibling
    clearKeyContainers()
    extraOptionButton.classList.remove("extra-option-active", "menu-active")
  }
}