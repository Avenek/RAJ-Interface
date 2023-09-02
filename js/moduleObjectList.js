
function createObjectList(module, moduleObject)
{
    let objectsContainerHtml = `
    <div class="object-list-container">
        <div class="container-title">Lista obiektów</div>`
    const ids = dynamicData[module].list.map(item => item.id || item.name);
        ids.forEach(id => {
          const checkedClass = id === moduleObject.id || id === moduleObject.name ? "radio-checked" : ""
          objectsContainerHtml+= `<div class="single-object-container"><label class="object-list-element ${checkedClass}"><input type="radio" name="object-list" class="radio-input">${id}</label><div class="delete-icon">🗑️</div></div>`;
        });
    objectsContainerHtml += '<button class="plus-circle add-object"><i class="fas fa-plus"></i></button></div>'
    return objectsContainerHtml  
}

function addObjectToList(){
    const objectListContainer = document.querySelector(".object-list-container")

    const singleObjectContainer = createObjectContainer()
    const plusButton =  createNewPlusButton()
    const deleteButton = createNewDeleteButton()
    const labelAndRadioButton = createNewLabelAndRadioButton()

    removeCurrentPlusButton(objectListContainer)
    removeCheckedFromAllRadio(objectListContainer)

    singleObjectContainer.appendChild(labelAndRadioButton);
    singleObjectContainer.appendChild(deleteButton)
    objectListContainer.appendChild(singleObjectContainer)
    objectListContainer.appendChild(plusButton);

    const radioButtons = objectListContainer.querySelectorAll('input[type="radio"]')
    setupRadioButtonsObjectList(radioButtons);
    addObjectToJson(currentModule)
}

function createObjectContainer(){
    const singleObjectContainer = document.createElement("div");
    singleObjectContainer.className = "single-object-container";

    return singleObjectContainer
}

function createNewLabelAndRadioButton(){
    const labelElement = document.createElement("label");
    labelElement.className = "object-list-element radio-checked";
    const radioInput = document.createElement("input");
    radioInput.type = "radio";
    radioInput.name = "object-list";
    radioInput.className = "radio-input";
    radioInput.checked = true;
    labelElement.appendChild(radioInput);
    labelElement.appendChild(document.createTextNode("obiekt-1"));

    return labelElement
}

function createNewPlusButton() {
    const addButton = document.createElement("button");
    addButton.className = "plus-circle add-object";
    const plusIcon = document.createElement("i");
    plusIcon.className = "fas fa-plus";
    addButton.appendChild(plusIcon);
    addButton.addEventListener("click", addObjectToList)

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
    plus.remove()
}

function addObjectToJson(module)
{
    switch(module){
        case "characterEffect":
            newObject = new CharacterEffect()
            dynamicData["characterEffect"].list.push(newObject)
            fillFormFields(newObject)
            hideAndRevealRequiredItems(newObject)
            break;
    }
}

function removeObjectFromList(event){
    const objectId = event.target.previousElementSibling.textContent
    removeObjectFromJson(currentModule, objectId)
    const container = event.target.parentNode
    container.remove()
    if(container.firstChild.classList.contains("radio-checked"))
    {
        firstObject = document.querySelector(".object-list-element")
        firstObject.classList.add("radio-checked")
        fillFormFields(dynamicData[currentModule].list[0])
        hideAndRevealRequiredItems(dynamicData[currentModule].list[0])
    }

}

function changeObjectOnList(event){
    const objectId = event.target.parentNode.textContent
    const index = findObjectIndexOnList(currentModule, objectId)
    objectIndex = index
    workingObject = dynamicData[currentModule].list[objectIndex]
    fillFormFields(dynamicData[currentModule].list[index])
    hideAndRevealRequiredItems(dynamicData[currentModule].list[index])
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