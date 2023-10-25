class homeView extends pageView{
    constructor(){
        super() 
    }

    render(){
        this.createPageElements()
        this.appendElements()
        this.dataObjectBoxView = new dataObjectBoxView(this.dataObjectBox)
        this.modulesBoxView = new modulesBoxView(this.modulesBox)
        this.jsonDataBoxView = new jsonDataBoxView(this.jsonDataBox)
    }

    createPageElements(){
        this.modulesContainer = this.createElement("div", "modules-container")
        this.dataObjectBox = this.createElement("div", "data-object-box")
        this.modulesBox = this.createElement("div", "modules-box")
        this.jsonDataBox = this.createElement("div", "json-data-box")
    }

    appendElements(){
        this.root.innerHTML = ""
        this.modulesContainer.append(this.dataObjectBox, this.modulesBox)
        this.root.append(this.modulesContainer, this.jsonDataBox)
    }
}