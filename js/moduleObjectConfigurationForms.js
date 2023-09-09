function createObjectConfigurationContainer(config)
{
    let html = ''
    for (const property of config.properties) {
        if(property.type === "key" || property.type === "subkey" || property.type === "subSubkey"){
        html += `<div class="${property.type}">
        <header data-name="${property.name}">${property.name.substring(property.name.indexOf(".")+1).toUpperCase()}</header></div><div class="key-menu">`
        html+=createObjectConfigurationContainer(property)
        continue;
        }
        else if (property.type === 'options') {
            html+=`<div class="key-value"><header class="property-name">${property.name.substring(property.name.indexOf(".")+1)}:</header>`
            for (const option of property.options) {
              const checkedClass = property.defaultInput===option.name ? 'radio-checked' : '';
              const checked =  property.defaultInput===option.name ? 'checked' : '';
              html += `<label class="radio-button ${checkedClass}"><input type="radio" name="${property.name}" class="radio-input" ${checked}>${option.name}</label>`;
            }
          } 
        else if (property.type === 'string') {
          html += `<div class="key-value"><label for="${property.name}"><span class="property-name">${property.name.substring(property.name.lastIndexOf(".")+1)}:</span></label><input type="text" id="${property.name}" value="${property.defaultInput}" name="${property.name}">`;

        }
        else if(property.type === 'number'){
          html += `<div class="key-value"><label for="${property.name}"><span class="property-name">${property.name.substring(property.name.lastIndexOf(".")+1)}:</span></label><input type="number" step==${property.step} min=${property.min} max=${property.max} value=${property.defaultInput} id="${property.name}" name="${property.name}">`;

        }
        else if(property.type === 'bool'){
          const checked =  property.defaultInput ? "checkbox-checked" : ""
          html += `<div class="key-value"><label for="${property.name}"><span class="property-name">${property.name.substring(property.name.lastIndexOf(".")+1)}:</span><span class="slider round ${checked}"></span><input checked type="checkbox" id="${property.name}" name="${property.name}" class="hide"></label>`;
        }
        else if(property.type === 'table'){
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
              case "get random":
                color = "#FFF01F"
                break;
              default:
                color= "#CCFF00"
                break
            }
            html += `<button class="extra-option" style="--clr:${color}"><span>${option.name.toUpperCase()}</span><i></i></button>`;
            }
          }
        if (property['tool-tip']) {
          html += addToolTip(property['tool-tip'])
        }
        html+='</div>'
      }
    html += `</div>`;
    return html;
}

function addToolTip(tip)
{
   return `<div class="tool-tip">
     <i class="tool-tip__icon">i</i>
     <p class="tool-tip__info">${tip}</p>
   </div>`
}

function fillFormFields(data, prefix = "") {
    for (let key in data) {
      const value = data[key];
      const fullKey = prefix + key;
  
      if (typeof value === "object") {
        fillFormFields(value, fullKey + ".");
      } else {
        let inputElements = document.querySelectorAll('[name="' + fullKey + '"]');
        
        if (inputElements.length > 0) {
          if (inputElements[0].type === "radio") {
            for (let i = 0; i < inputElements.length; i++) {
              const inputElement = inputElements[i];
              if (inputElement.parentNode.textContent === value.toString()) {
                    inputElement.parentNode.classList.add("radio-checked");
              }
              else{
                inputElement.parentNode.classList.remove("radio-checked");
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
              inputElement.value = value;
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
  
  function findInputsByName(name, containerClassName) {
    const container = document.querySelector(`.${containerClassName}`)
    return Array.from(container.querySelectorAll('input[name="' + name + '"]'));
  }
  
  function hideAndRevealRequiredItems(container)
  {
    container.requiredItems.forEach(item => {
      if(item.type === "key" || item.type === "subkey")
      {
        headers = findHeadersByName(item.name, container.className)

        if(!item.require.value.includes(getValueFromObject(container.workingObject, item.require.name)))
        {
            headers.forEach(header => {
              header.parentNode.classList.add("hide")
              header.parentNode.nextElementSibling.classList.add("hide")
            })
        }
        else{
          headers.forEach(header => {
            header.parentNode.classList.remove("hide")
            header.parentNode.nextElementSibling.classList.remove("hide")
          })
        }
      }
      else{
        if(!item.require.value.includes(getValueFromObject(container.workingObject, item.require.name)))
        {
          inputs = findInputsByName(item.name, container.className)
          inputs.forEach(input => {
            if(input.type === "radio" || input.type==="checkbox")
            {
              input.parentNode.parentNode.classList.add("hide")
            }
            else{
              input.parentNode.classList.add("hide")
            }
          })
        }
        else{
          inputs = findInputsByName(item.name, container.className)
          inputs.forEach(input => {
            if(input.type === "radio" || input.type==="checkbox")
            {
              input.parentNode.parentNode.classList.remove("hide")
            }
            else{
              input.parentNode.classList.remove("hide")
            }
          })
        }
      }
    })
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
  event.target.classList.add("extra-option-active")
  event.target.classList.toggle("menu-active")
  let fullHtml = '<div class="container-title">Konfiguracja klucza</div>'
  if(event.target.classList.contains("menu-active"))
  {
      switch(event.target.textContent)
    {
      case "CASE":
        fetch(`../config/case.json`)
        .then(response => response.json())
        .then(config => {
            fullHtml += createObjectConfigurationContainer(config) 
            container.innerHTML = fullHtml
            keyContainer = new Container(0, "key-configuration")
            keyContainer.requiredItems = findReuqiredItems(config)
            keyContainer.path = objectContainer.path + ".case.list[keyContainer.currentIndex]"
            if(!objectContainer.workingObject["case"])
            {
              objectContainer.workingObject["case"] = {}
              objectContainer.workingObject["case"].list = []
              keyContainer.workingObject = new Case()
              objectContainer.workingObject["case"].list.push(keyContainer.workingObject)
            }
            updateDynamicDataAndJsonText()
            fillFormFields(objectContainer.workingObject);
            hideAndRevealRequiredItems(keyContainer)
            
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
  }
  

}