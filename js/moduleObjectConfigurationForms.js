function createObjectConfigurationContainer(config, moduleObject)
{
    let html = ''
    for (const property of config.properties) {
        if(property.type === "key" || property.type === "subkey"){
        html += `<div class="${property.type}">
        <header data-name="${property.name}">${property.name.substring(property.name.indexOf(".")+1).toUpperCase()}</header></div><div class="key-menu">`
        html+=createObjectConfigurationContainer(property, moduleObject)
        }
        else if (property.type === 'options') {
            html+=`<div class="key-value"><h2 class="property-name">${property.name.substring(property.name.indexOf(".")+1)}:</h2>`
            for (const option of property.options) {
              const checkedClass = property.default===option ? 'radio-checked' : '';
              const checked =  property.default===option ? 'checked' : '';
              html += `<label class="radio-button ${checkedClass}"><input type="radio" name="${property.name}" class="radio-input" ${checked}>${option.name}</label>`;
            }
            if (property.extraOptions) {
              for (const option of property.extraOptions) {
                html += `<div class="case-tip"><span class="case-tip__icon">${option.name.toUpperCase()}</span></div>`;
                }
              }
              if (property['tool-tip']) {
                html += addToolTip(property['tool-tip'])
              }
            html+='</div>'
          } 
        else if (property.type === 'string') {
          html += `<div class="key-value"><label for="${property.name}"><span class="property-name">${property.name.substring(property.name.indexOf(".")+1)}:</span></label><input type="text" id="${property.name}" value=${property.default} name="${property.name}">`;
          if (property['tool-tip']) {
            html += addToolTip(property['tool-tip'])
          }
          html+='</div>'
        }
        else if(property.type === 'number'){
          html += `<div class="key-value"><label for="${property.name}"><span class="property-name">${property.name.substring(property.name.indexOf(".")+1)}:</span></label><input type="number" step==${property.step} min=${property.min} max=${property.max} value=${property.default} id="${property.name}" name="${property.name}">`;
          if (property['tool-tip']) {
            html += addToolTip(property['tool-tip'])
          }
          html+='</div>'
        }
        else if(property.type === 'bool'){
          const checked =  property.default ? "checkbox-checked" : ""
          html += `<div class="key-value"><label for="${property.name}"><span class="property-name">${property.name.substring(property.name.indexOf(".")+1)}:</span><span class="slider round ${checked}"></span><input checked type="checkbox" id="${property.name}" name="${property.name}" class="hide"></label>`;
          if (property['tool-tip']) {
            html += addToolTip(property['tool-tip'])
          }
          html+='</div>'
        }
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
    for (var key in data) {
      var value = data[key];
      var fullKey = prefix + key;
  
      if (typeof value === "object") {
        fillFormFields(value, fullKey + ".");
      } else {
        var inputElements = document.querySelectorAll('[name="' + fullKey + '"]');
        
        if (inputElements.length > 0) {
          if (inputElements[0].type === "radio") {
            for (var i = 0; i < inputElements.length; i++) {
              var inputElement = inputElements[i];
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
            var inputElement = inputElements[0];
            if (value) {
               inputElement.previousElementSibling.classList.add("checkbox-checked");
              }
              else{
                inputElement.previousElementSibling.classList.remove("checkbox-checked");
              }
          }
          else {
              inputElements[0].value = value;
          }
        }
      }
    }
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
  
  function findHeadersByName(name) {
    return Array.from(document.querySelectorAll('header[data-name="' + name + '"]'));
  }
  
  // Funkcja do wyszukiwania inputów (elementy z klasą "input" lub "subinput")
  function findInputsByName(name) {
    return Array.from(document.querySelectorAll('input[name="' + name + '"]'));
  }
  
  function hideAndRevealRequiredItems(moduleObject)
  {
    requiredItems.forEach(item => {
      if(item.type === "key" || item.type === "subkey")
      {
        headers = findHeadersByName(item.name)

        if(!item.require.value.includes(getValueFromObject(moduleObject, item.require.name)))
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
        if(!item.require.value.includes(getValueFromObject(moduleObject, item.require.name)))
        {
          inputs = findInputsByName(item.name)
          inputs.forEach(input => {
            input.parentNode.classList.add("hide")
          })
        }
        else{
          inputs = findInputsByName(item.name)
          inputs.forEach(input => {
            input.parentNode.classList.remove("hide")
          })
  
        }
      }
  
    })
  }

  
function changeValueInJsonRadioButton(event){
  const key = event.target.name
  const value = event.target.parentNode.textContent
  const keys = key.split('.');
  let currentObject = dynamicData[currentModule].list[objectIndex];
  for (let i = 0; i < keys.length - 1; i++) {
    currentObject = currentObject[keys[i]];
  }
  currentObject[keys[keys.length - 1]] = value;
}