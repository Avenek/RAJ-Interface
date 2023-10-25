class homeView{
    constructor(){
        this.root = document.querySelector(".home-root")
        this.dataObjectBox = root.querySelector(".data-object-box")
        this.modulesBox = root.querySelector(".modules-box")
        this.jsonDataBox = root.querySelector(".json-data-box")
        this.dataObjectBoxView = new dataObjectBoxView(this.dataObjectBox)
        this.modulesBoxView = new modulesBoxView(this.modulesBox)
        this.jsonDataBoxView = new jsonDataBoxView(this.jsonDataBox)
    }

    render(dataObjectList, modulesList, jsonData){
        this.dataObjectBoxView.create(dataObjectList)
        this.modulesBoxView.create(modulesList)
        this.jsonDataBoxView.create(jsonData)
    }
}