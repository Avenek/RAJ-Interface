let draggedElementParent;
let draggedModule = null;
let isHoverToolTip = false
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

function handleDragOver(event) {
    event.preventDefault();
    if (draggedModule && draggedModule.classList.contains("dragging")) {
        draggedModule.shadow.style.left = event.pageX + "px";
        draggedModule.shadow.style.top = event.pageY + "px";
    }
}

function createShadowButton() {
    const shadow = draggedModule.cloneNode(true);
    shadow.classList.remove("dragging");
    shadow.style.position = "fixed";
    shadow.style.pointerEvents = "none";
    shadow.style.opacity = "0.7";
    shadow.style.zIndex = "1000";
    shadow.style.transition = "none";
    shadow.style.transform = "translate(-50%, -50%)";

    return shadow
}

function handleDrop(event) {
    event.preventDefault()
    if (event.target.classList.contains("container")) {
        dropOnEmptyArea(event)
    } 
    else if (event.target.classList.contains("glow-on-hover") && event.currentTarget.classList.contains("single-module-container") && draggedModule && draggedModule !== event.currentTarget){
        dropOnSingleModule(event)
    }
}

function dropOnEmptyArea(event){

    const moduleContainers = event.target.querySelectorAll(".single-module-container");
    if(moduleContainers.length===0)
    {
        event.target.append(draggedModule)
        return
    }

    for (let i = 1 ; i< moduleContainers.length ; i++) {
        const moduleBeforeRect = moduleContainers[i-1].getBoundingClientRect()
        const moduleRect = moduleContainers[i].getBoundingClientRect()

        if ((event.pageY > moduleRect.top && event.pageY < moduleRect.bottom) || (event.pageY > moduleBeforeRect.top && event.pageY < moduleBeforeRect.bottom)) {
            if(event.pageX < moduleBeforeRect.left && moduleRect.top == moduleBeforeRect.top)
            {
                moduleOnRightSide = moduleContainers[i-1]
                moduleOnRightSide.parentNode.insertBefore(draggedModule, moduleOnRightSide)
                draggedModule.insertAdjacentHTML('afterend', '\n');
                moduleOnRightSide = draggedModule.nextElementSibling
                return
            }
            else if(event.pageX > moduleRect.right && i == moduleContainers.length-1)
            {
                moduleOnRightSide = moduleContainers[i]
                moduleOnRightSide.parentNode.append(draggedModule)
                draggedModule.insertAdjacentHTML('afterend', '\n');
                moduleOnRightSide = null
                moduleOnLeftSide = draggedModule.previousElementSibling
                return
            }
            else if((event.pageX > moduleBeforeRect.right && event.pageX < moduleRect.left && moduleRect.top == moduleBeforeRect.top) || (event.pageX > moduleBeforeRect.right && moduleRect.top != moduleBeforeRect.top && event.pageY<moduleBeforeRect.bottom))
            {
                moduleOnRightSide = moduleContainers[i]
                moduleOnRightSide.parentNode.insertBefore(draggedModule, moduleOnRightSide)
                draggedModule.insertAdjacentHTML('afterend', '\n');
                moduleOnRightSide = draggedModule.nextElementSibling
                return
            }
        }
    }
}

function dropOnSingleModule(event)
{
    const targetModule = event.target.parentNode.parentNode
    const targetModuleParent = event.target.parentNode.parentNode.parentNode
    if(isDroppedOnLeftSide(event))
    {
        targetModuleParent.insertBefore(draggedModule, targetModule) 
        draggedModule.insertAdjacentHTML('afterend', '\n');
        moduleOnRightSide = draggedModule.nextElementSibling
    } 
    else {
        targetModuleParent.insertBefore(draggedModule, targetModule.nextSibling)
        targetModule.insertAdjacentHTML('afterend', '\n');
        moduleOnRightSide = draggedModule.nextElementSibling
        moduleOnLeftSide = draggedModule.previousElementSibling
    }
}

function isDroppedOnLeftSide(event){
    return event.pageX < event.currentTarget.getBoundingClientRect().left + event.currentTarget.clientWidth / 2
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
    else {
        const leftDestinationModuleName = moduleOnLeftSide.querySelector(".glow-on-hover").textContent;
        for (const container of storedContainers.containers) {
            const leftDestinationModule = container.modules.findIndex(module => module.name === leftDestinationModuleName);
            
            if (leftDestinationModule !== -1) {
            container.modules.push(draggedModuleObject)
            break;
            }
        }
    } 
    localStorage.setItem('containerConfig', JSON.stringify(storedContainers));
}
