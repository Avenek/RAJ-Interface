class ObjectIdBoxController {
    constructor(view, model) {
        this.view = view
        this.model = model
        this.model.bindObjectIdListChanged(this.objectIdListChanged)
        this.model.objectIdListChanged(this.model.objectIdList, this.model.hasList)
        this.view.bindCheckObjectId(this.handleCheckObjectId)
        this.view.bindDeleteObjectId(this.handleDeleteObjectId)
        this.view.bindAddObjectId(this.handleAddObjectId)
        this.view.bindCloneObjectId(this.handleCloneObjectId)
        this.view.bindUpdateNameObjectId(this.handleUpdateNameObjectId)
        this.view.bindDragAndDrop(this.handleDragAndDrop)
    }

    objectIdListChanged = (objectIdList, hasList, addPlusButton = true) => {
        this.view.displayObjectIdBox(objectIdList, hasList, addPlusButton)
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

    handleDragAndDrop = (indexData) => {
        this.model.dropElement(indexData)
    }
  }