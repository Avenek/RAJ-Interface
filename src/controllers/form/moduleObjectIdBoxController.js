class ModuleObjectIdBoxController {
    constructor(view, model) {
        this.view = view
        this.model = model
        this.model.bindObjectIdListChanged(this.objectIdListChanged)
        this.view.bindCheckObjectId(this.handleCheckObjectId)
        this.view.bindDeleteObjectId(this.handleDeleteObjectId)
        this.view.bindAddObjectId(this.handleAddObjectId)
        this.view.bindCloneObjectId(this.handleCloneObjectId)
        this.view.bindUpdateNameObjectId(this.handleUpdateNameObjectId)
    }
    
    objectIdListChanged = (objectIdList) => {
        this.view.displayObjectIdBox(objectIdList)
    }

    handleCheckObjectId = (index) => {
        this.model.checkObjectId(index)
    }

    handleAddObjectId = () => {
        this.model.addObjectId()
    }

    handleCloneObjectId = (index) => {
        this.model.cloneObjectId(index)
    }

    handleDeleteObjectId = (index) => {
        this.model.deleteObjectId(index)
    }

    handleUpdateNameObjectId = (index, newName) => {
        this.model.updateNameObjectId(index, newName)
    }
      
  }