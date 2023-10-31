class ModulesBoxView extends View{
    constructor(modulesBox){
        super()
       this.modulesBox = modulesBox
       this.plusButton = this.createElement("div", "plus-circle")
       this.dragAndDrop = new DragAndDrop()
    }

    displayModulesBox = (modulesList) => {
        let html =''
        for(const container of modulesList.containers)
        {   
            let containerDiv = `<div class="container">
            <div class="container-title">${container.title}</div>
            <div class="edit-button">⚙️</div>`
            containerDiv += container.modules.length!==0 ? `<div class="delete-button hide">🗑️</div>\n` : `<div class="delete-button">🗑️</div>\n`
            for(const singleModule of container.modules)
            {
                containerDiv += `<div class="single-module-container">
                <div class="drag-button">↕</div>
                <div class="tool-tip">
                    <div class="tool-tip-icon">i</div>
                    <p class="tool-tip-info">${singleModule.tipInfo}</p>
                  </div>
                <div class="glow-on-hover"><img src="assets/pictures/${singleModule.name.charAt(0).toLowerCase() + singleModule.name.slice(1)}.png" alt="${singleModule.name}"><br>${singleModule.name}</div>
            </div>\n`
            }
            containerDiv+="</div>"
            html +=containerDiv
        }
        this.modulesBox.innerHTML = html
        this.plusButton.textContent = "+"
        this.modulesBox.append(this.plusButton)
    }

    bindAddContainer = (handler) => {
        this.plusButton.addEventListener("click", event => {
          event.preventDefault()
            handler()
        })
    }

    bindDeleteContainer = (handler) => {
        this.modulesBox.addEventListener("click", event => {
            if (event.target.className === 'delete-button') {
            const container = event.target.parentElement
            const index = this.getIndexElement(this.modulesBox, "container", container)
                handler(index)
            }
        })
    }

    bindUpdateNameContainer = (handler) => {
        this.modulesBox.addEventListener("click", event => {
            if (event.target.className === 'edit-button') {
                this.settingForm(event, handler)
            }
        })
    }

    settingForm(event, handler){
        const titleDiv = event.target.parentElement.firstElementChild
        const input = this.createInput(titleDiv)
        const oldTitle = titleDiv.textContent
        titleDiv.textContent = "";
        titleDiv.appendChild(input);
        input.focus();
        const container = event.target.parentElement
        const index = this.getIndexElement(this.modulesBox, "container", container)
        input.addEventListener("keyup", (event) => {
            if (event.key === "Enter") {
                handler(index, input.value)
            }
        })
        input.addEventListener("blur", () => {
            handler(index, input.value)
        })
        
    };
    
    createInput(titleDiv){
        const input = this.createElement("input");
        input.style.width = "200px";
        input.type = "text";
        input.value = titleDiv.textContent;
    
        return input
    }

    bindDragAndDrop = (handler) => {
        this.modulesBox.addEventListener("mousedown", event => {
            if (event.target.className === 'drag-button') {
                this.handleDragStart(event)
                this.dragAndDrop.handleDragOver(event)
            }
        })
        this.modulesBox.addEventListener("mousemove", event => {
            this.dragAndDrop.handleDragOver(event)
        })
        this.root.addEventListener('mouseup', event => { 
            this.handleDrop(event, handler) 
        });
        
    }

    handleDragStart = (event) => {
        this.dragAndDrop.draggedModule = event.target.parentElement;
        this.dragAndDrop.draggedModule.classList.add("dragging")
        this.dragAndDrop.createShadowButton()
    }

    handleDrop = (event, handler) => {
        if(this.dragAndDrop.draggedModule){
            this.dragAndDrop.draggedModule.classList.remove("dragging")

            this.dragAndDrop.shadow.remove()
            if (this.isDroppedOnEmptyArea(event)) {
                handler(this.dropOnEmptyArea(event))
            } 
            else if (this.isDroppedOnSingleModule(event)){
                handler(this.dropOnSingleModule(event))
            }
            this.dragAndDrop.draggedModule = null
        }
    }

    isDroppedOnEmptyArea = (event) => {
        return event.target.classList.contains("container")
    }
    
    isDroppedOnSingleModule = (event) => {
        return event.target.classList.contains("glow-on-hover") && this.draggedModule !== event.target
    }
    
    dropOnEmptyArea = (event) => {
        const fromContainer = this.dragAndDrop.draggedModule.parentElement
        const fromContainerIndex = this.getIndexElement(this.modulesBox, "container", fromContainer)
        const fromDraggedModuleIndex = this.getIndexElement(fromContainer, "single-module-container", this.dragAndDrop.draggedModule)
        const toContainer = event.target
        const toContainerIndex = this.getIndexElement(this.modulesBox, "container", toContainer)
        const indexData = {
            "fromContainer": fromContainerIndex,
            "fromDraggedModule": fromDraggedModuleIndex,
            "toContainer": toContainerIndex
        }

        const moduleContainers = event.target.querySelectorAll(".single-module-container");
        if(moduleContainers.length===0)
        {
            indexData.moveTo = 0
            return indexData
        }
        const firstContainerRect = moduleContainers[0].getBoundingClientRect()
        const lastContainerRect = moduleContainers[moduleContainers.length-1].getBoundingClientRect()
        if(this.dragAndDrop.isDroppedBeforeFirstContainer(event, firstContainerRect))
        {
            indexData.moveTo = 0
            return indexData
        }
        else if(this.dragAndDrop.isDroppedAfterLastContainer(event, lastContainerRect))
        {
            indexData.moveTo = moduleContainers.length
            return indexData
        }
    
        for (let i = 1 ; i< moduleContainers.length ; i++) {
            const moduleBeforeRect = moduleContainers[i-1].getBoundingClientRect()
            const moduleAfterRect = moduleContainers[i].getBoundingClientRect()
    
            if(this.dragAndDrop.isDroppedBetweemTwoContainers(event, moduleBeforeRect, moduleAfterRect)){
                indexData.moveTo = i
                return indexData
            }
        }
    }
    
    dropOnSingleModule = (event) => {
        const fromContainer = this.dragAndDrop.draggedModule.parentElement
        const fromContainerIndex = this.getIndexElement(this.modulesBox, "container", fromContainer)
        const fromDraggedModuleIndex = this.getIndexElement(fromContainer, "single-module-container", this.dragAndDrop.draggedModule)
        const toContainer = event.target.parentElement.parentElement
        const toContainerIndex = this.getIndexElement(this.modulesBox, "container", toContainer)
        const indexData = {
            "fromContainer": fromContainerIndex,
            "fromDraggedModule": fromDraggedModuleIndex,
            "toContainer": toContainerIndex
        }
        
        const moduleContainers = toContainer.querySelectorAll(".glow-on-hover");
        if(this.isDroppedOnLeftSide(event))
        {
            const targetModuleIndex = this.getIndexElement(toContainer, "glow-on-hover", event.target)
            indexData.moveTo = targetModuleIndex
            return indexData
        } 
        else if(this.isDroppedOnRightSideLastModule(event, moduleContainers)){
            indexData.moveTo = moduleContainers.length
            return indexData
        }
        else{
            const targetModuleIndex = this.getIndexElement(toContainer, "glow-on-hover", event.target)
            indexData.moveTo = targetModuleIndex + 1
            return indexData
        }
    }
    
    isDroppedOnLeftSide = (event) => {
        return event.pageX < event.target.getBoundingClientRect().left + event.target.clientWidth / 2
    }
    
    isDroppedOnRightSideLastModule = (event, moduleContainers) => {
        const lastContainerRect = moduleContainers[moduleContainers.length-1].getBoundingClientRect()
        const targetContainerRect = event.target.getBoundingClientRect()
        return event.pageX > targetContainerRect.right - event.target.clientWidth / 2 && targetContainerRect.left === lastContainerRect.left && targetContainerRect.bottom === lastContainerRect.bottom
    }


}