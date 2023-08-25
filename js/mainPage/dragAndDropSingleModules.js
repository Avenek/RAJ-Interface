const singleModulesContainers = document.querySelectorAll(".single-module-container");
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
    console.log(draggedModule);

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
    let targetContainer = null
    for (let i = 1 ; i< moduleContainers.length ; i++) {
        const moduleBeforeRect = moduleContainers[i-1].getBoundingClientRect()
        const moduleRect = moduleContainers[i].getBoundingClientRect()

        if ((event.pageY > moduleRect.top && event.pageY < moduleRect.bottom) || (event.pageY > moduleBeforeRect.top && event.pageY < moduleBeforeRect.bottom)) {
            if(event.pageX < moduleBeforeRect.left && moduleRect.top == moduleBeforeRect.top)
            {
                targetContainer = moduleContainers[i-1]
                targetContainer.parentNode.insertBefore(draggedModule, targetContainer)
                draggedModule.insertAdjacentHTML('afterend', '\n');
                return
            }
            else if(event.pageX > moduleRect.right && i == moduleContainers.length-1)
            {
                targetContainer = moduleContainers[i]
                targetContainer.parentNode.append(draggedModule)
                draggedModule.insertAdjacentHTML('afterend', '\n');
                return
            }
            else if((event.pageX > moduleBeforeRect.right && event.pageX < moduleRect.left && moduleRect.top == moduleBeforeRect.top) || (event.pageX > moduleBeforeRect.right && moduleRect.top != moduleBeforeRect.top && event.pageY<moduleBeforeRect.bottom))
            {
                targetContainer = moduleContainers[i]
                targetContainer.parentNode.insertBefore(draggedModule, targetContainer)
                draggedModule.insertAdjacentHTML('afterend', '\n');
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
        console.log(1);
        targetModuleParent.insertBefore(draggedModule, targetModule) 
        draggedModule.insertAdjacentHTML('afterend', '\n');
    } 
    else {
        console.log(2);
        targetModuleParent.insertBefore(draggedModule, targetModule.nextSibling)
        targetModule.insertAdjacentHTML('afterend', '\n');
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
    saveSrajContainerState()
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

createDOMEvenets()
console.log(containerLists);