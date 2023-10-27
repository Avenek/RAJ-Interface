class ModulesBoxController {
    constructor(view, model) {
        this.view = view
        this.model = model
        this.modulesListChanged(this.model.modulesList)
        this.model.bindModulesListChanged(this.modulesListChanged)
        this.view.bindDeleteContainer(this.handleDeleteContainer)
        this.view.bindAddContainer(this.handleAddContainer)
        this.view.bindUpdateNameContainer(this.handleUpdateNameContainer)
        this.view.bindDragAndDrop(this.handleDragAndDrop)
    }
    
    modulesListChanged = (modulesList) => {
        this.view.displayModulesBox(modulesList)
        localStorage.setItem('containerConfig', JSON.stringify(modulesList));
    }

    handleAddContainer = () => {
        this.model.addContainer()
    }

    handleDeleteContainer = (name) => {
        this.model.deleteContainer(name)
    }

    handleUpdateNameContainer = (containerName, newName) => {
        this.model.updateNameContainer(containerName, newName)
    }
    handleDragAndDrop = (indexData) => {
        this.model.dropContainer(indexData)
    }
      
  }