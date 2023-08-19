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

    if (draggedModule.shadow) {
        document.body.removeChild(draggedModule.shadow);
        draggedModule.shadow = null;
    }

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
    document.addEventListener("dragover", handleDragOver);
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

