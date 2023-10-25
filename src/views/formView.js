class formView{
    constructor(){
        this.root = document.querySelector(".form-root")
        
    }

    render(){
        this.createElements()
        this.appendElements()
    }

    createElements(){
        this.headerPanel = document.createElement("div")
        this.headerPanel.classList.add("header-panel")
        this.formContainer = document.createElement("div")
        this.formContainer.classList.add("form-container")
        this.moduleObjectConfiguration = document.createElement("div")
        this.moduleObjectConfiguration.classList.add("module-object-configuration", "object-configuration")
        this.moduleObjectIdBox = document.createElement("div")
        this.moduleObjectIdBox.classList.add("module-object-id-box", "object-id-box")
        this.moduleObjectForm = document.createElement("div")
        this.moduleObjectForm.classList.add("module-object-form", "object-form")
        this.extraOptionConfiguration = document.createElement("div")
        this.extraOptionConfiguration.classList.add("extra-option-configuration", "object-configuration")
        this.extraOptionIdBox = document.createElement("div")
        this.extraOptionIdBox.classList.add("extra-option-id-box", "object-id-box")
        this.extraOptionForm = document.createElement("div")
        this.extraOptionForm.classList.add("extra-option-form", "object-form")
        this.jsonDataBox = document.createElement("div")
        this.jsonDataBox.classList.add("json-data-box")
    }

    appendElements(){
        this.root.innerHTML = ""
        this.moduleObjectConfiguration.append(this.moduleObjectIdBox, this.moduleObjectForm)
        this.extraOptionConfiguration.append(this.extraOptionIdBox, this.extraOptionForm)
        this.formContainer.append(this.moduleObjectConfiguration, this.extraOptionConfiguration)
        this.root.append(this.headerPanel, this.formContainer, this.jsonDataBox)
    }
}