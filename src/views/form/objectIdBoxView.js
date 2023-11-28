class ObjectIdBoxView extends View{
    constructor(objectIdBox){
        super()
       this.objectIdBox = objectIdBox
       this.plusButton = this.createElement("div", "object-id-plus-circle")
       this.plusButton.textContent = "+"
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
            if (event.target.className === 'object-id') {
                const index = this.getIndexElement(this.objectIdBox, 'object-id', event.target)
                handler(index)
            }
        })
    }

    bindAddObjectId = (handler) => {
        this.objectIdBox.addEventListener("click", event => {
            if (event.target.className === 'object-id-plus-circle') {
                handler()
            }
        })
    }

    bindCloneObjectId = (handler) => {
        this.objectIdBox.addEventListener("click", event => {
            if (event.target.className === 'object-id-copy-button') {
                const index = this.getIndexElement(this.objectIdBox, "single-object-id-container", event.target.parentElement)
                handler(index)
            }
        })
    }

    bindDeleteObjectId = (handler) => {
        this.objectIdBox.addEventListener("click", event => {
            if (event.target.className === 'object-id-delete-button') {
                if (window.confirm("Czy na pewno chcesz usunąć obiekt?")) {
                    const index = this.getIndexElement(this.objectIdBox, "single-object-id-container", event.target.parentElement)
                    handler(index)
                }
            }
        })
    }

    bindUpdateNameObjectId = (handler) => {
        this.objectIdBox.addEventListener("click", event => {
            if (event.target.className === 'test') {
                 handler(index)
            }
        })
    }
}