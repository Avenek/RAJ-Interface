class ObjectIdBoxView extends View{
    constructor(objectIdBox){
        super()
       this.objectIdBox = objectIdBox
       this.plusButton = this.createElement("div", "object-id-plus-circle")
       this.plusButton.textContent = "+"
       this.dragAndDrop = new DragAndDrop()
    }

    displayObjectIdBox = (objectIdList, hasList, addPlusButton = true) => {
        this.objectIdBox.innerHTML = ""
        const titleElement = this.createElement("div", "container-title")
        titleElement.textContent = "Menu obiektów"
        this.objectIdBox.append(titleElement)
        objectIdList.forEach(id => {
            const containerElement = this.createElement("div", "single-object-id-container")
            const idElement = id.isChecked ? this.createElement("div", "object-id", "option-checked") : this.createElement("div", "object-id")
            idElement.textContent = id.name
            const deleteButton = this.createElement("div", "object-id-delete-button")
            deleteButton.textContent = "🗑️"
            if(hasList){
                idElement.setAttribute("draggable", true);
                const copyButton = this.createElement("div", "object-id-copy-button")
                copyButton.textContent = "⧉"
                containerElement.append(idElement, copyButton, deleteButton)
            }
            else{
                containerElement.append(idElement, deleteButton)
            }
            this.objectIdBox.append(containerElement)
        })
        if((hasList || objectIdList.length === 0) && addPlusButton){
            this.objectIdBox.append(this.plusButton)
        }
    }

    bindCheckObjectId = (handler) => {
        this.objectIdBox.addEventListener("click", event => {
            if (event.target.classList.contains('object-id')) {
                const index = this.getIndexElement(this.objectIdBox, 'object-id', event.target)
                handler(index)
            }
        })
    }

    bindAddObjectId = (handler) => {
        this.objectIdBox.addEventListener("click", event => {
            if (event.target.classList.contains('object-id-plus-circle')) {
                handler()
            }
        })
    }

    bindCloneObjectId = (handler) => {
        this.objectIdBox.addEventListener("click", event => {
            if (event.target.classList.contains('object-id-copy-button')) {
                const index = this.getIndexElement(this.objectIdBox, "single-object-id-container", event.target.parentElement)
                handler(index)
            }
        })
    }

    bindDeleteObjectId = (handler) => {
        this.objectIdBox.addEventListener("click", event => {
            if (event.target.classList.contains('object-id-delete-button')) {
                if (window.confirm("Czy na pewno chcesz usunąć obiekt?")) {
                    const index = this.getIndexElement(this.objectIdBox, "single-object-id-container", event.target.parentElement)
                    handler(index)
                }
            }
        })
    }

    bindUpdateNameObjectId = (handler) => {
        this.objectIdBox.addEventListener("click", event => {
            if (event.target.classList.contains('test')) {
                 handler(index)
            }
        })
    }



    bindDragAndDrop = (handler) => {
        this.objectIdBox.addEventListener("dragstart", event => {
            if (event.target.classList.contains('object-id')) {
                this.handleDragStart(event)
            }
        })
        this.objectIdBox.addEventListener('dragend', event => { 
                this.handleDrop(event, handler) 
        });
    }

    handleDragStart = (event) => {
        this.dragAndDrop.draggedModule = event.target;
        this.dragAndDrop.draggedModule.classList.add("dragging")
    }

    handleDrop = (event, handler) => {
        if(this.dragAndDrop.draggedModule){
            this.dragAndDrop.draggedModule.classList.remove("dragging")
            if (this.isDroppedOnEmptyArea(event)) {
                handler(this.dropOnEmptyArea(event))
            }
            else if(this.dropOnSingleModule(event)){
                handler(this.dropOnSingleModule(event))
            }
            this.dragAndDrop.draggedModule = null
        } 
    }

    isDroppedOnEmptyArea = (event) => {
        return document.elementFromPoint(event.pageX, event.pageY).classList.contains("object-id-box")
    }
    
    isDroppedOnSingleModule = (event) => {
        return document.elementFromPoint(event.pageX, event.pageY).classList.contains("object-id") && this.draggedModule !== event.target
    }
    
    dropOnEmptyArea = (event) => {
        const fromDraggedModuleIndex = this.getIndexElement(this.objectIdBox, "object-id", this.dragAndDrop.draggedModule)
        const indexData = {
            "fromDraggedModule": fromDraggedModuleIndex,
        }

        const moduleElements = this.objectIdBox.querySelectorAll(".object-id");
        if(moduleElements.length===0)
        {
            indexData.moveTo = 0
            return indexData
        }
        const firstElementRect = moduleElements[0].getBoundingClientRect()
        const lastElementRect = moduleElements[moduleElements.length-1].getBoundingClientRect()
        if(this.dragAndDrop.isDroppedBeforeFirstContainer(event, firstElementRect))
        {
            indexData.moveTo = 0
            return indexData
        }
        else if(this.dragAndDrop.isDroppedAfterLastContainer(event, lastElementRect))
        {
            indexData.moveTo = moduleElements.length
            return indexData
        }
    
        for (let i = 1 ; i< moduleElements.length ; i++) {
            const moduleBeforeRect = moduleElements[i-1].getBoundingClientRect()
            const moduleAfterRect = moduleElements[i].getBoundingClientRect()
    
            if(this.dragAndDrop.isDroppedBetweemTwoContainers(event, moduleBeforeRect, moduleAfterRect)){
                indexData.moveTo = i
                return indexData
            }
        }
    }
    
    dropOnSingleModule = (event) => {
        const fromDraggedModuleIndex = this.getIndexElement(this.objectIdBox, "object-id", this.dragAndDrop.draggedModule)
        const indexData = {
            "fromDraggedModule": fromDraggedModuleIndex,
        }
        
        const moduleElements = this.objectIdBox.querySelectorAll(".object-id");
        if(this.isDroppedOnLeftSide(event))
        {
            const targetModuleIndex = this.getIndexElement(this.objectIdBox, "object-id", document.elementFromPoint(event.pageX, event.pageY)) - 1
            indexData.moveTo = targetModuleIndex === -1 ? 0 : targetModuleIndex
            return indexData
        } 
        else if(this.isDroppedOnRightSideLastModule(event, moduleElements)){
            indexData.moveTo = moduleElements.length
            return indexData
        }
        else{
            const targetModuleIndex = this.getIndexElement(this.objectIdBox, "object-id", document.elementFromPoint(event.pageX, event.pageY))
            indexData.moveTo = targetModuleIndex === 0 ? 1 : targetModuleIndex
            return indexData
        }
    }
    
    isDroppedOnLeftSide = (event) => {
        return event.pageX < document.elementFromPoint(event.pageX, event.pageY).getBoundingClientRect().left + document.elementFromPoint(event.pageX, event.pageY).clientWidth / 2
    }
    
    isDroppedOnRightSideLastModule = (event, moduleElements) => {
        const lastElementRect = moduleElements[moduleElements.length-1].getBoundingClientRect()
        const targetElementRect = document.elementFromPoint(event.pageX, event.pageY).getBoundingClientRect()
        return event.pageX > targetElementRect.right - document.elementFromPoint(event.pageX, event.pageY).clientWidth / 2 && targetElementRect.left === lastElementRect.left && targetElementRect.bottom === lastElementRect.bottom
    }
}