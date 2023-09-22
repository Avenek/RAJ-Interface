function addObjectToList(container){
    const objectListContainer = document.querySelector(`.${container.listClassName}`)
    const singleObjectContainer = createObjectContainer(container)
    const deleteButton = createNewDeleteButton(container)
    const labelAndRadioButton = createNewLabelAndRadioButton(objectListContainer, container)
    let plusButton
    if(container.hasList)
    {
        plusButton = createNewPlusButton(container)
        removeCurrentPlusButton(objectListContainer)
    }
    else{
        removeCurrentPlusButton(objectListContainer)
    }

    removeCheckedFromAllRadio(objectListContainer)

    singleObjectContainer.appendChild(labelAndRadioButton);
    singleObjectContainer.appendChild(deleteButton)
    objectListContainer.appendChild(singleObjectContainer)
    if(container.hasList)
    {
    objectListContainer.appendChild(plusButton);
    }

    const radioButtons = objectListContainer.querySelectorAll('input[type="radio"]')
    setupRadioButtonsObjectList(radioButtons, container);
    addObjectToJson(container, labelAndRadioButton.textContent)
    revealFullForm(container)
}

function createObjectContainer(container){
    const singleObjectContainer = document.createElement("div");
    singleObjectContainer.className = "single-object-container";
    if(container.name === "behavior"){
        singleObjectContainer.addEventListener("dragstart", handleDragStart);
        singleObjectContainer.draggable = true
    }
    return singleObjectContainer
}

function createNewLabelAndRadioButton(objectListContainer, container){
    const labelElement = document.createElement("label");
    labelElement.className = "object-list-element radio-checked";
    const radioInput = document.createElement("input");
    radioInput.type = "radio";
    radioInput.name = "object-list";
    radioInput.className = "radio-input";
    radioInput.checked = true;
    labelElement.appendChild(radioInput);
    let defaultName="";
    switch(container.name){
        case "case":
            defaultName = 'ARGUMENT'
          break; 
        case "behavior":
            defaultName = 'IDLE'
            break;
        case "characterHide":
            defaultName = "HERO"
            break;
        case "weather":
            defaultName = "Rain"
            break;
        case "earthQuake":
            defaultName = "earthQuake"
            break;
        default:
            const radioButtons = objectListContainer.querySelectorAll('input[type="radio"]');
            let number = radioButtons.length
            defaultName = `obiekt-${number}`
            while(findObjectIndexOnList(defaultName, container) !== null){
                number+=1
                defaultName = `obiekt-${number}`
            }
          break; 
      }
    
    
    labelElement.appendChild(document.createTextNode(defaultName));

    return labelElement
}

function createNewPlusButton(container) {
    const addButton = document.createElement("div");
    addButton.className = "plus-circle add-object";
    const plusIcon = document.createElement("span");
    plusIcon.className = "fas fa-plus";
    addButton.appendChild(plusIcon);
    addButton.removeEventListener("click", () => addObjectToList(container))
    addButton.addEventListener("click", () => addObjectToList(container))

    return addButton
}

