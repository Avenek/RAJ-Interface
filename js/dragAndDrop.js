let singleModulesContainers = document.querySelectorAll(".single-module-container");
const containerLists = document.querySelectorAll('.container');
const moduleContainer = document.querySelector(".module-container")

let draggedModule = null;
let offsetX = 0;
let offsetY = 0;

function handleDragStart(event) {
   
    draggedModule = event.currentTarget;
    draggedModule.classList.add("dragging");

    const rect = draggedModule.getBoundingClientRect();
    offsetX = event.clientX - rect.left;
    offsetY = event.clientY - rect.top;
}

function handleDragEnd() {
    draggedModule.classList.remove("dragging");
    offsetX = 0;
    offsetY = 0;
    saveState()
}

function handleDragOver(event) {
    event.preventDefault();
}

function handleDrop(event) {
    event.preventDefault();

    if (draggedModule && draggedModule !== event.currentTarget) {
        if (event.clientX < event.currentTarget.getBoundingClientRect().left + event.currentTarget.clientWidth / 2) {
            event.currentTarget.parentNode.insertBefore(draggedModule, event.currentTarget);
        } else {
            event.currentTarget.parentNode.insertBefore(draggedModule, event.currentTarget.nextSibling);
        }
    }
}

function createDOMEvenets() {
    singleModulesContainers.forEach((singleModuleContainer) => {
        singleModuleContainer.addEventListener("dragstart", handleDragStart);
        singleModuleContainer.addEventListener("dragend", handleDragEnd);
        singleModuleContainer.addEventListener("dragover", handleDragOver);
        singleModuleContainer.addEventListener("drop", handleDrop);
    });
}


function saveState() {
    const mainContainerHTML = document.querySelector('.module-container').innerHTML;
    localStorage.setItem('srajContainerState', mainContainerHTML);
}

function restoreState() {
    const mainContainerHTML = localStorage.getItem('srajContainerState');
    if (mainContainerHTML) {
        moduleContainer.innerHTML = mainContainerHTML;
    }
    singleModulesContainers = document.querySelectorAll(".single-module-container");
    createDOMEvenets()
}

document.addEventListener("DOMContentLoaded", restoreState());

