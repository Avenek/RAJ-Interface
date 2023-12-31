class HomeView extends View{
    constructor(){
        super() 
        this.render()
    }

    render = () => {
        this.createPageElements()
        this.appendElements()
        this.dataObjectsBoxView = new DataObjectsBoxView(this.dataObjectsBox)
        this.modulesBoxView = new ModulesBoxView(this.modulesBox)
        this.jsonDataBoxView = new JsonDataBoxHomeView(this.jsonDataBox)
    }

    createPageElements(){
        this.modulesContainer = this.createElement("div", "modules-container")
        this.dataObjectsBox = this.createElement("div", "data-object-box")
        this.modulesBox = this.createElement("div", "modules-box")
        this.jsonDataBox = this.createElement("div", "json-data-box")
    }

    appendElements(){
        this.root.innerHTML = ""
        this.modulesContainer.append(this.dataObjectsBox, this.modulesBox)
        this.root.append(this.modulesContainer, this.jsonDataBox)
    }
}