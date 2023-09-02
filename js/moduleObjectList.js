
function createObjectList(module, moduleObject)
{
    let objectsContainerHtml = `
    <div class="object-list-container">
        <div class="container-title">Lista obiektów</div>`
    const ids = dynamicData[module].list.map(item => item.id || item.name);
        ids.forEach(id => {
          const checkedClass = id === moduleObject.id || id === moduleObject.name ? "checked" : ""
          objectsContainerHtml+= `<div class="single-object-container"><label class="object-list-element ${checkedClass}"><input type="radio" name="object-list" class="radio-input">${id}</label><div class="delete-icon">🗑️</div></div>`;
        });
    objectsContainerHtml += '<button class="plus-circle add-object"><i class="fas fa-plus"></i></button></div>'
    return objectsContainerHtml  
}

function addObjectToList(){
    const objectListContainer = document.querySelector(".object-list-container")
    const plus = objectListContainer.querySelector(".add-object")
    plus.remove()
    objects = objectListContainer.querySelectorAll(".object-list-element")
    objects.forEach(object => object.classList.remove("checked"))
    objectListContainer.innerHTML+='<div class="single-object-container"><label class="object-list-element checked"><input type="radio" name="object-list" class="radio-input">obiekt-1</label><div class="delete-icon">🗑️</div></div><button class="plus-circle add-object"><i class="fas fa-plus"></i></button></div>'
    const radioButtons = objectListContainer.querySelectorAll('input[type="radio"]')
    setupRadioButtonsObjectList(radioButtons);
    addObjectPlus = document.querySelector(".add-object")
    addObjectPlus.addEventListener("click", addObjectToList)
    removeObjectButtons = document.querySelectorAll(".delete-icon")
    removeObjectButtons.forEach(button => button.addEventListener("click", removeObjectFromList))
    addObjectToJson(currentModule)

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
    if(container.firstChild.classList.contains("checked"))
    {
        firstObject = document.querySelector(".object-list-element")
        firstObject.classList.add("checked")
        fillFormFields(dynamicData[currentModule].list[0])
        hideAndRevealRequiredItems(dynamicData[currentModule].list[0])
    }

}

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

function changeObjectOnList(event){
    const objectId = event.target.parentNode.textContent
    const index = findObjectIndexOnList(currentModule, objectId)
    fillFormFields(dynamicData[currentModule].list[index])
    hideAndRevealRequiredItems(dynamicData[currentModule].list[index])
}

function setupRadioButtonsObjectList(radioButtons) {
    radioButtons.forEach(radioButton => {
        radioButton.addEventListener('click', () => {
            radioButtons.forEach(rb => {
                rb.parentNode.classList.remove('checked');
            });
            radioButton.parentNode.classList.add('checked');
        });
        radioButton.addEventListener('change', changeObjectOnList)
    });
  }