let singleModulesContainers = document.querySelectorAll(".single-module-container");
const containerLists = document.querySelectorAll('.container');
const srajModuleContainers = document.querySelector(".sraj-modules-container")
let draggedElementParent;

let draggedModule = null;
let offsetX = 0;
let offsetY = 0;
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

    const rect = draggedModule.getBoundingClientRect();
    offsetX = event.clientX - rect.left;
    offsetY = event.clientY - rect.top;
}

function handleDragEnd() {
    draggedModule.classList.remove("dragging");
    offsetX = 0;
    offsetY = 0;

    if (draggedModule.shadow) {
        document.body.removeChild(draggedModule.shadow);
        draggedModule.shadow = null;
    }
    updateContainerWithDeleteElement(draggedElementParent)
    updateContainerWithDeleteElement(draggedModule.parentNode);
    saveState()
}

function handleDragOver(event) {
    event.preventDefault();

    if (draggedModule && draggedModule.classList.contains("dragging")) {
        if (!draggedModule.shadow) {
            const shadow = draggedModule.cloneNode(true);
            shadow.classList.remove("dragging");
            shadow.style.position = "fixed";
            shadow.style.pointerEvents = "none";
            shadow.style.opacity = "0.7";
            shadow.style.zIndex = "1000";
            shadow.style.transition = "none";
            shadow.style.transform = "translate(-50%, -50%)"; // Dostosowanie położenia

            document.body.appendChild(shadow);
            draggedModule.shadow = shadow;
        }
        
        // Aktualizujemy pozycję cienia podczas przeciągania
        draggedModule.shadow.style.left = event.clientX + "px";
        draggedModule.shadow.style.top = event.clientY + "px";
    }
}

function handleDrop(event) {
    event.preventDefault();
    if (event.target.classList.contains("container")) {
        // Get all single-module-container elements within the container
        const moduleContainers = event.target.querySelectorAll(".single-module-container");
        // Find the appropriate position to insert the dragged module
        let targetContainer = null;

        if(moduleContainers.length===0)
        {
            event.target.append(draggedModule)
        }
        for (let i = 1 ; i< moduleContainers.length ; i++) {
            const moduleBeforeRect = moduleContainers[i-1].getBoundingClientRect();
            const moduleRect = moduleContainers[i].getBoundingClientRect();

            if (event.clientY > moduleRect.top && event.clientY < moduleRect.bottom) {
                if(event.clientX < moduleBeforeRect.left){
                    targetContainer = moduleContainers[i-1]
                    targetContainer.parentNode.insertBefore(draggedModule, targetContainer);
                    break;
                }
                else if(event.clientX > moduleRect.right && i == moduleContainers.length-1)
                {
                    targetContainer = moduleContainers[i]
                    targetContainer.parentNode.append(draggedModule);
                    break;
                }
                else if(event.clientX > moduleBeforeRect.right && event.clientX < moduleBeforeRect.left)
                {
                    targetContainer = moduleContainers[i]
                    targetContainer.parentNode.insertBefore(draggedModule, targetContainer);
                    break;
                }
                
            }
        }
    } 
    else if (event.target.classList.contains("glow-on-hover")){
        if(event.currentTarget.classList.contains("single-module-container"))
        {
            console.log(event.currentTarget);
            if (draggedModule && draggedModule !== event.currentTarget) {
                if (event.clientX < event.currentTarget.getBoundingClientRect().left + event.currentTarget.clientWidth / 2) {
                    event.target.parentNode.parentNode.parentNode.insertBefore(draggedModule, event.target.parentNode.parentNode);
                
                } else {
                    event.target.parentNode.parentNode.parentNode.insertBefore(draggedModule, event.target.parentNode.parentNode.nextSibling);
                    
                }
            }
        }
    }
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
    const toolTips = document.querySelectorAll(".tool-tip")
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

localStorage.clear()