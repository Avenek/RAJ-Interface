let uniqueNameRadioButtons, addObjectPlus, deleteObjectButtons, radioButtonObjectList, inputList, checkboxList, keyHeaders, extraOptionsButtons, jsonButtons
let currentModule = ""
let requiredItems;
let keyRequiredItems;
let configJson;
let objectContainer, keyContainer

function loadModuleObject(index, module)
{
  objectContainer = new Container(index, "object-configuration")
  currentModule = module
  fetch(`../config/modules.json`)
    .then(response => response.json())
    .then(config => {
      const configObject = findObjectByName(config.modules, "characterEffect")
      if(configObject.hasList){
        objectContainer.hasList = true
        if(dynamicData.hasOwnProperty(currentModule))
        {
          objectContainer.workingObject = dynamicData[currentModule].list[index]
        }
        else {
          dynamicData[currentModule]={}
          dynamicData[currentModule].list=[]
        }
      }
      else {
        objectContainer.hasList = false
        dynamicData[currentModule]={}
      }
        
    })
    .catch(error => {
    console.error('Błąd pobierania:', error);
    })
}

function loadModuleContent()
{
    const home = document.querySelector(".element-container")
    home.innerHTML = '<div class="home"><i class="fa-solid fa-house"></i></div>'
    let fullHtml = `<div class="configuration-container"><div class="objects-container">`
    const handleContainer = document.querySelector(".handle-container")
    removeAllChildren(handleContainer)
    fullHtml += createObjectList(currentModule, objectContainer.workingObject)
    fetch(`../config/${currentModule}.json`)
    .then(response => response.json())
    .then(config => {
        objectContainer.jsonConfig = config
        fullHtml += `<div class="object-configuration">`
        fullHtml += createObjectConfigurationContainer(config) 
        fullHtml += createKeyMenu()
        handleContainer.innerHTML += fullHtml
        objectContainer.requiredItems = findReuqiredItems(config)
        const container = document.querySelector(".object-configuration")
        const objectListContainer = document.querySelector(".object-list-container")
        getModuleElements(container, objectListContainer)
        addObjectIfListIsEmpty(objectContainer)
        createModuleDOMEvents(objectContainer)
        if(!objectContainer.hasList){
          addObjectPlus.remove()
        }
        fillFormFields(objectContainer.workingObject);
        hideAndRevealRequiredItems(objectContainer)
        removeDefaultValuesFromJson(objectContainer.workingObject, objectContainer.jsonConfig.properties)
        
    })
    .catch(error => {
    console.error('Błąd pobierania:', error);
    })

    const buttonsContainer = document.querySelector(".buttons-container")
    const jsonButtonsHtml = createJsonButtons()
    buttonsContainer.innerHTML = jsonButtonsHtml
    //restoreLastJson()

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

function setupRadioButtons(radioButtons, container) {
  radioButtons.forEach(radioButton => {
      radioButton.addEventListener('click', () => {
          radioButtons.forEach(rb => {
              rb.parentNode.classList.remove('radio-checked');
          });
          radioButton.parentNode.classList.add('radio-checked');
      });
      radioButton.addEventListener('change', (event) => {
        updateObjectRadioButton(event, container)
        fillFormFields(container.workingObject)
        hideAndRevealRequiredItems(container)})
  });
}

function addObjectIfListIsEmpty(container){
  if(radioButtonObjectList.length ===0)
  {
    addObjectToList(container)
  }
}

function getModuleElements(container, listContainer){
  getModuleElementsFromContainer(container)
  getModuleElementsFromObjectList(listContainer)
  jsonButtons = document.querySelectorAll(".json-buttons")
}
function getModuleElementsFromContainer(container){
  const radioButtons = container.querySelectorAll('input[type="radio"]');
  uniqueNameRadioButtons = new Set();
  radioButtons.forEach(radioButton => {
    const name = radioButton.getAttribute('name');
    if (name && !uniqueNameRadioButtons.has(name)) {
      uniqueNameRadioButtons.add(name);
    }
  });

  inputList = container.querySelectorAll('input[type="text"], input[type="number"]')
  checkboxList = container.querySelectorAll('.slider')
  keyHeaders = container.querySelectorAll(".key, .subkey, .subSubkey")
  extraOptionsButtons = container.querySelectorAll(".extra-option")
}

function getModuleElementsFromObjectList(container){
  radioButtonObjectList = container.querySelectorAll('input[type="radio"]')
  addObjectPlus = container.querySelector(".add-object")
  deleteObjectButtons = container.querySelectorAll(".delete-icon")
}

function createModuleDOMEvents(container){
  createModuleDOMEventFromContainer(container)
  createModuleDOMEventFromObjectList()
  jsonButtons.forEach(button => button.addEventListener("click", buttonClick))
}

function createModuleDOMEventFromContainer(container){
  uniqueNameRadioButtons.forEach(name => {
    const radioButtons = document.querySelectorAll(`input[name="${name}"]`);
    setupRadioButtons(radioButtons, container);
  })

  setupRadioButtonsObjectList(radioButtonObjectList, container);

  if (checkboxList) {
    checkboxList.forEach(checkbox => {
      checkbox.removeEventListener("click", (event) => checkboxClickEvent(checkbox, event, container))
      checkbox.addEventListener("click", (event) => checkboxClickEvent(checkbox, event, container))   
    })
  }

  if (inputList) {
    inputList.forEach(input => {
      input.removeEventListener("keyup", (event) => inputClickEvent(event, container))
      input.addEventListener("keyup", (event) => inputClickEvent(event, container))
      })
    }

  if (keyHeaders) {
    keyHeaders.forEach(header => {
      header.removeEventListener("click", event => collapseObjectKeys(event))
      header.addEventListener("click", event => collapseObjectKeys(event))
    })
  }

  if (extraOptionsButtons) {
  extraOptionsButtons.forEach(button => {
    button.removeEventListener("click", (event) => handleExtraOptionButtonClick(event))
    button.addEventListener("click", (event) => handleExtraOptionButtonClick(event))
    })
  }
}

function createModuleDOMEventFromObjectList(){
  if (addObjectPlus) {
    addObjectPlus.removeEventListener("click", addObjectToList)
    addObjectPlus.addEventListener("click", addObjectToList)
  }
  if(deleteObjectButtons){
    deleteObjectButtons.forEach(button => button.removeEventListener("click", removeObjectFromList))
    deleteObjectButtons.forEach(button => button.addEventListener("click", removeObjectFromList))
  }
}

function checkboxClickEvent(checkbox, event, container){
    checkbox.classList.toggle("checkbox-checked")
    changeValueInJsonCheckbox(event, container)
    removeDefaultValuesFromJson(container)
}

function inputClickEvent(event, container){
  changeValueInJsonInput(event, container)
  resizeIfIsTooLongValue(event)
  updateObjectListText()
  removeDefaultValuesFromJson(container.workingObject, container.jsonConfig.properties, container)
}


function main(){
  loadModuleObject(0, "characterEffect")
  loadModuleContent()
  const jsonText = document.querySelector(".json-text")
  jsonText.value = JSON.stringify(dynamicData, null, 2);
 }
 
 main();