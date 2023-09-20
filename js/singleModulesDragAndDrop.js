let moduleOnRightSide = null
let moduleOnLeftSide = null

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
}

function handleDrop(event) {
    event.preventDefault()
    if (isDroppedOnEmptyArea(event)) {
        dropOnEmptyArea(event)
    } 
    else if (isDroppedOnSingleModule(event)){
        dropOnSingleModule(event)
    }
}

function isDroppedOnEmptyArea(event) {
    return event.target.classList.contains("container")
}

function isDroppedOnSingleModule(event) {
    return event.target.classList.contains("glow-on-hover") && event.currentTarget.classList.contains("single-module-container") && draggedModule && draggedModule !== event.currentTarget
}

function dropOnEmptyArea(event){

    const moduleContainers = event.target.querySelectorAll(".single-module-container");
    if(moduleContainers.length===0)
    {
        event.target.append(draggedModule)
        return
    }
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
        draggedModule.insertAdjacentHTML('afterend', '\n');
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
        draggedModule.insertAdjacentHTML('afterend', '\n');
}

function dropOnSingleModule(event)
{
    const container = event.target.parentElement.parentElement.parentElement
    const moduleContainers = container.querySelectorAll(".single-module-container");
    const targetModule = event.target.parentNode.parentNode
    if(isDroppedOnLeftSide(event))
    {
        insertDraggedBeforeGivenModule(targetModule)
        moduleOnRightSide = draggedModule.nextElementSibling
    } 
    else if(isDroppedOnRightSideLastModule(event, moduleContainers)){
        moduleOnLeftSide = moduleContainers[moduleContainers.length-1]
        moduleOnLeftSide.parentNode.append(draggedModule)
        draggedModule.insertAdjacentHTML('afterend', '\n');
    }
    else{
        insertDraggedBeforeGivenModule(targetModule.nextElementSibling)
        moduleOnRightSide = draggedModule.nextElementSibling
    }
}

function isDroppedOnLeftSide(event){
    return event.pageX < event.currentTarget.getBoundingClientRect().left + event.currentTarget.clientWidth / 2
}

function isDroppedOnRightSideLastModule(event, moduleContainers){
    const lastContainerRect = moduleContainers[moduleContainers.length-1].getBoundingClientRect()
    const targetContainerRect = event.currentTarget.getBoundingClientRect()
    return event.pageX > targetContainerRect.right - event.currentTarget.clientWidth / 2 && targetContainerRect.left === lastContainerRect.left && targetContainerRect.bottom === lastContainerRect.bottom
}

function handleDragEnd() {
    draggedModule.classList.remove("dragging")

    if (draggedModule.shadow) {
        document.body.removeChild(draggedModule.shadow)
        draggedModule.shadow = null
    }
    updateContainerWithDeleteElement(draggedElementParent)
    updateContainerWithDeleteElement(draggedModule.parentNode)
    saveChangesToLocalStorage()
    moduleOnLeftSide = null
    moduleOnRightSide = null
}

function saveChangesToLocalStorage()
{
    const draggedModuleName = draggedModule.querySelector(".glow-on-hover").textContent;
        const draggedModuleObject = storedContainers.containers
        .flatMap(container => container.modules)
        .find(module => module.name === draggedModuleName);
        for (const container of storedContainers.containers) {
            const draggedModuleIndex = container.modules.findIndex(module => module.name === draggedModuleName);
            
            if (draggedModuleIndex !== -1) {
            container.modules.splice(draggedModuleIndex, 1);
            break;
            }
        }
    if(moduleOnLeftSide!==null || moduleOnRightSide !== null)
    {
        if(moduleOnRightSide!==null)
        {
            const rightDestinationModuleName = moduleOnRightSide.querySelector(".glow-on-hover").textContent;
            for (const container of storedContainers.containers) {
                const rightDestinationModule = container.modules.findIndex(module => module.name === rightDestinationModuleName);
                
                if (rightDestinationModule !== -1) {
                container.modules.splice(rightDestinationModule, 0, draggedModuleObject);
                break;
                }
            }
        }
        else{
            const leftDestinationModuleName = moduleOnLeftSide.querySelector(".glow-on-hover").textContent;
            for (const container of storedContainers.containers) {
                const leftDestinationModule = container.modules.findIndex(module => module.name === leftDestinationModuleName);
                
                if (leftDestinationModule !== -1) {
                container.modules.push(draggedModuleObject)
                break;
                }
            }
        } 
      
    }
    else{
        const moduleName = draggedModule.parentElement.firstChild.nextElementSibling.textContent;
        for (const container of storedContainers.containers) {
            if (container.title === moduleName) {
            container.modules.push(draggedModuleObject)
            break;
            }
        }
    }
    localStorage.setItem('containerConfig', JSON.stringify(storedContainers));
}
