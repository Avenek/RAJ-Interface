class ModulesBoxView extends View{
    constructor(modulesBox){
        super()
       this.modulesBox = modulesBox
       this.plusButton = this.createElement("div", "plus-circle")
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
        this.deleteButtons = this.modulesBox.querySelectorAll(".delete-button");
        this.deleteButtons.forEach(button => {
            button.addEventListener("click", event => {
                event.preventDefault()
                const containerTitle = event.target.parentElement.firstElementChild.textContent
                  handler(containerTitle)
              })
        })
    }

    bindUpdateNameContainer = (handler) => {
        this.editButtons = this.modulesBox.querySelectorAll(".edit-button")
        this.editButtons.forEach(button => {
            button.addEventListener("click", event => {
                event.preventDefault()
                this.settingForm(event, handler)
            })
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
        const input = document.createElement("input");
        input.style.width = "200px";
        input.type = "text";
        input.value = titleDiv.textContent;
    
        return input
    }

}