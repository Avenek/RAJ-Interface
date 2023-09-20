let draggedModule = null;
let isHoverToolTip = false
let draggedElementParent;

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
    shadow.classList.add("shadow");

    return shadow
}


function isDroppedBeforeFirstContainer(event, firstModuleRect){
    console.log(firstModuleRect);
    return (event.pageX < firstModuleRect.left && isOnTheSameHigh(event, firstModuleRect))
}

function isDroppedAfterLastContainer(event, lastModuleRect){
    return (event.pageX > lastModuleRect.right && isOnTheSameHigh(event, lastModuleRect))
}

function isOnTheSameHigh(event, moduleRect) {
    return event.pageY > moduleRect.top && event.pageY < moduleRect.bottom
}

function isDroppedBetweemTwoContainers(event, moduleBeforeRect, moduleAfterRect){
    return (event.pageX > moduleBeforeRect.right && event.pageX < moduleAfterRect.left && event.pageY < moduleAfterRect.bottom) 
|| (event.pageX > moduleBeforeRect.right && moduleAfterRect.top != moduleBeforeRect.top && event.pageY<moduleBeforeRect.bottom) 
|| (event.pageX < moduleAfterRect.left && moduleAfterRect.top != moduleBeforeRect.top && event.pageY<moduleAfterRect.bottom)
}


function insertDraggedBeforeGivenModule(moduleOnRightSide){
        moduleOnRightSide.parentNode.insertBefore(draggedModule, moduleOnRightSide)
        draggedModule.insertAdjacentHTML('afterend', '\n');
}

function dropOnSingleModule(event)
{
    const targetModule = event.target.parentNode.parentNode
    if(isDroppedOnLeftSide(event))
    {
        insertDraggedBeforeGivenModule(targetModule)
        moduleOnRightSide = draggedModule.nextElementSibling
    } 
    else {
        insertDraggedBeforeGivenModule(targetModule.nextElementSibling)
        moduleOnRightSide = draggedModule.nextElementSibling
    }
}

function isDroppedOnLeftSide(event){
    return event.pageX < event.currentTarget.getBoundingClientRect().left + event.currentTarget.clientWidth / 2
}