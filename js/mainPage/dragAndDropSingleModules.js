let singleModulesContainers
const toolTips = document.querySelectorAll(".tool-tip")
const containerLists = document.querySelectorAll('.container');
const srajModuleContainers = document.querySelector(".sraj-modules-container")
let draggedElementParent;
let draggedModule = null;
let isHoverToolTip = false

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
        draggedModule.shadow.style.left = event.clientX + "px";
        draggedModule.shadow.style.top = event.clientY + "px";
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
        if (event.clientX < event.currentTarget.getBoundingClientRect().left + event.currentTarget.clientWidth / 2) {
            event.target.parentNode.parentNode.parentNode.insertBefore(draggedModule, event.target.parentNode.parentNode)     
        } 
        else {
            event.target.parentNode.parentNode.parentNode.insertBefore(draggedModule, event.target.parentNode.parentNode.nextSibling)             
        }
    }
}

function dropOnEmptyArea(event){
    if(singleModulesContainers.length===0)
    {
        event.target.append(draggedModule)
        return
    }
    let targetContainer = null
    for (let i = 1 ; i< singleModulesContainers.length ; i++) {
        const moduleBeforeRect = singleModulesContainers[i-1].getBoundingClientRect()
        const moduleRect = singleModulesContainers[i].getBoundingClientRect()

        if (event.clientY > moduleRect.top && event.clientY < moduleRect.bottom) {
            if(event.clientX < moduleBeforeRect.left)
            {
                targetContainer = singleModulesContainers[i-1]
                targetContainer.parentNode.insertBefore(draggedModule, targetContainer)
                return
            }
            else if(event.clientX > moduleRect.right && i == singleModulesContainers.length-1)
            {
                targetContainer = singleModulesContainers[i]
                targetContainer.parentNode.append(draggedModule)
                return
            }
            else if(event.clientX > moduleBeforeRect.right && event.clientX < moduleBeforeRect.left)
            {
                targetContainer = singleModulesContainers[i]
                targetContainer.parentNode.insertBefore(draggedModule, targetContainer)
                return
            }   
        }
    }
}

function handleDragEnd() {
    draggedModule.classList.remove("dragging")

    if (draggedModule.shadow) {
        document.body.removeChild(draggedModule.shadow)
        draggedModule.shadow = null
    }
    updateContainerWithDeleteElement(draggedElementParent)
    updateContainerWithDeleteElement(draggedModule.parentNode)
    saveState()
}

function createDOMEvenets() {
    srajModuleContainers.addEventListener("drop", handleDrop)

    singleModulesContainers.forEach((singleModuleContainer) => {
        singleModuleContainer.addEventListener("dragstart", handleDragStart);
        singleModuleContainer.addEventListener("dragend", handleDragEnd);
        singleModuleContainer.addEventListener("dragover", handleDragOver);
        singleModuleContainer.addEventListener("drop", handleDrop);
    });
    
    document.addEventListener("dragover", handleDragOver);

    toolTips.forEach(toolTip => {
        toolTip.addEventListener("mouseover", ()=>isHoverToolTip = true)
        toolTip.addEventListener("mouseout", ()=>isHoverToolTip = false)
    })
}

function saveState() {
    const mainContainerHTML = document.querySelector('.sraj-modules-container').innerHTML;
    localStorage.setItem('srajContainerState', mainContainerHTML);
}

function restoreState() {
    const mainContainerHTML = localStorage.getItem('srajContainerState');
    if (mainContainerHTML) {
        srajModuleContainers.innerHTML = mainContainerHTML;
    }
    singleModulesContainers = document.querySelectorAll(".single-module-container");
    createDOMEvenets()
}

document.addEventListener("DOMContentLoaded", restoreState());

//localStorage.clear()