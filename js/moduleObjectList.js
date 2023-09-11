
function createObjectList(module, moduleObject)
{
    let objectsContainerHtml = `
    <div class="object-list-container">
        <div class="container-title">Lista obiektów</div>`
        try{
            const ids = dynamicData[module].list.map(item => item.id || item.name);
            ids.forEach(id => {
                const checkedClass = id === moduleObject.id || id === moduleObject.name ? "radio-checked" : ""
                objectsContainerHtml+= `<div class="single-object-container"><label class="object-list-element ${checkedClass}"><input type="radio" name="object-list" class="radio-input">${id}</label><div class="delete-icon">🗑️</div></div>`;
            });
            objectsContainerHtml += '<button class="plus-circle add-object"><i class="fas fa-plus"></i></button></div>'
        }
        catch(error){
            objectsContainerHtml += '<button class="plus-circle add-object"><i class="fas fa-plus"></i></button></div>'
            return objectsContainerHtml
        }
    return objectsContainerHtml  
}

function addObjectToList(container){
    const objectListContainer = document.querySelector(".object-list-container")

    const singleObjectContainer = createObjectContainer()
    const plusButton =  createNewPlusButton(container)
    const deleteButton = createNewDeleteButton()
    const labelAndRadioButton = createNewLabelAndRadioButton(objectListContainer)

    removeCurrentPlusButton(objectListContainer)
    removeCheckedFromAllRadio(objectListContainer)

    singleObjectContainer.appendChild(labelAndRadioButton);
    singleObjectContainer.appendChild(deleteButton)
    objectListContainer.appendChild(singleObjectContainer)
    objectListContainer.appendChild(plusButton);

    const radioButtons = objectListContainer.querySelectorAll('input[type="radio"]')
    setupRadioButtonsObjectList(radioButtons);
    addObjectToJson(currentModule, labelAndRadioButton.textContent, container)
}

function createObjectContainer(){
    const singleObjectContainer = document.createElement("div");
    singleObjectContainer.className = "single-object-container";

    return singleObjectContainer
}

function createNewLabelAndRadioButton(objectListContainer){
    const labelElement = document.createElement("label");
    labelElement.className = "object-list-element radio-checked";
    const radioInput = document.createElement("input");
    radioInput.type = "radio";
    radioInput.name = "object-list";
    radioInput.className = "radio-input";
    radioInput.checked = true;
    labelElement.appendChild(radioInput);
    const radioButtons = objectListContainer.querySelectorAll('input[type="radio"]');

    labelElement.appendChild(document.createTextNode(`obiekt-${radioButtons.length+1}`));

    return labelElement
}

function createNewPlusButton(container) {
    const addButton = document.createElement("button");
    addButton.className = "plus-circle add-object";
    const plusIcon = document.createElement("i");
    plusIcon.className = "fas fa-plus";
    addButton.appendChild(plusIcon);
    addButton.addEventListener("click", () => addObjectToList(container))

    return addButton
}

function createNewDeleteButton()
{   
    const deleteButton = document.createElement("div");
    deleteButton.className = "delete-icon";
    deleteButton.textContent = "🗑️";
    deleteButton.addEventListener("click", removeObjectFromList)

    return deleteButton
}

function removeCheckedFromAllRadio(objectListContainer)
{
    objects = objectListContainer.querySelectorAll(".object-list-element")
    objects.forEach(object => {
        object.classList.remove("radio-checked")
        object.checked=false
    })
}

function removeCurrentPlusButton(objectListContainer){
    const plus = objectListContainer.querySelector(".add-object")
    try{
    plus.remove()
    }
    catch{}
}

function addObjectToJson(module, id, container)
{
    const moduleName = module.charAt(0).toUpperCase() + module.substring(1)
    objectContainer.workingObject = new objectDict[moduleName](id);
    if(objectContainer.hasList) {
        dynamicData[currentModule].list.push(objectContainer.workingObject)
        const index = findObjectIndexOnList(currentModule, id)
        objectContainer.currentIndex = index
      }
      else {
        dynamicData[currentModule] = objectContainer.workingObject
      }
    fillFormFields(objectContainer.workingObject)
    removeDefaultValuesFromJson(objectContainer.workingObject, objectContainer.jsonConfig.properties, container)
    hideAndRevealRequiredItems(objectContainer)
    updateDynamicDataAndJsonText()
}

function removeObjectFromList(event){
    if (window.confirm("Czy na pewno chcesz usunąć obiekt?")) {
        const objectId = event.target.previousElementSibling.textContent
        removeObjectFromJson(currentModule, objectId)
        const container = event.target.parentNode
        if(container.firstChild.classList.contains("radio-checked"))
        {
            objectContainer.currentIndex = 0
            const elements = document.querySelectorAll(".object-list-element")
            if(elements.length>1){
                elements[0].classList.add("radio-checked")
                workingObject = dynamicData[currentModule].list[0]
                fillFormFields(workingObject)
                hideAndRevealRequiredItems(objectContainer)
            }
            else{
                workingObject = null
                delete dynamicData[currentModule]
            }
            updateDynamicDataAndJsonText()
        }
        container.remove()
        updateJsonTextArea()
        
    }
}

function changeObjectOnList(event){
    const objectId = event.target.parentNode.textContent
    const index = findObjectIndexOnList(currentModule, objectId)
    objectContainer.currentIndex = index
    objectContainer.workingObject = dynamicData[currentModule].list[index]
    console.log("teraz");
    fillFormFields(objectContainer.workingObject)
    hideAndRevealRequiredItems(objectContainer)
    removeDefaultValuesFromJson(objectContainer.workingObject, objectContainer.jsonConfig.properties)
}

function setupRadioButtonsObjectList(radioButtons) {
    radioButtons.forEach(radioButton => {
        radioButton.addEventListener('click', () => {
            radioButtons.forEach(rb => {
                rb.parentNode.classList.remove('radio-checked');
            });
            radioButton.parentNode.classList.add('radio-checked');
        });
        radioButton.addEventListener('change', changeObjectOnList)
    });
  }

  function updateObjectListText()
  {
    const objectListContainer = document.querySelector(".object-list-container")
    const checkedRadioButton = objectListContainer.querySelector('label.radio-checked > input[type="radio"]');
    checkedRadioButton.parentElement.firstChild.nextSibling.textContent = objectContainer.workingObject["id"] || objectContainer.workingObject["name"]
}