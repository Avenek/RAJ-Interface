class ModulesBoxController {
    constructor(view, model) {
        this.view = view
        this.model = model
        this.modulesListChanged(this.model.modulesList)
        this.model.bindModulesListChanged(this.modulesListChanged)
        this.view.bindAddContainer(this.handleAddContainer)
    }
    
    modulesListChanged = (modulesList) => {
        this.view.displayModulesBox(modulesList)
        this.view.bindDeleteContainer(this.handleDeleteContainer)
        this.view.bindUpdateNameContainer(this.handleUpdateNameContainer)
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
      
  }