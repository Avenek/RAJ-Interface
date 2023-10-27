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
            const containerTitle = event.target.parentElement.firstElementChild.textContent
                handler(containerTitle)
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

    settingForm(e, handler){
        const titleDiv = e.target.parentElement.firstElementChild
        const input = this.createInput(titleDiv)
        const oldTitle = titleDiv.textContent
        titleDiv.textContent = "";
        titleDiv.appendChild(input);
        input.focus();

        input.addEventListener("keyup", (event) => {
            if (event.key === "Enter") {
                handler(oldTitle, input.value)
            }
        })
        input.addEventListener("blur", () => {
            handler(oldTitle, input.value)
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
            if (event.target.className === 'glow-on-hover') {
                this.handleDragStart(event)
            }
        })
    }

    handleDragStart = (event) => {
        this.dragAndDrop.draggedModule = event.target;
        this.dragAndDrop.draggedModule.classList.add("dragging")
        this.root.addEventListener("mousemove", event => {
            this.dragAndDrop.handleDragOver(event)
        })
        this.root.addEventListener('mouseup', event => { this.handleDrop(event) });
        this.dragAndDrop.createShadowButton()
    }

    handleDrop = (event) => {
        this.dragAndDrop.draggedModule.classList.remove("dragging")
        this.root.removeEventListener('mousemove', this.handleDragOver);
        this.root.removeEventListener('mouseup', this.handleDrop);
        this.dragAndDrop.shadow.remove()
        if (this.dragAndDrop.isDroppedOnEmptyArea(event)) {
            this.dragAndDrop.dropOnEmptyArea(event)
        } 
        else if (this.dragAndDrop.isDroppedOnSingleModule(event)){
            this.dragAndDrop.dropOnSingleModule(event)
        }


        
        
    }

}