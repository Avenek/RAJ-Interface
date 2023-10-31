class ModuleObjectIdBoxView extends View{
    constructor(objectIdBox){
        super()
       this.objectIdBox = objectIdBox
       this.plusButton = this.createElement("div", "object-id-plus-circle")
       this.plusButton.textContent = "+"
    }

    displayObjectIdBox = (objectIdList) => {
        const titleElement = this.createElement("div", "container-title")
        titleElement.textContent = "Menu obiektów"
        this.objectIdBox.append(titleElement)
        objectIdList.forEach(id => {
            const containerElement = this.createElement("div", "single-object-id-container")
            const idElement = id.isChecked ? this.createElement("div", "object-id", "option-checked") : this.createElement("div", "object-id")
            idElement.textContent = id.name
            const copyButton = this.createElement("div", "object-id-copy-button")
            copyButton.textContent = "⧉"
            const deleteButton = this.createElement("div", "object-id-delete-button")
            deleteButton.textContent = "🗑️"
            containerElement.append(idElement, copyButton, deleteButton)
            this.objectIdBox.append(containerElement, this.plusButton)
        })
    }

    bindCheckObjectId = (handler) => {
        this.plusButton.addEventListener("click", event => {
          event.preventDefault()
            handler()
        })
    }

    bindAddObjectId = (handler) => {
        this.plusButton.addEventListener("click", event => {
          event.preventDefault()
            handler()
        })
    }

    bindCloneObjectId = (handler) => {
        this.plusButton.addEventListener("click", event => {
          event.preventDefault()
            handler()
        })
    }

    bindDeleteObjectId = (handler) => {
        this.objectIdBox.addEventListener("click", event => {
            if (event.target.className === 'delete-button') {
                handler(index)
            }
        })
    }

    bindUpdateNameObjectId = (handler) => {
        this.objectIdBox.addEventListener("click", event => {
            if (event.target.className === 'edit-button') {
                
            }
        })
    }
}