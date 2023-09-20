let moduleOnRightSide = null
let moduleOnLeftSide = null
let startIndex, endIndex

function handleDragStart(event) {
    if(isHoverToolTip)
    { 
        event.preventDefault();
        return
    }
    draggedModule = event.currentTarget;
    draggedModule.classList.add("dragging");
    draggedElementParent = draggedModule.parentNode

    if (!draggedModule.shadow) {
        const shadow = createShadowButton()
        document.body.appendChild(shadow);
        draggedModule.shadow = shadow;
    }
    startIndex = findIndexOfDraggedModule(draggedModule)
}

function handleDrop(event) {
    event.preventDefault()
    if (isDroppedOnEmptyArea(event)) {
        dropOnEmptyArea(event)
    } 
    else if(isDroppedOnContainer(event)){
        dropOnContainer(event)
    }
    else if (isDroppedOnSingleModule(event)){
        dropOnSingleModule(event)
    }
}

function isDroppedOnEmptyArea(event) {
    return event.target.classList.contains("object-list-key")
}

function isDroppedOnContainer(event){
    return event.target.classList.contains("single-object-container")
}

function isDroppedOnSingleModule(event) {
    return event.target.classList.contains("object-list-element") && draggedModule && draggedModule !== event.currentTarget
}

function dropOnEmptyArea(event){
    const container = document.querySelector('.object-list-key')
    const moduleContainers = container.querySelectorAll(".single-object-container");
    const firstContainerRect = moduleContainers[0].getBoundingClientRect()
    const lastContainerRect = moduleContainers[moduleContainers.length-1].getBoundingClientRect()
    if(isDroppedBeforeFirstContainer(event, firstContainerRect))
    {
        
        moduleOnRightSide = moduleContainers[0]
        insertDraggedBeforeGivenModule(moduleOnRightSide)
        return
    }
    else if(isDroppedAfterLastContainer(event, lastContainerRect))
    {
        moduleOnLeftSide = moduleContainers[moduleContainers.length-1]
        moduleOnLeftSide.parentNode.append(draggedModule)
        insertDraggedBeforeGivenModule(moduleOnLeftSide.nextElementSibling);
        return
    }

    for (let i = 1 ; i< moduleContainers.length ; i++) {
        const moduleBeforeRect = moduleContainers[i-1].getBoundingClientRect()
        const moduleAfterRect = moduleContainers[i].getBoundingClientRect()

        if(isDroppedBetweemTwoContainers(event, moduleBeforeRect, moduleAfterRect)){
            moduleOnRightSide = moduleContainers[i]
            insertDraggedBeforeGivenModule(moduleOnRightSide)
            return
        }
    }
}


function insertDraggedBeforeGivenModule(moduleOnRightSide){
        moduleOnRightSide.parentNode.insertBefore(draggedModule, moduleOnRightSide)
}

function dropOnSingleModule(event)
{
    const container = event.target.parentElement.parentElement
    const moduleContainers = container.querySelectorAll(".single-object-container");
    const targetModule = event.target.parentNode
    if(isDroppedOnLeftSide(event))
    {
        insertDraggedBeforeGivenModule(targetModule)
        moduleOnRightSide = draggedModule.nextElementSibling
    } 
    else if(isDroppedOnRightSideLastModule(event, moduleContainers)){
        moduleOnLeftSide = moduleContainers[moduleContainers.length-1]
        moduleOnLeftSide.parentNode.append(draggedModule)
        insertDraggedBeforeGivenModule(targetModule.nextElementSibling)
    }
    else{
        insertDraggedBeforeGivenModule(targetModule.nextElementSibling)
        moduleOnRightSide = draggedModule.nextElementSibling
    }
}

function dropOnContainer(event)
{
    const container = event.target.parentElement
    const moduleContainers = container.querySelectorAll(".single-object-container");
    const targetModule = event.target
    if(isDroppedOnLeftSide(event))
    {
        insertDraggedBeforeGivenModule(targetModule)
        moduleOnRightSide = draggedModule.nextElementSibling
    } 
    else if(isDroppedOnRightSideLastModule(event, moduleContainers)){
        moduleOnLeftSide = moduleContainers[moduleContainers.length-1]
        moduleOnLeftSide.parentNode.append(draggedModule)
        insertDraggedBeforeGivenModule(targetModule.previousElementSibling)
    }
    else{
        insertDraggedBeforeGivenModule(targetModule.nextElementSibling)
        moduleOnRightSide = draggedModule.nextElementSibling
    }
}

function isDroppedOnLeftSide(event){
    return event.pageX < event.target.getBoundingClientRect().left + event.target.clientWidth / 2
}

function isDroppedOnRightSideLastModule(event, moduleContainers){
    const lastContainerRect = moduleContainers[moduleContainers.length-1].getBoundingClientRect()
    const targetContainerRect = event.target.parentNode.getBoundingClientRect()
    return event.pageX > targetContainerRect.right - event.currentTarget.clientWidth / 2 && targetContainerRect.left === lastContainerRect.left && targetContainerRect.bottom === lastContainerRect.bottom
}

function handleDragEnd() {
    draggedModule.classList.remove("dragging")
    endIndex = findIndexOfDraggedModule(draggedModule)

    if (draggedModule.shadow) {
        document.body.removeChild(draggedModule.shadow)
        draggedModule.shadow = null
    }
    changeInBehaviorList()
    moduleOnLeftSide = null
    moduleOnRightSide = null
}

function changeInBehaviorList()
{
    const list = objectContainer.workingObject.behavior.list
    const [movedItem] = list.splice(startIndex, 1);
    list.splice(endIndex, 0, movedItem);
    keyContainer.currentIndex = endIndex
    updateDynamicDataAndJsonText()
}

function findIndexOfDraggedModule(draggedModule){
    const container = document.querySelector('.object-list-key')
    const moduleContainers = container.querySelectorAll(".single-object-container");
    for(let i = 0 ; i< moduleContainers.length ; i++){
        if(draggedModule === moduleContainers[i]){
            return i
        }
    }
}