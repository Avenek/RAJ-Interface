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

    isDroppedOnEmptyArea = (event) => {
        return event.target.classList.contains("container")
    }
    
    isDroppedOnSingleModule = (event) => {
        return event.target.classList.contains("glow-on-hover") && this.draggedModule !== event.target
    }
    
    dropOnEmptyArea = (event) => {
        const moduleContainers = event.target.querySelectorAll(".single-module-container");
        if(moduleContainers.length===0)
        {
            event.target.append(draggedModule)
            return
        }
        const firstContainerRect = moduleContainers[0].getBoundingClientRect()
        const lastContainerRect = moduleContainers[moduleContainers.length-1].getBoundingClientRect()
        if(isDroppedBeforeFirstContainer(event, firstContainerRect))
        {
            moduleOnRightSide = moduleContainers[0]
            if(moduleOnRightSide === draggedModule){
                moduleOnRightSide = moduleContainers[1]
            }
            insertDraggedBeforeGivenModule(moduleOnRightSide)
            return
        }
        else if(isDroppedAfterLastContainer(event, lastContainerRect))
        {
            moduleOnLeftSide = moduleContainers[moduleContainers.length-1]
            if(moduleOnLeftSide === draggedModule){
                moduleOnLeftSide = moduleContainers[moduleContainers.length-2]
            }
            moduleOnLeftSide.parentNode.append(draggedModule)
            draggedModule.insertAdjacentHTML('afterend', '\n');
            return
        }
    
        for (let i = 1 ; i< moduleContainers.length ; i++) {
            const moduleBeforeRect = moduleContainers[i-1].getBoundingClientRect()
            const moduleAfterRect = moduleContainers[i].getBoundingClientRect()
    
            if(isDroppedBetweemTwoContainers(event, moduleBeforeRect, moduleAfterRect)){
                moduleOnRightSide = moduleContainers[i]
                insertDraggedBeforeGivenModule(moduleOnRightSide)
                return
            }
        }
    }
    
    dropOnSingleModule = (event) => {
        const container = event.target.parentElement.parentElement.parentElement
        const moduleContainers = container.querySelectorAll(".single-module-container");
        const targetModule = event.target.parentNode.parentNode
        if(isDroppedOnLeftSide(event))
        {
            insertDraggedBeforeGivenModule(targetModule)
            moduleOnRightSide = draggedModule.nextElementSibling
        } 
        else if(isDroppedOnRightSideLastModule(event, moduleContainers)){
            moduleOnLeftSide = moduleContainers[moduleContainers.length-1]
            moduleOnLeftSide.parentNode.append(draggedModule)
            draggedModule.insertAdjacentHTML('afterend', '\n');
        }
        else{
            insertDraggedBeforeGivenModule(targetModule.nextElementSibling)
            moduleOnRightSide = draggedModule.nextElementSibling
        }
    }
    
    isDroppedOnLeftSide = (event) => {
        return event.pageX < event.currentTarget.getBoundingClientRect().left + event.currentTarget.clientWidth / 2
    }
    
    isDroppedOnRightSideLastModule = (event, moduleContainers) => {
        const lastContainerRect = moduleContainers[moduleContainers.length-1].getBoundingClientRect()
        const targetContainerRect = event.currentTarget.getBoundingClientRect()
        return event.pageX > targetContainerRect.right - event.currentTarget.clientWidth / 2 && targetContainerRect.left === lastContainerRect.left && targetContainerRect.bottom === lastContainerRect.bottom
    }
}