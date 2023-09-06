let uniqueNamesSet, addObjectPlus, deleteObjectButtons, radioButtonObjectList, inputList, checkboxList, keyHeaders, extraOptionsButtons
let currentModule = ""
let objectIndex
let requiredItems;

function loadModuleObject(index, module="", hasList = true)
{
  objectIndex = index
  currentModule = module
  if(dynamicData.hasOwnProperty(currentModule))
  {
    workingObject = dynamicData[currentModule].list[objectIndex]
  }
  else if(hasList){
    dynamicData[currentModule]={}
    dynamicData[currentModule].list=[]
  }
  else{
    dynamicData[currentModule]={}
  }
}

function loadModuleContent()
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
    fullHtml += createObjectList(currentModule, workingObject)
    fetch(`../config/${currentModule}.json`)
    .then(response => response.json())
    .then(config => {
        fullHtml += `<div class="object-configuration">`
        fullHtml += createObjectConfigurationContainer(config, workingObject) 
        fullHtml += createKeyMenu()
        handleContainer.innerHTML += fullHtml
        requiredItems = findReuqiredItems(config)
        getModuleElements()
        if(radioButtonObjectList.length ===0)
        {
          addObjectToList()
        }
        createModuleDOMEvents()
        fillFormFields(workingObject);
        hideAndRevealRequiredItems(workingObject)
        
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

function setupRadioButtons(radioButtons) {
  radioButtons.forEach(radioButton => {
      radioButton.addEventListener('click', () => {
          radioButtons.forEach(rb => {
              rb.parentNode.classList.remove('radio-checked');
          });
          radioButton.parentNode.classList.add('radio-checked');
      });
      radioButton.addEventListener('change', (event) => {
        updateObjectRadioButton(event)
        fillFormFields(workingObject)
        hideAndRevealRequiredItems(workingObject)})
  });
}


function getModuleElements(){
  const objectConfigurationContainer = document.querySelector(".object-configuration")
  const radioButtons = objectConfigurationContainer.querySelectorAll('input[type="radio"]');
  uniqueNamesSet = new Set();
  const objectListContainer = document.querySelector(".object-list-container")
  radioButtonObjectList = objectListContainer.querySelectorAll('input[type="radio"]')
  radioButtons.forEach(radioButton => {
    const name = radioButton.getAttribute('name');
    if (name && !uniqueNamesSet.has(name)) {
      uniqueNamesSet.add(name);
    }
  });

  addObjectPlus = document.querySelector(".add-object")
  deleteObjectButtons = document.querySelectorAll(".delete-icon")
  inputList = document.querySelectorAll('input[type="text"], input[type="number"]')
  checkboxList = document.querySelectorAll('.slider')
  keyHeaders = document.querySelectorAll(".key, .subkey, .subSubkey")
  extraOptionsButtons = document.querySelectorAll(".extra-option")
}

function createModuleDOMEvents(){
  uniqueNamesSet.forEach(name => {
    const radioButtons = document.querySelectorAll(`input[name="${name}"]`);
    setupRadioButtons(radioButtons);
  })

  setupRadioButtonsObjectList(radioButtonObjectList);

  checkboxList.forEach(checkbox => {
    checkbox.addEventListener("click", (event) => {
    checkbox.classList.toggle("checkbox-checked")
    changeValueInJsonCheckbox(event)
    })
  })

  inputList.forEach(input => input.addEventListener("keyup", (event) => {
    changeValueInJsonInput(event)
    resizeIfIsTooLongValue(event)
    updateObjectListText()
  }))

  keyHeaders.forEach(header => {
    header.addEventListener("click", event => collapseObjectKeys(event))
  })
 
  extraOptionsButtons.forEach(button => {
    button.addEventListener("click", (event) => handleExtraOptionButtonClick(event))
  })

  addObjectPlus.addEventListener("click", addObjectToList)
  deleteObjectButtons.forEach(button => button.addEventListener("click", removeObjectFromList))
}

function main(){
  loadModuleObject(0, "characterEffect")
  loadModuleContent()
  const jsonText = document.querySelector(".json-text")
  jsonText.value = JSON.stringify(dynamicData, null, 2);
 }
 
 main();