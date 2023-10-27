class DragAndDrop{
    constructor(){
        this.draggedModule = null;
        this.isHoverToolTip = false
        this.draggedElementParent = null;
        this.shadow = null
    }

    handleDragOver(event) {
        event.preventDefault();
        if (this.draggedModule && this.draggedModule.classList.contains("dragging")) {
            this.shadow.style.left = event.pageX + "px";
            this.shadow.style.top = event.pageY + "px";
        }
    }

    createShadowButton() {
        this.shadow = this.draggedModule.cloneNode(true);
        this.shadow.classList.remove("dragging");
        this.shadow.classList.add("shadow");
        document.body.appendChild(this.shadow);
    }

    isDroppedBeforeFirstContainer(event, firstModuleRect){
        return (event.pageX < firstModuleRect.left && this.isOnTheSameHigh(event, firstModuleRect))
    }

    isDroppedAfterLastContainer(event, lastModuleRect){
        return (event.pageX > lastModuleRect.right && this.isOnTheSameHigh(event, lastModuleRect))
    }

    isOnTheSameHigh(event, moduleRect) {
        return event.pageY > moduleRect.top && event.pageY < moduleRect.bottom
    }

    isDroppedBetweemTwoContainers(event, moduleBeforeRect, moduleAfterRect){
        return (event.pageX > moduleBeforeRect.right && event.pageX < moduleAfterRect.left && event.pageY < moduleAfterRect.bottom) 
    || (event.pageX > moduleBeforeRect.right && moduleAfterRect.top != moduleBeforeRect.top && event.pageY<moduleBeforeRect.bottom) 
    || (event.pageX < moduleAfterRect.left && moduleAfterRect.top != moduleBeforeRect.top && event.pageY<moduleAfterRect.bottom)
    }
}