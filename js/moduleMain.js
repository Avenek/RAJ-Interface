let uniqueNamesSet
const moduleObject={
  "action"        : "REMOVE",
  "id"          : "Sralala",
  "windowTarget"  : "MAP",
  "effect"        : "ANIMATION",
  "target"        : {
    "kind": "NPC", 
    "id": 1
  },
  "params": {
  "gifUrl": "characterEffects/kup23-pnacza.gif",        
    "delayAfter": 3,
    "repeat"  : true,
    "position": "LEFT_HAND",
    "behind": true
  }
}

function loadModuleContent(module, moduleObject)
{
    const head = document.querySelector("head")
    head.innerHTML+= '<link rel="stylesheet" href="../css/modulePage.css">'
    const plus = document.querySelector(".plus-circle")
    const home = document.querySelector(".element-container")
    home.innerHTML = '<div class="home"><i class="fa-solid fa-house"></i></div>'
    //plus.remove()
    let fullHtml = `<div class="configuration-container"><div class="objects-container">`
    const handleContainer = document.querySelector(".handle-container")
    removeAllChildren(handleContainer)
    fullHtml += createObjectList(module, moduleObject)
    fetch(`../config/${module}.json`)
    .then(response => response.json())
    .then(config => {
        fullHtml += `<div class="object-configuration">`
        fullHtml += createObjectConfigurationContainer(config, moduleObject) 
        fullHtml += createKeyMenu()
        handleContainer.innerHTML += fullHtml
        getModuleElements()
        createModuleDOMEvents()
        fillFormFields(moduleObject);
        hideAndRevealRequiredItems(config, moduleObject)

    })
    .catch(error => {
    console.error('Błąd pobierania:', error);
    })

    const buttonsContainer = document.querySelector(".buttons-container")
    const jsonButtonsHtml = createJsonButtons()
    buttonsContainer.innerHTML = jsonButtonsHtml
    //restoreLastJson()

}

function createObjectList(module, moduleObject)
{
    let objectsContainerHtml = `
    <div class="object-list-container">
        <div class="container-title">Lista obiektów</div>`
    const ids = dynamicData[module].list.map(item => item.id || item.name);
        ids.forEach(id => {
          const checkedClass = id === moduleObject.id || id === moduleObject.name ? "checked" : ""
          objectsContainerHtml+= `<label class="object-list-element ${checkedClass}"><input type="radio" name="object-list" class="radio-input">${id}</label>`;
        });
    objectsContainerHtml += '<button class="plus-circle"><i class="fas fa-plus"></i></button></div>'
    return objectsContainerHtml  
}

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
              const checkedClass = property.default ? 'checked' : '';
              html += `<label class="radio-button ${checkedClass}"><input type="radio" name="${property.name}" class="radio-input" ${checkedClass}>${option.name}</label>`;
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

function createKeyMenu() {
  return `</div><div class="object-key">   
  <div class="key-menu">
      <div class="container-title">Menu pomocnicze</div>
  </div>
  <div class="key-configuration">
      <div class="container-title">Konfiguracja klucza</div>
  </div>`
}

function setupRadioButtons(radioButtons) {
  radioButtons.forEach(radioButton => {
      radioButton.addEventListener('click', () => {
          radioButtons.forEach(rb => {
              rb.parentNode.classList.remove('checked');
          });
          radioButton.parentNode.classList.add('checked');
      });
  });
}


function getModuleElements(){
  const radioButtons = document.querySelectorAll('input[type="radio"]');
  uniqueNamesSet = new Set();

  radioButtons.forEach(radioButton => {
    const name = radioButton.getAttribute('name');
    if (name && !uniqueNamesSet.has(name)) {
      uniqueNamesSet.add(name);
    }
  });

}

function createModuleDOMEvents(){
  uniqueNamesSet.forEach(name => {
    const radioButtons = document.querySelectorAll(`input[name="${name}"]`);
    setupRadioButtons(radioButtons);
  })

  const checkboxes = document.querySelectorAll('input[type="checkbox"]')
  checkboxes.forEach(checkbox => {
    checkbox.addEventListener("click", () =>
    checkbox.previousElementSibling.classList.toggle("checkbox-checked"))
  })
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
                  inputElement.parentNode.classList.add("checked");
            }
            else{
              inputElement.parentNode.classList.remove("checked");
            }
          }
        } 
        else if(inputElements[0].type === "checkbox")
        {
          var inputElement = inputElements[0];
          if (value) {
             inputElement.previousElementSibling.classList.add("checkbox-checked");
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

function findReuqireItems(config)
{
  let objectsWithRequire = [];
  if (typeof config === 'object') {
    if (config.hasOwnProperty('require')) {
      objectsWithRequire.push(config);
    }

    for (let key in config) {
      if (config.hasOwnProperty(key)) {
        objectsWithRequire = objectsWithRequire.concat(findReuqireItems(config[key]));
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

function hideAndRevealRequiredItems(config, moduleObject)
{
  requireItems = findReuqireItems(config)
  requireItems.forEach(item => {
    if(item.type === "key" || item.type === "subkey")
    {
      headers = findHeadersByName(item.name)
      console.log(headers);
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
        console.log(inputs);
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


function main(){
  loadModuleContent("characterEffect", moduleObject)
 }
 
 main();