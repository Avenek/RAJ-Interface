class DragAndDrop{
    constructor(){
        this.draggedModule = null;
        this.isHoverToolTip = false
        this.draggedElementParent = null;
    }
    

    handleDragOver(event) {
        event.preventDefault();
        if (draggedModule && draggedModule.classList.contains("dragging")) {
            draggedModule.shadow.style.left = event.pageX + "px";
            draggedModule.shadow.style.top = event.pageY + "px";
        }
    }

    createShadowButton() {
        const shadow = draggedModule.cloneNode(true);
        shadow.classList.remove("dragging");
        shadow.classList.add("shadow");

        return shadow
    }


    isDroppedBeforeFirstContainer(event, firstModuleRect){
        return (event.pageX < firstModuleRect.left && isOnTheSameHigh(event, firstModuleRect))
    }

    isDroppedAfterLastContainer(event, lastModuleRect){
        return (event.pageX > lastModuleRect.right && isOnTheSameHigh(event, lastModuleRect))
    }

    isOnTheSameHigh(event, moduleRect) {
        return event.pageY > moduleRect.top && event.pageY < moduleRect.bottom
    }

    isDroppedBetweemTwoContainers(event, moduleBeforeRect, moduleAfterRect){
        return (event.pageX > moduleBeforeRect.right && event.pageX < moduleAfterRect.left && event.pageY < moduleAfterRect.bottom) 
    || (event.pageX > moduleBeforeRect.right && moduleAfterRect.top != moduleBeforeRect.top && event.pageY<moduleBeforeRect.bottom) 
    || (event.pageX < moduleAfterRect.left && moduleAfterRect.top != moduleBeforeRect.top && event.pageY<moduleAfterRect.bottom)
    }


    insertDraggedBeforeGivenModule(moduleOnRightSide){
        moduleOnRightSide.parentNode.insertBefore(draggedModule, moduleOnRightSide)
        draggedModule.insertAdjacentHTML('afterend', '\n');
    }

    dropOnSingleModule(event)
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

    isDroppedOnLeftSide(event){
        return event.pageX < event.currentTarget.getBoundingClientRect().left + event.currentTarget.clientWidth / 2
    }
}