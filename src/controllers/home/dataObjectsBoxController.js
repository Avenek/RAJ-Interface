class DataObjectsBoxController {
    constructor(view, model) {
        this.view = view
        this.model = model
        this.objectsListChanged()
        this.model.bindObjectsListChanged(this.objectsListChanged)
    }
    
    objectsListChanged = () => {
        this.model.createDataObjectsList()
        this.view.displayDataObjects(this.model.dataObjectsList)
      }
  }