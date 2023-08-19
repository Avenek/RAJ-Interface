const moduleContainers = document.querySelectorAll(".single-module-container");
const containerLists = document.querySelectorAll('.container');

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

moduleContainers.forEach((moduleContainer) => {
    moduleContainer.addEventListener("dragstart", handleDragStart);
    moduleContainer.addEventListener("dragend", handleDragEnd);
    moduleContainer.addEventListener("dragover", handleDragOver);
    moduleContainer.addEventListener("drop", handleDrop);
});

document.addEventListener("dragover", (event) => {
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
            shadow.style.transform = "translate(-50%, -50%)";

            document.body.appendChild(shadow);
            draggedModule.shadow = shadow;
        }

        draggedModule.shadow.style.left = event.clientX + "px";
        draggedModule.shadow.style.top = event.clientY + "px";
    }
});

function saveState() {
    const mainContainerHTML = document.querySelector('.module-container').innerHTML;

    localStorage.setItem('srajContainerState', mainContainerHTML);
}

/*function addDragAndDropListeners() {
    moduleContainers.forEach((moduleContainer) => {
        moduleContainer.addEventListener("dragstart", handleDragStart);
        moduleContainer.addEventListener("dragend", handleDragEnd);
        moduleContainer.addEventListener("dragover", handleDragOver);
        moduleContainer.addEventListener("drop", handleDrop);
    });
}

function removeDragAndDropListeners() {
    moduleContainers.forEach((moduleContainer) => {
        moduleContainer.removeEventListener("dragstart", handleDragStart);
        moduleContainer.removeEventListener("dragend", handleDragEnd);
        moduleContainer.removeEventListener("dragover", handleDragOver);
        moduleContainer.removeEventListener("drop", handleDrop);
    });
}

function restoreState() {
    const mainContainerHTML = localStorage.getItem('srajContainerState');
    if (mainContainerHTML) {
        const moduleContainer = document.querySelector('.module-container');
        moduleContainer.innerHTML = mainContainerHTML;

        // Usuń stare event listenery
        removeDragAndDropListeners();

        // Dodaj nowe event listenery
        addDragAndDropListeners();
    }
}

window.addEventListener('load', () => {
    restoreState();
    console.log(localStorage.getItem("srajContainerState"));
});*/