function createNewDeleteButton(container)
{   
    const deleteButton = document.createElement("div");
    deleteButton.className = "delete-icon";
    deleteButton.textContent = "🗑️";
    deleteButton.addEventListener("click", (event) => removeObjectFromList(event, container))

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

function addObjectToJson(container, id)
{
    let moduleName
    if(container.name === "behavior"){
        if(currentModule === "callInstantBehaviorFakeNpc"){
            moduleName = 'fakeNpcBehavior'
        }
        else{
            moduleName = currentModule+"Behavior"
        }

      container.workingObject = new objectDict[moduleName]();

      moduleName = "behavior"
    }
    else{

       moduleName = container.name

       container.workingObject = new objectDict[moduleName](id);
    }
    
    let index
    switch(moduleName){
        case "case":
            if(!objectContainer.workingObject.hasOwnProperty("case")){
                objectContainer.workingObject["case"] = {}
                objectContainer.workingObject["case"].list = []
            }
            objectContainer.workingObject["case"].list.push(container.workingObject)
            index = findObjectIndexOnList(id, container)
            container.currentIndex = index
            break;
         case "behavior":
            if(currentModule === "callInstantBehaviorFakeNpc"){
                objectContainer.workingObject.list.push(container.workingObject)
            }
            else{
                objectContainer.workingObject["behavior"].list.push(container.workingObject)
            }
            index = findObjectIndexOnList(id, container)
            container.currentIndex = index
            break;    
        default:
            if(objectContainer.hasList) {
                if(!dynamicData.hasOwnProperty(currentModule))
                {
                    dynamicData[currentModule]={}
                    dynamicData[currentModule].list=[]
                }
                container.list.push(container.workingObject)
                const index = findObjectIndexOnList(id, container)
                container.currentIndex = index
              }
              else {
                dynamicData[currentModule] = objectContainer.workingObject
              }
              clearKeyContainers()
              break;
    }


    fillFormFields(container.workingObject)
    removeDefaultValuesFromJson(container.workingObject, container.jsonConfig.properties, container)
    container.hideAndRevealRequiredItems()
    updateDynamicDataAndJsonText()
    hightligthsUsedExtraOption(container)
    saveJsonState()
}

function removeObjectFromList(event, container){
    if (window.confirm("Czy na pewno chcesz usunąć obiekt?")) {
        const objectId = event.target.previousElementSibling.textContent
        switch(container.name)
        {
            case "case":
                removeObjectFromJson(objectId, objectContainer.workingObject.case.list, container)
                break;
            case "behavior":
                if(currentModule === "callInstantBehaviorFakeNpc"){
                    removeObjectFromJson(objectId, objectContainer.workingObject.list, container)
                }
                else{
                    removeObjectFromJson(objectId, objectContainer.workingObject.behavior.list, container)
                }
                break;
            case "random", "randomFirstIndex", "getCharacterData", "light":
                break;
            default:
                removeObjectFromJson(objectId, container.list, container)
                clearKeyContainers()
        }
        const singleContainer = event.target.parentNode
        if(singleContainer.firstChild.classList.contains("radio-checked"))
        {
            
            localStorage.setItem("index", 0)
            const listContainer = document.querySelector(`.${container.listClassName}`)
            const elements = listContainer.querySelectorAll(".object-list-element")
            if(elements.length>1){
                if(container.currentIndex === 0){
                    elements[1].classList.add("radio-checked")
                }
                else{
                    elements[0].classList.add("radio-checked")
                }
                container.workingObject = container.list[0]
                fillFormFields(container.workingObject)
                container.hideAndRevealRequiredItems()
                hightligthsUsedExtraOption(container)
            }
            else{
                switch(container.name){
                    case "case":
                        objectContainer.removeObjectKeyByPath("case")
                        hideFullForm(container, true)
                        keyContainer.event.classList.remove("extra-option-active", "menu-active")
                        break;
                    case "behavior":
                        hideFullForm(container, true)
                        keyContainer.event.classList.remove("extra-option-active", "menu-active")
                        break;
                    case "random", "getCharacterData":
                        const path = container.event.previousElementSibling.previousElementSibling.name
                        const value = findObjectByProperty(objectContainer.jsonConfig.properties, path, "name").defaultInput
                        objectContainer.setObjectKeyByPath(path, value)
                        clearKeyContainers()
                        keyContainer.event.classList.remove("extra-option-active", "menu-active")
                        break;
                    case "randomFirstIndex":
                       objectContainer.removeObjectKeyByPath("behavior.randomFirstIndex")
                        clearKeyContainers()
                        keyContainer.event.classList.remove("extra-option-active", "menu-active")
                        break;
                    case "light":
                        objectContainer.removeObjectKeyByPath("d.light")
                        clearKeyContainers()
                        keyContainer.event.classList.remove("extra-option-active", "menu-active")
                        break;
                    default:
                        if(!container.hasList){
                            const plusButton = createNewPlusButton(container)
                            listContainer.appendChild(plusButton)
                        }
                        container.workingObject = null
                        delete dynamicData[currentModule]
                        hideFullForm(container, false)
                    break;
                }
            }

            updateDynamicDataAndJsonText()
        }
        container.currentIndex = 0
        singleContainer.remove()
        updateJsonTextArea()
        saveJsonState()
        
    }
}

function changeObjectOnList(container){
    if(container === objectContainer)
    {
        clearKeyContainers()
    }
    const listContainer = document.querySelector(`.${container.listClassName}`)
    const elements = listContainer.querySelectorAll(".object-list-element")
    let index
    for(let i = 0 ; i<elements.length ; i++){
        if(elements[i].classList.contains("radio-checked")){
            index = i
            break;
        }
    }
    container.currentIndex = index
    if(container === objectContainer){
        localStorage.setItem("index", index)
    }
    container.workingObject = container.list[index]
    fillFormFields(container.workingObject)
    container.hideAndRevealRequiredItems()
    removeDefaultValuesFromJson(container.workingObject, container.jsonConfig.properties, container)
    hightligthsUsedExtraOption(container)
}

function clearKeyContainers(){
    const containerKey = document.querySelector(".key-configuration")
    const listContainer = document.querySelector(".object-list-key")
    containerKey.innerHTML = ""
    listContainer.innerHTML = '<div class="container-title">Menu obiektów</div>'
    if(keyContainer){
        const extraOptionButton = keyContainer.event
        extraOptionButton.classList.remove("extra-option-active")
        extraOptionButton.classList.remove("menu-active")
    }
    
}

function setupRadioButtonsObjectList(radioButtons, container) {
    radioButtons.forEach(radioButton => {
        radioButton.removeEventListener('click', () => {
            radioButtons.forEach(rb => {
                rb.parentNode.classList.remove('radio-checked');
            });
            radioButton.parentNode.classList.add('radio-checked');
        });
        radioButton.addEventListener('click', () => {
            radioButtons.forEach(rb => {
                rb.parentNode.classList.remove('radio-checked');
            });
            radioButton.parentNode.classList.add('radio-checked');
        });
        radioButton.removeEventListener('change', () => changeObjectOnList(container))
        radioButton.addEventListener('change', () => changeObjectOnList(container))
    });
  }

  function updateObjectListText(container)
  {
    const objectListContainer = document.querySelector(`.${container.listClassName}`)
    const checkedRadioButton = objectListContainer.querySelector('label.radio-checked > input[type="radio"]');
    if(container.hasList){
    switch(container.name){
        case "case", "characterHide":
            checkedRadioButton.parentElement.firstChild.nextSibling.textContent = container.workingObject["kind"]
            break;
        case "behavior":
            checkedRadioButton.parentElement.firstChild.nextSibling.textContent = container.workingObject["name"]
            break;
        default:
            checkedRadioButton.parentElement.firstChild.nextSibling.textContent = container.workingObject["id"] || container.workingObject["name"]
            break;
        }
    }   
}