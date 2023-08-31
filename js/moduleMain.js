let uniqueNamesSet
const moduleObject={
  "action"        : "CREATE",
  "id"          : "Sralala",
  "windowTarget"  : "MAP",
  "effect"        : "TINT",
  "target"        : {
    "kind": "NPC", 
    "id": 1
  },
  "params": {
    "duration": 0.2,
    "color"   : {"r": 0, "g":0, "b":0},
    "repeat"  : 2,
    "delayBefore": 10
  }
}

function loadModuleContent(module)
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
    fullHtml += createObjectList(module)
    fetch(`../config/${module}.json`)
    .then(response => response.json())
    .then(config => {
        fullHtml += `<div class="object-configuration">`
        fullHtml += createObjectConfigurationContainer(config, moduleObject) 
        fullHtml += createKeyMenu()
        handleContainer.innerHTML += fullHtml
        getModuleElements()
        createModuleDOMEvents()

    })
    .catch(error => {
    console.error('Błąd pobierania:', error);
    })

    const buttonsContainer = document.querySelector(".buttons-container")
    const jsonButtonsHtml = createJsonButtons()
    buttonsContainer.innerHTML = jsonButtonsHtml
    //restoreLastJson()

}

function createObjectList(module)
{
    let objectsContainerHtml = `
    <div class="object-list-container">
        <div class="container-title">Lista obiektów</div>`
    const ids = dynamicData[module].list.map(item => item.id || item.name);
        ids.forEach(id => {
          objectsContainerHtml+= `<label class="object-list-element"><input type="radio" name="object-list" class="radio-input">${id}</label>`;
        });
    objectsContainerHtml += '</div>'
    return objectsContainerHtml  
}

function createObjectConfigurationContainer(config, moduleObject)
{
    let html = ''
    for (const property of config.properties) {
      const hideClass = property.hide ? "hide" : ""
        if(property.type === "key" || property.type === "subkey"){
        html += `<div class="${property.type} ${hideClass}">
        <header>${property.name.toUpperCase()}</header></div><div class="key-menu">`
        html+=createObjectConfigurationContainer(property, moduleObject)
        }
        else if (property.type === 'options') {
            html+=`<div class="key-value ${hideClass}"><h2 class="property-name">${property.name}:</h2>`
            for (const option of property.options) {
              let checkedClass = option.checked ? 'checked' : '';
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
          html += `<div class="key-value ${hideClass}"><label for="${property.name}"><span class="property-name">${property.name}:</span></label><input type="text" id="${property.name}" name="${property.name}"></div>`;
          if (property['tool-tip']) {
            html += addToolTip(property['tool-tip'])
          }
        }
        else if(property.type === 'number'){
          html += `<div class="key-value ${hideClass}"><label for="${property.name}"><span class="property-name">${property.name}:</span></label><input type="number" step==${property.step} min=${property.min} max=${property.max} id="${property.name}" name="${property.name}"></div>`;
          if (property['tool-tip']) {
            html += addToolTip(property['tool-tip'])
          }
        }
        else if(property.type === 'bool'){
          html += `<div class="key-value ${hideClass}"><label for="${property.name}"><span class="property-name">${property.name}:</span><span class="slider round"></span><input checked type="checkbox" id="${property.name}" name="${property.name}" class="hide"></label></div>`;
          if (property['tool-tip']) {
            html += addToolTip(property['tool-tip'])
          }
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

function main(){
 loadModuleContent("characterEffect")
}

main();

