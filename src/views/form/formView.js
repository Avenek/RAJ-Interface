class FormView extends View{
    constructor(){  
        super()
    }

    render(){
        this.createPageElements()
        this.appendElements()
        this.headerPanelView = new HeaderPanelView(this.headerPanel)
        this.moduleObjectIdBoxView = new ObjectIdBoxView(this.moduleObjectIdBox)
        this.jsonDataBoxView = new JsonDataBoxFormView(this.jsonDataBox)
        this.moduleObjectFormView = new ObjectFormView(this.moduleObjectForm)
        this.extraOptionObjectFormView = new ObjectFormView(this.extraOptionForm)
        this.extraOptionObjectIdBoxView = new ObjectIdBoxView(this.extraOptionIdBox)
    }

    createPageElements = () =>{
        this.configurationContainer = this.createElement("div", "configuration-container")
        this.headerPanel = this.createElement("div", "header-panel")
        this.formContainer = this.createElement("div", "form-container")
        this.moduleObjectConfiguration = this.createElement("div", "module-object-configuration", "object-configuration")
        this.moduleObjectIdBox = this.createElement("div", "module-object-id-box", "object-id-box")
        this.moduleObjectForm = this.createElement("div", "module-object-form", "object-form")
        this.extraOptionConfiguration = this.createElement("div", "extra-option-configuration", "object-configuration")
        this.extraOptionIdBox = this.createElement("div", "extra-option-id-box", "object-id-box")
        this.extraOptionForm = this.createElement("div", "extra-option-form", "object-form")
        this.jsonDataBox = this.createElement("div", "json-data-box")
    }

    appendElements(){
        this.root.innerHTML = ""
        this.moduleObjectConfiguration.append(this.moduleObjectIdBox, this.moduleObjectForm)
        this.extraOptionConfiguration.append(this.extraOptionIdBox, this.extraOptionForm)
        this.formContainer.append(this.moduleObjectConfiguration, this.extraOptionConfiguration)
        this.configurationContainer.append(this.headerPanel, this.formContainer)
        this.root.append(this.configurationContainer, this.jsonDataBox)
    }

    bindClickExtraOptionModuleForm = (handler) => {
        this.moduleObjectFormView.objectForm.addEventListener("mousedown", event => {
            if (event.target.classList.contains('extra-option')) {
                const button = event.target
                let buttonName = button.textContent
                handler(buttonName, button.id)
            }
        })  
    }

    bindClickExtraOptionExtraOptionForm = (handler) => {
        this.extraOptionObjectFormView.objectForm.addEventListener("mousedown", event => {
            if (event.target.classList.contains('extra-option')) {
                const button = event.target
                let buttonName = button.textContent
                handler(buttonName, button.id)
            }
        })  
    }
}